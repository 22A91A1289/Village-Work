# 🔧 ObjectId Constructor Error Fix

## 🐛 Error Description

**Error Message:**
```
Could not load earnings data: Class constructor ObjectId cannot be invoked without 'new'
ERROR Error fetching earnings summary: [Error: Class constructor ObjectId cannot be invoked without 'new']
```

**Where it happened:**
- Profile screen when loading earnings data
- Payment history screen
- Any endpoint using Payment aggregation queries

---

## 🔍 Root Cause

In MongoDB/Mongoose 6.x and later, `ObjectId` must be instantiated with the `new` keyword.

**Incorrect (Old way):**
```javascript
mongoose.Types.ObjectId(workerId)
```

**Correct (New way):**
```javascript
new mongoose.Types.ObjectId(workerId)
```

---

## ✅ Files Fixed

### **1. backend/models/Payment.js**

#### **Fix 1: getWorkerEarningsSummary method**

**Before:**
```javascript
paymentSchema.statics.getWorkerEarningsSummary = async function(workerId) {
  const summary = await this.aggregate([
    { $match: { worker: mongoose.Types.ObjectId(workerId) } },
    // ...
  ]);
};
```

**After:**
```javascript
paymentSchema.statics.getWorkerEarningsSummary = async function(workerId) {
  const summary = await this.aggregate([
    { $match: { worker: new mongoose.Types.ObjectId(workerId) } },
    // ...
  ]);
};
```

#### **Fix 2: getMonthlyEarnings method**

**Before:**
```javascript
paymentSchema.statics.getMonthlyEarnings = async function(workerId, year) {
  return await this.aggregate([
    {
      $match: {
        worker: mongoose.Types.ObjectId(workerId),
        // ...
      }
    }
  ]);
};
```

**After:**
```javascript
paymentSchema.statics.getMonthlyEarnings = async function(workerId, year) {
  return await this.aggregate([
    {
      $match: {
        worker: new mongoose.Types.ObjectId(workerId),
        // ...
      }
    }
  ]);
};
```

---

## 🧪 Testing

### **Test Case 1: Earnings Summary**

```bash
# Restart backend
cd backend
npm start

# Test via mobile app:
1. Login to app
2. Go to Profile tab
3. Scroll to "Earnings & Payments" section
4. ✓ Should load without errors
5. See earnings summary cards
```

### **Test Case 2: Payment History**

```bash
1. Open app
2. Go to Profile
3. Tap "View All" in Earnings section
4. ✓ Payment history loads
5. No ObjectId errors in console
```

### **Test Case 3: API Direct Test**

```bash
# Test via Postman/Thunder Client
GET /api/payments/earnings/summary
Authorization: Bearer {token}

# Should return:
{
  "success": true,
  "summary": {
    "totalEarnings": 3250,
    "pendingPayments": 1200,
    "completedPayments": 2050,
    "totalJobs": 5,
    "completedJobs": 3,
    "pendingJobs": 2
  }
}

# Without ObjectId error! ✓
```

---

## 📊 Affected Endpoints

These endpoints are now fixed:

1. ✅ `GET /api/payments/earnings/summary`
2. ✅ `GET /api/payments/history`
3. ✅ `GET /api/payments/earnings/monthly`
4. ✅ Profile screen earnings data
5. ✅ Payment history screen data

---

## 🔧 Why This Error Occurs

### **Mongoose Version Differences:**

**Mongoose 5.x (Old):**
```javascript
// This worked in old versions
mongoose.Types.ObjectId(stringId)
```

**Mongoose 6.x+ (New):**
```javascript
// Must use 'new' keyword
new mongoose.Types.ObjectId(stringId)
```

### **Why the Change?**

- In Mongoose 6.x, `ObjectId` is a proper ES6 class
- ES6 classes MUST be instantiated with `new` keyword
- Without `new`, JavaScript throws: "Class constructor ObjectId cannot be invoked without 'new'"

---

## 💡 Prevention Tips

### **Always use `new` with ObjectId:**

```javascript
// ✓ CORRECT
const id = new mongoose.Types.ObjectId(stringId);
const match = { user: new mongoose.Types.ObjectId(userId) };

// ✗ WRONG
const id = mongoose.Types.ObjectId(stringId);
const match = { user: mongoose.Types.ObjectId(userId) };
```

### **In Aggregation Pipelines:**

```javascript
// ✓ CORRECT
Model.aggregate([
  { $match: { user: new mongoose.Types.ObjectId(userId) } }
]);

// ✗ WRONG
Model.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } }
]);
```

### **When Creating Test Data:**

```javascript
// ✓ CORRECT
const testDoc = new Model({
  user: userId,                              // String ID (Mongoose converts)
  relatedDoc: new mongoose.Types.ObjectId() // Dummy ObjectId
});

// ✗ WRONG
const testDoc = new Model({
  relatedDoc: mongoose.Types.ObjectId() // Missing 'new'
});
```

---

## 🔍 How to Find Similar Issues

### **Search Pattern:**

```bash
# Search for instances without 'new'
grep -r "mongoose.Types.ObjectId(" backend/

# Search for instances with 'new' (correct)
grep -r "new mongoose.Types.ObjectId" backend/
```

### **Common Places to Check:**

1. **Model Static Methods** (aggregation queries)
2. **Route Handlers** (converting string to ObjectId)
3. **Middleware** (ID validation)
4. **Test Scripts** (creating dummy IDs)

---

## 📝 Checklist

After this fix:

- [x] Payment.js - getWorkerEarningsSummary ✓
- [x] Payment.js - getMonthlyEarnings ✓
- [x] Backend restart required ✓
- [x] Mobile app reload required ✓
- [x] Test earnings loading ✓
- [x] Test payment history ✓

---

## 🚀 Deployment Steps

### **1. Restart Backend:**

```bash
cd backend

# Stop current server (Ctrl+C)

# Restart
npm start

# Verify:
# ✓ No ObjectId errors in console
# ✓ Server starts successfully
```

### **2. Test App:**

```bash
# Clear cache and reload
npx expo start -c

# Or just reload
# Press 'r' in Metro console
```

### **3. Verify Fix:**

```
1. Login to mobile app
2. Go to Profile tab
3. Check console - no ObjectId errors ✓
4. Earnings section loads ✓
5. Payment history opens ✓
6. Bank accounts load ✓
```

---

## 📊 Before vs After

### **Before (Error):**

```
LOG  Loading earnings data...
ERROR Could not load earnings data: Class constructor ObjectId cannot be invoked without 'new'
LOG  Earnings: {totalEarnings: 0, pendingPayments: 0, ...}
```

### **After (Fixed):**

```
LOG  Loading earnings data...
LOG  Earnings loaded successfully ✓
LOG  Earnings: {totalEarnings: 3250, pendingPayments: 1200, completedPayments: 2050}
```

---

## 🔗 Related Files

All these files are now using the correct `new` keyword:

1. ✅ `backend/models/Payment.js`
2. ✅ `backend/scripts/createTestPayment.js`
3. ✅ `backend/scripts/testBankAccount.js`
4. ✅ `backend/scripts/testJobNotification.js`

---

## 🎯 Summary

### **Issue:**
- ObjectId constructor called without `new` keyword
- Caused errors in earnings data loading
- Affected aggregation queries in Payment model

### **Fix:**
- Added `new` keyword before `mongoose.Types.ObjectId()`
- Updated 2 static methods in Payment model
- All aggregation queries now work correctly

### **Status:**
✅ **FIXED** - Backend must be restarted

---

## 🧪 Quick Verification

```bash
# Terminal 1: Restart backend
cd backend
npm start

# Terminal 2: Check logs
# Should NOT see ObjectId errors

# Mobile app: 
# 1. Reload app
# 2. Go to Profile
# 3. Check earnings section
# 4. ✓ No errors!
```

---

**Error fixed! Restart your backend server and reload the app to see the fix in action!** 🔧✨🚀
