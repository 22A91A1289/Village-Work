# 🔧 Render: "Cannot find module index.js" – Fix

## ❌ The Error

```
Error: Cannot find module '/opt/render/project/src/backend/index.js'
==> Running 'node index.js'
```

---

## 🎯 Cause

- **Root Directory** is correct: Render is using the `backend/` folder.
- **Start Command** is wrong: Render is running `node index.js`.
- Your backend has **`server.js`**, not **`index.js`**.

So Node looks for `backend/index.js` and fails.

---

## ✅ Fix: Change Start Command in Render

### In Render Dashboard

1. Open your service: **https://dashboard.render.com**
2. Click your **backend service**
3. Go to **Settings** (left sidebar)
4. Scroll to **"Build & Deploy"**
5. Find **"Start Command"**
6. Change it from:
   ```text
   node index.js
   ```
   to:
   ```text
   node server.js
   ```
7. Click **Save Changes**
8. Go to **Manual Deploy** → **Deploy latest commit**

---

## 📋 Correct Render Settings

| Setting          | Value              |
|------------------|--------------------|
| **Root Directory** | `backend`        |
| **Build Command**  | `npm install`    |
| **Start Command**  | `node server.js` |

---

## ✅ After Changing Start Command

Logs should show:

```text
==> Running 'node server.js'
🚀 WorkNex Server running on port 10000
✅ MongoDB connected successfully
```

No more: `Cannot find module .../index.js`

---

## 📁 Backend Entry Point

Your backend structure:

```text
backend/
├── server.js    ← main entry (use this)
├── package.json
├── routes/
├── models/
└── ...
```

There is no `index.js` in `backend/`. The correct command is **`node server.js`**.

---

**Summary:** In Render → Settings → Start Command, set **`node server.js`**, save, and redeploy.
