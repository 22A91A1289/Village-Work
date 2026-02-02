const mongoose = require('mongoose');
require('dotenv').config();

const Application = require('./models/Application');
const Job = require('./models/Job');
const User = require('./models/User');

async function checkApplications() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all applications
    const applications = await Application.find()
      .populate('job', 'title category')
      .populate('applicant', 'name email phone')
      .sort({ appliedAt: -1 });

    console.log('📊 TOTAL APPLICATIONS:', applications.length);
    console.log('─'.repeat(80));

    if (applications.length === 0) {
      console.log('⚠️  No applications found in database');
      console.log('\n💡 This means:');
      console.log('   1. No workers have applied to jobs yet');
      console.log('   2. OR applications are not being saved (bug in mobile app)');
    } else {
      applications.forEach((app, index) => {
        console.log(`\n${index + 1}. APPLICATION ID: ${app._id}`);
        console.log(`   📝 Job: ${app.job?.title || 'Job Deleted'} (${app.job?.category || 'N/A'})`);
        console.log(`   👤 Applicant: ${app.applicant?.name || 'User Deleted'}`);
        console.log(`   📧 Email: ${app.applicant?.email || 'N/A'}`);
        console.log(`   📱 Phone: ${app.applicant?.phone || 'N/A'}`);
        console.log(`   📍 Status: ${app.status}`);
        console.log(`   📅 Applied: ${app.appliedAt.toLocaleString()}`);
        console.log(`   💬 Message: ${app.message || 'No message'}`);
      });
    }

    console.log('\n' + '─'.repeat(80));

    // Check jobs
    const jobs = await Job.find().populate('postedBy', 'name email');
    console.log(`\n📊 TOTAL JOBS: ${jobs.length}`);
    
    if (jobs.length === 0) {
      console.log('⚠️  No jobs found in database');
      console.log('💡 Create jobs first from the web dashboard!');
    } else {
      console.log('\nJOBS LIST:');
      jobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} (${job.category}) - Posted by: ${job.postedBy?.name || 'Unknown'}`);
        console.log(`   Applicants: ${job.applicants?.length || 0}`);
      });
    }

    console.log('\n' + '─'.repeat(80));

    // Check users
    const workers = await User.find({ role: 'worker' }).select('name email phone');
    const owners = await User.find({ role: 'owner' }).select('name email');
    
    console.log(`\n👷 WORKERS: ${workers.length}`);
    workers.forEach((w, i) => console.log(`${i + 1}. ${w.name} (${w.email})`));
    
    console.log(`\n👔 EMPLOYERS: ${owners.length}`);
    owners.forEach((o, i) => console.log(`${i + 1}. ${o.name} (${o.email})`));

    console.log('\n✅ Database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run on a loop every 5 seconds if --watch flag is provided
if (process.argv.includes('--watch')) {
  console.log('👀 WATCH MODE: Checking database every 5 seconds...\n');
  setInterval(async () => {
    await checkApplications();
    console.log('\n⏳ Next check in 5 seconds...\n');
  }, 5000);
} else {
  checkApplications();
}
