const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const fs = require('fs');

// Robustly load .env
// 1. Try project root (if running from backend/)
let envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  // 2. Try current directory (if running from root)
  envPath = path.join(__dirname, '.env');
}

dotenv.config({ path: envPath });

console.log(`📡 Loaded environment from: ${envPath}`);

// Verify critical env vars
if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL ERROR: MONGODB_URI is not defined.');
  console.error(`   Checked path: ${envPath}`);
  console.error('   Please check that .env exists and contains MONGODB_URI');
  process.exit(1);
}

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Helper to check if origin is allowed (localhost, local network, Vercel)
const isAllowedOrigin = (origin) => {
  // Allow all origins in development mode for debugging
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  if (!origin) return true; // Allow non-browser requests (e.g. Postman, mobile apps)
  
  // Allow localhost
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return true;
  
  // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.x.x.x)
  // This allows any device on the same WiFi to connect
  if (
    origin.startsWith('http://192.168.') || 
    origin.startsWith('http://10.') || 
    origin.startsWith('http://172.')
  ) return true;
  
  // Allow Vercel deployments
  if (/\.vercel\.app$/.test(origin)) return true;
  
  return false;
};

// Initialize Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      console.log('🔌 Socket connection attempt from:', origin);
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.log('🚫 Socket blocked origin:', origin);
        callback(null, false);
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: (origin, callback) => {
    console.log('🌐 CORS check for origin:', origin);
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Private-Network']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/bank-accounts', require('./routes/bankAccounts'));
app.use('/api/payment-actions', require('./routes/paymentActions'));
app.use('/api/ratings', require('./routes/ratings'));

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

// 404 handler (include path/method to debug wrong URLs)
app.use((req, res) => {
  console.log(`⚠️ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found', path: req.originalUrl || req.path, method: req.method });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join room based on user role
  socket.on('join', (data) => {
    const { userId, role } = data;
    socket.join(role); // Join role-based room (worker, owner, admin)
    socket.join(userId); // Join user-specific room
    console.log(`👤 User ${userId} (${role}) joined`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// Listen on all network interfaces (0.0.0.0) to accept connections from devices on local network
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WorkNex Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📱 Mobile devices can connect at: http://192.168.31.14:${PORT}`);
  console.log(`💡 Make sure your device is on the same WiFi network`);
  console.log(`⚡ Socket.io enabled for real-time updates`);
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Make sure no other server is running.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    console.log('Server closed');
    if (signal === 'SIGUSR2') {
      process.kill(process.pid, 'SIGUSR2');
    } else {
      process.exit(0);
    }
  });
};

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));
process.once('SIGUSR2', () => shutdown('SIGUSR2'));
