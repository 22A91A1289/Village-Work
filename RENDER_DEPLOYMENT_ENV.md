# 🚀 Render Deployment - Environment Variables

## Required Environment Variables for Render

When deploying your WorkNex backend to Render, you need to add these environment variables in the Render dashboard.

---

## 📝 Environment Variables List

### 1. **MONGODB_URI** (Required)
**Description:** MongoDB database connection string

**Value:**
```
mongodb+srv://surajtelidevara4:suraj1234@testing.9syxs.mongodb.net/worknex?retryWrites=true&w=majority&appName=testing
```

**Notes:**
- This connects to your MongoDB Atlas cluster
- Contains database credentials
- Make sure MongoDB Atlas allows Render's IP addresses (or allow all IPs: 0.0.0.0/0)

---

### 2. **PORT** (Optional - Auto-set by Render)
**Description:** Port where the server runs

**Value:**
```
10000
```

**Notes:**
- Render automatically sets this
- You can leave it blank (Render uses its own port)
- If you set it, use `10000` (Render's default)

---

### 3. **NODE_ENV** (Recommended)
**Description:** Node environment mode

**Value:**
```
production
```

**Notes:**
- Set to `production` for deployed environment
- Affects error messages and logging
- Use `development` only for testing

---

### 4. **JWT_SECRET** (Required)
**Description:** Secret key for JWT token generation

**Value:**
```
your_super_secret_jwt_key_change_this_in_production_12345
```

**⚠️ IMPORTANT:**
- **DO NOT use the default value!**
- Generate a strong random string
- Use at least 32 characters
- Keep it secret!

**Generate a secure secret:**
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Online
# Visit: https://randomkeygen.com/
```

---

### 5. **SMTP_HOST** (Required for Forgot Password)
**Description:** SMTP server hostname for sending emails

**Value:**
```
smtp.gmail.com
```

**Notes:**
- For Gmail SMTP
- For other providers, use their SMTP host

---

### 6. **SMTP_PORT** (Required for Forgot Password)
**Description:** SMTP server port

**Value:**
```
587
```

**Notes:**
- `587` for TLS (recommended)
- `465` for SSL
- Gmail uses 587

---

### 7. **SMTP_USER** (Required for Forgot Password)
**Description:** Email address for sending emails

**Value:**
```
surajtelidevara4@gmail.com
```

**Notes:**
- Use your Gmail address
- Must have App Password enabled (if using Gmail)

---

### 8. **SMTP_PASS** (Required for Forgot Password)
**Description:** Email password or App Password

**Value:**
```
cohe ziie tuug cqxw
```

**⚠️ IMPORTANT - Gmail Users:**
- **NOT your regular Gmail password!**
- Must be a Google App Password
- Enable 2FA first, then create App Password
- Get it here: https://myaccount.google.com/apppasswords

**Format:**
- 16 characters like: `xxxx xxxx xxxx xxxx`
- Spaces are optional but recommended

---

### 9. **SMTP_FROM** (Required for Forgot Password)
**Description:** From email address in sent emails

**Value:**
```
surajtelidevara4@gmail.com
```

**Notes:**
- Usually same as SMTP_USER
- Must be authorized to send from SMTP server

---

## 🎯 Quick Copy-Paste for Render

Copy these key-value pairs to Render's environment variables section:

```
MONGODB_URI=mongodb+srv://surajtelidevara4:suraj1234@testing.9syxs.mongodb.net/worknex?retryWrites=true&w=majority&appName=testing

NODE_ENV=production

JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING_32_CHARACTERS_OR_MORE

SMTP_HOST=smtp.gmail.com

SMTP_PORT=587

SMTP_USER=surajtelidevara4@gmail.com

SMTP_PASS=cohe ziie tuug cqxw

SMTP_FROM=surajtelidevara4@gmail.com
```

---

## 📋 Step-by-Step: Adding Variables in Render

### 1. **Go to Your Render Service**
- Login to https://render.com
- Select your backend service
- Click "Environment" in left sidebar

### 2. **Add Each Variable**
For each variable above:
- Click "Add Environment Variable"
- Enter **Key** (e.g., `MONGODB_URI`)
- Enter **Value** (the actual value)
- Click "Save Changes"

### 3. **Important Variables to Update**

#### ⚠️ Must Change Before Deploy:
1. **JWT_SECRET** - Generate new random string
2. **SMTP_PASS** - Use your actual App Password

#### ✅ Can Use As-Is (if using your MongoDB):
1. **MONGODB_URI** - Your MongoDB connection string
2. **SMTP_USER** - Your email
3. **SMTP_FROM** - Your email

---

## 🔐 Security Best Practices

### 1. **JWT_SECRET**
```bash
# Generate secure secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Output (example):
7f3d8e2a9c1b4f6e5d8a7c3b9e2f1a4d8c7b6a5e9f3d2c1b8a7e6d5c4f3b2a1d
```

**Use this in Render:**
```
JWT_SECRET=7f3d8e2a9c1b4f6e5d8a7c3b9e2f1a4d8c7b6a5e9f3d2c1b8a7e6d5c4f3b2a1d
```

### 2. **MongoDB Security**
- Use strong password
- Enable IP whitelist or allow all (0.0.0.0/0) for Render
- Use MongoDB Atlas for production

### 3. **SMTP Password**
- Never use regular Gmail password
- Always use Google App Password
- Keep it secret

---

## 🌐 MongoDB Atlas Configuration

**If email sending doesn't work:**

1. **Allow Render IP Addresses:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Render's specific IPs

2. **Database User:**
   - Make sure user has read/write permissions
   - Check username and password are correct

---

## 🧪 Testing After Deployment

### 1. **Check Backend Health**
```
https://your-render-app.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 2. **Check Environment**
```
https://your-render-app.onrender.com/api/health
```

**Should return:**
```json
{
  "environment": "production",
  "database": "connected"
}
```

### 3. **Test Forgot Password (Email)**
- Use mobile app or web dashboard
- Click "Forgot Password"
- Enter email
- Check if OTP email is received

---

## 🐛 Troubleshooting

### Problem: "Email service not configured"

**Solution:**
- Check all SMTP_ variables are added in Render
- No typos in variable names
- Values have no extra spaces

### Problem: "Failed to fetch" from frontend

**Solution:**
- Update frontend API_BASE_URL to Render URL
- Example: `https://worknex-backend.onrender.com`

**Mobile App (`utils/api.js`):**
```javascript
const API_BASE_URL = 'https://worknex-backend.onrender.com';
```

**Web Dashboard (`.env`):**
```
REACT_APP_API_BASE_URL=https://worknex-backend.onrender.com
```

### Problem: MongoDB connection failed

**Solution:**
- Check MongoDB Atlas Network Access
- Allow 0.0.0.0/0 (all IPs)
- Verify MONGODB_URI is correct
- Check database user permissions

### Problem: JWT authentication not working

**Solution:**
- Make sure JWT_SECRET is set
- Same JWT_SECRET across all instances
- No spaces in JWT_SECRET value

---

## 📊 Complete Checklist

Before deploying to Render:

- [ ] MONGODB_URI set and tested
- [ ] JWT_SECRET generated (strong random string)
- [ ] NODE_ENV set to `production`
- [ ] SMTP_HOST set to `smtp.gmail.com`
- [ ] SMTP_PORT set to `587`
- [ ] SMTP_USER set to your Gmail
- [ ] SMTP_PASS set to Google App Password (not regular password)
- [ ] SMTP_FROM set to your Gmail
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Frontend API_BASE_URL updated to Render URL
- [ ] Tested `/health` endpoint after deploy
- [ ] Tested forgot password email sending

---

## 🚀 After Adding Variables

1. **Save Changes** in Render
2. **Redeploy** your service (if it doesn't auto-deploy)
3. **Check Logs** for any errors
4. **Test API** endpoints

---

## 📝 Example Render Environment Variables

```
Variable Name          | Variable Value
--------------------- | ------------------------------------------
MONGODB_URI           | mongodb+srv://user:pass@cluster.mongodb.net/worknex
NODE_ENV              | production
JWT_SECRET            | 7f3d8e2a9c1b4f6e5d8a7c3b9e2f1a4d8c7b6a5e...
SMTP_HOST             | smtp.gmail.com
SMTP_PORT             | 587
SMTP_USER             | your-email@gmail.com
SMTP_PASS             | xxxx xxxx xxxx xxxx
SMTP_FROM             | your-email@gmail.com
```

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Google App Passwords:** https://myaccount.google.com/apppasswords
- **JWT Secret Generator:** https://randomkeygen.com/

---

**Status:** ✅ Ready for Render Deployment  
**Required Variables:** 8 (9 including PORT)  
**Optional Variables:** 1 (PORT - auto-set by Render)

**Add these variables in Render, then deploy your backend! 🚀**
