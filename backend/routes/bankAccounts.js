const express = require('express');
const router = express.Router();
const BankAccount = require('../models/BankAccount');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

// @route   GET /api/bank-accounts
// @desc    Get all bank accounts for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await BankAccount.find({ 
      user: req.userId,
      isActive: true 
    }).sort({ isPrimary: -1, createdAt: -1 });

    res.json({
      success: true,
      accounts
    });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank accounts',
      error: error.message
    });
  }
});

// @route   GET /api/bank-accounts/primary
// @desc    Get primary bank account
// @access  Private
router.get('/primary', auth, async (req, res) => {
  try {
    const account = await BankAccount.getPrimaryAccount(req.userId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'No primary bank account found'
      });
    }

    res.json({
      success: true,
      account
    });
  } catch (error) {
    console.error('Error fetching primary account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch primary account',
      error: error.message
    });
  }
});

// @route   POST /api/bank-accounts
// @desc    Add new bank account
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      accountType,
      upiId
    } = req.body;

    // Validation
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if account already exists
    const existingAccount = await BankAccount.findOne({
      user: req.userId,
      accountNumber,
      ifscCode,
      isActive: true
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'This bank account is already added'
      });
    }

    // Check if this is the first account
    const accountCount = await BankAccount.countDocuments({
      user: req.userId,
      isActive: true
    });

    // Create new account
    const bankAccount = new BankAccount({
      user: req.userId,
      accountHolderName,
      accountNumber,
      ifscCode: ifscCode.toUpperCase(),
      bankName,
      branchName,
      accountType: accountType || 'savings',
      upiId,
      isPrimary: accountCount === 0, // First account is primary
      verificationStatus: 'pending'
    });

    await bankAccount.save();

    res.status(201).json({
      success: true,
      message: 'Bank account added successfully',
      account: bankAccount
    });
  } catch (error) {
    console.error('Error adding bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add bank account',
      error: error.message
    });
  }
});

// @route   PUT /api/bank-accounts/:id
// @desc    Update bank account
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      accountHolderName,
      bankName,
      branchName,
      accountType,
      upiId
    } = req.body;

    const account = await BankAccount.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    // Update fields (can't update account number or IFSC)
    if (accountHolderName) account.accountHolderName = accountHolderName;
    if (bankName) account.bankName = bankName;
    if (branchName) account.branchName = branchName;
    if (accountType) account.accountType = accountType;
    if (upiId !== undefined) account.upiId = upiId;

    await account.save();

    res.json({
      success: true,
      message: 'Bank account updated successfully',
      account
    });
  } catch (error) {
    console.error('Error updating bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bank account',
      error: error.message
    });
  }
});

// @route   PUT /api/bank-accounts/:id/set-primary
// @desc    Set account as primary
// @access  Private
router.put('/:id/set-primary', auth, async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      _id: req.params.id,
      user: req.userId,
      isActive: true
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    if (!account.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Only verified accounts can be set as primary'
      });
    }

    // Set as primary
    const updatedAccount = await BankAccount.setPrimaryAccount(req.params.id, req.userId);

    res.json({
      success: true,
      message: 'Primary account updated successfully',
      account: updatedAccount
    });
  } catch (error) {
    console.error('Error setting primary account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set primary account',
      error: error.message
    });
  }
});

// @route   PUT /api/bank-accounts/:id/verify
// @desc    Verify bank account (manual verification)
// @access  Private
router.put('/:id/verify', auth, async (req, res) => {
  try {
    const { method = 'manual' } = req.body;

    const account = await BankAccount.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    if (account.isVerified) {
      return res.json({
        success: true,
        message: 'Account is already verified',
        account
      });
    }

    // Verify account
    await account.verify(method);

    res.json({
      success: true,
      message: 'Bank account verified successfully',
      account
    });
  } catch (error) {
    console.error('Error verifying account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify account',
      error: error.message
    });
  }
});

// @route   DELETE /api/bank-accounts/:id
// @desc    Delete (soft delete) bank account
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    // Check if this is primary and there are other accounts
    if (account.isPrimary) {
      const otherAccounts = await BankAccount.find({
        user: req.userId,
        _id: { $ne: req.params.id },
        isActive: true,
        isVerified: true
      });

      if (otherAccounts.length > 0) {
        // Set another account as primary
        otherAccounts[0].isPrimary = true;
        await otherAccounts[0].save();
      }
    }

    // Soft delete
    account.isActive = false;
    await account.save();

    res.json({
      success: true,
      message: 'Bank account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bank account',
      error: error.message
    });
  }
});

// @route   GET /api/bank-accounts/:id/payments
// @desc    Get all payments received in this account
// @access  Private
router.get('/:id/payments', auth, async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    // Get payments
    const payments = await Payment.find({
      worker: req.userId,
      status: 'completed',
      paymentMethod: 'bank_transfer',
      'bankDetails.accountId': req.params.id
    })
      .populate('employer', 'name email')
      .populate('job', 'title category')
      .sort({ paidAt: -1 });

    res.json({
      success: true,
      account: {
        accountHolderName: account.accountHolderName,
        maskedAccountNumber: account.maskedAccountNumber,
        bankName: account.bankName,
        totalPayments: account.totalPaymentsReceived,
        totalAmount: account.totalAmountReceived
      },
      payments
    });
  } catch (error) {
    console.error('Error fetching account payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
});

// @route   POST /api/bank-accounts/validate-ifsc
// @desc    Validate IFSC code and get bank details
// @access  Private
router.post('/validate-ifsc', auth, async (req, res) => {
  try {
    const { ifscCode } = req.body;

    if (!ifscCode || ifscCode.length !== 11) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IFSC code format'
      });
    }

    // In production, integrate with IFSC API
    // For now, basic validation
    const bankCode = ifscCode.substring(0, 4);
    
    // Sample bank codes
    const bankNames = {
      'SBIN': 'State Bank of India',
      'HDFC': 'HDFC Bank',
      'ICIC': 'ICICI Bank',
      'AXIS': 'Axis Bank',
      'PUNB': 'Punjab National Bank',
      'UBIN': 'Union Bank of India',
      'BARB': 'Bank of Baroda',
      'CNRB': 'Canara Bank',
      'IDIB': 'Indian Bank'
    };

    res.json({
      success: true,
      valid: true,
      bankName: bankNames[bankCode] || 'Unknown Bank',
      ifscCode: ifscCode.toUpperCase(),
      message: 'IFSC code is valid'
    });
  } catch (error) {
    console.error('Error validating IFSC:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate IFSC code',
      error: error.message
    });
  }
});

module.exports = router;
