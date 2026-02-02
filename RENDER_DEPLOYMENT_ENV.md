# 🚀 Render Deployment - Environment Variables

**⚠️ Never commit real credentials to git.** Add these in the Render dashboard only.

---

## 📝 Variables to Add in Render Dashboard

Go to your Render service → **Environment** → Add each variable there (do not put real values in any file in the repo).

| Variable | Description | Example value (use your own) |
|----------|-------------|------------------------------|
| **MONGODB_URI** | MongoDB connection string | `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |
| **NODE_ENV** | Environment | `production` |
| **JWT_SECRET** | Secret for JWT (generate new) | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| **SMTP_HOST** | SMTP server (Gmail) | `smtp.gmail.com` |
| **SMTP_PORT** | SMTP port | `587` |
| **SMTP_USER** | Your email | `your-email@gmail.com` |
| **SMTP_PASS** | Gmail App Password (not normal password) | Create at https://myaccount.google.com/apppasswords |
| **SMTP_FROM** | From address | Same as SMTP_USER |

---

## 🔐 Security

- **Do not** put real MONGODB_URI, JWT_SECRET, or SMTP_PASS in any file in the repo.
- Keep `.env` and `backend/.env` in `.gitignore` (they are already ignored).
- Add values only in Render dashboard → Environment.

---

## 📋 Steps

1. Open https://dashboard.render.com → your backend service.
2. Click **Environment** in the sidebar.
3. Click **Add Environment Variable** for each key above and enter **your** values.
4. Save and redeploy.

---

## 🧪 After Deploy

Test: `https://your-app.onrender.com/health`  
Expected: `{"status":"ok","message":"Server is running"}`
