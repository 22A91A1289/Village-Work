const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

// Get worker earnings summary
router.get('/earnings/summary', auth, async (req, res) => {
  try {
    const summary = await Payment.getWorkerEarningsSummary(req.userId);
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings summary',
      error: error.message
    });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status; // pending, completed

    const query = { worker: req.userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('employer', 'name email phone')
      .populate('job', 'title category location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
});

// Get monthly earnings
router.get('/earnings/monthly', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthlyData = await Payment.getMonthlyEarnings(req.userId, year);

    // Format for frontend use
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(year, i, 1).toLocaleString('default', { month: 'short' }),
      earnings: 0,
      jobs: 0
    }));

    monthlyData.forEach(item => {
      months[item._id - 1].earnings = item.total;
      months[item._id - 1].jobs = item.count;
    });

    res.json({
      success: true,
      year,
      monthlyEarnings: months
    });
  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly earnings',
      error: error.message
    });
  }
});

// Get single payment details
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      worker: req.userId
    })
      .populate('employer', 'name email phone')
      .populate('job', 'title category location salary workDuration')
      .populate('application');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
});

// Mark payment as paid (for employers)
router.put('/:id/mark-paid', auth, async (req, res) => {
  try {
    const { paymentMethod, transactionId, paidAt } = req.body;
    
    const payment = await Payment.findById(req.params.id)
      .populate('worker', 'name email phone')
      .populate('employer', 'name')
      .populate('job', 'title');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user is the employer
    if (payment.employer._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this payment'
      });
    }

    // Update payment status
    payment.status = 'completed';
    payment.paymentMethod = paymentMethod || 'cash';
    payment.transactionId = transactionId || null;
    payment.paidAt = paidAt || new Date();
    
    await payment.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(payment.worker._id.toString()).emit('payment:completed', {
        payment: payment,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Payment marked as completed',
      payment
    });
  } catch (error) {
    console.error('Error marking payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark payment as paid',
      error: error.message
    });
  }
});

// Get employer's payments (all statuses - pending and completed)
router.get('/employer/pending', auth, async (req, res) => {
  try {
    const BankAccount = require('../models/BankAccount');
    
    // Fetch all payments for this employer (both pending and completed)
    const payments = await Payment.find({
      employer: req.userId
    })
      .populate('worker', 'name email phone')
      .populate('job', 'title category location')
      .populate('application')
      .sort({ createdAt: -1 })
      .lean();

    // Get bank account details for each worker
    for (let payment of payments) {
      if (payment.worker) {
        const bankAccount = await BankAccount.getPrimaryAccount(payment.worker._id);
        if (bankAccount) {
          payment.workerBankAccount = {
            accountHolderName: bankAccount.accountHolderName,
            accountNumber: bankAccount.accountNumber,
            ifscCode: bankAccount.ifscCode,
            bankName: bankAccount.bankName,
            branchName: bankAccount.branchName,
            accountType: bankAccount.accountType,
            upiId: bankAccount.upiId
          };
        }
      }
    }

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending payments',
      error: error.message
    });
  }
});

module.exports = router;
