const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'bank_transfer', 'card', 'other'],
    default: 'cash'
  },
  transactionId: {
    type: String
  },
  paidAt: {
    type: Date
  },
  notes: {
    type: String
  },
  // Bank account details for bank transfers
  bankDetails: {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankAccount'
    },
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    transferReference: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending'
    }
  },
  jobDetails: {
    title: String,
    category: String,
    workDuration: String,
    completedDate: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
paymentSchema.index({ worker: 1, status: 1, createdAt: -1 });
paymentSchema.index({ employer: 1, createdAt: -1 });
paymentSchema.index({ job: 1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString('en-IN')}`;
});

// Static method to get worker earnings summary
paymentSchema.statics.getWorkerEarningsSummary = async function(workerId) {
  const summary = await this.aggregate([
    { $match: { worker: new mongoose.Types.ObjectId(workerId) } },
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    totalEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0,
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0
  };

  summary.forEach(item => {
    if (item._id === 'completed') {
      result.completedPayments = item.total;
      result.completedJobs = item.count;
    } else if (item._id === 'pending') {
      result.pendingPayments = item.total;
      result.pendingJobs = item.count;
    }
  });

  result.totalEarnings = result.completedPayments + result.pendingPayments;
  result.totalJobs = result.completedJobs + result.pendingJobs;

  return result;
};

// Static method to get monthly earnings
paymentSchema.statics.getMonthlyEarnings = async function(workerId, year = new Date().getFullYear()) {
  return await this.aggregate([
    {
      $match: {
        worker: new mongoose.Types.ObjectId(workerId),
        status: 'completed',
        paidAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$paidAt' },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Instance method to mark as paid
paymentSchema.methods.markAsPaid = async function(paymentMethod, transactionId, bankDetails = null) {
  this.status = 'completed';
  this.paidAt = new Date();
  this.paymentMethod = paymentMethod;
  if (transactionId) {
    this.transactionId = transactionId;
  }
  
  // If bank transfer, store bank details
  if (paymentMethod === 'bank_transfer' && bankDetails) {
    this.bankDetails = {
      ...bankDetails,
      verificationStatus: 'verified'
    };
    
    // Update bank account payment stats if accountId provided
    if (bankDetails.accountId) {
      const BankAccount = require('./BankAccount');
      const account = await BankAccount.findById(bankDetails.accountId);
      if (account) {
        await account.recordPayment(this.amount);
      }
    }
  }
  
  await this.save();
  return this;
};

module.exports = mongoose.model('Payment', paymentSchema);
