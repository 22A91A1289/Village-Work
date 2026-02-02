# Quick Test Guide - Application Flow

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend Server (Terminal 1)
```powershell
cd "c:\React native\myapp\backend"
npm run dev
```

Wait for: `🚀 WorkNex Server running on port 5001`

### Step 2: Start Mobile App (Terminal 2)
```powershell
cd "c:\React native\myapp"
npm start
# or
npx expo start
```

### Step 3: Start Web Dashboard (Terminal 3)
```powershell
cd "c:\React native\myapp\web-dashboard"
npm start
```

## 📱 Testing the Application Flow

### Part 1: Submit Application (Mobile App)

1. **Open Mobile App** (on device/emulator)
2. **Login as Worker:**
   - Use worker credentials
   - Make sure you're logged in as role: "worker"

3. **Find a Job:**
   - Go to Home screen
   - Browse available jobs
   - Click on any job to view details

4. **Apply for Job:**
   - Click "Apply Now" button
   - If prompted, complete video KYC first
   - Confirm application

5. **Verify in Console:**
   ```
   Expected mobile app logs:
   🌐 API Request: POST /api/applications
   📦 Request body: { jobId: "...", message: "..." }
   🔑 Using auth token: ...
   📡 Response status: 201 Created
   ✅ API Success: { ...application data... }
   ```

   ```
   Expected backend logs:
   ========================================
   📝 POST /api/applications called
   👤 User ID: [worker-id]
   👤 User role: worker
   📦 Request body: { jobId: '...', message: '...' }
   ========================================
   ✅ Job found: [Job Title]
   ✅ Application created successfully!
   ✅ Applicant added to job
   ✅ Application submitted successfully
   ```

### Part 2: View Applications (Web Dashboard)

1. **Open Web Dashboard** (`http://localhost:3000`)
2. **Login as Employer:**
   - Use the same account that posted the job
   - Make sure you're logged in as role: "owner"

3. **Navigate to Applications:**
   - Click "Applications" in sidebar
   - Wait for data to load

4. **Verify in Console:**
   ```
   Expected web dashboard logs:
   🌐 WEB DASHBOARD: Loading applications and jobs...
   🔑 Auth Token: Present
   👤 Current User: { name: "...", role: "owner", ... }
   📥 RAW Data Received:
   Applications: [ { id: "...", worker: "...", job: "...", ... } ]
   📊 Applications count: 1 (or more)
   ✅ Loading complete
   ```

   ```
   Expected backend logs:
   ========================================
   🔍 GET /api/applications/owner/all called
   👤 User ID: [employer-id]
   👤 User role: owner
   ========================================
   📊 Employer jobs found: X
   📊 Applications found for employer: Y
   ✅ Applications found! Details:
     1. [Worker Name] applied for "[Job Title]" - Status: pending
   ✅ Returning Y applications to web dashboard
   ```

5. **View Application Card:**
   - Should see worker's name
   - Job title they applied for
   - Status: "pending"
   - Accept/Reject buttons

## 🔍 Troubleshooting Checklist

### If Application Submission Fails:

- [ ] Backend server is running (check Terminal 1)
- [ ] Mobile app showing correct API URL in logs
- [ ] Worker is logged in (check auth token in logs)
- [ ] Job ID is valid (check backend logs)
- [ ] No duplicate application error

### If Applications Not Showing in Web Dashboard:

- [ ] Backend server is running (check Terminal 1)
- [ ] Employer is logged in (check auth token)
- [ ] Employer account matches job poster
- [ ] Backend logs show applications exist
- [ ] Browser console shows successful API response
- [ ] No network errors in browser DevTools

### If Both Work But Data Doesn't Match:

- [ ] Check User IDs in backend logs
- [ ] Verify job's `postedBy` field matches employer ID
- [ ] Verify application's `job` field matches job ID
- [ ] Check database directly using MongoDB Compass

## 📊 Expected Results

✅ **Mobile App:**
- Shows "Applied" status after submission
- Can view application in "My Applications" screen
- Receives notification when application status changes

✅ **Web Dashboard:**
- Shows all applications for employer's jobs
- Displays worker information (name, phone, skills, KYC status)
- Can accept/reject applications
- Real-time updates when new applications arrive

✅ **Backend:**
- Logs show successful application creation
- Logs show successful application fetching
- No errors in console
- Database contains application documents

## 🔧 Quick Fixes

### "Cannot connect to backend"
```powershell
# Check if backend is running
curl http://localhost:5001/api/health

# If not working, restart backend
cd "c:\React native\myapp\backend"
npm run dev
```

### "401 Unauthorized"
```javascript
// Clear and re-login
// Mobile: Logout and login again
// Web: Clear localStorage and login again
localStorage.clear(); // In browser console
// Then login again
```

### "Applications still not showing"
```powershell
# Check database directly
# Use MongoDB Compass with connection string from backend/.env
# Query: db.applications.find({})
# Verify applications exist with correct job and applicant IDs
```

## 📞 Support Checklist

If issue persists, collect this information:

1. **Backend Console Logs** (full output)
2. **Mobile App Logs** (React Native debugger)
3. **Web Dashboard Console** (Browser DevTools)
4. **Network Tab** (Browser DevTools - show API calls)
5. **MongoDB Query Results** (applications collection)

## 🎯 Success Indicators

✅ Application count in web dashboard matches database
✅ Worker info displays correctly (name, phone, skills)
✅ KYC verification status shows correctly
✅ Accept/Reject buttons work
✅ Status updates in real-time
✅ Both mobile and web show consistent data

---

**Test Date:** _____________
**Tester:** _____________
**Result:** [ ] Pass [ ] Fail
**Issues Found:** _____________
