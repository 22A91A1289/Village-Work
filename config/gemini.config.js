/**
 * Gemini API Configuration
 * Get your free API key from: https://makersuite.google.com/app/apikey
 * or https://aistudio.google.com/app/apikey
 */

// ⚠️ IMPORTANT: Replace with your actual Gemini API key
export const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

// API Configuration
export const GEMINI_CONFIG = {
  model: 'gemini-pro', // Model to use
  timeout: 8000, // Timeout in milliseconds
  maxRetries: 1, // Number of retries on failure
};

// Feature flags
export const USE_AI_GENERATION = true; // Set to false to use only fallback questions

/**
 * Instructions to get API key:
 * 
 * 1. Visit: https://aistudio.google.com/app/apikey
 * 2. Sign in with your Google account
 * 3. Click "Create API Key"
 * 4. Copy the key and paste it above
 * 5. The API is FREE with generous limits
 * 
 * Free tier limits:
 * - 60 requests per minute
 * - 1500 requests per day
 * - More than enough for quiz generation!
 */
