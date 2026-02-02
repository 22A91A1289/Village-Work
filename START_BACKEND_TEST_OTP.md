# 🚀 Start Backend & Test OTP

## ✅ Email System is WORKING!

Test email successfully sent to `surajtelidevara4@gmail.com`!

---

## 📧 Step 1: Check Your Email RIGHT NOW

**Go to:** https://mail.google.com/

**Login:** surajtelidevara4@gmail.com

**Search for:** "WorkNex Password Reset OTP"

**Check these folders:**
1. ✅ **Inbox** (Primary tab)
2. ✅ **Spam** folder ⚠️ (MOST LIKELY HERE!)
3. ✅ **Promotions** tab
4. ✅ **All Mail**

**Email looks like:**
```
From: surajtelidevara4@gmail.com
Subject: WorkNex Password Reset OTP

🔐 WorkNex Password Reset

Your OTP for password reset is:

  123456

⏱️ This OTP will expire in 10 minutes.
🔒 If you did not request this, please ignore this email.
```

---

## 🚀 Step 2: Start Backend Server

**Open PowerShell/Terminal:**

```powershell
cd "c:\React native\myapp\backend"
npm start
```

**Wait for:**
```
🚀 WorkNex Server running on port 5001
MongoDB connected successfully
```

---

## 📱 Step 3: Test in Mobile App

**1. Start Expo:**
```powershell
cd "c:\React native\myapp"
npx expo start
```

**2. In App:**
- Login screen → "Forgot Password?"
- Enter email: `surajtelidevara4@gmail.com` (or your registered user email)
- Tap "Send OTP"

**3. Check Backend Console:**
You should see:
```
🔑 Forgot password request for email: surajtelidevara4@gmail.com
✅ User found: surajtelidevara4@gmail.com
🔢 Generated OTP: 456789
💾 OTP saved to database
📧 Attempting to send OTP email to: surajtelidevara4@gmail.com
✅ Email sent successfully!
  Message ID: <...>
  Response: 250 2.0.0 OK
```

**4. Check Email Again:**
- Open Gmail
- Look for new email with OTP
- **Check SPAM folder!** ⚠️

**5. Enter OTP:**
- Copy OTP from email
- Paste in app
- Enter new password
- Tap "Reset Password"

---

## 🌐 OR Test in Web Dashboard

**1. Start Web Dashboard:**
```powershell
cd "c:\React native\myapp\web-dashboard"
npm start
```

**2. In Browser:**
- Open: http://localhost:3000
- Click "Forgot Password?"
- Enter email: `surajtelidevara4@gmail.com`
- Click "Send OTP"

**3. Check Backend Console** (same as above)

**4. Check Email** (check SPAM!)

**5. Enter OTP + Reset**

---

## ⚠️ IMPORTANT: Gmail Spam Issue

**Gmail might mark automated emails as SPAM!**

**If OTP not in Inbox:**

1. ✅ **Check SPAM folder** - Most likely here!
2. If found in SPAM:
   - Open the email
   - Click "Not spam" button
   - Next emails will go to Inbox

**To prevent future SPAM:**
1. Add `surajtelidevara4@gmail.com` to contacts
2. Mark first email as "Not spam"
3. Create filter: From `surajtelidevara4@gmail.com` → Never send to Spam

---

## 🔍 Troubleshooting

### Problem: Backend not starting

**Error:** Port already in use

**Solution:**
```powershell
# Kill existing Node processes
taskkill /F /IM node.exe

# Start again
cd "c:\React native\myapp\backend"
npm start
```

### Problem: User not found

**Error:** "User not found for email"

**Solution:**
- Use email that's registered in your database
- Or signup first, then test forgot password

### Problem: Email still not received

**Check:**
1. ✅ Backend console shows "Email sent successfully"?
2. ✅ Email address correct ga type chesava?
3. ✅ SPAM folder check chesava?
4. ✅ Gmail lo login chesava (surajtelidevara4@gmail.com)?

---

## 📊 Test Results

**Just now tested:**
```
✅ SMTP Configuration: Correct
✅ Gmail Connection: Success
✅ Email Sent: Success
✅ Message ID: <27a7cd34-b1d9-c05a-895e-d54a8135851e@gmail.com>
✅ Gmail Response: 250 2.0.0 OK
```

**Test OTP sent to:** surajtelidevara4@gmail.com  
**Test OTP:** 123456

**GO CHECK YOUR EMAIL NOW!** 📧

---

## ✅ Quick Checklist

Before asking "OTP raledu":

- [ ] Backend running (`npm start` in backend folder)?
- [ ] Used correct email (registered email)?
- [ ] Checked INBOX?
- [ ] Checked SPAM folder? ⚠️
- [ ] Checked Promotions tab?
- [ ] Checked All Mail?
- [ ] Searched "WorkNex" in Gmail?
- [ ] Backend console shows "Email sent successfully"?

---

**Email system is working perfectly! Check your SPAM folder! 📧✅**
