# 🔧 Render Deployment Error Fix

## ❌ Error You're Seeing:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/render/project/src/App'
Did you mean to import "./App.js"?
```

---

## 🎯 Problem:

You're trying to deploy the **web-dashboard** (React app) as a **Node.js Web Service**. This won't work!

**Root Cause:**
- Render is looking in the wrong directory
- Trying to run a React app with Node.js directly
- Should either deploy backend OR deploy dashboard as Static Site

---

## ✅ Solution: Deploy Backend Correctly

### Step 1: Fix Root Directory

**In Render Dashboard:**

1. Go to your service → **Settings**
2. Scroll to **Root Directory**
3. Change from blank or `web-dashboard` to:
   ```
   backend
   ```
4. Click **Save Changes**

### Step 2: Fix Build & Start Commands

**Build Command:**
```
npm install
```

**Start Command:**
```
node server.js
```

### Step 3: Verify Files Exist

Make sure these files exist in your `backend` folder:
- ✅ `backend/server.js` (main entry point)
- ✅ `backend/package.json`
- ✅ `backend/.env` (for local - don't commit this!)

### Step 4: Redeploy

Click **Manual Deploy** → **Deploy latest commit**

---

## 📊 Correct Render Configuration

### Backend (Web Service)

| Setting | Value |
|---------|-------|
| **Type** | Web Service |
| **Environment** | Node |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Port** | 10000 (or leave blank - Render auto-assigns) |

### Environment Variables:

Add these in Render dashboard (Environment tab):

```
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
JWT_SECRET=your_generated_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

---

## 🌐 If You Want to Deploy Web Dashboard

**Don't deploy it as a Web Service!** Deploy as a **Static Site** instead.

### Create New Static Site:

1. **In Render:** Click "New" → "Static Site"
2. **Connect Repository**
3. **Configure:**
   - **Name:** `worknex-dashboard`
   - **Root Directory:** `web-dashboard`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. **Add Environment Variable:**
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com
   ```

5. **Create Static Site**

---

## 🚀 Deployment Order

**Deploy in this order:**

1. **Backend First** (Web Service)
   - Get the URL: `https://worknex-backend.onrender.com`
   - Test: `https://worknex-backend.onrender.com/health`

2. **Then Web Dashboard** (Static Site)
   - Use backend URL in env variable
   - Deploy and test

3. **Mobile App** (Not on Render)
   - Update `utils/api.js` with backend URL
   - Build and distribute via Expo

---

## 🔍 Verify Backend Files

✅ **Verified! Your backend has all required files:**

```
backend/
├── server.js          ✅ Main entry point
├── package.json       ✅ Dependencies
├── config/
│   └── database.js    ✅ MongoDB connection
├── models/            ✅ Database models
├── routes/            ✅ API routes
├── middleware/        ✅ Auth middleware
└── utils/             ✅ Utilities (mailer)
```

**All files present! Ready for deployment.**

---

## 📝 Quick Fix Checklist

### Immediate Fix (In Render Dashboard):

- [ ] Go to Service → Settings
- [ ] Set **Root Directory** to `backend`
- [ ] Set **Build Command** to `npm install`
- [ ] Set **Start Command** to `node server.js`
- [ ] Save Changes
- [ ] Add all environment variables (see RENDER_DEPLOYMENT_ENV.md)
- [ ] Click "Manual Deploy" → "Deploy latest commit"

### Verify Deployment:

- [ ] Check logs for "Server running on port"
- [ ] Test: `https://your-app.onrender.com/health`
- [ ] Should return: `{"status":"ok","message":"Server is running"}`

---

## 🎯 What Each Part Should Be:

| Component | Deploy To | Type | Entry Point |
|-----------|-----------|------|-------------|
| **Backend** | Render | Web Service | `backend/server.js` |
| **Web Dashboard** | Render/Vercel | Static Site | `web-dashboard/build` |
| **Mobile App** | Expo | Mobile App | Not on Render |

---

## 💡 Pro Tip

You can also use the `render.yaml` file (already created in your project root) for automatic configuration:

1. Commit `render.yaml` to git
2. Push to GitHub
3. Render will auto-detect settings
4. Just add environment variables manually

---

## 🐛 Common Errors After Fix

### Error: "Cannot find module 'express'"

**Cause:** Dependencies not installed

**Fix:**
- Check **Build Command**: `npm install`
- Check `backend/package.json` exists
- Redeploy

### Error: "ECONNREFUSED MongoDB"

**Cause:** MongoDB connection failed

**Fix:**
- Check `MONGODB_URI` environment variable
- Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Check database credentials

### Error: "Port already in use"

**Cause:** Render port conflict (shouldn't happen)

**Fix:**
- Don't set PORT in environment variables
- Let Render auto-assign port
- Check `server.js` uses `process.env.PORT || 5001`

---

## ✅ Success Indicators

After correct deployment, you should see:

**Render Logs:**
```
==> Downloading cache...
==> Running 'npm install'
==> Running 'node server.js'
🚀 WorkNex Server running on port 10000
✅ MongoDB connected successfully
📡 Environment: production
```

**Health Check Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

**API Test (from mobile/web):**
```json
{
  "jobs": [...],
  "applications": [...]
}
```

---

## 🔗 Related Files

- **Environment Variables:** `RENDER_DEPLOYMENT_ENV.md`
- **Render Config:** `render.yaml`
- **Backend Setup:** `backend/README.md`

---

**Status:** ✅ Fix documented  
**Action Required:** Update Render settings to use `backend` folder  
**Expected Time:** 5 minutes + deployment time (~10 min)

<function_calls>
<invoke name="LS">
<parameter name="target_directory">c:\React native\myapp\backend