const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const User = require('../models/User');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');

// @route   POST /api/ratings
// @desc    Submit a rating
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { ratedUserId, rating, review, jobId, applicationId } = req.body;
    
    console.log('⭐ Rating submission:', {
      ratedBy: req.userId,
      ratedUser: ratedUserId,
      rating,
      applicationId
    });
    
    // Validation
    if (!ratedUserId) {
      return res.status(400).json({ error: 'User to rate is required' });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if rated user exists
    const ratedUser = await User.findById(ratedUserId);
    if (!ratedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get rater user to determine role
    const raterUser = await User.findById(req.userId);
    if (!raterUser) {
      return res.status(404).json({ error: 'Rater not found' });
    }
    
    // Cannot rate yourself
    if (req.userId === ratedUserId) {
      return res.status(400).json({ error: 'You cannot rate yourself' });
    }
    
    // Check if application exists (if provided)
    if (applicationId) {
      const application = await Application.findById(applicationId)
        .populate('job', 'postedBy');
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      // Verify the rater is involved in this application
      const isWorker = application.applicant.toString() === req.userId;
      const isOwner = application.job.postedBy.toString() === req.userId;
      
      if (!isWorker && !isOwner) {
        return res.status(403).json({ error: 'You are not authorized to rate for this application' });
      }
      
      // Check if already rated for this application
      const existingRating = await Rating.findOne({
        ratedBy: req.userId,
        ratedUser: ratedUserId,
        application: applicationId
      });
      
      if (existingRating) {
        // Update existing rating
        existingRating.rating = rating;
        existingRating.review = review || existingRating.review;
        existingRating.updatedAt = new Date();
        await existingRating.save();
        
        console.log('✅ Rating updated:', existingRating._id);
        
        // Recalculate average rating
        const avgRating = await Rating.calculateAverageRating(ratedUserId);
        await User.findByIdAndUpdate(ratedUserId, {
          rating: avgRating.averageRating,
          reviews: avgRating.totalRatings
        });
        
        return res.json({
          success: true,
          message: 'Rating updated successfully',
          rating: existingRating
        });
      }
    }
    
    // Create new rating
    const newRating = new Rating({
      ratedBy: req.userId,
      ratedUser: ratedUserId,
      rating,
      review: review || '',
      job: jobId || null,
      application: applicationId || null,
      raterRole: raterUser.role
    });
    
    await newRating.save();
    
    console.log('✅ New rating created:', newRating._id);
    
    // Calculate and update average rating for the rated user
    const avgRating = await Rating.calculateAverageRating(ratedUserId);
    
    await User.findByIdAndUpdate(ratedUserId, {
      rating: avgRating.averageRating,
      reviews: avgRating.totalRatings
    });
    
    console.log('✅ User rating updated:', {
      userId: ratedUserId,
      averageRating: avgRating.averageRating,
      totalRatings: avgRating.totalRatings
    });
    
    res.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });
    
  } catch (error) {
    console.error('❌ Rating submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/ratings/user/:userId
// @desc    Get ratings for a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const ratings = await Rating.find({ ratedUser: userId })
      .populate('ratedBy', 'name role')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
    
    const avgRating = await Rating.calculateAverageRating(userId);
    const breakdown = await Rating.getRatingBreakdown(userId);
    
    res.json({
      success: true,
      ratings,
      averageRating: avgRating.averageRating,
      totalRatings: avgRating.totalRatings,
      breakdown
    });
    
  } catch (error) {
    console.error('❌ Get ratings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/ratings/my-ratings
// @desc    Get ratings given by current user
// @access  Private
router.get('/my-ratings', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedBy: req.userId })
      .populate('ratedUser', 'name role')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      ratings
    });
    
  } catch (error) {
    console.error('❌ Get my ratings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/ratings/can-rate/:userId/:applicationId?
// @desc    Check if current user can rate another user (optionally for an application)
// @access  Private
router.get('/can-rate/:userId/:applicationId?', auth, async (req, res) => {
  try {
    const { userId, applicationId } = req.params;
    
    // Cannot rate yourself
    if (req.userId === userId) {
      return res.json({
        canRate: false,
        reason: 'Cannot rate yourself'
      });
    }
    
    // If application specified, check if already rated
    if (applicationId) {
      const existingRating = await Rating.findOne({
        ratedBy: req.userId,
        ratedUser: userId,
        application: applicationId
      });
      
      if (existingRating) {
        return res.json({
          canRate: false,
          reason: 'Already rated',
          existingRating: {
            rating: existingRating.rating,
            review: existingRating.review,
            createdAt: existingRating.createdAt
          }
        });
      }
      
      // Check if application exists and user is authorized
      const application = await Application.findById(applicationId)
        .populate('job', 'postedBy');
      
      if (!application) {
        return res.json({
          canRate: false,
          reason: 'Application not found'
        });
      }
      
      const isWorker = application.applicant.toString() === req.userId;
      const isOwner = application.job.postedBy.toString() === req.userId;
      
      if (!isWorker && !isOwner) {
        return res.json({
          canRate: false,
          reason: 'Not authorized'
        });
      }
    }
    
    res.json({
      canRate: true
    });
    
  } catch (error) {
    console.error('❌ Can rate check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/ratings/:id
// @desc    Delete a rating (only by the rater)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    // Only the rater can delete their rating
    if (rating.ratedBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this rating' });
    }
    
    const ratedUserId = rating.ratedUser;
    
    await rating.deleteOne();
    
    // Recalculate average rating
    const avgRating = await Rating.calculateAverageRating(ratedUserId);
    await User.findByIdAndUpdate(ratedUserId, {
      rating: avgRating.averageRating,
      reviews: avgRating.totalRatings
    });
    
    console.log('✅ Rating deleted and user rating recalculated');
    
    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete rating error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
