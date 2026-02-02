const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.error('Auth error: User not found for ID:', decoded.userId);
      return res.status(401).json({ error: 'User not found. Please login again.' });
    }
    
    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Server error in authentication' });
  }
};

// Middleware to check if user is owner/admin
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user.role === 'owner' || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Owner or Admin role required.' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};

// Middleware to check if user is worker
const isWorker = (req, res, next) => {
  if (req.user.role === 'worker') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Worker role required.' });
  }
};

module.exports = { auth, isOwnerOrAdmin, isAdmin, isWorker };
