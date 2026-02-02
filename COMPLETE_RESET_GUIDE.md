# Complete System Reset & Fix Guide

## 🚨 Current Problem

Everything was working before, but after my changes, both mobile app and web dashboard have network errors.

## 🔍 Root Cause

Backend runs on **PORT 5001** (from `.env` file), but I made incorrect changes to frontend ports causing connection failures.

## ✅ COMPLETE FIX - Follow These Steps Exactly

### Step 1: Stop Everything

**Stop all running processes:**

1. **Backend Terminal:** Press `Ctrl+C`
2. **Web Dashboard Terminal:** Press `Ctrl+C`
3. **Mobile App Terminal:** Press `Ctrl+C`
4. **Close all terminals**

### Step 2: Verify Backend Port Configuration

Backend is correctly configured in `.env`:
```
PORT=5001
```

**This is CORRECT! Don't change!**

### Step 3: Verify Frontend Configurations

Both should use **PORT 5001**:

**Mobile App:** `utils/api.js` ✅ (Already fixed to 5001)
**Web Dashboard:** `web-dashboard/src/services/api.js` ✅ (Already fixed to 5001)

### Step 4: Start Backend (FIRST!)

```bash
# Open NEW terminal
cd "c:\React native\myapp\backend"
npm run dev
```

**Wait for:**
```
🚀 WorkNex Server running on port 5001
✅ MongoDB Connected
```

**Must see port 5001!**

### Step 5: Test Backend Directly

**Open browser:** `http://localhost:5001`

Should see:
```json
{"message":"WorkNex API Server","status":"running"}
```

**If this doesn't work, backend is not running properly!**

### Step 6: Clear Mobile App Cache

**IMPORTANT: Clear Expo cache!**

```bash
cd "c:\React native\myapp"

# Clear cache completely
npx expo start --clear

# Or if that doesn't work:
npm start -- --clear
```

**This forces Expo to reload all files fresh!**

### Step 7: Restart Web Dashboard

```bash
# Open NEW terminal
cd "c:\React native\myapp\web-dashboard"
npm start
```

**Wait for:**
```
Compiled successfully!
Local: http://localhost:3000
```

### Step 8: Test Web Dashboard

1. Open browser: `http://localhost:3000`
2. Press **F12** → Console tab
3. Login as employer
4. **Check console - should see:**

```javascript
🌐 Web Dashboard API Configuration:
  - API Base URL: http://localhost:5001  ← Must be 5001!
  - Current Origin: http://localhost:3000

🌐 API Request: POST /api/auth/login
   Full URL: http://localhost:5001/api/auth/login
📡 Response status: 200 OK
✅ API Success: { token: "...", user: {...} }
```

**If you see "Failed to fetch" → Backend not running or wrong port!**

### Step 9: Test Mobile App

1. **Make sure Expo started with --clear flag!**
2. Open Expo Go app on phone
3. Scan QR code
4. **In mobile console, should see:**

```
🌐 API Base URL: http://192.168.31.14:5001  ← Must be 5001!
```

5. Login and check if jobs load

**If still "Network request failed":**
- Expo cache didn't clear
- Try: Close Expo Go app completely → Force close → Restart

## 🔧 Emergency Reset (If Nothing Works)

### Option 1: Complete Expo Reset

```bash
cd "c:\React native\myapp"

# Delete Expo cache
rmdir /s /q .expo
rmdir /s /q node_modules\.cache

# Restart with clear
npx expo start --clear
```

### Option 2: Rebuild Everything

```bash
# Mobile app
cd "c:\React native\myapp"
npm install
npx expo start --clear

# Web dashboard
cd web-dashboard
npm install
npm start
```

## 📊 Verification Checklist

Run through this after restart:

### Backend:
- [ ] Terminal shows: "🚀 WorkNex Server running on port **5001**"
- [ ] Terminal shows: "✅ MongoDB Connected"
- [ ] Browser `http://localhost:5001` shows API message
- [ ] Backend terminal shows incoming requests

### Web Dashboard:
- [ ] Terminal shows: "Compiled successfully!"
- [ ] Browser opens: `http://localhost:3000`
- [ ] Console (F12) shows: "API Base URL: http://localhost:**5001**"
- [ ] Can login successfully
- [ ] Console shows "✅ API Success" messages
- [ ] NO "Failed to fetch" errors

### Mobile App:
- [ ] Expo started with `--clear` flag
- [ ] Console shows: "API Base URL: http://192.168.31.14:**5001**"
- [ ] Can login successfully
- [ ] Jobs load without errors
- [ ] NO "Network request failed" errors

## 🚨 Common Issues

### Issue 1: Port Still Wrong

**Check console output carefully:**
```
❌ WRONG: API Base URL: http://localhost:5000
✅ RIGHT: API Base URL: http://localhost:5001
```

**If wrong port shown:**
- Cache not cleared
- Old files still loaded
- Need complete restart with `--clear`

### Issue 2: Backend Not Responding

**Symptoms:**
- Browser `http://localhost:5001` doesn't load
- Backend terminal shows errors

**Solution:**
```bash
# Check if port is already in use
netstat -ano | findstr :5001

# If process found, kill it:
taskkill /PID <PID> /F

# Then restart backend
npm run dev
```

### Issue 3: Expo Cache Issues

**Symptoms:**
- Mobile app shows old API URL
- Changes not reflecting

**Solution:**
```bash
# Nuclear option - clear everything
npx expo start --clear --reset-cache

# Or
rm -rf node_modules/.cache .expo
npx expo start
```

### Issue 4: Network Error Still Persists

**Check:**
1. Is backend actually running? (Check terminal)
2. Is MongoDB connected? (Check backend logs)
3. Is phone on same WiFi? (Check network)
4. Is IP correct? (Run `ipconfig` to verify)

## 📝 What I Changed (For Reference)

### Files Modified:
1. `utils/api.js` - Set to port 5001
2. `web-dashboard/src/services/api.js` - Set to port 5001, added logging
3. `backend/routes/users.js` - Updated video validation (30-240 seconds)

### What Went Wrong:
1. Initially changed ports from 5001 → 5000 (WRONG)
2. Then changed back to 5001 (CORRECT)
3. But Expo cached old code
4. Didn't restart with `--clear` flag

## 🎯 The Real Fix

**The issue is CACHING, not configuration!**

All configurations are now CORRECT (port 5001).

**Just need to clear cache and restart properly!**

## 🚀 Quick Command Summary

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Web Dashboard  
cd web-dashboard
npm start

# Terminal 3 - Mobile App (WITH CLEAR!)
cd "c:\React native\myapp"
npx expo start --clear
```

**That's it! All three must be running simultaneously!**

---

**Status:** ✅ Configuration Fixed, Cache Needs Clearing
**Date:** 2026-02-02
**Issue:** Expo cache causing old code to run
**Solution:** Restart Expo with `--clear` flag
**Impact:** CRITICAL - Must clear cache for changes to take effect!
