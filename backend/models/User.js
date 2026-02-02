const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: function() {
      // Phone not required for Google OAuth users initially
      return !this.googleId;
    }
  },
  password: { 
    type: String, 
    required: function() {
      // Password not required for Google OAuth users
      return !this.googleId;
    },
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  resetOtpHash: {
    type: String
  },
  resetOtpExpires: {
    type: Date
  },
  profilePicture: {
    type: String
  },
  role: { 
    type: String, 
    enum: ['worker', 'owner', 'admin'], 
    required: [true, 'Role is required'] 
  },
  location: { 
    type: String 
  },
  
  // Employer-specific fields
  businessName: {
    type: String
  },
  businessType: {
    type: String
  },
  
  // Worker-specific fields
  skills: [{ 
    type: String 
  }],
  experience: { 
    type: String 
  },
  availability: { 
    type: mongoose.Schema.Types.Mixed, // Can be Boolean or String
    default: true 
  },
  skillLevel: { 
    type: String, 
    enum: ['new', 'experienced'], 
    default: 'new' 
  },
  quizScore: { 
    type: Number,
    default: null
  },
  quizPassed: { 
    type: Boolean, 
    default: null 
  },
  quizCategory: {
    type: String
  },
  videoUrl: { 
    type: String 
  },
  videoUploaded: {
    type: Boolean,
    default: false
  },
  
  // Profile
  bio: { 
    type: String 
  },
  hourlyRate: { 
    type: String 
  },
  workType: {
    type: String
  },
  
  // Work Preferences
  workCategories: [{
    type: String
  }],
  workTypes: [{
    type: String
  }],
  experienceLevel: {
    type: String,
    enum: ['new', 'intermediate', 'experienced', 'expert'],
    default: 'new'
  },
  workPreferencesCompleted: {
    type: Boolean,
    default: false
  },
  
  // Stats
  jobsCompleted: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
