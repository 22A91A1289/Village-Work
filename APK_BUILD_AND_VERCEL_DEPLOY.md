# 📱 APK Build + 🌐 Vercel Dashboard Deploy

Backend is live at **https://village-work.onrender.com**.  
This guide covers: **building an APK** and **deploying the dashboard on Vercel**.

---

## 🌐 Part 1: Deploy Dashboard on Vercel

### Step 1: Push Latest Code to GitHub

Make sure your repo is up to date:

```bash
cd "c:\React native\myapp"
git add -A
git status
git commit -m "Use production API URL for mobile and dashboard"   # if needed
git push origin master
```

### Step 2: Deploy on Vercel

1. **Open Vercel:** https://vercel.com → Sign in (e.g. with GitHub).

2. **New Project**
   - Click **"Add New..."** → **"Project"**
   - **Import** your repo: `22A91A1289/Village-Work`

3. **Configure Project**
   - **Framework Preset:** Create React App (or Vite if you use it)
   - **Root Directory:** Click **Edit** → set to **`web-dashboard`**
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `build` (default)

4. **Environment Variable**
   - **Key:** `REACT_APP_API_BASE_URL`
   - **Value:** `https://village-work.onrender.com`
   - Add it, then click **Deploy**.

5. **Wait for deploy** (~2–3 min).  
   You’ll get a URL like: `https://village-work-xxx.vercel.app`.

### Step 3: Test Dashboard

- Open the Vercel URL.
- Login with an employer account.
- Check that Jobs, Applications, Profile, etc. load (they should call the Render backend).

---

## 📱 Part 2: Build APK (Android)

Your app is **Expo**. To get an **APK** you use **EAS Build**.

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Log in to Expo

```bash
eas login
```

Create an Expo account at https://expo.dev if you don’t have one.

### Step 3: Configure EAS (first time only)

In the project root (same folder as `app.json`):

```bash
cd "c:\React native\myapp"
eas build:configure
```

Choose **All** (Android + iOS). This creates `eas.json`.

### Step 4: Production API in APK

The app is already set to use **production** when not in development:

- **File:** `utils/api.js`
- **Production URL:** `https://village-work.onrender.com`
- When you build a **release** APK, `__DEV__` is false, so the APK uses this URL. No extra step needed for the API.

### Step 5: Build APK

**Option A – APK (direct install, e.g. side-loading):**

```bash
eas build --platform android --profile preview
```

**Option B – AAB (for Google Play Store):**

```bash
eas build --platform android --profile production
```

First time, EAS will ask:

- **Generate a new Android Keystore?** → Yes (unless you already have one).
- **Expo account** → use the one you logged in with.

### Step 6: Download APK

1. When the build finishes, EAS shows a link (or go to https://expo.dev → your project → **Builds**).
2. Open the **Android** build.
3. Click **Download** to get the `.apk` (preview) or use the AAB for Play Store (production).

### Step 7: Install APK on Phone

- Copy the `.apk` to the phone (USB, Drive, etc.).
- Open the file on the phone and install (enable “Install from unknown sources” if asked).
- Open the app; it will use **https://village-work.onrender.com** as the backend.

---

## 📋 Summary

| Item | URL / Command |
|------|----------------|
| **Backend (Render)** | https://village-work.onrender.com |
| **Dashboard (Vercel)** | Set Root Directory: `web-dashboard`, env: `REACT_APP_API_BASE_URL=https://village-work.onrender.com` |
| **APK build** | `eas build --platform android --profile preview` |
| **Production API in app** | Already in `utils/api.js` (uses Render when not `__DEV__`) |

---

## ⚠️ Notes

### Render free tier

- Service may sleep after ~15 min of no traffic.
- First request after sleep can take 30–60 seconds (cold start).
- For production, consider a paid plan or another host if you need no cold starts.

### CORS on backend

Your backend must allow the Vercel dashboard origin. If you see CORS errors in the browser:

- In backend (e.g. `server.js` or CORS config), add your Vercel URL to allowed origins, e.g.  
  `https://your-dashboard-name.vercel.app`  
  (and optionally `https://*.vercel.app`).

### EAS Build quotas

- Free Expo accounts have a limited number of builds per month.
- Check https://expo.dev/pricing for current limits.

---

## ✅ Checklist

**Vercel (dashboard)**  
- [ ] Repo connected, Root Directory = `web-dashboard`  
- [ ] `REACT_APP_API_BASE_URL=https://village-work.onrender.com`  
- [ ] Deploy successful, login and API calls work  

**APK**  
- [ ] `eas login` and `eas build:configure` done  
- [ ] `eas build --platform android --profile preview`  
- [ ] APK downloaded and installed on device  
- [ ] App loads and talks to https://village-work.onrender.com  

You can use this file as a single reference for both “download APK” and “deploy dashboard on Vercel”.
