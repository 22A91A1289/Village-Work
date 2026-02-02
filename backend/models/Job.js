const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Job title is required'] 
  },
  description: { 
    type: String,
    default: ''
  },
  category: { 
    type: String, 
    required: [true, 'Job category is required'] 
  },
  type: { 
    type: String, 
    enum: ['Daily Work', 'Technical Work'], 
    required: [true, 'Job type is required'] 
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'] 
  },
  salary: { 
    type: String, 
    required: [true, 'Salary is required'] 
  },
  duration: { 
    type: String 
  },
  experienceLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'expert', 'any'],
    default: 'any'
  },
  trainingProvided: { 
    type: Boolean, 
    default: false 
  },
  requirements: [{ 
    type: String 
  }],
  benefits: [{ 
    type: String 
  }],
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  applicants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  status: { 
    type: String, 
    enum: ['active', 'closed', 'completed'], 
    default: 'active' 
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent'],
    default: 'normal'
  },
  requiresSkillTest: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update updatedAt on save
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
jobSchema.index({ location: 1, status: 1 });
jobSchema.index({ category: 1, type: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
