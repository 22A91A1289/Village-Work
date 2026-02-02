# 🔍 Authentication Debug Guide - "User Not Found" Error

## 🐛 Problem

**Error:** "User not found" when trying to create jobs from web dashboard.

**Symptoms:**
- Login works fine
- Can access dashboard
- But job creation fails with "User not found"

---

## 🔍 Root Cause Analysis

### **Possible Causes:**

1. **Token/User ID Mismatch**
   - Token contains old/invalid user ID
   - User was deleted but token still exists
   - Token expired or corrupted

2. **Database Connection Issue**
   - MongoDB connection lost
   - User collection query failing

3. **Auth Flow Issue**
   - Token not being sent correctly
   - Middleware not finding user in database

---

## ✅ Fixes Applied

### **1. Enhanced Error Logging**

**File:** `backend/middleware/auth.js`

```javascript
// Before:
if (!user) {
  return res.status(401).json({ error: 'User not found' });
}

// After:
if (!user) {
  console.error('Auth error: User not found for ID:', decoded.userId);
  return res.status(401).json({ error: 'User not found. Please login again.' });
}
```

**Benefit:** Now logs the problematic user ID to console for debugging.

---

### **2. Added Auth Test Endpoint**

**File:** `backend/routes/auth.js`

```javascript
// New endpoint to test authentication
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Usage:** `GET /api/auth/me` - Returns current logged-in user info.

---

### **3. Created Debug Page**

**File:** `web-dashboard/src/pages/TestAuth.js`

**Features:**
- Shows current auth token status
- Shows stored user info
- Test authentication endpoint button
- Test job creation button
- Detailed error messages

**Access:** `http://localhost:3000/test-auth`

---

## 🧪 Debugging Steps

### **Step 1: Access Debug Page**

```
1. Open web dashboard
2. Go to: http://localhost:3000/test-auth
3. Check "Current Auth Status" section
```

**What to Look For:**
```javascript
{
  "hasToken": true,        // Should be true
  "token": "eyJhbGc...",   // Should show token
  "user": {
    "_id": "...",          // Should have user ID
    "role": "owner",       // Should be owner or admin
    "name": "...",
    "email": "..."
  }
}
```

---

### **Step 2: Test Authentication**

```
1. Click "Test Auth Endpoint" button
2. Check the result
```

**Expected Result:**
```javascript
✅ Success
Authentication working!
{
  "id": "user_id_here",
  "name": "Your Name",
  "email": "your@email.com",
  "role": "owner",
  "location": "Your Location"
}
```

**If Failed:**
```javascript
❌ Error
Error: User not found. Please login again.
```

**Solution:** Logout and login again.

---

### **Step 3: Test Job Creation**

```
1. Click "Test Job Creation" button
2. Check the result
```

**Expected Result:**
```javascript
✅ Success
Job created successfully!
{
  "_id": "job_id",
  "title": "Test Job",
  "category": "Electrician",
  ...
}
```

**If Failed:**
```javascript
❌ Error
Error: User not found / Access denied
```

---

## 🔧 Solutions

### **Solution 1: Logout and Login Again**

**Most Common Fix - Clears old/invalid tokens**

```bash
1. Go to web dashboard
2. Click profile icon → Logout
3. Login again with correct credentials
4. Try creating job again

✅ This should fix most auth issues
```

---

### **Solution 2: Clear Browser Storage**

**If logout doesn't work:**

```javascript
// Open browser console (F12)
// Run these commands:
localStorage.clear();
location.reload();

// Then login again
```

---

### **Solution 3: Check User Role**

**Verify user has correct role in database:**

```bash
# In MongoDB, check user:
db.users.findOne({ email: "your@email.com" })

# Verify role field:
{
  "_id": "...",
  "email": "your@email.com",
  "role": "owner"  // Should be "owner" or "admin"
}

# If role is "worker", update it:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "owner" } }
)
```

---

### **Solution 4: Recreate User Account**

**If user is missing from database:**

```bash
1. Go to signup page
2. Create new account with role="owner"
3. Login with new account
4. Try creating job

✅ Fresh account should work
```

---

## 📊 Auth Flow Diagram

### **Normal Flow (Working):**

```
User Login
   ↓
POST /api/auth/login
   ↓
Backend generates JWT token with userId
   ↓
Token + User object sent to frontend
   ↓
Frontend stores in localStorage
   ↓
User creates job
   ↓
POST /api/jobs with Authorization header
   ↓
Backend auth middleware:
  - Verifies token ✅
  - Finds user by decoded.userId ✅
  - User role is owner/admin ✅
   ↓
Job created successfully ✅
```

---

### **Broken Flow (User Not Found):**

```
User Login (old session)
   ↓
Old token in localStorage
   ↓
User tries to create job
   ↓
POST /api/jobs with old token
   ↓
Backend auth middleware:
  - Verifies token ✅
  - Tries to find user by decoded.userId ❌
  - User not found in database! ❌
   ↓
Error: "User not found" ❌
```

**Why?**
- User was deleted from database
- User ID in token doesn't match any user
- Token is from different environment (dev/prod)

---

## 🔍 Console Logs to Check

### **Backend Console:**

**Look for:**
```bash
Auth error: User not found for ID: 507f1f77bcf86cd799439011
```

**This tells you:**
- Which user ID is causing the problem
- Check if this ID exists in MongoDB

### **Browser Console:**

**Check for:**
```javascript
// Network tab → Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Console → localStorage
authToken: "eyJhbGc..."
authUser: {"_id":"...","role":"owner",...}
```

---

## 🧪 Quick Test Commands

### **Test in Browser Console:**

```javascript
// 1. Check token
console.log('Token:', localStorage.getItem('authToken'));

// 2. Check user
console.log('User:', JSON.parse(localStorage.getItem('authUser')));

// 3. Test auth endpoint
fetch('http://localhost:5001/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  }
})
.then(r => r.json())
.then(d => console.log('Auth test:', d));

// 4. Test job creation
fetch('http://localhost:5001/api/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  },
  body: JSON.stringify({
    title: 'Test Job',
    category: 'Electrician',
    type: 'Daily Work',
    location: 'Hyderabad',
    salary: '₹500/day',
    description: 'Test',
    experienceLevel: 'beginner',
    trainingProvided: false
  })
})
.then(r => r.json())
.then(d => console.log('Job creation:', d));
```

---

## ✅ Summary

### **Most Likely Solution:**

```
🎯 LOGOUT AND LOGIN AGAIN

This fixes 90% of "User not found" errors by:
✅ Generating fresh token
✅ Syncing with current database state
✅ Refreshing user info
✅ Clearing old/stale data
```

### **Quick Fix Steps:**

```bash
1. Click Logout in web dashboard
2. Login again with your email/password
3. Go to Jobs page
4. Try creating a job
5. Should work now! ✅
```

### **If Still Not Working:**

```bash
1. Go to /test-auth page
2. Run both test buttons
3. Check error messages
4. Copy error and provide for debugging
5. Or try creating new owner account
```

---

## 📁 Files Modified

```
✅ backend/middleware/auth.js
   - Added error logging for debugging

✅ backend/routes/auth.js
   - Added GET /api/auth/me endpoint

✅ web-dashboard/src/pages/TestAuth.js (NEW)
   - Complete auth testing page

✅ web-dashboard/src/App.js
   - Added /test-auth route

✅ AUTH_DEBUG_GUIDE.md (NEW)
   - This documentation file
```

---

## 🎯 Next Steps

1. **Access test page:** `http://localhost:3000/test-auth`
2. **Run both tests** to identify the issue
3. **Try logout/login** first (quickest fix)
4. **Check error messages** if tests fail
5. **Verify user role** is owner/admin

**If you share the error message from test page, I can provide more specific help!** 🚀
