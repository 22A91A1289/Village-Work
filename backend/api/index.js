const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Note: Socket.io is not available in Vercel serverless functions
// Routes that use io will work but won't emit socket events
app.set('io', null);

// Connect to MongoDB
connectDB();

// Middleware - allow all Vercel origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://village-work.vercel.app',
  /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/jobs', require('../routes/jobs'));
app.use('/api/users', require('../routes/users'));
app.use('/api/applications', require('../routes/applications'));
app.use('/api/quiz', require('../routes/quiz'));
app.use('/api/chat', require('../routes/chat'));
app.use('/api/notifications', require('../routes/notifications'));
app.use('/api/payments', require('../routes/payments'));
app.use('/api/bank-accounts', require('../routes/bankAccounts'));
app.use('/api/payment-actions', require('../routes/paymentActions'));
app.use('/api/ratings', require('../routes/ratings'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WorkNex API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to WorkNex API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      jobs: '/api/jobs',
      users: '/api/users',
      applications: '/api/applications',
      quiz: '/api/quiz',
      chat: '/api/chat',
      notifications: '/api/notifications',
      payments: '/api/payments',
      bankAccounts: '/api/bank-accounts'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`⚠️ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found', path: req.originalUrl || req.path, method: req.method });
});

// Export for Vercel serverless
module.exports = app;

