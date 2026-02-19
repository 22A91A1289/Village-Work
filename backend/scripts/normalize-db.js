const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const { normalizeEmail } = require('../utils/validation');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function normalizeDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`Normalizing ${users.length} users...`);
    
    for (const user of users) {
      const originalEmail = user.email;
      const normalizedEmail = normalizeEmail(originalEmail);
      
      if (originalEmail !== normalizedEmail) {
        console.log(`Updating ${originalEmail} -> ${normalizedEmail}`);
        try {
          user.email = normalizedEmail;
          await user.save();
        } catch (err) {
          if (err.code === 11000) {
            console.warn(`Duplicate found for ${normalizedEmail}. Skipping mapping for ${originalEmail}.`);
            // Optional: merge accounts or notify admin
          } else {
            console.error(`Error updating ${originalEmail}:`, err.message);
          }
        }
      }
    }
    
    console.log('Normalization complete.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

normalizeDB();
