# 🔐 Google Sign-In Setup Guide

## 🎯 Overview

Google Sign-In (OAuth 2.0) has been integrated into the WorkNex app, allowing users to:
- **Sign up** with their Google account (no password needed!)
- **Login** instantly using Google credentials
- **Auto-fill** profile information from Google
- **Secure authentication** with Google's trusted platform

## ✅ What's Implemented

### **Frontend (React Native/Expo)**
- ✅ `utils/googleAuth.js` - Google OAuth configuration & helpers
- ✅ `components/GoogleSignInButton.js` - Reusable Google Sign-In button
- ✅ Updated `LoginScreen` - Added "Continue with Google" button
- ✅ Updated `SignUpScreen` - Added "Sign up with Google" button
- ✅ Package dependencies installed (`expo-auth-session`, `expo-web-browser`, `expo-crypto`)

### **Backend (Node.js/Express)**
- ✅ Updated `models/User.js` - Added Google OAuth fields (`googleId`, `verified`, `profilePicture`)
- ✅ Updated `routes/auth.js` - Added `/api/auth/google-login` and `/api/auth/google-signup` endpoints
- ✅ JWT token generation for Google users
- ✅ Auto-create accounts for new Google users

## 📋 Setup Steps

### **Step 1: Google Cloud Console Setup**

You need to create OAuth credentials in Google Cloud Console:

#### **1.1: Go to Google Cloud Console**
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

#### **1.2: Create or Select a Project**
```
1. Click the project dropdown (top-left)
2. Click "NEW PROJECT"
3. Project name: "WorkNex" (or your app name)
4. Click "CREATE"
5. Wait for project creation
6. Select your new project
```

#### **1.3: Enable Google+ API**
```
1. Click "APIs & Services" → "Library" (left menu)
2. Search for: "Google+ API"
3. Click on "Google+ API"
4. Click "ENABLE"
5. Wait for API to enable
```

#### **1.4: Configure OAuth Consent Screen**
```
1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (for testing)
3. Click "CREATE"

4. Fill in App information:
   - App name: WorkNex
   - User support email: your-email@gmail.com
   - App logo: (optional)
   - Application home page: (optional)
   - Application privacy policy: (optional)
   - Application terms of service: (optional)
   - Authorized domains: (leave empty for now)
   - Developer contact: your-email@gmail.com

5. Click "SAVE AND CONTINUE"

6. Scopes:
   - Click "ADD OR REMOVE SCOPES"
   - Select:
     ☑ .../auth/userinfo.email
     ☑ .../auth/userinfo.profile
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

7. Test users (for testing phase):
   - Click "ADD USERS"
   - Add your Gmail address
   - Click "ADD"
   - Click "SAVE AND CONTINUE"

8. Summary:
   - Review your settings
   - Click "BACK TO DASHBOARD"
```

#### **1.5: Create OAuth 2.0 Credentials**

**For Android:**
```
1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: "Android"
4. Name: "WorkNex Android"
5. Package name: "com.yourcompany.myapp" (from app.json)
6. SHA-1 certificate fingerprint:
   
   For development (debug keystore):
   Run in terminal:
   
   Windows (PowerShell):
   keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
   
   Mac/Linux:
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   Copy the SHA-1 fingerprint

7. Click "CREATE"
8. Copy the "Client ID" → Save it!
```

**For iOS:**
```
1. Click "CREATE CREDENTIALS" → "OAuth client ID"
2. Application type: "iOS"
3. Name: "WorkNex iOS"
4. Bundle ID: "com.yourcompany.myapp" (from app.json)
5. Click "CREATE"
6. Copy the "Client ID" → Save it!
```

**For Web (Expo Go):**
```
1. Click "CREATE CREDENTIALS" → "OAuth client ID"
2. Application type: "Web application"
3. Name: "WorkNex Expo"
4. Authorized JavaScript origins:
   - http://localhost
   - http://localhost:19006

5. Authorized redirect URIs:
   - http://localhost:19006
   - https://auth.expo.io/@your-expo-username/myapp

6. Click "CREATE"
7. Copy the "Client ID" → Save it!
```

### **Step 2: Configure Your App**

#### **2.1: Update `app.json` (if using Expo)**
```json
{
  "expo": {
    "name": "WorkNex",
    "slug": "myapp",
    "scheme": "myapp",
    "android": {
      "package": "com.yourcompany.myapp",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.myapp",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

#### **2.2: Update `utils/googleAuth.js`**

Replace the placeholder Client IDs with your actual ones:

```javascript
export const GOOGLE_CONFIG = {
  // Replace these with your actual Client IDs from Google Cloud Console
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
};
```

**Example:**
```javascript
export const GOOGLE_CONFIG = {
  androidClientId: '123456789-abc123.apps.googleusercontent.com',
  iosClientId: '123456789-xyz789.apps.googleusercontent.com',
  webClientId: '123456789-web123.apps.googleusercontent.com',
  expoClientId: '123456789-web123.apps.googleusercontent.com', // Same as web for Expo
};
```

### **Step 3: Install Dependencies**

```bash
# Navigate to your app directory
cd "c:\React native\myapp"

# Install required packages
npm install

# Or if using Expo
expo install expo-auth-session expo-web-browser expo-crypto
```

### **Step 4: Restart Backend Server**

```bash
# Navigate to backend directory
cd backend

# Restart server
npm run dev
```

The backend will now handle Google OAuth requests!

### **Step 5: Test Google Sign-In**

#### **On Android Emulator:**
```
1. Start backend server: cd backend && npm run dev
2. Start Expo: cd .. && expo start
3. Press 'a' to open Android emulator
4. Navigate to Login screen
5. Tap "Continue with Google"
6. Select your Google account
7. Grant permissions
8. ✅ Should login successfully!
```

#### **On iOS Simulator:**
```
1. Start backend server: cd backend && npm run dev
2. Start Expo: cd .. && expo start
3. Press 'i' to open iOS simulator
4. Navigate to Login screen
5. Tap "Continue with Google"
6. Select your Google account
7. Grant permissions
8. ✅ Should login successfully!
```

#### **On Physical Device:**
```
1. Ensure device is on same WiFi as dev machine
2. Start backend server: cd backend && npm run dev
3. Start Expo: expo start
4. Scan QR code with Expo Go app
5. Navigate to Login screen
6. Tap "Continue with Google"
7. Select your Google account
8. Grant permissions
9. ✅ Should login successfully!
```

## 🔍 How It Works

### **User Flow:**

```
1. User taps "Continue with Google"
   ↓
2. GoogleSignInButton opens Google OAuth popup
   ↓
3. User selects Google account & grants permissions
   ↓
4. Google returns:
   - accessToken
   - User info (name, email, picture, googleId)
   ↓
5. App sends data to backend:
   POST /api/auth/google-login (existing user)
   OR
   POST /api/auth/google-signup (new user)
   ↓
6. Backend:
   - Checks if user exists
   - Creates new user OR updates existing
   - Generates JWT token
   ↓
7. Frontend:
   - Saves authToken to AsyncStorage
   - Saves user data to AsyncStorage
   - Navigates to WorkerTabNavigator
   ↓
8. ✅ User is logged in!
```

### **Database Structure:**

**User Model (MongoDB):**
```javascript
{
  _id: ObjectId,
  name: "John Doe",                    // From Google
  email: "john@gmail.com",             // From Google
  googleId: "1234567890",              // From Google (unique)
  verified: true,                      // From Google
  profilePicture: "https://...",       // From Google
  phone: "",                           // Updated later by user
  password: "random_hash",             // Random (not used for Google users)
  role: "worker",                      // Always worker for mobile
  skillLevel: "new",                   // Default
  quizPassed: null,                    // Not attempted
  quizScore: null,                     // Not attempted
  createdAt: Date,
  updatedAt: Date
}
```

### **Backend API Endpoints:**

#### **1. POST `/api/auth/google-login`**
**Purpose:** Login existing user with Google

**Request:**
```json
{
  "googleId": "1234567890",
  "email": "john@gmail.com",
  "name": "John Doe",
  "picture": "https://...",
  "verified": true
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@gmail.com",
    "role": "worker",
    "skillLevel": "new",
    "quizPassed": null,
    "quizScore": null,
    "profilePicture": "https://..."
  }
}
```

**Response (User Not Found):**
```json
{
  "message": "Account not found. Please sign up first.",
  "requiresSignup": true
}
```

#### **2. POST `/api/auth/google-signup`**
**Purpose:** Create new user with Google OR login if already exists

**Request:**
```json
{
  "googleId": "1234567890",
  "email": "john@gmail.com",
  "name": "John Doe",
  "picture": "https://...",
  "verified": true,
  "role": "worker"
}
```

**Response (New User Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@gmail.com",
    "role": "worker",
    "skillLevel": "new",
    "quizPassed": null,
    "quizScore": null,
    "profilePicture": "https://..."
  },
  "message": "Account created successfully"
}
```

**Response (Existing User):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... },
  "message": "Logged in successfully"
}
```

## 🎨 UI Components

### **GoogleSignInButton**

**Usage:**
```javascript
import GoogleSignInButton from '../components/GoogleSignInButton';

<GoogleSignInButton 
  onSuccess={(response) => {
    console.log('Success:', response);
    // Navigate to home screen
  }}
  onError={(error) => {
    console.error('Error:', error);
    // Show error message
  }}
  isSignUp={false} // true for sign up, false for login
/>
```

**Props:**
- `onSuccess` (function): Called when sign-in succeeds
- `onError` (function): Called when sign-in fails
- `isSignUp` (boolean): true = "Sign up with Google", false = "Continue with Google"

### **Button States:**

**Loading:**
```
┌───────────────────────────┐
│   🔄  (spinner)           │
└───────────────────────────┘
```

**Ready:**
```
┌───────────────────────────┐
│   G   Continue with Google│
└───────────────────────────┘
```

## 🐛 Troubleshooting

### **Problem 1: "Google sign-in not configured"**
**Solution:**
- Check that you've replaced placeholder Client IDs in `utils/googleAuth.js`
- Ensure all 4 Client IDs are filled (Android, iOS, Web, Expo)

### **Problem 2: "API not enabled"**
**Solution:**
- Go to Google Cloud Console
- Enable "Google+ API"
- Wait 5-10 minutes for propagation

### **Problem 3: "Invalid redirect URI"**
**Solution:**
- Go to Google Cloud Console → Credentials
- Edit your OAuth client
- Add these redirect URIs:
  - `http://localhost:19006`
  - `https://auth.expo.io/@your-username/myapp`
  - Your app's custom scheme (e.g., `myapp://google-auth`)

### **Problem 4: "Access blocked: App not verified"**
**Solution:**
- This is normal during development
- Add your Gmail as a "Test user" in OAuth consent screen
- For production, submit app for Google verification

### **Problem 5: "Network request failed"**
**Solution:**
- Ensure backend server is running (`npm run dev`)
- Check API_BASE_URL in `utils/api.js`
- Verify device/emulator is on same WiFi as dev machine
- Check firewall isn't blocking connections

### **Problem 6: "Email already exists"**
**Solution:**
- User already has an account with email/password
- They should use regular login first
- OR backend can merge accounts (link Google to existing account)

## 🔐 Security Best Practices

### **1. Client IDs Are Public**
- ✅ Client IDs can be in source code (they're not secret!)
- ❌ **NEVER** commit Client Secrets to source control
- ✅ Use environment variables for sensitive data

### **2. Backend Validation**
- ✅ Always validate Google tokens on backend
- ✅ Don't trust frontend data blindly
- ✅ Use JWT for session management

### **3. HTTPS in Production**
- ✅ Use HTTPS for all API calls in production
- ✅ Configure proper CORS policies
- ✅ Use secure cookies for web

### **4. Token Expiration**
- ✅ Set reasonable JWT expiration (30 days)
- ✅ Implement refresh token flow
- ✅ Handle token expiration gracefully

## 📊 Benefits of Google Sign-In

### **For Users:**
- ✅ **No passwords to remember** - Use Google account
- ✅ **Faster signup** - Just 2 taps!
- ✅ **Auto-fill info** - Name, email, photo pre-filled
- ✅ **Trusted security** - Google's authentication
- ✅ **One-tap login** - Quick return visits

### **For Developers:**
- ✅ **Less password management** - Google handles it
- ✅ **Verified emails** - Google emails are verified
- ✅ **Better UX** - Smooth authentication flow
- ✅ **Reduced friction** - More signups!
- ✅ **Profile photos** - Auto-import from Google

### **For Business:**
- ✅ **Higher conversion** - Easier signup = more users
- ✅ **Better data quality** - Real names, verified emails
- ✅ **Reduced support** - Less "forgot password" tickets
- ✅ **Trust signal** - "Sign in with Google" is familiar
- ✅ **Professional appearance** - Modern authentication

## 📝 Testing Checklist

### **Before Going Live:**

- [ ] ✅ All 4 Client IDs configured in `googleAuth.js`
- [ ] ✅ Google+ API enabled in Cloud Console
- [ ] ✅ OAuth consent screen completed
- [ ] ✅ Test users added (for testing phase)
- [ ] ✅ Redirect URIs configured correctly
- [ ] ✅ Backend endpoints tested (`/api/auth/google-login`, `/api/auth/google-signup`)
- [ ] ✅ Database has Google fields (`googleId`, `verified`, `profilePicture`)
- [ ] ✅ JWT token generation works
- [ ] ✅ Frontend stores token correctly
- [ ] ✅ Navigation after login works
- [ ] ✅ Tested on Android emulator/device
- [ ] ✅ Tested on iOS simulator/device
- [ ] ✅ Error handling implemented
- [ ] ✅ Loading states work properly
- [ ] ✅ Cancel flow handled gracefully

### **Production Deployment:**

- [ ] ✅ Submit app for Google verification (if needed)
- [ ] ✅ Update OAuth consent screen to "Published"
- [ ] ✅ Add production redirect URIs
- [ ] ✅ Use HTTPS for all API calls
- [ ] ✅ Update CORS policies
- [ ] ✅ Monitor error logs
- [ ] ✅ Test with real users

## 🚀 Next Steps

### **Optional Enhancements:**

1. **Apple Sign-In**
   - Add "Sign in with Apple" for iOS users
   - Required for App Store if you have Google Sign-In

2. **Facebook Login**
   - Add Facebook OAuth for social users
   - Similar implementation to Google

3. **Account Linking**
   - Allow users to link Google account to existing email/password account
   - Merge duplicate accounts

4. **Profile Sync**
   - Auto-update user's profile photo from Google
   - Refresh Google token periodically

5. **Analytics**
   - Track Google sign-in conversion rate
   - Monitor authentication errors
   - A/B test button placement

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Cloud Console settings
3. Check backend logs for errors
4. Verify network connectivity
5. Test with a different Google account

## 📚 Resources

- **Google OAuth Documentation:** https://developers.google.com/identity/protocols/oauth2
- **Expo Auth Session:** https://docs.expo.dev/versions/latest/sdk/auth-session/
- **Google Cloud Console:** https://console.cloud.google.com/
- **JWT.io:** https://jwt.io/ (debug JWT tokens)

---

**Status:** ✅ Fully Implemented - Ready for testing!  
**Last Updated:** January 27, 2026  
**Version:** 1.0
