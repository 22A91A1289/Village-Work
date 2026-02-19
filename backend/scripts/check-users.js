const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'email name');
    console.log('Users in DB:');
    users.forEach(u => console.log(`- ${u.email} (${u.name})`));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
