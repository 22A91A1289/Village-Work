const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'application_status',    // Application accepted/rejected
      'new_job',              // New job posted in user's skill area
      'quiz_reminder',        // Reminder to take/retake quiz
      'message',              // New chat message
      'payment',              // Payment received
      'system',               // System notifications
      'job_alert'             // Job matching user's skills
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,  // Additional data (jobId, applicationId, etc.)
    default: {}
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  actionUrl: {
    type: String  // Deep link or screen to navigate to
  },
  icon: {
    type: String,
    default: 'notifications'
  },
  iconColor: {
    type: String,
    default: '#4F46E5'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ user: 1, createdAt: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(userId, data) {
  try {
    const notification = await this.create({
      user: userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      actionUrl: data.actionUrl,
      icon: data.icon,
      iconColor: data.iconColor
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.readAt = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model('Notification', notificationSchema);
