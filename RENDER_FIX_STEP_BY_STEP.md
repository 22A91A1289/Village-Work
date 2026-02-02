# 🔧 Render Error Fix - Step by Step

## ❌ The Error

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/render/project/src/App'
Running 'node index.js'
```

---

## 🎯 Why This Happens

Your repo has **3 different parts** in one repo:

```
Village-Work (repo root)
├── index.js          ← Expo/React Native entry (MOBILE APP)
├── App.js            ← Mobile app root component
├── package.json      ← Mobile app dependencies
│
├── backend/          ← ✅ THIS is what Render should run!
│   ├── server.js     ← Express API server
│   └── package.json  ← Backend dependencies
│
└── web-dashboard/     ← React web app (deploy as Static Site)
```

**What Render is doing now:**
1. Uses **project root** (no Root Directory set)
2. Runs `npm install` → installs **mobile app** dependencies
3. Runs `node index.js` → tries to run **Expo mobile app** with Node ❌

**What Render should do:**
1. Use **Root Directory: backend**
2. Run `npm install` → installs **backend** dependencies
3. Run `node server.js` → starts **Express API** ✅

---

## ✅ Fix in 4 Steps (Render Dashboard)

### Step 1: Open Your Service

1. Go to **https://dashboard.render.com**
2. Log in
3. Click your service (e.g. **Village-Work** or **worknex-backend**)

---

### Step 2: Go to Settings

1. Click **"Settings"** in the left sidebar
2. Scroll to **"Build & Deploy"** section

---

### Step 3: Change These 3 Settings

| Setting | Current (Wrong) | Change To (Correct) |
|---------|-----------------|---------------------|
| **Root Directory** | *(empty or wrong)* | `backend` |
| **Build Command** | `npm install` | `npm install` *(keep same)* |
| **Start Command** | `node index.js` | `node server.js` |

**Type exactly:**
- **Root Directory:** `backend` (just the word backend, no slash)
- **Start Command:** `node server.js`

---

### Step 4: Save and Redeploy

1. Click **"Save Changes"** (blue button at bottom)
2. Go to **"Manual Deploy"** in the top right
3. Click **"Deploy latest commit"**
4. Wait for build to finish (~2–5 min)

---

## 📸 Where to Find Each Setting

### Root Directory
- **Settings** → scroll to **"Build & Deploy"**
- Find **"Root Directory"**
- If empty, type: `backend`
- If it has something else, replace with: `backend`

### Start Command
- Same section **"Build & Deploy"**
- Find **"Start Command"**
- Change from `node index.js` to: `node server.js`

---

## ✅ After Fix – What You Should See

**Build logs:**
```
==> Cloning from https://github.com/22A91A1289/Village-Work
==> Checking out commit ...
==> Using Node.js version 22.22.0
==> Running build command 'npm install'...
added XXX packages
==> Running 'node server.js'
🚀 WorkNex Server running on port 10000
✅ MongoDB connected successfully
```

**No more:** `Running 'node index.js'` or `Cannot find module '/opt/render/project/src/App'`

---

## 🧪 Test After Deploy

1. Open your service URL (e.g. `https://your-service-name.onrender.com`)
2. Add `/health` at the end: `https://your-service-name.onrender.com/health`
3. You should see:
   ```json
   {"status":"ok","message":"Server is running"}
   ```

---

## 📋 Checklist

- [ ] Root Directory = `backend`
- [ ] Start Command = `node server.js`
- [ ] Save Changes clicked
- [ ] Manual Deploy → Deploy latest commit
- [ ] Build succeeds (no red error)
- [ ] `/health` returns JSON

---

## 🔗 Summary

| What | Value |
|------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

Do this in Render and redeploy. The error will be fixed.
