/**
 * Test Script to Create Sample Notifications
 * Run with: node backend/scripts/createTestNotification.js <userId>
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Notification = require('../models/Notification');

// Sample notification templates
const sampleNotifications = [
  {
    type: 'application_status',
    title: '🎉 Application Accepted!',
    message: 'Your application for "Electrician Helper" has been accepted. The employer will contact you soon.',
    icon: 'checkmark-circle',
    iconColor: '#10B981',
    actionUrl: 'MyApplications'
  },
  {
    type: 'new_job',
    title: '💼 New Job Available',
    message: 'A new Plumber job has been posted in your area. Check it out now!',
    icon: 'briefcase',
    iconColor: '#3B82F6',
    actionUrl: 'Home'
  },
  {
    type: 'quiz_reminder',
    title: '📚 Quiz Reminder',
    message: 'Don\'t forget to take your Mechanic skill test to unlock more opportunities.',
    icon: 'school',
    iconColor: '#8B5CF6',
    actionUrl: 'QuizScreen'
  },
  {
    type: 'message',
    title: '💬 New Message',
    message: 'Ramesh Kumar sent you a message about the Electrician position.',
    icon: 'chatbubble',
    iconColor: '#06B6D4',
    actionUrl: 'ChatList'
  },
  {
    type: 'payment',
    title: '💰 Payment Received',
    message: 'You received ₹650 payment for completing the Carpentry job.',
    icon: 'card',
    iconColor: '#F59E0B',
    actionUrl: 'Profile'
  }
];

async function createTestNotifications(userId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worknex');
    console.log('✅ Connected to MongoDB');

    if (!userId) {
      console.error('❌ Please provide a user ID');
      console.log('Usage: node createTestNotification.js <userId>');
      process.exit(1);
    }

    // Create 3 random notifications
    const notificationsToCreate = [];
    for (let i = 0; i < 3; i++) {
      const template = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      notificationsToCreate.push({
        user: userId,
        ...template,
        data: { test: true },
        createdAt: new Date(Date.now() - (i * 1000 * 60 * 5)) // 5 minutes apart
      });
    }

    const created = await Notification.insertMany(notificationsToCreate);
    console.log(`✅ Created ${created.length} test notifications for user ${userId}`);
    console.log('\nNotifications:');
    created.forEach((notif, i) => {
      console.log(`${i + 1}. ${notif.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get userId from command line argument
const userId = process.argv[2];
createTestNotifications(userId);
