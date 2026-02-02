# API Endpoint Testing Guide

This guide helps you test all backend API endpoints to ensure data flows correctly from frontend to backend.

## Prerequisites

1. Backend server running on port 5001
2. MongoDB connected
3. React Native app running (or Postman/curl for manual testing)

## Testing Endpoints

### 1. Health Check (No Auth Required)

**Test if server is running:**
```bash
GET http://localhost:5001/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "WorkNex API is running",
  "timestamp": "2026-01-23T..."
}
```

---

### 2. Authentication Endpoints

#### 2.1 Register New User

**Endpoint:** `POST /api/auth/register`

**Test in React Native:**
- Go to SignUpScreen
- Fill in all fields
- Select role (Worker or Recruiter)
- Click "Create Account"

**Manual Test (Postman/curl):**
```bash
POST http://localhost:5001/api/auth/register
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

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "worker",
    "location": "Rajam, Andhra Pradesh"
  }
}
```

**Check MongoDB:**
- Verify user is created in `users` collection
- Password should be hashed (not plain text)

---

#### 2.2 Login User

**Endpoint:** `POST /api/auth/login`

**Test in React Native:**
- Go to LoginScreen
- Enter email and password
- Click "Sign In"

**Manual Test:**
```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "worker",
    "location": "Rajam, Andhra Pradesh",
    "skillLevel": "new",
    "quizPassed": false,
    "videoUploaded": false
  }
}
```

**Verify:**
- Token is returned
- User data matches registered user

---

#### 2.3 Get Current User (Auth Required)

**Endpoint:** `GET /api/auth/me`

**Test:**
```bash
GET http://localhost:5001/api/auth/me
Authorization: Bearer <your_token_here>
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "worker",
  ...
}
```

---

### 3. Jobs Endpoints

#### 3.1 Get All Jobs (Public)

**Endpoint:** `GET /api/jobs`

**Test in React Native:**
- Open HomeScreen
- Jobs should load automatically from backend
- Check console for API calls

**Manual Test:**
```bash
GET http://localhost:5001/api/jobs
```

**With Filters:**
```bash
GET http://localhost:5001/api/jobs?category=Construction&type=Daily Work&location=Rajam
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "title": "Construction Helper Needed",
    "description": "...",
    "category": "Construction",
    "type": "Daily Work",
    "location": "Rajam, Srikakulam",
    "salary": "₹450/day",
    "status": "active",
    "postedBy": {
      "name": "Owner Name",
      "email": "owner@example.com"
    },
    ...
  }
]
```

**Verify:**
- Jobs appear in HomeScreen
- Jobs match backend data
- Filters work correctly

---

#### 3.2 Create Job (Owner/Admin Only)

**Endpoint:** `POST /api/jobs`

**Test in React Native:**
- Login as Owner/Recruiter
- Go to job posting screen
- Create a new job

**Manual Test:**
```bash
POST http://localhost:5001/api/jobs
Authorization: Bearer <owner_token>
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

**Verify:**
- Job is created in MongoDB
- Job appears in GET /api/jobs response
- Job shows in Owner's "My Jobs" screen

---

#### 3.3 Get Single Job

**Endpoint:** `GET /api/jobs/:id`

**Test:**
```bash
GET http://localhost:5001/api/jobs/<job_id>
```

---

### 4. Quiz Endpoints

#### 4.1 Submit Quiz Results

**Endpoint:** `POST /api/quiz/submit`

**Test in React Native:**
- Go to QuizScreen
- Complete a quiz
- Submit the quiz
- Check console for API call

**Manual Test:**
```bash
POST http://localhost:5001/api/quiz/submit
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "category": "Electrician",
  "questions": [
    {
      "question": "What is the standard voltage?",
      "options": ["110V", "220V", "440V"],
      "correctAnswer": 1,
      "userAnswer": 1
    }
  ],
  "timeTaken": 300
}
```

**Expected Response:**
```json
{
  "quiz": {
    "_id": "...",
    "user": "...",
    "category": "Electrician",
    "score": 4,
    "totalQuestions": 5,
    "percentage": 80,
    "passed": true
  },
  "message": "Congratulations! You passed the quiz."
}
```

**Verify:**
- Quiz result saved in MongoDB
- User's `quizPassed` field updated to `true`
- User's `skillLevel` updated to `experienced`

---

#### 4.2 Get User's Quiz Results

**Endpoint:** `GET /api/quiz/my-results`

**Test:**
```bash
GET http://localhost:5001/api/quiz/my-results
Authorization: Bearer <user_token>
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "category": "Electrician",
    "score": 4,
    "totalQuestions": 5,
    "percentage": 80,
    "passed": true,
    "completedAt": "..."
  }
]
```

---

### 5. Applications Endpoints

#### 5.1 Apply for Job

**Endpoint:** `POST /api/applications`

**Test in React Native:**
- Login as Worker
- Go to JobDetailsScreen
- Click "Apply" button

**Manual Test:**
```bash
POST http://localhost:5001/api/applications
Authorization: Bearer <worker_token>
Content-Type: application/json

{
  "jobId": "<job_id>",
  "message": "I'm interested in this job"
}
```

**Verify:**
- Application created in MongoDB
- Job's `applicants` array updated
- Application appears in worker's "My Applications"

---

#### 5.2 Get My Applications

**Endpoint:** `GET /api/applications/my-applications`

**Test:**
```bash
GET http://localhost:5001/api/applications/my-applications
Authorization: Bearer <worker_token>
```

---

### 6. Users Endpoints

#### 6.1 Get User Profile

**Endpoint:** `GET /api/users/profile`

**Test:**
```bash
GET http://localhost:5001/api/users/profile
Authorization: Bearer <user_token>
```

---

#### 6.2 Update User Profile

**Endpoint:** `PUT /api/users/profile`

**Test:**
```bash
PUT http://localhost:5001/api/users/profile
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "skills": ["Construction", "Plumbing"],
  "experience": "2 years",
  "bio": "Experienced worker"
}
```

---

## Testing Checklist

### ✅ Authentication
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token is stored in AsyncStorage
- [ ] Can get current user with token
- [ ] Invalid credentials are rejected

### ✅ Jobs
- [ ] Can fetch all jobs (HomeScreen loads jobs)
- [ ] Jobs display correctly in UI
- [ ] Can filter jobs by category/type/location
- [ ] Owner can create new job
- [ ] Created jobs appear in list

### ✅ Quiz
- [ ] Can submit quiz results
- [ ] Quiz results saved to database
- [ ] User profile updated after quiz
- [ ] Can retrieve quiz history
- [ ] Pass/fail logic works (60% threshold)

### ✅ Applications
- [ ] Worker can apply for job
- [ ] Application saved to database
- [ ] Can view own applications
- [ ] Owner can see applications for their jobs

### ✅ Data Flow
- [ ] Data persists in MongoDB
- [ ] Frontend displays backend data
- [ ] Updates reflect immediately
- [ ] Error handling works

## Common Issues & Solutions

### Issue: "Network request failed"
**Solution:** 
- Check if backend server is running
- Verify API_BASE_URL in `utils/api.js`
- For Android emulator, use `10.0.2.2:5001`
- For physical device, set `EXPO_PUBLIC_API_BASE_URL` to your PC's IP

### Issue: "401 Unauthorized"
**Solution:**
- Check if token is being sent in Authorization header
- Verify token hasn't expired
- Re-login to get new token

### Issue: "No jobs showing"
**Solution:**
- Check if jobs exist in MongoDB
- Verify API endpoint returns data
- Check console for errors
- Ensure fallback to mock data works

### Issue: "Quiz not submitting"
**Solution:**
- Check if user is logged in (token required)
- Verify quiz data format matches backend
- Check console for API errors

## MongoDB Verification

### Check Collections:
```javascript
// In MongoDB Compass or mongo shell
use worknex

// Check users
db.users.find().pretty()

// Check jobs
db.jobs.find().pretty()

// Check applications
db.applications.find().pretty()

// Check quizzes
db.quizzes.find().pretty()
```

## Next Steps

1. **Test all endpoints** using the checklist above
2. **Verify data persistence** in MongoDB
3. **Test error scenarios** (invalid data, network errors)
4. **Test on physical device** if using emulator
5. **Add more test data** to MongoDB for better testing

---

**Need Help?** Check server logs for detailed error messages.
