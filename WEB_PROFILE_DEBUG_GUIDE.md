# 🔧 Web Dashboard Profile Loading Issues - Debug Guide

## 🐛 Problem Reported

**User Issue:** "employeer profile chudu set chey sariagga failed to load inka save avatle"

**Translation:** 
- Profile data failed to load
- Cannot save profile
- Edit Profile button not showing form properly

---

## ✅ Fixes Applied

### 1. **Enhanced Error Handling**

**File:** `web-dashboard/src/pages/Profile.js`

#### Added Features:

1. ✅ **Auth Check Before API Calls**
   - Checks if user is logged in
   - Redirects to login if session expired

2. ✅ **Detailed Error Messages**
   - Network errors: "Backend server not running"
   - Auth errors: "Session expired"
   - 404 errors: "Profile not found"

3. ✅ **Error State UI**
   - Shows specific error icon and message
   - "Try Again" button to retry loading
   - Instructions for starting backend

4. ✅ **Refresh Button**
   - Added "Refresh" button in profile header
   - Manually reload data from backend

5. ✅ **Better Loading State**
   - Shows helpful tips while loading
   - Backend start instructions if slow

6. ✅ **Save Validation**
   - Checks required fields before saving
   - Better error messages for save failures

---

## 🔍 Common Issues & Solutions

### Issue 1: Backend Not Running ⚠️

**Error:** "Failed to fetch" or "Backend server is not running"

**Solution:**

```powershell
# Open PowerShell/Terminal
cd "c:\React native\myapp\backend"
npm start
```

**Expected Output:**
```
🚀 WorkNex Server running on port 5001
MongoDB connected successfully
```

**Check if Backend Running:**
```powershell
# Open browser
http://localhost:5001/health
# Should show: {"status":"ok"}
```

---

### Issue 2: Session Expired / Not Logged In 🔒

**Error:** "Session expired" or "Unauthorized"

**Solution:**

1. **Logout and Login Again:**
   - Click logout in dashboard
   - Login with employer credentials
   - Try profile page again

2. **Check Browser Console:**
   ```
   Press F12 → Console tab
   Look for: "🔑 Auth token: Present" or "Missing"
   ```

3. **Clear Browser Storage:**
   ```
   F12 → Application → Local Storage → Clear All
   Login again
   ```

---

### Issue 3: CORS Error 🌐

**Error:** "CORS policy" or "Access-Control-Allow-Origin"

**Check Backend CORS Settings:**

**File:** `backend/server.js`

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',     // Web dashboard
    'http://localhost:19006',    // Expo web
    'exp://localhost:19000',     // Expo mobile
    'http://localhost:19000'     // Expo DevTools
  ],
  credentials: true
}));
```

**Fix:** Make sure `http://localhost:3000` is in the origins list.

---

### Issue 4: Profile Data Not Found 📭

**Error:** "Profile not found" or "User not found"

**Check Database:**

1. **Open MongoDB:**
   ```
   MongoDB Compass or Atlas Dashboard
   Database: worknex
   Collection: users
   ```

2. **Find Your User:**
   ```json
   // Search by email
   { "email": "your-email@example.com" }
   ```

3. **Check User Role:**
   ```json
   {
     "role": "owner",  // Must be "owner" for employer
     "email": "...",
     "name": "..."
   }
   ```

---

### Issue 5: Can't Save Profile Changes ❌

**Error:** "Failed to save profile"

**Check Console Logs:**

```
F12 → Console → Look for:
💾 Saving profile updates: {...}
✅ Profile updated on backend
OR
❌ Error saving profile
```

**Common Causes:**

1. **Missing Required Fields:**
   - Name (required)
   - Phone (required)
   - Location (required)

2. **Invalid Data Format:**
   - Phone should be string
   - All fields should be strings

3. **Backend Validation Error:**
   ```
   Check backend console for:
   ❌ Update profile error: ...
   ```

---

## 🧪 Testing Steps

### Step 1: Check Backend Status

```powershell
# Terminal 1: Start Backend
cd "c:\React native\myapp\backend"
npm start

# Wait for:
🚀 WorkNex Server running on port 5001
```

### Step 2: Check Web Dashboard

```powershell
# Terminal 2: Start Web Dashboard
cd "c:\React native\myapp\web-dashboard"
npm start

# Opens: http://localhost:3000
```

### Step 3: Login to Dashboard

1. Open: http://localhost:3000/login
2. Login with employer credentials:
   ```
   Email: employer@example.com
   Password: yourpassword
   ```

### Step 4: Test Profile Page

1. Navigate to: http://localhost:3000/profile
2. Check browser console (F12)
3. Look for logs:
   ```
   🔍 Fetching employer profile data...
   🔑 Auth token: Present
   ✅ User data: {...}
   ✅ Jobs data: [...]
   ✅ Applications data: [...]
   ✅ Profile stats calculated
   ```

### Step 5: Test Edit & Save

1. Click "Edit Profile" button
2. Modify fields (name, phone, location, etc.)
3. Click "Save Changes"
4. Check console:
   ```
   💾 Saving profile updates: {...}
   ✅ Profile updated on backend
   ✅ Success! Your profile has been updated successfully!
   ```

---

## 📊 Browser Console Debugging

### Open Developer Tools

```
Press F12 (Windows/Linux)
Press Cmd+Option+I (Mac)
```

### Check for Errors

**Console Tab:**
```
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5001
  - Current Origin: http://localhost:3000

🌐 API Request: GET /api/users/profile
   Full URL: http://localhost:5001/api/users/profile
🔑 Using auth token: eyJhbGciOiJIUzI1NI...

📡 Response status: 200 OK
✅ API Success: { name: "...", email: "...", ... }
```

**Network Tab:**
```
1. Click "Network" tab
2. Refresh profile page
3. Look for requests to:
   - /api/users/profile
   - /api/jobs/owner/my-jobs
   - /api/applications/owner/all

4. Click each request
5. Check Status: should be 200 OK
6. Check Response: should have data
```

---

## 🔧 Quick Fixes

### Fix 1: Clear Browser Cache

```
F12 → Application → Storage → Clear site data
OR
Ctrl+Shift+Delete → Clear browsing data
```

### Fix 2: Restart Everything

```powershell
# Stop all (Ctrl+C)

# Backend
cd "c:\React native\myapp\backend"
npm start

# Web Dashboard (new terminal)
cd "c:\React native\myapp\web-dashboard"
npm start
```

### Fix 3: Check Environment Variables

**File:** `web-dashboard/.env` (create if not exists)

```env
REACT_APP_API_BASE_URL=http://localhost:5001
```

**Restart after creating .env file!**

### Fix 4: Verify Backend Route

**Test with Postman or curl:**

```bash
# Get Profile (replace TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5001/api/users/profile
```

---

## 🎯 New Features Added

### 1. Refresh Button

**Location:** Profile page header (top right)

**Usage:**
- Click "Refresh" to reload data from backend
- Useful if data becomes stale
- Doesn't require page reload

### 2. Enhanced Error Display

**Shows:**
- Specific error type (network, auth, etc.)
- Helpful instructions
- Backend start commands
- "Try Again" button

### 3. Better Loading State

**Shows:**
- Loading spinner
- Helpful tips
- Backend start instructions
- Warning if taking too long

### 4. Field Validation

**Save button:**
- Validates required fields
- Shows clear error messages
- Prevents empty submissions

---

## 📱 Backend Requirements

### Must Be Running:

```
✅ Backend server: http://localhost:5001
✅ MongoDB: Connected
✅ Auth middleware: Working
✅ CORS: Configured for localhost:3000
```

### Check Backend Health:

```bash
# Browser or curl
http://localhost:5001/health

# Expected:
{"status":"ok"}
```

---

## 🐛 Still Having Issues?

### Collect Debug Information:

1. **Browser Console Logs:**
   - F12 → Console → Screenshot all logs
   - Look for ❌ errors

2. **Backend Console Logs:**
   - Terminal where backend is running
   - Look for errors or warnings

3. **Network Tab:**
   - F12 → Network → Screenshot failed requests
   - Check Status code (200, 401, 404, 500)

4. **Local Storage:**
   - F12 → Application → Local Storage
   - Check if `authToken` exists

### Share This Info:

```
1. Backend running? Yes/No
2. Login successful? Yes/No
3. Browser console errors? (screenshot)
4. Backend console errors? (copy/paste)
5. Network tab status codes? (list)
```

---

## ✅ Checklist

Before reporting "not working":

- [ ] Backend server running (port 5001)
- [ ] Web dashboard running (port 3000)
- [ ] Logged in successfully
- [ ] Browser console checked (F12)
- [ ] Auth token present in localStorage
- [ ] Backend console checked for errors
- [ ] Network tab shows 200 OK responses
- [ ] MongoDB connected
- [ ] CORS configured correctly
- [ ] Tried "Refresh" button
- [ ] Tried logout/login
- [ ] Tried clearing browser cache
- [ ] Tried restart (backend + dashboard)

---

## 🎯 Expected Behavior

### Profile Page Should Show:

1. **Header:**
   - Name, business name
   - Location, rating
   - Profile picture (or initials)

2. **Stats Cards:**
   - Active Jobs: Number
   - Total Hires: Number
   - Rating: X.X out of 5.0
   - Applications: Number

3. **Edit Form:**
   - Full Name (editable)
   - Business Name (editable)
   - Email (view only - disabled)
   - Mobile Number (editable)
   - Location (editable)
   - About Your Business (editable)

4. **Buttons:**
   - "Edit Profile" → switches to edit mode
   - "Refresh" → reloads data
   - "Save Changes" → saves to backend (in edit mode)
   - "Cancel" → discards changes (in edit mode)

---

**Status:** ✅ Enhanced error handling & debugging tools added  
**Testing:** Check backend status first, then test profile page  
**Support:** Use browser console (F12) for detailed error info

**Backend start chesi, login chesi, profile page test cheyandi! 🚀**
