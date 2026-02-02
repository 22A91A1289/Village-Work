# Quick Start Guide - Complete System

## 🚀 Start Everything in Correct Order

### 1️⃣ Start Backend Server (FIRST!)

```bash
# Open terminal 1
cd "c:\React native\myapp\backend"
npm run dev
```

**Wait for:**
```
✅ MongoDB connected successfully
🚀 WorkNex Server running on port 5000
```

**If you see errors:**
- MongoDB not running? Start MongoDB service
- Port 5000 already in use? Kill existing process or use different port

### 2️⃣ Start Web Dashboard (SECOND!)

```bash
# Open terminal 2 (new terminal)
cd "c:\React native\myapp\web-dashboard"
npm start
```

**Browser will open:** `http://localhost:3000`

**Press F12** to open browser console and watch for:
```
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5000
  - Current Origin: http://localhost:3000
```

### 3️⃣ Start Mobile App (THIRD!)

```bash
# Open terminal 3 (new terminal)
cd "c:\React native\myapp"
npm start
```

**In console, watch for:**
```
🌐 API Base URL: http://192.168.31.14:5000
```

## ✅ Verify Everything is Working

### Test Backend:

Open browser: `http://localhost:5000`

Should see:
```json
{"message":"WorkNex API Server","status":"running"}
```

### Test Web Dashboard:

1. Go to: `http://localhost:3000`
2. Login as employer
3. Press F12 → Check console for:
```
✅ API Success: { token: "...", user: {...} }
```

### Test Mobile App:

1. Open app in Expo Go
2. Login as worker
3. Console should show:
```
✅ API Success
```

## 🐛 If Something Doesn't Work

### Backend Won't Start:

**Error:** "Port 5000 already in use"
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Error:** "MongoDB connection failed"
```bash
# Start MongoDB
net start MongoDB
# OR if installed via installer:
# Start "Services" → Find "MongoDB" → Start
```

### Web Dashboard Shows "Failed to Fetch":

1. **Check backend is running** (terminal 1)
2. **Open browser console** (F12)
3. **Look for logs:**
```
🚨 NETWORK ERROR - Possible causes:
   1. Backend server not running  ← Check this!
```

4. **If backend is running but still error:**
```bash
# Restart web dashboard
# In terminal 2: Ctrl+C, then:
npm start
```

### Mobile App Can't Connect:

1. **Check IP address in console:**
```
🌐 API Base URL: http://192.168.31.14:5000
```

2. **Verify your computer's IP:**
```bash
ipconfig
# Look for IPv4 Address
```

3. **If IP different, update:**
Edit `utils/api.js`:
```javascript
const LOCAL_IP = 'YOUR_ACTUAL_IP'; // Update this!
```

4. **Restart Expo:**
```bash
# Ctrl+C in terminal 3, then:
npm start
```

## 📋 Complete Startup Checklist

- [ ] Terminal 1: Backend running on port 5000
- [ ] Terminal 1 shows: "MongoDB connected successfully"
- [ ] Terminal 2: Web dashboard running on port 3000
- [ ] Browser console shows: API configuration with correct URL
- [ ] Terminal 3: Expo running
- [ ] Mobile console shows: API Base URL with correct IP
- [ ] Backend: Can login via web dashboard
- [ ] Backend: Can login via mobile app
- [ ] Web dashboard: Can create job
- [ ] Mobile app: Can see jobs
- [ ] Mobile app: Can apply for job
- [ ] Web dashboard: Can see application

## 🎯 Test Flow

### Complete Worker → Employer Flow:

1. **Mobile App (Worker):**
   - Login as worker
   - Find a job
   - Click "Apply"
   - ✅ See success message

2. **Browser Console:**
```
🌐 API Request: POST /api/applications
📡 Response status: 201
✅ API Success
```

3. **Backend Terminal:**
```
📥 POST /api/applications
✅ Application created successfully!
```

4. **Web Dashboard (Employer):**
   - Go to Applications page
   - ✅ See the new application

5. **Browser Console:**
```
🌐 API Request: GET /api/applications/owner/all
📡 Response status: 200
✅ API Success: [array with 1 application]
```

6. **Backend Terminal:**
```
📥 GET /api/applications/owner/all
✅ Returning 1 applications to web dashboard
```

## 📝 Summary

**Correct startup order:**
1. Backend (port 5000) → Wait for MongoDB connection
2. Web Dashboard (port 3000) → Check browser console
3. Mobile App → Check Expo console

**All three must be running!**

**Use browser console (F12) and terminals to verify each step!**

---

**Status:** ✅ Complete guide
**Date:** 2026-02-02
**Purpose:** Quick reference for starting entire system
