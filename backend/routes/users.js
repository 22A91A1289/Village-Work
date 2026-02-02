const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'phone', 'location', 'skills', 'experience', 
      'bio', 'hourlyRate', 'workType', 'availability',
      'businessName', 'businessType' // Added employer fields
    ];
    
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    updates.forEach(update => {
      user[update] = req.body[update];
    });
    
    await user.save();
    
    console.log('✅ Profile updated for user:', user.email);
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/users/upload-video
// @desc    Upload video introduction (save URL/data)
// @access  Private
router.post('/upload-video', auth, async (req, res) => {
  try {
    const { videoUrl, videoData, duration } = req.body;
    
    console.log('📹 Video upload request:', {
      userId: req.userId,
      hasVideoUrl: !!videoUrl,
      hasVideoData: !!videoData,
      duration
    });
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate duration (30-240 seconds for 30 seconds to 4 minutes)
    if (duration && (duration < 30 || duration > 240)) {
      return res.status(400).json({ 
        error: 'Video must be between 30 seconds to 4 minutes (30-240 seconds)' 
      });
    }
    
    // Store video URL or data
    if (videoUrl) {
      user.videoUrl = videoUrl;
    } else if (videoData) {
      // For base64 or cloud storage URL
      user.videoUrl = videoData;
    }
    
    user.videoUploaded = true;
    
    await user.save();
    
    console.log('✅ Video saved for user:', user.email);
    
    res.json({
      message: 'Video uploaded successfully',
      videoUploaded: true,
      videoUrl: user.videoUrl
    });
  } catch (error) {
    console.error('❌ Video upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/video
// @desc    Update user video URL
// @access  Private
router.put('/video', auth, async (req, res) => {
  try {
    const { videoUrl } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }
    
    const user = await User.findById(req.userId);
    user.videoUrl = videoUrl;
    user.videoUploaded = true;
    await user.save();
    
    res.json({ message: 'Video uploaded successfully', videoUrl: user.videoUrl });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/work-preferences
// @desc    Update user work preferences
// @access  Private
router.put('/work-preferences', auth, async (req, res) => {
  try {
    const { workCategories, workTypes, availability, experienceLevel } = req.body;
    
    console.log('📋 Work preferences update:', {
      userId: req.userId,
      workCategories,
      workTypes,
      availability,
      experienceLevel
    });
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update work preferences
    if (workCategories) user.workCategories = workCategories;
    if (workTypes) user.workTypes = workTypes;
    if (availability) user.availability = availability;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    
    // Mark preferences as completed
    user.workPreferencesCompleted = true;
    
    await user.save();
    
    console.log('✅ Work preferences saved for user:', user.email);
    
    res.json({
      message: 'Work preferences saved successfully',
      workPreferences: {
        workCategories: user.workCategories,
        workTypes: user.workTypes,
        availability: user.availability,
        experienceLevel: user.experienceLevel,
        workPreferencesCompleted: user.workPreferencesCompleted
      }
    });
  } catch (error) {
    console.error('❌ Work preferences update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/work-preferences
// @desc    Get user work preferences
// @access  Private
router.get('/work-preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('workCategories workTypes availability experienceLevel workPreferencesCompleted');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      workCategories: user.workCategories || [],
      workTypes: user.workTypes || [],
      availability: user.availability || '',
      experienceLevel: user.experienceLevel || '',
      workPreferencesCompleted: user.workPreferencesCompleted || false
    });
  } catch (error) {
    console.error('Get work preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email -phone');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
