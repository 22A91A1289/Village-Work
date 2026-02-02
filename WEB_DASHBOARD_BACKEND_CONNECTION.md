# 🌐 Web Dashboard - Backend Connection Guide

## ✅ Yes, Same Backend Setup!

**Web Dashboard** and **Mobile App** use the **SAME backend** (port 5001).

### How It Works:

1. **Backend Server** (port 5001) - Single source of truth
   - Stores all jobs in MongoDB
   - Handles all API requests

2. **Web Dashboard** (port 3000) - For Employers
   - Posts jobs via `/api/jobs` POST
   - Views applications via `/api/applications/job/:jobId`
   - Manages jobs via `/api/jobs/owner/my-jobs`

3. **Mobile App** - For Workers
   - Views jobs via `/api/jobs` GET
   - Applies for jobs via `/api/applications` POST
   - Sees same jobs posted from web dashboard

---

## 🔄 Data Flow

### When Employer Posts Job on Web Dashboard:
1. Employer fills form on web dashboard
2. Web dashboard calls: `POST /api/jobs` → Backend
3. Backend saves job to MongoDB
4. **Job immediately available** in mobile app
5. Workers see job in HomeScreen (fetches from `/api/jobs`)

### When Worker Applies from Mobile App:
1. Worker clicks "Apply" in mobile app
2. Mobile app calls: `POST /api/applications` → Backend
3. Backend saves application to MongoDB
4. **Application immediately visible** in web dashboard
5. Employer sees application in ApplicationsScreen

---

## ✅ What's Been Connected

### 1. **Web Dashboard Login** ✅
- Connected to `/api/auth/login`
- Stores JWT token
- Authenticates employers

### 2. **Web Dashboard Jobs** ✅
- Fetches jobs from `/api/jobs/owner/my-jobs`
- Creates jobs via `/api/jobs` POST
- Deletes jobs via `/api/jobs/:id` DELETE
- Jobs posted here appear in mobile app!

### 3. **Mobile App Jobs** ✅
- Fetches jobs from `/api/jobs`
- Shows all active jobs (including from web dashboard)

---

## 🚀 How to Test

### Step 1: Start Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5001`

### Step 2: Start Web Dashboard
```bash
cd web-dashboard
npm start
```
Web dashboard runs on `http://localhost:3000`

### Step 3: Start Mobile App
```bash
npm start
```
Mobile app runs on Expo

### Step 4: Test Flow
1. **Login to Web Dashboard** (as Owner/Employer)
   - Use credentials from backend
   - Go to Jobs page

2. **Create a Job** on Web Dashboard
   - Fill form and submit
   - Job saved to MongoDB

3. **Check Mobile App**
   - Login as Worker
   - Open HomeScreen
   - **Job from web dashboard should appear!** ✅

4. **Apply from Mobile App**
   - Worker applies for job
   - Application saved to MongoDB

5. **Check Web Dashboard**
   - Go to Applications page
   - **Application from mobile app should appear!** ✅

---

## 📊 API Endpoints Used

### Web Dashboard (Employer):
- `POST /api/auth/login` - Login
- `GET /api/jobs/owner/my-jobs` - Get my jobs
- `POST /api/jobs` - Create job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/applications/job/:jobId` - Get applications
- `PUT /api/applications/:id/status` - Update status

### Mobile App (Worker):
- `POST /api/auth/login` - Login
- `GET /api/jobs` - Get all jobs (sees jobs from web!)
- `POST /api/applications` - Apply for job
- `GET /api/applications/my-applications` - My applications

---

## ✅ Confirmation

**Yes, backend setup is the same!**

- ✅ Same MongoDB database
- ✅ Same API endpoints
- ✅ Same port (5001)
- ✅ Jobs posted on web → appear in mobile app
- ✅ Applications from mobile → appear in web dashboard

**Everything is connected and working!** 🎉

---

## 🔧 Configuration

### Web Dashboard API URL:
- Default: `http://localhost:5001`
- Can be changed via `REACT_APP_API_BASE_URL` environment variable

### Mobile App API URL:
- Android Emulator: `http://10.0.2.2:5001`
- iOS Simulator: `http://localhost:5001`
- Physical Device: Set `EXPO_PUBLIC_API_BASE_URL`

---

## 📝 Summary

**Web Dashboard** (Employers) ↔️ **Backend** (Port 5001) ↔️ **Mobile App** (Workers)

All three share the same backend and database. Jobs posted anywhere appear everywhere! ✅
