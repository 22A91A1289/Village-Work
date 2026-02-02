/**
 * Script to Get User ID by Email
 * Run with: node backend/scripts/getUserId.js <email>
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function getUserId(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worknex');
    console.log('✅ Connected to MongoDB');

    if (!email) {
      console.log('\n📋 Fetching all users...\n');
      const users = await User.find().select('name email role _id').limit(10);
      
      if (users.length === 0) {
        console.log('❌ No users found in database');
        process.exit(1);
      }

      console.log('👥 Users in database:\n');
      users.forEach((user, i) => {
        console.log(`${i + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user._id}`);
        console.log('');
      });

      console.log('\n💡 To create test notifications for a user, run:');
      console.log(`   node backend/scripts/createTestNotification.js <userId>`);
      console.log('\n   Example:');
      console.log(`   node backend/scripts/createTestNotification.js ${users[0]._id}`);
    } else {
      const user = await User.findOne({ email: email.toLowerCase() }).select('name email role _id');
      
      if (!user) {
        console.log(`❌ No user found with email: ${email}`);
        process.exit(1);
      }

      console.log('\n✅ User found:\n');
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`ID: ${user._id}`);
      console.log('\n💡 To create test notifications for this user, run:');
      console.log(`   node backend/scripts/createTestNotification.js ${user._id}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
getUserId(email);
