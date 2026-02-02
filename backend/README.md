# WorkNex Backend API

Backend server for WorkNex - A platform connecting students with local employers for part-time work opportunities.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/worknex
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**For MongoDB Atlas (Cloud - Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Replace `MONGODB_URI` with your Atlas connection string

**For Local MongoDB:**
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/worknex`

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Jobs
- `GET /api/jobs` - Get all active jobs (with filters: category, type, location, experienceLevel)
- `GET /api/jobs/:id` - Get single job by ID
- `POST /api/jobs` - Create a new job (Owner/Admin only)
- `PUT /api/jobs/:id` - Update a job (Owner/Admin only)
- `DELETE /api/jobs/:id` - Delete a job (Owner/Admin only)
- `GET /api/jobs/owner/my-jobs` - Get jobs posted by current user

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/video` - Update user video URL
- `GET /api/users/:id` - Get user by ID (public profile)

### Applications
- `POST /api/applications` - Apply for a job (Worker only)
- `GET /api/applications/my-applications` - Get current user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job (Owner/Admin only)
- `PUT /api/applications/:id/status` - Update application status (Owner/Admin only)

### Quiz
- `POST /api/quiz/submit` - Submit quiz results
- `GET /api/quiz/my-results` - Get current user's quiz results
- `GET /api/quiz/:id` - Get specific quiz result

### Chat
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/:chatId` - Get chat messages
- `POST /api/chat/create` - Create or get existing chat
- `POST /api/chat/:chatId/message` - Send a message

### Health Check
- `GET /api/health` - Check API status

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Models

### User
- Worker, Owner, or Admin roles
- Skills, experience, availability
- Quiz scores and video URLs

### Job
- Job postings with categories and types
- Location, salary, requirements
- Applicant tracking

### Application
- Job applications
- Status tracking (pending, accepted, rejected, completed)

### Quiz
- Quiz results and scores
- Category-specific assessments
- Pass/fail tracking

### Chat
- Conversations between users
- Messages with timestamps
- Job context

## 🛠️ Development

### Project Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── controllers/          # Business logic (optional)
├── middleware/
│   └── auth.js          # JWT authentication
├── models/
│   ├── User.js          # User model
│   ├── Job.js           # Job model
│   ├── Application.js   # Application model
│   ├── Quiz.js          # Quiz model
│   └── Chat.js          # Chat model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── jobs.js          # Job routes
│   ├── users.js         # User routes
│   ├── applications.js  # Application routes
│   ├── quiz.js          # Quiz routes
│   └── chat.js          # Chat routes
├── .env                 # Environment variables (create this)
├── .gitignore
├── package.json
├── README.md
└── server.js            # Main server file
```

## 📝 Example API Calls

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "password": "password123",
  "role": "worker",
  "location": "Rajam, Andhra Pradesh"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Job (with auth token)
```bash
POST http://localhost:5000/api/jobs
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Construction Helper Needed",
  "description": "Need helper for construction work",
  "category": "Construction",
  "type": "Daily Work",
  "location": "Rajam, Srikakulam",
  "salary": "₹450/day",
  "experienceLevel": "beginner",
  "trainingProvided": true
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- Verify network connectivity
- Check firewall settings

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000

### JWT Token Errors
- Make sure JWT_SECRET is set in `.env`
- Check if token is included in Authorization header
- Verify token hasn't expired

## 🔄 Next Steps

1. **Connect Frontend**: Update React Native app to use these API endpoints
2. **Add File Upload**: Implement video upload to cloud storage (AWS S3 or Firebase)
3. **Real-time Chat**: Add Socket.io for real-time messaging
4. **Add Validation**: Use express-validator for request validation
5. **Add Testing**: Write unit and integration tests
6. **Deploy**: Deploy to Heroku, AWS, or similar platform

## 📚 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **socket.io** - Real-time communication (for future chat)

## 📄 License

ISC
