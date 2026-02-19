const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Robustly load .env
let envPath = path.join(__dirname, '..', '..', '.env');
if (!fs.existsSync(envPath)) {
  envPath = path.join(__dirname, '..', '.env');
}
if (!fs.existsSync(envPath)) {
    envPath = path.join(__dirname, '.env');
}

dotenv.config({ path: envPath });

console.log(`📡 Loaded environment from: ${envPath}`);

if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['worker', 'owner', 'admin'], default: 'worker' },
  // ... other fields are not needed for this update
}, { strict: false }); // strict: false allows us to update without defining the full schema

const User = mongoose.model('User', userSchema);

const updateRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'rohithtelidevara@gmail.com';
    const newRole = 'worker';

    const result = await User.findOneAndUpdate(
      { email: email },
      { $set: { role: newRole } },
      { new: true }
    );

    if (result) {
      console.log(`✅ Successfully updated role for ${email} to '${result.role}'`);
    } else {
      console.error(`❌ User with email ${email} not found.`);
    }

  } catch (error) {
    console.error('❌ Error updating role:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

updateRole();
