/**
 * Test Script to Create Sample Payment Records
 * Run with: node backend/scripts/createTestPayment.js <userId>
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Payment = require('../models/Payment');
const User = require('../models/User');

async function createTestPayments(userId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worknex');
    console.log('✅ Connected to MongoDB');

    if (!userId) {
      console.error('❌ Please provide a user ID');
      console.log('Usage: node createTestPayment.js <userId>');
      console.log('\n💡 To get user ID, run: node scripts/getUserId.js');
      process.exit(1);
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ User not found with ID: ${userId}`);
      process.exit(1);
    }

    console.log(`\n👤 User: ${user.name} (${user.email})`);

    // Find an employer
    const employer = await User.findOne({ role: 'owner' });
    if (!employer) {
      console.error('❌ No employer found in database');
      process.exit(1);
    }

    // Sample payment templates
    const samplePayments = [
      {
        amount: 650,
        status: 'completed',
        paymentMethod: 'upi',
        transactionId: 'UPI' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        jobDetails: {
          title: 'Electrician Helper - Residential Work',
          category: 'Electrician',
          workDuration: '1 day',
          completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      },
      {
        amount: 550,
        status: 'completed',
        paymentMethod: 'cash',
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        jobDetails: {
          title: 'Plumber Work - Pipe Installation',
          category: 'Plumber',
          workDuration: '1 day',
          completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        }
      },
      {
        amount: 800,
        status: 'pending',
        jobDetails: {
          title: 'Carpenter - Furniture Repair',
          category: 'Carpenter',
          workDuration: '2 days',
          completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Yesterday
        }
      },
      {
        amount: 450,
        status: 'pending',
        jobDetails: {
          title: 'Farm Labor Work',
          category: 'Farming',
          workDuration: '1 day',
          completedDate: new Date() // Today
        }
      },
      {
        amount: 700,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        jobDetails: {
          title: 'Mechanic Assistant - Vehicle Service',
          category: 'Mechanic',
          workDuration: '1 day',
          completedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    console.log('\n💰 Creating test payments...\n');

    const createdPayments = [];
    for (const paymentData of samplePayments) {
      const payment = new Payment({
        worker: userId,
        employer: employer._id,
        job: new mongoose.Types.ObjectId(), // Dummy job ID
        application: new mongoose.Types.ObjectId(), // Dummy application ID
        ...paymentData
      });

      await payment.save();
      createdPayments.push(payment);
      
      const statusEmoji = payment.status === 'completed' ? '✅' : '⏳';
      console.log(`${statusEmoji} ${payment.jobDetails.title}`);
      console.log(`   Amount: ₹${payment.amount}`);
      console.log(`   Status: ${payment.status.toUpperCase()}`);
      if (payment.paidAt) {
        console.log(`   Paid: ${payment.paidAt.toLocaleDateString()}`);
      }
      console.log('');
    }

    // Calculate summary
    const totalEarnings = createdPayments.reduce((sum, p) => sum + p.amount, 0);
    const completed = createdPayments.filter(p => p.status === 'completed');
    const pending = createdPayments.filter(p => p.status === 'pending');
    const completedAmount = completed.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = pending.reduce((sum, p) => sum + p.amount, 0);

    console.log('📊 Summary:');
    console.log(`   Total Payments: ${createdPayments.length}`);
    console.log(`   Total Earnings: ₹${totalEarnings.toLocaleString('en-IN')}`);
    console.log(`   Completed: ${completed.length} (₹${completedAmount.toLocaleString('en-IN')})`);
    console.log(`   Pending: ${pending.length} (₹${pendingAmount.toLocaleString('en-IN')})`);

    console.log('\n✅ Test payments created successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Login to mobile app as this user');
    console.log('   2. Go to Profile tab');
    console.log('   3. See "💰 Earnings & Payments" section');
    console.log('   4. Tap "View All" to see full payment history');

    console.log('\n🗑️  To clean up test data:');
    console.log(`   db.payments.deleteMany({ worker: ObjectId('${userId}') })`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Get userId from command line argument
const userId = process.argv[2];
createTestPayments(userId);
