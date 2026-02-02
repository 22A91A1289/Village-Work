# 🤖 AI Quiz Generation Setup Guide

## 📋 Overview

Your quiz system now supports **AI-powered question generation** using Google's Gemini API!

### ✨ Benefits:
- ✅ **Unlimited Questions**: Generate fresh questions every time
- ✅ **Multi-Language**: Automatic Telugu, Hindi, and English support
- ✅ **No Repetition**: Every quiz attempt gets new questions
- ✅ **Free Tier**: Generous free limits (60 requests/min, 1500/day)
- ✅ **Dynamic Content**: Questions adapt to the skill category
- ✅ **Fallback Ready**: Uses static questions if AI fails

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Free Gemini API Key

1. **Visit Google AI Studio:**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Sign In** with your Google account

3. **Click "Create API Key"** button

4. **Copy the API key** (looks like: `AIzaSy...`)

### Step 2: Configure API Key

1. **Open file:** `config/gemini.config.js`

2. **Replace the placeholder:**
   ```javascript
   // Before:
   export const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   
   // After:
   export const GEMINI_API_KEY = 'AIzaSyC...your-actual-key...';
   ```

3. **Save the file**

### Step 3: Test It!

1. **Reload app** (Press "R" twice in Expo)
2. **Select any technical category**
3. **Click "Take Test"**
4. **Choose language** (Telugu/Hindi/English)
5. **Watch the magic! 🎉**

You'll see:
```
🤖 Generating quiz questions...
Creating fresh questions in తెలుగు
```

---

## 🎯 How It Works

### Architecture Flow:

```
User selects language
       ↓
Quiz attempts AI generation
       ↓
┌──────────────────┐
│ Gemini API Key?  │
└─────┬────────────┘
      │
   Yes│         No
      ↓          ↓
 [Generate AI] [Fallback]
   Fresh Q's    Static Q's
   Any Lang     Limited
      ↓          ↓
 Display questions
```

### Language Support:

When you select **Telugu (తెలుగు)**:
- AI generates questions entirely in Telugu
- Options in Telugu
- Explanations in Telugu

When you select **Hindi (हिंदी)**:
- AI generates questions entirely in Hindi
- Options in Hindi
- Explanations in Hindi

When you select **English**:
- AI generates professional English questions

---

## 📊 Current Status

### ✅ Implemented Features:

1. **AI Integration Ready**
   - Gemini API configured
   - Timeout handling (8 seconds)
   - Automatic fallback

2. **Multi-Language Prompts**
   - Telugu prompt templates
   - Hindi prompt templates
   - English prompt templates

3. **Smart Fallback System**
   - 50+ static questions per category
   - Telugu translations for major categories
   - Automatic reset when pool exhausted

4. **Categories with Telugu Fallback:**
   - ⚡ Electrician (5 questions)
   - 💧 Plumber (5 questions)
   - 🔨 Carpenter (5 questions)
   - 🔧 Mechanic (5 questions)
   - 📄 Data Entry (10 questions)

---

## 🔧 Configuration Options

### File: `config/gemini.config.js`

```javascript
// Enable/Disable AI generation
export const USE_AI_GENERATION = true; // Set false to use only static

// API Configuration
export const GEMINI_CONFIG = {
  model: 'gemini-pro',    // AI model to use
  timeout: 8000,          // 8 seconds timeout
  maxRetries: 1,          // Retry once on failure
};
```

### Toggle Features:

**Want to temporarily use only static questions?**
```javascript
export const USE_AI_GENERATION = false;
```

**Want longer timeout for slow networks?**
```javascript
export const GEMINI_CONFIG = {
  timeout: 15000, // 15 seconds
};
```

---

## 🎓 Testing Guide

### Test Case 1: AI Generation (Telugu)
1. Configure API key
2. Select "Mechanic" category
3. Click "Take Test"
4. Choose "తెలుగు (Telugu)"
5. Expected: Fresh AI-generated Telugu questions

### Test Case 2: Fallback Mode
1. Set `USE_AI_GENERATION = false`
2. Select "Data Entry" category
3. Click "Take Test"
4. Choose "తెలుగు (Telugu)"
5. Expected: Static Telugu questions (instant load)

### Test Case 3: Multiple Attempts
1. Complete a quiz
2. Attempt same category again
3. Expected: Different questions (if AI enabled)

---

## 📈 API Limits (Free Tier)

Google Gemini Free Tier:
- ✅ **60 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **No credit card required**

### For Your App:
- Each quiz = 1 API call
- 1,500 quizzes per day = **MORE than enough**
- Average: 50-100 quizzes/day expected

---

## ⚠️ Troubleshooting

### Problem: "API key not configured"
**Solution:** 
- Check `config/gemini.config.js`
- Ensure key is pasted correctly
- No extra spaces or quotes

### Problem: Questions in English when Telugu selected
**Solution:**
- Check if `USE_AI_GENERATION = true`
- If false, fallback questions used
- Not all categories have Telugu fallback yet

### Problem: Slow loading
**Cause:** AI generation takes 3-8 seconds
**Solution:** Normal behavior
- First load: AI generates (5-8 sec)
- Fallback: Instant load
- Shows loading indicator

### Problem: API quota exceeded
**Cause:** 1,500 requests/day limit reached
**Solution:** 
- App automatically switches to fallback
- Wait 24 hours for quota reset
- Or upgrade to paid tier (optional)

---

## 🎯 What Happens Without API Key?

**Don't want to setup API key? No problem!**

The app works perfectly with static questions:
- ✅ 50+ questions per category
- ✅ Telugu translations for major skills
- ✅ Instant loading (no delays)
- ⚠️ Limited pool (questions repeat after 10+ attempts)

---

## 🚀 Next Steps

### Option 1: Enable AI (Recommended)
1. Follow setup steps above
2. Get unlimited dynamic questions
3. Better user experience for retests

### Option 2: Keep Static Only
1. Set `USE_AI_GENERATION = false`
2. App works immediately
3. No external dependencies

### Option 3: Hybrid (Current Default)
1. Try AI first
2. Fallback to static on failure
3. Best of both worlds!

---

## 📞 Support

**API Key Issues:**
- Visit: https://aistudio.google.com/app/apikey
- Google AI Studio docs: https://ai.google.dev/

**App Issues:**
- Check console logs for errors
- Verify internet connection
- Test with static questions first

---

## 📝 Summary

✅ **AI Integration**: Ready and configured
✅ **Multi-Language**: Telugu, Hindi, English
✅ **Fallback System**: 50+ static questions
✅ **Free to Use**: No costs (free tier)
✅ **Easy Setup**: 5 minutes to configure

**Status:** 
- Without API key: Works with static questions ✅
- With API key: Unlimited AI questions 🚀

**Next:** Add your Gemini API key to unlock unlimited questions!
