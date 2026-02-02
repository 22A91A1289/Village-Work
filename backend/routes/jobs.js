const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Notification = require('../models/Notification');
const { auth, isOwnerOrAdmin } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all active jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, location, experienceLevel } = req.query;
    
    // Build query
    const query = { status: 'active' };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (experienceLevel && experienceLevel !== 'any') {
      query.experienceLevel = experienceLevel;
    }
    
    const jobs = await Job.find(query)
      .populate('postedBy', 'name email phone location')
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email phone location')
      .populate('applicants', 'name email phone location skills');
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Owner/Admin only)
router.post('/', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.userId
    };
    
    const job = new Job(jobData);
    await job.save();
    
    const populatedJob = await Job.findById(job._id)
      .populate('postedBy', 'name email phone');
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('job:created', {
        job: populatedJob,
        timestamp: new Date()
      });
    }
    
    // Send notifications to eligible users
    try {
      await sendJobNotifications(job);
    } catch (notifError) {
      console.error('Error sending job notifications:', notifError);
      // Don't fail job creation if notifications fail
    }
    
    res.status(201).json(populatedJob);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/jobs/owner/my-jobs
// @desc    Get all jobs posted by current user (employer)
// @access  Private (Owner/Admin only)
router.get('/owner/my-jobs', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    console.log('🔍 GET /api/jobs/owner/my-jobs called');
    console.log('👤 User ID:', req.userId);
    
    const jobs = await Job.find({ postedBy: req.userId })
      .sort({ createdAt: -1 });
    
    console.log('📊 Jobs found:', jobs.length);
    res.json(jobs);
  } catch (error) {
    console.error('❌ Get my jobs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Owner/Admin only)
router.put('/:id', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check if user is the owner or admin
    if (job.postedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }
    
    Object.assign(job, req.body);
    await job.save();
    
    const updatedJob = await Job.findById(job._id)
      .populate('postedBy', 'name email phone');
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('job:updated', {
        job: updatedJob,
        timestamp: new Date()
      });
    }
    
    res.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Owner/Admin only)
router.delete('/:id', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check if user is the owner or admin
    if (job.postedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }
    
    const jobId = job._id;
    await job.deleteOne();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('job:deleted', {
        jobId: jobId,
        timestamp: new Date()
      });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/jobs/owner/my-jobs
// @desc    Get jobs posted by current user
// @access  Private (Owner/Admin only)
router.get('/owner/my-jobs', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId })
      .populate('applicants', 'name email phone location skills')
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to send notifications when new job is posted
async function sendJobNotifications(job) {
  try {
    // Technical job categories that require skill tests
    const technicalCategories = ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Welder', 'Data Entry'];
    
    let eligibleUsers = [];
    
    if (job.type === 'Technical Work' && technicalCategories.includes(job.category)) {
      // For technical jobs: Find users who passed the specific skill test
      console.log(`📢 Finding users who passed ${job.category} skill test...`);
      
      const passedQuizzes = await Quiz.find({
        category: job.category,
        passed: true
      }).distinct('user');
      
      if (passedQuizzes.length > 0) {
        eligibleUsers = await User.find({
          _id: { $in: passedQuizzes },
          role: 'worker'
        }).select('_id');
        
        console.log(`✅ Found ${eligibleUsers.length} eligible users for ${job.category}`);
      }
    } else {
      // For daily work: Notify all active workers
      console.log(`📢 Notifying all workers about ${job.category} job...`);
      
      eligibleUsers = await User.find({
        role: 'worker'
      }).select('_id').limit(100); // Limit to avoid overwhelming system
      
      console.log(`✅ Found ${eligibleUsers.length} workers to notify`);
    }
    
    // Create notifications for eligible users
    if (eligibleUsers.length > 0) {
      const notifications = eligibleUsers.map(user => ({
        user: user._id,
        type: 'new_job',
        title: `💼 New ${job.category} Job!`,
        message: `${job.title} - ${job.salary} in ${job.location}. Apply now!`,
        data: { 
          jobId: job._id,
          jobCategory: job.category,
          jobType: job.type
        },
        actionUrl: 'JobDetails',
        icon: 'briefcase',
        iconColor: '#3B82F6'
      }));
      
      await Notification.insertMany(notifications);
      console.log(`✅ Created ${notifications.length} job notifications`);
    }
  } catch (error) {
    console.error('Error in sendJobNotifications:', error);
    throw error;
  }
}

module.exports = router;
