const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const Rating = require('../models/Rating');
const { auth, isOwnerOrAdmin } = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Worker only)
router.post('/', auth, async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('📝 POST /api/applications called');
    console.log('👤 User ID:', req.userId);
    console.log('👤 User role:', req.user?.role);
    console.log('📦 Request body:', req.body);
    console.log('========================================\n');
    
    const { jobId, message } = req.body;
    
    if (!jobId) {
      console.log('❌ No jobId provided');
      return res.status(400).json({ error: 'Job ID is required' });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('❌ Job not found:', jobId);
      return res.status(404).json({ error: 'Job not found' });
    }
    console.log('✅ Job found:', job.title);
    
    // Check if user is worker
    const user = await User.findById(req.userId);
    console.log('👤 User role:', user.role);
    if (user.role !== 'worker') {
      console.log('❌ User is not a worker');
      return res.status(403).json({ error: 'Only workers can apply for jobs' });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.userId
    });
    
    if (existingApplication) {
      console.log('⚠️ Already applied');
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    
    // Create application
    const application = new Application({
      job: jobId,
      applicant: req.userId,
      message: message || ''
    });
    
    await application.save();
    console.log('✅ Application created successfully!');
    console.log('📋 Application details:', {
      id: application._id,
      job: application.job,
      applicant: application.applicant,
      status: application.status,
      createdAt: application.appliedAt
    });
    
    // Add applicant to job
    if (!job.applicants.includes(req.userId)) {
      job.applicants.push(req.userId);
      await job.save();
      console.log('✅ Applicant added to job');
    } else {
      console.log('ℹ️ Applicant already in job.applicants array');
    }
    console.log('📋 Job details:', {
      jobId: job._id,
      postedBy: job.postedBy,
      title: job.title,
      totalApplicants: job.applicants.length
    });
    
    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title location salary')
      .populate('applicant', 'name email phone location skills');
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(job.postedBy.toString()).emit('application:new', {
        application: populatedApplication,
        timestamp: new Date()
      });
    }
    
    console.log('✅ Application submitted successfully');
    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error('❌ Create application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get current user's applications
// @access  Private
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .populate('job', 'title location salary type category status')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/applications/owner/all
// @desc    Get all applications for employer's jobs
// @access  Private (Owner/Admin only)
router.get('/owner/all', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('🔍 GET /api/applications/owner/all called');
    console.log('👤 User ID:', req.userId);
    console.log('👤 User role:', req.user?.role);
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('========================================\n');
    
    // Get all jobs posted by this employer
    const employerJobs = await Job.find({ postedBy: req.userId });
    console.log('📊 Employer jobs found:', employerJobs.length);
    employerJobs.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.title} (ID: ${job._id}) - ${job.applicants.length} applicants in job array`);
    });
    
    if (employerJobs.length === 0) {
      console.log('⚠️ No jobs found for this employer - returning empty array');
      return res.json([]);
    }
    
    console.log('📋 Job IDs:', employerJobs.map(j => j._id));
    
    const jobIds = employerJobs.map(job => job._id);
    
    // Debug: Check ALL applications in database
    const allApplications = await Application.find({});
    console.log('🔍 DEBUG: Total applications in DB:', allApplications.length);
    if (allApplications.length > 0) {
      console.log('🔍 DEBUG: Sample application in DB:', {
        id: allApplications[0]._id,
        job: allApplications[0].job,
        applicant: allApplications[0].applicant,
        status: allApplications[0].status
      });
    }
    
    // Get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title location salary type category status')
      .populate('applicant', 'name email phone location skills workCategories workTypes experience experienceLevel quizScore quizPassed rating videoUrl videoUploaded')
      .sort({ appliedAt: -1 });
    
    console.log('📊 Applications found for employer:', applications.length);
    
    if (applications.length > 0) {
      console.log('✅ Applications found! Details:');
      applications.forEach((app, index) => {
        console.log(`  ${index + 1}. ${app.applicant?.name || 'Unknown'} applied for "${app.job?.title || 'Unknown Job'}" - Status: ${app.status}`);
      });
    } else {
      console.log('⚠️ No applications found for these jobs');
      console.log('🔍 DEBUG: Checking if job IDs match...');
      // Check if any applications exist for any of these job IDs
      for (const jobId of jobIds) {
        const count = await Application.countDocuments({ job: jobId });
        console.log(`  🔍 Job ${jobId}: ${count} applications`);
      }
      console.log('🔍 DEBUG: Total applications in database:', allApplications.length);
    }
    
    console.log('\n========================================');
    console.log('✅ Returning', applications.length, 'applications to web dashboard');
    console.log('========================================\n');
    
    res.json(applications);
  } catch (error) {
    console.error('❌ Get owner applications error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get applications for a specific job
// @access  Private (Owner/Admin only)
router.get('/job/:jobId', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check if user is the owner or admin
    if (job.postedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view these applications' });
    }
    
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone location skills experience quizScore quizPassed videoUrl')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Owner/Admin only)
router.put('/:id/status', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const application = await Application.findById(req.params.id)
      .populate('job');
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Check if user is the job owner or admin
    if (application.job.postedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }
    
    application.status = status;
    application.reviewedAt = new Date();
    
    if (status === 'completed') {
      application.completedAt = new Date();
    }
    
    await application.save();
    
    // Create payment record when application is accepted
    if (status === 'accepted') {
      try {
        // Extract amount from salary string (e.g., "₹600/day" -> 600)
        let amount = 0;
        if (application.job.salary) {
          const salaryMatch = application.job.salary.match(/(\d+)/);
          if (salaryMatch) {
            amount = parseInt(salaryMatch[0]);
          }
        }

        // Check if payment already exists for this application
        const existingPayment = await Payment.findOne({ application: application._id });
        
        if (!existingPayment) {
          const payment = new Payment({
            worker: application.applicant,
            employer: application.job.postedBy,
            job: application.job._id,
            application: application._id,
            amount: amount,
            status: 'pending', // Pending until employer marks as paid
            jobDetails: {
              title: application.job.title,
              category: application.job.category,
              workDuration: application.job.workDuration,
              acceptedDate: new Date()
            }
          });

          await payment.save();
          console.log(`✅ Payment record created: ₹${amount} for ${application.job.title}`);
        } else {
          console.log(`ℹ️ Payment already exists for this application`);
        }
      } catch (paymentError) {
        console.error('❌ Error creating payment record:', paymentError);
        // Don't fail the main request if payment creation fails
      }
    }
    
    // Create notification for applicant
    try {
      let notificationData = {};
      
      if (status === 'accepted') {
        notificationData = {
          type: 'application_status',
          title: '🎉 Application Accepted!',
          message: `Your application for "${application.job.title}" has been accepted. The employer will contact you soon.`,
          data: { applicationId: application._id, jobId: application.job._id },
          actionUrl: 'MyApplications',
          icon: 'checkmark-circle',
          iconColor: '#10B981'
        };
      } else if (status === 'rejected') {
        notificationData = {
          type: 'application_status',
          title: 'Application Update',
          message: `Your application for "${application.job.title}" was not selected this time. Keep applying!`,
          data: { applicationId: application._id, jobId: application.job._id },
          actionUrl: 'MyApplications',
          icon: 'close-circle',
          iconColor: '#EF4444'
        };
      } else if (status === 'completed') {
        notificationData = {
          type: 'application_status',
          title: '✅ Job Completed',
          message: `Your job "${application.job.title}" has been marked as completed. Great work!`,
          data: { applicationId: application._id, jobId: application.job._id },
          actionUrl: 'MyApplications',
          icon: 'trophy',
          iconColor: '#F59E0B'
        };
      }
      
      if (Object.keys(notificationData).length > 0) {
        await Notification.createNotification(application.applicant, notificationData);
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail the main request if notification fails
    }
    
    const updatedApplication = await Application.findById(application._id)
      .populate('job', 'title location salary')
      .populate('applicant', 'name email phone location');
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Notify the employer
      io.to(application.job.postedBy.toString()).emit('application:updated', {
        application: updatedApplication,
        timestamp: new Date()
      });
      
      // Notify the worker
      io.to(application.applicant.toString()).emit('application:updated', {
        application: updatedApplication,
        timestamp: new Date()
      });
    }
    
    res.json(updatedApplication);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PATCH /api/applications/:id
// @desc    Update application (for web dashboard)
// @access  Private (Owner/Admin only)
router.patch('/:id', auth, isOwnerOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected', 'pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const application = await Application.findById(req.params.id)
      .populate('job');
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Check if user is the job owner or admin
    if (application.job.postedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }
    
    application.status = status;
    application.reviewedAt = new Date();
    
    if (status === 'completed') {
      application.completedAt = new Date();
    }
    
    await application.save();
    
    // Create payment record when application is accepted
    if (status === 'accepted') {
      try {
        // Extract amount from salary string (e.g., "₹600/day" -> 600)
        let amount = 0;
        if (application.job.salary) {
          const salaryMatch = application.job.salary.match(/(\d+)/);
          if (salaryMatch) {
            amount = parseInt(salaryMatch[0]);
          }
        }

        // Check if payment already exists for this application
        const Payment = require('../models/Payment');
        const existingPayment = await Payment.findOne({ application: application._id });
        
        if (!existingPayment) {
          const payment = new Payment({
            worker: application.applicant,
            employer: application.job.postedBy,
            job: application.job._id,
            application: application._id,
            amount: amount,
            status: 'pending', // Pending until employer marks as paid
            jobDetails: {
              title: application.job.title,
              category: application.job.category,
              workDuration: application.job.workDuration,
              acceptedDate: new Date()
            }
          });

          await payment.save();
          console.log(`✅ Payment record created: ₹${amount} for ${application.job.title}`);
        } else {
          console.log(`ℹ️ Payment already exists for this application`);
        }
      } catch (paymentError) {
        console.error('❌ Error creating payment record:', paymentError);
        // Don't fail the main request if payment creation fails
      }
    }
    
    // Create notification for applicant
    try {
      let notificationData = {};
      
      if (status === 'accepted') {
        notificationData = {
          type: 'application_status',
          title: '🎉 Application Accepted!',
          message: `Your application for "${application.job.title}" has been accepted. The employer will contact you soon.`,
          data: { applicationId: application._id, jobId: application.job._id },
          actionUrl: 'MyApplications',
          icon: 'checkmark-circle',
          iconColor: '#10B981'
        };
      } else if (status === 'rejected') {
        notificationData = {
          type: 'application_status',
          title: 'Application Update',
          message: `Your application for "${application.job.title}" was not selected this time. Keep applying!`,
          data: { applicationId: application._id, jobId: application.job._id },
          actionUrl: 'MyApplications',
          icon: 'close-circle',
          iconColor: '#EF4444'
        };
      } else if (status === 'completed') {
        notificationData = {
          type: 'application_status',
          title: '✅ Job Completed',
          message: `Your job "${application.job.title}" has been marked as completed. Great work!`,
          data: { applicationId: application._id, jobId: application.job._id },
          actionUrl: 'MyApplications',
          icon: 'trophy',
          iconColor: '#F59E0B'
        };
      }
      
      if (Object.keys(notificationData).length > 0) {
        await Notification.createNotification(application.applicant, notificationData);
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail the main request if notification fails
    }
    
    const updatedApplication = await Application.findById(application._id)
      .populate('job', 'title location salary')
      .populate('applicant', 'name email phone location');
    
    res.json(updatedApplication);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/applications/work-history
// @desc    Get worker's completed work history
// @access  Private
router.get('/work-history', auth, async (req, res) => {
  try {
    // Fetch completed applications
    const applications = await Application.find({
      applicant: req.userId,
      status: { $in: ['completed', 'cancelled', 'accepted'] }
    })
      .populate('job', 'title category location salary workDuration')
      .sort({ completedAt: -1, createdAt: -1 })
      .lean();

    // Fetch payment data for each application
    const applicationsWithPayments = await Promise.all(
      applications.map(async (app) => {
        const payment = await Payment.findOne({
          application: app._id,
          worker: req.userId
        }).lean();

        return {
          ...app,
          payment: payment || null
        };
      })
    );

    // Fetch ratings for these applications (rated by employer)
    const ratingMap = {};
    const appIds = applicationsWithPayments.map(app => app._id);
    if (appIds.length > 0) {
      const ratings = await Rating.find({
        ratedUser: req.userId,
        application: { $in: appIds }
      }).select('application rating review').lean();

      ratings.forEach(r => {
        ratingMap[r.application.toString()] = {
          rating: r.rating,
          review: r.review
        };
      });
    }

    const historyWithRatings = applicationsWithPayments.map(app => ({
      ...app,
      rating: ratingMap[app._id.toString()]?.rating || null,
      review: ratingMap[app._id.toString()]?.review || null
    }));

    // Calculate stats
    const completedApps = historyWithRatings.filter(app => app.status === 'completed');
    const totalJobs = completedApps.length;
    
    const totalEarnings = completedApps.reduce((sum, app) => {
      return sum + (app.payment?.amount || 0);
    }, 0);

    // Average rating from user profile
    const avgRating = req.user?.rating || 0;

    const stats = {
      totalJobs,
      totalEarnings,
      avgRating,
      completionRate: applications.length > 0 
        ? Math.round((completedApps.length / applications.length) * 100) 
        : 0
    };

    res.json({
      success: true,
      history: historyWithRatings,
      stats
    });
  } catch (error) {
    console.error('Error fetching work history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work history',
      error: error.message
    });
  }
});

module.exports = router;
