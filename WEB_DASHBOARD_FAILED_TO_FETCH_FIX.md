# Web Dashboard "Failed to Fetch" Error - Complete Fix

## 🐛 Problem
**User Report:** "Error: Failed to fetch" in web dashboard when trying to fetch jobs/applications

**Error Message:**
```
❌ Error
Error: Failed to fetch

💡 Troubleshooting Steps:
Check if you're logged in (token exists above)
Click "Test Auth Endpoint" to verify authentication
Click "Test Job Creation" to test job posting
If auth fails: Logout and login again
Make sure user role is 'owner' or 'admin'
```

## 🔍 Diagnostic Steps

### Step 1: Check Backend Server Status

**CRITICAL:** Backend MUST be running!

```bash
# Open terminal
cd "c:\React native\myapp\backend"

# Start backend
npm run dev
```

**Expected output:**
```
🚀 WorkNex Server running on port 5000
📡 Environment: development
🌐 API URL: http://localhost:5000
📱 Mobile devices can connect at: http://192.168.31.14:5000
💡 Make sure your device is on the same WiFi network
⚡ Socket.io enabled for real-time updates
✅ MongoDB connected successfully
```

**If you DON'T see this:**
- ❌ Backend is NOT running
- ❌ Web dashboard CANNOT connect
- ❌ "Failed to fetch" error will occur

### Step 2: Check Web Dashboard Port

Web dashboard runs on **port 3000** by default.

```bash
# In web-dashboard folder
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view web-dashboard in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.31.14:3000
```

**Browser will open:** `http://localhost:3000`

### Step 3: Check Browser Console

**CRITICAL:** Open browser console (Press F12) to see detailed error logs!

**With enhanced logging (after fix), you'll see:**

#### When Page Loads:
```javascript
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5000
  - Current Origin: http://localhost:3000
```

#### When Making API Call:
```javascript
🌐 API Request: GET /api/jobs/owner/my-jobs
   Full URL: http://localhost:5000/api/jobs/owner/my-jobs
🔑 Using auth token: eyJhbGciOiJIUzI1NiIs...
📡 Response status: 200 OK
✅ API Success: [...]
```

#### If "Failed to Fetch" Error:
```javascript
❌ Fetch Error for GET /api/jobs/owner/my-jobs: TypeError: Failed to fetch
   Error type: TypeError
   Error message: Failed to fetch
🚨 NETWORK ERROR - Possible causes:
   1. Backend server not running
   2. Wrong backend URL: http://localhost:5000
   3. CORS not configured for: http://localhost:3000
   4. Firewall blocking connection
```

## ✅ Solution Applied

### 1. Enhanced Web Dashboard API Logging

**File:** `web-dashboard/src/services/api.js`

**Added:**
- Configuration logging on page load
- Detailed request/response logging
- Better error messages with troubleshooting hints
- Network error detection and diagnosis

**Before (No logging):**
```javascript
async function request(path, { method = 'GET', body, auth = false } = {}) {
  // ... silent fetch ...
  throw new Error(message); // Generic error
}
```

**After (Comprehensive logging):**
```javascript
async function request(path, { method = 'GET', body, auth = false } = {}) {
  console.log(`🌐 API Request: ${method} ${path}`);
  console.log(`   Full URL: ${API_BASE_URL}${path}`);
  
  try {
    const res = await fetch(/*...*/);
    console.log(`📡 Response status: ${res.status}`);
    console.log(`✅ API Success:`, data);
  } catch (error) {
    console.error(`❌ Fetch Error:`, error);
    console.error('🚨 NETWORK ERROR - Possible causes:');
    console.error('   1. Backend server not running');
    // ... more diagnostics ...
  }
}
```

### 2. Verified CORS Configuration

**File:** `backend/server.js`

**Current CORS settings:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',      // ✅ Web dashboard
    'http://127.0.0.1:3000',      // ✅ Web dashboard (alternative)
    'http://192.168.31.14:3000',  // ✅ Web dashboard (network)
    'http://localhost:19006'       // ✅ Mobile app (Expo)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Status:** ✅ CORS already configured correctly for web dashboard!

### 3. Verified Port Configuration

**Backend:** Port 5000 ✅
**Web Dashboard:** Port 3000 ✅
**Web Dashboard API URL:** `http://localhost:5000` ✅

**Status:** ✅ Ports configured correctly!

## 🧪 Testing Steps

### Test 1: Start Backend

```bash
cd backend
npm run dev
```

**Watch for:**
```
✅ MongoDB connected successfully
🚀 WorkNex Server running on port 5000
```

### Test 2: Start Web Dashboard

```bash
cd web-dashboard
npm start
```

**Browser opens:** `http://localhost:3000`

### Test 3: Check Browser Console (F12)

**On page load, should see:**
```
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5000
  - Current Origin: http://localhost:3000
```

### Test 4: Login to Dashboard

1. Login with owner credentials
2. **Watch console for:**

```javascript
🌐 API Request: POST /api/auth/login
   Full URL: http://localhost:5000/api/auth/login
📦 Request body: { email: "...", password: "..." }
📡 Response status: 200 OK
✅ API Success: { token: "...", user: {...} }
```

### Test 5: Navigate to Jobs/Applications

1. Click on "Jobs" or "Applications"
2. **Watch console for:**

```javascript
🌐 API Request: GET /api/jobs/owner/my-jobs
   Full URL: http://localhost:5000/api/jobs/owner/my-jobs
🔑 Using auth token: eyJhbGciOiJIUzI1NiIs...
📡 Response status: 200 OK
✅ API Success: [array of jobs]
```

### Test 6: Check Backend Terminal

**Backend should log:**
```
📥 GET /api/jobs/owner/my-jobs - 2026-02-02T...
GET /jobs/owner/my-jobs called
👤 User ID: 65abc...
✅ Returning X jobs
```

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to fetch" - Backend Not Running

**Symptoms in browser console:**
```javascript
❌ Fetch Error for GET /api/...: TypeError: Failed to fetch
🚨 NETWORK ERROR - Possible causes:
   1. Backend server not running  ← THIS!
```

**Solution:**
```bash
cd backend
npm run dev
```

### Issue 2: "Failed to fetch" - Wrong Port

**Symptoms in browser console:**
```javascript
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5001  ← WRONG PORT!
```

**Solution:**
Check `web-dashboard/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000'; // ✅ Must be 5000
```

### Issue 3: CORS Error

**Symptoms in browser console:**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Solution:**
Check `backend/server.js` CORS config includes your origin:
```javascript
app.use(cors({
  origin: ['http://localhost:3000'], // Must include your web dashboard URL
  credentials: true
}));
```

### Issue 4: MongoDB Not Connected

**Symptoms in backend terminal:**
```
❌ MongoDB connection error
```

**Solution:**
Check `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/myapp
```

Test MongoDB:
```bash
mongosh
```

### Issue 5: Authentication Token Missing

**Symptoms in browser console:**
```javascript
⚠️ Auth requested but no token found
❌ API Error: Unauthorized
```

**Solution:**
1. Logout from web dashboard
2. Clear browser storage (F12 → Application → Local Storage → Clear All)
3. Login again

### Issue 6: Firewall Blocking

**Symptoms:**
- Backend running ✓
- Ports correct ✓
- CORS configured ✓
- Still "Failed to fetch" ❌

**Solution:**
```bash
# Windows Firewall - Allow Node.js
# Go to: Windows Security → Firewall & network protection
# → Allow an app through firewall → Change settings
# → Find "Node.js" and check both Private and Public
```

## 📊 Expected Flow

### Successful Request Flow:

```
1. Web Dashboard (http://localhost:3000)
   │
   ↓ Request: GET /api/jobs/owner/my-jobs
   │ Headers: Authorization: Bearer <token>
   │
2. Backend Server (http://localhost:5000)
   │ CORS check: Is origin http://localhost:3000 allowed? ✓
   │ Auth check: Is token valid? ✓
   │
   ↓ Query MongoDB
   │
3. MongoDB Database
   │ Find jobs for user
   │
   ↓ Return data
   │
4. Backend Server
   │ Send response with jobs data
   │
   ↓ Response: 200 OK + JSON data
   │
5. Web Dashboard
   │ Display jobs in UI ✓
```

### Failed Request Flow (Backend Not Running):

```
1. Web Dashboard (http://localhost:3000)
   │
   ↓ Request: GET /api/jobs/owner/my-jobs
   │
2. Network: Try to connect to http://localhost:5000
   │
   ❌ Connection refused (nothing listening on port 5000)
   │
   ↓ TypeError: Failed to fetch
   │
3. Web Dashboard
   │ Show error message ❌
```

## 🎯 Quick Checklist

Run through this in order:

- [ ] **Backend terminal:** `cd backend` → `npm run dev`
- [ ] **See:** "🚀 WorkNex Server running on port 5000"
- [ ] **See:** "✅ MongoDB connected successfully"
- [ ] **Web dashboard terminal:** `cd web-dashboard` → `npm start`
- [ ] **Browser opens:** `http://localhost:3000`
- [ ] **Press F12** to open browser console
- [ ] **See:** "🌐 Web Dashboard API Configuration"
- [ ] **See:** "API Base URL: http://localhost:5000"
- [ ] **Login** as employer/owner
- [ ] **Console shows:** "✅ API Success"
- [ ] **Navigate to** Jobs or Applications page
- [ ] **Console shows:** API requests and responses
- [ ] **Backend terminal shows:** Incoming requests
- [ ] **Data displays** in UI ✓

## 📝 Files Modified

### 1. Web Dashboard API Service
**File:** `web-dashboard/src/services/api.js`

**Changes:**
1. Added API configuration logging on load
2. Added detailed request logging (method, path, full URL)
3. Added auth token logging
4. Added response status logging
5. Added success/error logging
6. Added network error detection with helpful diagnostics

**Impact:** Can now see EXACTLY what's happening in browser console!

## 🎓 Understanding the Logs

### Good Logs (Everything Working):

```javascript
// On page load
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5000  ← Correct!
  - Current Origin: http://localhost:3000 ← Correct!

// On login
🌐 API Request: POST /api/auth/login
   Full URL: http://localhost:5000/api/auth/login
📦 Request body: { email: "...", password: "..." }
📡 Response status: 200 OK  ← Success!
✅ API Success: { token: "...", user: {...} }

// On fetching data
🌐 API Request: GET /api/jobs/owner/my-jobs
   Full URL: http://localhost:5000/api/jobs/owner/my-jobs
🔑 Using auth token: eyJhbGciOiJIUzI1NiIs...  ← Has token!
📡 Response status: 200 OK  ← Success!
✅ API Success: [array of jobs]  ← Got data!
```

### Bad Logs (Backend Not Running):

```javascript
// On page load
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5000  ← URL is correct
  - Current Origin: http://localhost:3000 ← Origin is correct

// On fetching data
🌐 API Request: GET /api/jobs/owner/my-jobs
   Full URL: http://localhost:5000/api/jobs/owner/my-jobs
🔑 Using auth token: eyJhbGciOiJIUzI1NiIs...
❌ Fetch Error for GET /api/jobs/owner/my-jobs: TypeError: Failed to fetch  ← ERROR!
   Error type: TypeError
   Error message: Failed to fetch
🚨 NETWORK ERROR - Possible causes:
   1. Backend server not running  ← MOST LIKELY!
   2. Wrong backend URL: http://localhost:5000
   3. CORS not configured for: http://localhost:3000
   4. Firewall blocking connection
```

## 🚀 What to Do Now

### Step 1: Restart Web Dashboard (IMPORTANT!)

```bash
# Stop web dashboard (Ctrl+C)
cd web-dashboard
npm start
```

**Why:** Changes to `api.js` need a restart to take effect!

### Step 2: Make Sure Backend is Running

```bash
cd backend
npm run dev
```

### Step 3: Test in Browser

1. Open web dashboard: `http://localhost:3000`
2. Press F12 (open console)
3. Login
4. Navigate to Jobs/Applications
5. **Watch the console logs!**

### Step 4: Send Me the Logs

If still not working, send:

1. **Browser console output** (F12 → Console tab → Copy all)
2. **Backend terminal output** (Copy from npm run dev)
3. **Screenshots** of error messages

## 🎉 Expected Result

**After restart, browser console should show:**

```javascript
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5000
  - Current Origin: http://localhost:3000

(When you navigate to Jobs/Applications:)

🌐 API Request: GET /api/jobs/owner/my-jobs
   Full URL: http://localhost:5000/api/jobs/owner/my-jobs
🔑 Using auth token: eyJhbGciOiJIUzI1NiIs...
📡 Response status: 200 OK
✅ API Success: [...]

🌐 API Request: GET /api/applications/owner/all
   Full URL: http://localhost:5000/api/applications/owner/all
🔑 Using auth token: eyJhbGciOiJIUzI1NiIs...
📡 Response status: 200 OK
✅ API Success: [...]
```

**And data should display in the UI! ✅**

---

**Status:** ✅ Enhanced logging added
**Date:** 2026-02-02
**Issue:** "Failed to fetch" error with no details
**Solution:** Added comprehensive logging to diagnose the exact issue
**Next:** Restart web dashboard and check console logs

## 📌 Summary

**Enhanced web dashboard API logging to show:**
- ✅ What URL is being used
- ✅ What requests are being made
- ✅ What responses are received
- ✅ Detailed error diagnostics
- ✅ Network error detection

**Now you can see EXACTLY what's failing!**

**Restart web dashboard and check browser console (F12) - logs will show the problem! 🔍**
