const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  // Who is giving the rating
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rater ID is required']
  },
  
  // Who is being rated
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rated user ID is required']
  },
  
  // Related job/application (optional but recommended)
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  // Rating value (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // Review text (optional)
  review: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  
  // Rating type
  raterRole: {
    type: String,
    enum: ['worker', 'owner'],
    required: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate ratings for same application
ratingSchema.index({ ratedBy: 1, ratedUser: 1, application: 1 }, { unique: true, sparse: true });

// Index for querying ratings
ratingSchema.index({ ratedUser: 1 });
ratingSchema.index({ ratedBy: 1 });
ratingSchema.index({ application: 1 });

// Update updatedAt on save
ratingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to calculate average rating for a user
ratingSchema.statics.calculateAverageRating = async function(userId) {
  try {
    const result = await this.aggregate([
      { $match: { ratedUser: userId } },
      { 
        $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        } 
      }
    ]);
    
    if (result.length > 0) {
      return {
        averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal
        totalRatings: result[0].totalRatings
      };
    }
    
    return {
      averageRating: 0,
      totalRatings: 0
    };
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return {
      averageRating: 0,
      totalRatings: 0
    };
  }
};

// Static method to get rating breakdown (count per star)
ratingSchema.statics.getRatingBreakdown = async function(userId) {
  try {
    const breakdown = await this.aggregate([
      { $match: { ratedUser: userId } },
      { 
        $group: { 
          _id: '$rating',
          count: { $sum: 1 }
        } 
      },
      { $sort: { _id: -1 } }
    ]);
    
    // Create object with all star ratings (1-5)
    const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    breakdown.forEach(item => {
      result[item._id] = item.count;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting rating breakdown:', error);
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
};

module.exports = mongoose.model('Rating', ratingSchema);
