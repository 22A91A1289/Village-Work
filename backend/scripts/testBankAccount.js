/**
 * Test Script for Bank Account System
 * Run with: node backend/scripts/testBankAccount.js <userId>
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const BankAccount = require('../models/BankAccount');
const User = require('../models/User');

async function testBankAccountSystem(userId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worknex');
    console.log('✅ Connected to MongoDB\n');

    if (!userId) {
      console.error('❌ Please provide a user ID');
      console.log('Usage: node testBankAccount.js <userId>');
      console.log('\n💡 To get user ID, run: node scripts/getUserId.js');
      process.exit(1);
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ User not found with ID: ${userId}`);
      process.exit(1);
    }

    console.log(`👤 Testing for: ${user.name} (${user.email})\n`);

    // Sample bank accounts
    const sampleAccounts = [
      {
        accountHolderName: user.name,
        accountNumber: '12345678901234',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
        branchName: 'Mumbai Branch',
        accountType: 'savings',
        upiId: user.email.split('@')[0] + '@sbi'
      },
      {
        accountHolderName: user.name,
        accountNumber: '98765432109876',
        ifscCode: 'HDFC0002345',
        bankName: 'HDFC Bank',
        branchName: 'Delhi Branch',
        accountType: 'current',
        upiId: user.email.split('@')[0] + '@hdfcbank'
      }
    ];

    console.log('🏦 Creating test bank accounts...\n');

    const createdAccounts = [];
    for (let i = 0; i < sampleAccounts.length; i++) {
      const accountData = sampleAccounts[i];
      
      // Check if account already exists
      const existing = await BankAccount.findOne({
        user: userId,
        accountNumber: accountData.accountNumber,
        isActive: true
      });

      if (existing) {
        console.log(`⏭️  Account ${i + 1} already exists (${accountData.bankName})`);
        createdAccounts.push(existing);
        continue;
      }

      const account = new BankAccount({
        user: userId,
        ...accountData,
        isPrimary: i === 0, // First account is primary
        isVerified: i === 0, // First account is verified
        verificationStatus: i === 0 ? 'verified' : 'pending',
        verifiedAt: i === 0 ? new Date() : null,
        verificationMethod: i === 0 ? 'manual' : 'manual'
      });

      await account.save();
      createdAccounts.push(account);

      const verifiedEmoji = account.isVerified ? '✅' : '⏳';
      const primaryEmoji = account.isPrimary ? '⭐' : '  ';

      console.log(`${verifiedEmoji} ${primaryEmoji} Account ${i + 1}: ${accountData.bankName}`);
      console.log(`   Account Number: ${account.maskedAccountNumber}`);
      console.log(`   IFSC: ${accountData.ifscCode}`);
      console.log(`   Type: ${accountData.accountType.toUpperCase()}`);
      console.log(`   UPI: ${accountData.upiId}`);
      console.log(`   Status: ${account.verificationStatus.toUpperCase()}`);
      console.log('');
    }

    // Summary
    console.log('📊 Summary:');
    console.log(`   Total Accounts: ${createdAccounts.length}`);
    console.log(`   Verified: ${createdAccounts.filter(a => a.isVerified).length}`);
    console.log(`   Pending: ${createdAccounts.filter(a => !a.isVerified).length}`);
    console.log(`   Primary: ${createdAccounts.find(a => a.isPrimary)?.bankName || 'None'}`);

    // Get primary account
    const primaryAccount = await BankAccount.getPrimaryAccount(userId);
    if (primaryAccount) {
      console.log('\n⭐ Primary Account:');
      console.log(`   ${primaryAccount.accountHolderName}`);
      console.log(`   ${primaryAccount.bankName}`);
      console.log(`   ${primaryAccount.maskedAccountNumber}`);
      console.log(`   IFSC: ${primaryAccount.ifscCode}`);
    }

    console.log('\n✅ Bank accounts created successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart backend server (if running)');
    console.log('   2. Clear cache and reload mobile app:');
    console.log('      npx expo start -c');
    console.log('   3. Login to mobile app as this user');
    console.log('   4. Go to Profile → Earnings & Payments');
    console.log('   5. See "Bank Account" section');
    console.log('   6. Tap "Manage" to see all accounts');

    console.log('\n🧪 Test Payment with Bank Account:');
    console.log('   1. Complete a job');
    console.log('   2. Employer calls:');
    console.log(`      GET /api/payment-actions/{paymentId}/worker-bank-account`);
    console.log('   3. Will return primary account details');
    console.log('   4. Complete payment with bank_transfer method');

    console.log('\n🗑️  To clean up test data:');
    console.log(`   db.bankaccounts.deleteMany({ user: ObjectId('${userId}') })`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Get userId from command line argument
const userId = process.argv[2];
testBankAccountSystem(userId);
