const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  branchName: {
    type: String,
    trim: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'current'],
    default: 'savings'
  },
  upiId: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed', 'under_review'],
    default: 'pending'
  },
  verifiedAt: {
    type: Date
  },
  verificationMethod: {
    type: String,
    enum: ['manual', 'penny_drop', 'document', 'upi'],
    default: 'manual'
  },
  // For payment tracking
  totalPaymentsReceived: {
    type: Number,
    default: 0
  },
  totalAmountReceived: {
    type: Number,
    default: 0
  },
  lastPaymentDate: {
    type: Date
  },
  // Additional details
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
bankAccountSchema.index({ user: 1, isPrimary: 1 });
bankAccountSchema.index({ user: 1, isActive: 1 });
bankAccountSchema.index({ accountNumber: 1, ifscCode: 1 });

// Virtual for masked account number
bankAccountSchema.virtual('maskedAccountNumber').get(function() {
  if (!this.accountNumber) return '';
  const len = this.accountNumber.length;
  if (len <= 4) return this.accountNumber;
  return 'XXXX' + this.accountNumber.slice(-4);
});

// Static method to get user's primary account
bankAccountSchema.statics.getPrimaryAccount = async function(userId) {
  // First try to get verified primary account
  let account = await this.findOne({ 
    user: userId, 
    isPrimary: true, 
    isActive: true,
    isVerified: true 
  });
  
  // If no verified primary account, get any primary account
  if (!account) {
    account = await this.findOne({ 
      user: userId, 
      isPrimary: true, 
      isActive: true
    });
  }
  
  // If no primary account at all, get the first active account
  if (!account) {
    account = await this.findOne({ 
      user: userId, 
      isActive: true
    }).sort({ createdAt: -1 }); // Get most recent
  }
  
  return account;
};

// Static method to set primary account
bankAccountSchema.statics.setPrimaryAccount = async function(accountId, userId) {
  // Remove primary flag from all accounts
  await this.updateMany(
    { user: userId },
    { isPrimary: false }
  );
  
  // Set new primary
  return await this.findByIdAndUpdate(
    accountId,
    { isPrimary: true },
    { new: true }
  );
};

// Instance method to verify account
bankAccountSchema.methods.verify = async function(method = 'manual') {
  this.isVerified = true;
  this.verificationStatus = 'verified';
  this.verifiedAt = new Date();
  this.verificationMethod = method;
  
  // If this is the first verified account, make it primary
  const otherVerifiedAccounts = await this.constructor.find({
    user: this.user,
    isVerified: true,
    _id: { $ne: this._id }
  });
  
  if (otherVerifiedAccounts.length === 0) {
    this.isPrimary = true;
  }
  
  await this.save();
  return this;
};

// Instance method to record payment
bankAccountSchema.methods.recordPayment = async function(amount) {
  this.totalPaymentsReceived += 1;
  this.totalAmountReceived += amount;
  this.lastPaymentDate = new Date();
  await this.save();
  return this;
};

// Ensure toJSON includes virtuals
bankAccountSchema.set('toJSON', { virtuals: true });
bankAccountSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('BankAccount', bankAccountSchema);
