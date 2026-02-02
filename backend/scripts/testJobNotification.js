/**
 * Test Script to Create a Job and Verify Notifications
 * Run with: node backend/scripts/testJobNotification.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Job = require('../models/Job');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Notification = require('../models/Notification');

async function testJobNotification() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worknex');
    console.log('✅ Connected to MongoDB\n');

    // 1. Find an employer
    const employer = await User.findOne({ role: 'owner' });
    if (!employer) {
      console.log('❌ No employer found. Please create an employer account first.');
      process.exit(1);
    }
    console.log(`👔 Found employer: ${employer.name} (${employer.email})`);

    // 2. Check workers who passed Electrician test
    const electricianQuizzes = await Quiz.find({
      category: 'Electrician',
      passed: true
    }).distinct('user');
    
    console.log(`\n⚡ Workers who passed Electrician test: ${electricianQuizzes.length}`);
    
    if (electricianQuizzes.length === 0) {
      console.log('⚠️  No workers have passed Electrician test yet.');
      console.log('💡 Create a worker account and pass the Electrician test first!');
    }

    // 3. Create a test job
    console.log('\n📝 Creating test Electrician job...');
    
    const testJob = new Job({
      title: 'Residential Electrician Needed - Test Job',
      description: 'This is a test job to verify notifications work correctly. Need experienced electrician for home wiring work.',
      category: 'Electrician',
      type: 'Technical Work',
      salary: '₹650/day',
      location: 'Vizianagaram',
      workDuration: '3 days',
      requirements: ['Basic electrical knowledge', 'Safety equipment'],
      experienceLevel: 'experienced',
      postedBy: employer._id,
      status: 'active'
    });

    await testJob.save();
    console.log(`✅ Job created: ${testJob.title}`);
    console.log(`   Job ID: ${testJob._id}`);

    // 4. Wait a moment for notifications to be created (if automatic)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. Check if notifications were created
    const notifications = await Notification.find({
      'data.jobId': testJob._id,
      type: 'new_job'
    }).populate('user', 'name email');

    console.log(`\n🔔 Notifications created: ${notifications.length}`);
    
    if (notifications.length > 0) {
      console.log('\n✅ NOTIFICATIONS SUCCESSFULLY CREATED!\n');
      console.log('Recipients:');
      notifications.forEach((notif, i) => {
        console.log(`  ${i + 1}. ${notif.user.name} (${notif.user.email})`);
        console.log(`     Title: ${notif.title}`);
        console.log(`     Message: ${notif.message}`);
        console.log('');
      });
    } else {
      console.log('\n⚠️  No notifications were created.');
      console.log('This might mean:');
      console.log('  1. No workers have passed the Electrician test yet');
      console.log('  2. The notification function needs to be called manually');
      console.log('  3. There was an error in the notification creation');
      
      // Try to create notifications manually
      console.log('\n🔧 Attempting to create notifications manually...');
      
      if (electricianQuizzes.length > 0) {
        const eligibleUsers = await User.find({
          _id: { $in: electricianQuizzes },
          role: 'worker'
        });
        
        const manualNotifications = eligibleUsers.map(user => ({
          user: user._id,
          type: 'new_job',
          title: `💼 New ${testJob.category} Job!`,
          message: `${testJob.title} - ${testJob.salary} in ${testJob.location}. Apply now!`,
          data: { 
            jobId: testJob._id,
            jobCategory: testJob.category,
            jobType: testJob.type
          },
          actionUrl: 'JobDetails',
          icon: 'briefcase',
          iconColor: '#3B82F6'
        }));
        
        await Notification.insertMany(manualNotifications);
        console.log(`✅ Manually created ${manualNotifications.length} notifications`);
      }
    }

    // 6. Summary
    console.log('\n📊 Summary:');
    console.log(`   Job created: ✅`);
    console.log(`   Notifications sent: ${notifications.length > 0 ? '✅' : '⚠️'}`);
    console.log(`   Total recipients: ${notifications.length || electricianQuizzes.length}`);
    
    console.log('\n💡 To verify:');
    console.log('   1. Login to worker app');
    console.log('   2. Check notification badge on bell icon');
    console.log('   3. Tap bell to see notifications');
    console.log('   4. Tap notification to view job details');
    
    console.log('\n🗑️  To clean up:');
    console.log(`   db.jobs.deleteOne({ _id: ObjectId('${testJob._id}') })`);
    console.log(`   db.notifications.deleteMany({ 'data.jobId': ObjectId('${testJob._id}') })`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testJobNotification();
