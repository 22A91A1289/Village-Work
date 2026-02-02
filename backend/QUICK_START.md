# 🚀 Quick Start Guide

## What Has Been Created

✅ Complete backend infrastructure with:
- Express.js server
- MongoDB database models (User, Job, Application, Quiz, Chat)
- RESTful API endpoints
- JWT authentication
- All CRUD operations

## Next Steps (Do These Now)

### 1. Install Dependencies (2 minutes)

```bash
cd backend
npm install
```

### 2. Set Up MongoDB (5-10 minutes)

**Option A: MongoDB Atlas (Recommended - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string
5. See `ENV_SETUP.md` for detailed instructions

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/worknex`

### 3. Create .env File (1 minute)

Create `backend/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_key_here
```

**Generate JWT Secret:**
- Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
- Mac/Linux: `openssl rand -base64 32`

### 4. Start the Server (30 seconds)

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 WorkNex Server running on port 5000
📡 Environment: development
🌐 API URL: http://localhost:5000
```

### 5. Test the API (2 minutes)

**Test Health Endpoint:**
```bash
# Open browser or use curl
http://localhost:5000/api/health
```

**Test Registration (using Postman or curl):**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+91 9876543210",
  "password": "password123",
  "role": "worker",
  "location": "Rajam, Andhra Pradesh"
}
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication
├── models/
│   ├── User.js              # User schema
│   ├── Job.js               # Job schema
│   ├── Application.js       # Application schema
│   ├── Quiz.js              # Quiz schema
│   └── Chat.js              # Chat schema
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── jobs.js              # Job endpoints
│   ├── users.js             # User endpoints
│   ├── applications.js      # Application endpoints
│   ├── quiz.js              # Quiz endpoints
│   └── chat.js              # Chat endpoints
├── .env                     # Environment variables (create this)
├── package.json
├── server.js                # Main server file
└── README.md                # Full documentation
```

## 🔗 API Endpoints Summary

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `GET /api/users/:id` - Get user profile

### Protected Endpoints (Require Auth Token)
- `GET /api/auth/me` - Get current user
- `POST /api/jobs` - Create job (Owner/Admin)
- `GET /api/jobs/owner/my-jobs` - Get my jobs
- `POST /api/applications` - Apply for job (Worker)
- `GET /api/applications/my-applications` - My applications
- `POST /api/quiz/submit` - Submit quiz
- `GET /api/chat/conversations` - Get conversations

See `README.md` for complete API documentation.

## 🐛 Common Issues

### "Cannot find module"
- Run `npm install` in the backend directory

### "MongoDB connection error"
- Check MongoDB is running (local) or cluster is active (Atlas)
- Verify connection string in `.env`
- Check network/firewall settings

### "Port 5000 already in use"
- Change PORT in `.env` file
- Or kill process using port 5000

### "JWT_SECRET not defined"
- Make sure `.env` file exists
- Check JWT_SECRET is set in `.env`

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with all variables
- [ ] MongoDB connection string configured
- [ ] JWT_SECRET set (random string)
- [ ] Server starts without errors
- [ ] Health endpoint returns OK
- [ ] Can register a new user
- [ ] Can login and get token

## 🎯 What's Next?

After backend is running:

1. **Connect React Native App**
   - Create API service layer in frontend
   - Replace mock data with API calls
   - Add authentication token handling

2. **Test All Features**
   - User registration/login
   - Job creation/listing
   - Job applications
   - Quiz submission
   - Chat functionality

3. **Add Advanced Features**
   - File upload for videos (cloud storage)
   - Real-time chat with Socket.io
   - Push notifications
   - Payment integration

## 📚 Documentation

- `README.md` - Complete API documentation
- `ENV_SETUP.md` - Detailed environment setup guide
- `QUICK_START.md` - This file

## 🆘 Need Help?

1. Check `README.md` for detailed documentation
2. Check `ENV_SETUP.md` for environment setup
3. Verify all files are created correctly
4. Check server logs for error messages

---

**Ready to start? Run `npm install` and follow the steps above!** 🚀
