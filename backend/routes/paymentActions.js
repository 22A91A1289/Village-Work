const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const BankAccount = require('../models/BankAccount');
const Notification = require('../models/Notification');
const { auth, isOwnerOrAdmin } = require('../middleware/auth');

// @route   PUT /api/payment-actions/:id/complete
// @desc    Mark payment as completed (for employers)
// @access  Private (Owner/Admin)
router.put('/:id/complete', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const {
      paymentMethod,
      transactionId,
      bankAccountId,
      transferReference,
      notes
    } = req.body;

    const payment = await Payment.findById(req.params.id)
      .populate('worker', 'name email')
      .populate('job');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user is authorized (job employer or admin)
    if (payment.employer.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this payment'
      });
    }

    if (payment.status === 'completed') {
      return res.json({
        success: true,
        message: 'Payment already completed',
        payment
      });
    }

    // If bank transfer, verify bank account
    let bankDetails = null;
    if (paymentMethod === 'bank_transfer') {
      if (!bankAccountId) {
        return res.status(400).json({
          success: false,
          message: 'Bank account is required for bank transfers'
        });
      }

      // Get worker's bank account
      const bankAccount = await BankAccount.findOne({
        _id: bankAccountId,
        user: payment.worker._id,
        isActive: true
      });

      if (!bankAccount) {
        return res.status(404).json({
          success: false,
          message: 'Bank account not found or inactive'
        });
      }

      if (!bankAccount.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Bank account is not verified. Please ask worker to verify their account.',
          requiresVerification: true,
          accountDetails: {
            accountHolderName: bankAccount.accountHolderName,
            maskedAccountNumber: bankAccount.maskedAccountNumber,
            bankName: bankAccount.bankName,
            ifscCode: bankAccount.ifscCode
          }
        });
      }

      // Prepare bank details for payment
      bankDetails = {
        accountId: bankAccount._id,
        accountHolderName: bankAccount.accountHolderName,
        accountNumber: bankAccount.accountNumber,
        ifscCode: bankAccount.ifscCode,
        bankName: bankAccount.bankName,
        transferReference: transferReference || transactionId,
        verificationStatus: 'verified'
      };
    }

    // Mark payment as paid
    await payment.markAsPaid(paymentMethod, transactionId, bankDetails);

    // Add notes if provided
    if (notes) {
      payment.notes = notes;
      await payment.save();
    }

    // Send notification to worker
    try {
      const methodText = paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                        paymentMethod === 'upi' ? 'UPI' : 
                        paymentMethod === 'cash' ? 'Cash' : 'Payment';

      await Notification.createNotification(payment.worker._id, {
        type: 'payment',
        title: '💰 Payment Received!',
        message: `₹${payment.amount.toLocaleString('en-IN')} received via ${methodText} for "${payment.jobDetails.title}"`,
        data: { 
          paymentId: payment._id,
          amount: payment.amount,
          paymentMethod,
          transactionId
        },
        actionUrl: 'PaymentHistoryScreen',
        icon: 'cash',
        iconColor: '#10B981'
      });
    } catch (notifError) {
      console.error('Error creating payment notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Payment completed successfully',
      payment,
      bankVerified: paymentMethod === 'bank_transfer'
    });
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete payment',
      error: error.message
    });
  }
});

// @route   GET /api/payment-actions/:id/worker-bank-account
// @desc    Get worker's primary bank account for payment
// @access  Private (Owner/Admin)
router.get('/:id/worker-bank-account', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (payment.employer.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get worker's primary bank account
    const bankAccount = await BankAccount.getPrimaryAccount(payment.worker);

    if (!bankAccount) {
      return res.json({
        success: false,
        message: 'Worker has not added any bank account',
        hasBankAccount: false
      });
    }

    res.json({
      success: true,
      hasBankAccount: true,
      isVerified: bankAccount.isVerified,
      account: {
        id: bankAccount._id,
        accountHolderName: bankAccount.accountHolderName,
        maskedAccountNumber: bankAccount.maskedAccountNumber,
        bankName: bankAccount.bankName,
        ifscCode: bankAccount.ifscCode,
        branchName: bankAccount.branchName,
        upiId: bankAccount.upiId,
        verificationStatus: bankAccount.verificationStatus
      }
    });
  } catch (error) {
    console.error('Error fetching worker bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank account',
      error: error.message
    });
  }
});

module.exports = router;
