const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Number, required: true },
    userAnswer: { type: Number },
    isCorrect: { type: Boolean }
  }],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  timeTaken: {
    type: Number // in seconds
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
quizSchema.index({ user: 1, completedAt: -1 });
quizSchema.index({ category: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
