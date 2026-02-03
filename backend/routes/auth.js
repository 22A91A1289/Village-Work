const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendOtpEmail } = require('../utils/mailer');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      role, 
      location,
      workCategories,
      experienceLevel,
      workPreferencesCompleted
    } = req.body;
    
    // Validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    const emailNorm = (typeof email === 'string' ? email : '').trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: emailNorm });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Create new user (use normalized email)
    const user = new User({
      name,
      email: emailNorm,
      phone,
      password,
      role,
      location: location || '',
      workCategories: workCategories || [],
      experienceLevel: experienceLevel || 'new',
      skillLevel: experienceLevel === 'experienced' ? 'experienced' : 'new', // Set skillLevel based on experienceLevel
      workPreferencesCompleted: workPreferencesCompleted || false
    });
    
    await user.save();
    
    console.log('✅ New user registered:', {
      email: user.email,
      role: user.role,
      workCategories: user.workCategories,
      experienceLevel: user.experienceLevel
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        workCategories: user.workCategories,
        experienceLevel: user.experienceLevel,
        skillLevel: user.skillLevel,
        workPreferencesCompleted: user.workPreferencesCompleted
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    // Normalize email (backend stores lowercase)
    const emailNorm = (typeof email === 'string' ? email : '').trim().toLowerCase();
    
    // Find user
    const user = await User.findOne({ email: emailNorm });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        skillLevel: user.skillLevel,
        quizPassed: user.quizPassed,
        videoUploaded: user.videoUploaded
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP to email for password reset
// @access  Public
const forgotPasswordHandler = async (req, res) => {
  let otp = null; // so we can use in catch for dev fallback
  try {
    const { email } = req.body;

    console.log('🔑 Forgot password request for email:', email);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Always respond success to avoid email enumeration
    if (!user) {
      console.log('⚠️ User not found for email:', email);
      return res.json({ success: true, message: 'If an account exists, OTP was sent to email' });
    }

    console.log('✅ User found:', user.email);

    // Generate 6-digit OTP
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated OTP:', otp);
    
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtpHash = otpHash;
    user.resetOtpExpires = expiresAt;
    await user.save();
    
    console.log('💾 OTP saved to database, expires at:', expiresAt);

    // Respond immediately so the client never hits "email taking too long"
    res.json({ success: true, message: 'If an account exists, OTP was sent to email. Check your inbox (and spam).' });

    // Send OTP email in background – don't block the response
    const recipientEmail = user.email;
    console.log('📧 Sending OTP email in background to:', recipientEmail);
    sendOtpEmail({ to: recipientEmail, otp })
      .then(() => console.log('✅ OTP email sent successfully to:', recipientEmail))
      .catch((err) => console.error('❌ Background OTP email failed for', recipientEmail, err.message));
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
};
router.post('/forgot-password', forgotPasswordHandler);
router.post('/forgot-password/', forgotPasswordHandler);  // allow trailing slash

// @route   POST /api/auth/reset-password
// @desc    Reset password using email + OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetOtpHash);
    if (!isOtpValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.password = newPassword;
    user.resetOtpHash = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/google-login
// @desc    Login with Google OAuth
// @access  Public
router.post('/google-login', async (req, res) => {
  try {
    const { googleId, email, name, picture, verified } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ message: 'Google ID and email are required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        message: 'Account not found. Please sign up first.',
        requiresSignup: true 
      });
    }

    // Update Google ID if not set
    if (!user.googleId) {
      user.googleId = googleId;
      user.verified = verified || false;
      if (picture) user.profilePicture = picture;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'worknex_secret_key_2024',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skillLevel: user.skillLevel,
        quizPassed: user.quizPassed,
        quizScore: user.quizScore,
        profilePicture: user.profilePicture || picture,
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

// @route   POST /api/auth/google-signup
// @desc    Sign up with Google OAuth
// @access  Public
router.post('/google-signup', async (req, res) => {
  try {
    const { googleId, email, name, picture, verified, role } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({ message: 'Google ID, email, and name are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google ID and log them in
      if (!user.googleId) {
        user.googleId = googleId;
        user.verified = verified || false;
        if (picture) user.profilePicture = picture;
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'worknex_secret_key_2024',
        { expiresIn: '30d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skillLevel: user.skillLevel,
          quizPassed: user.quizPassed,
          quizScore: user.quizScore,
          profilePicture: user.profilePicture || picture,
        },
        message: 'Logged in successfully'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      googleId,
      password: Math.random().toString(36).slice(-12), // Random password (won't be used)
      role: role || 'worker',
      phone: '', // Will be updated by user later
      location: '', // Will be updated by user later
      verified: verified || false,
      profilePicture: picture,
      skillLevel: 'new',
      quizPassed: null,
      quizScore: null,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'worknex_secret_key_2024',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skillLevel: user.skillLevel,
        quizPassed: user.quizPassed,
        quizScore: user.quizScore,
        profilePicture: user.profilePicture,
      },
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Google signup error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: 'Server error during Google signup' });
  }
});

module.exports = router;
