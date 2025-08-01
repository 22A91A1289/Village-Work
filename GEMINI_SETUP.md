# Gemini API Setup Guide

## Step 1: Get Your Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Configure API Key

Open `utils/aiQuizGenerator.js` and replace:

```javascript
const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```

With your actual API key:

```javascript
const API_KEY = 'YOUR_ACTUAL_API_KEY_FROM_GEMINI';
```

## Step 3: Test

1. Run the app
2. Navigate to Skill Assessment Screen
3. Select a category (Electrician, Plumber, etc.)
4. Start the quiz
5. Questions should be generated via Gemini API

## Notes

- **Free Tier**: Google Gemini API offers free tier suitable for development
- **Fallback**: If API key is not set or API fails, the app automatically uses hardcoded questions
- **Security**: For production, store API key in environment variables (not in code)

## Troubleshooting

### API Key Not Working?
- Check if API key is correctly copied (no extra spaces)
- Verify API key is active in Google Cloud Console
- Check internet connection

### Questions Not Generating?
- Check console logs for error messages
- App will automatically fallback to hardcoded questions
- Verify API key is set correctly

### Rate Limits?
- Free tier has rate limits
- If exceeded, app falls back to hardcoded questions automatically

## Future Improvements

- Store API key in `.env` file for better security
- Add question caching to reduce API calls
- Add difficulty levels
- Support for more categories

