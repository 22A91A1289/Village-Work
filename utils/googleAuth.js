import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Complete the authentication session on web
WebBrowser.maybeCompleteAuthSession();

/**
 * Google OAuth Configuration
 * 
 * IMPORTANT: You need to set up OAuth credentials in Google Cloud Console:
 * 1. Go to: https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable Google+ API
 * 4. Create OAuth 2.0 credentials
 * 5. Add your redirect URIs
 * 
 * For Expo apps:
 * - Development: exp://localhost:19000
 * - Production: Your app's scheme (e.g., myapp://google-auth)
 */

// Google OAuth Client IDs
// Replace these with your actual client IDs from Google Cloud Console
export const GOOGLE_CONFIG = {
  // Android Client ID (from Google Cloud Console)
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  
  // iOS Client ID (from Google Cloud Console)
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  
  // Web Client ID (from Google Cloud Console)
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  
  // Expo Client ID (can be same as web or create separate)
  expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
};

/**
 * Initialize Google Sign-In
 * @returns {Object} - Google authentication hooks and methods
 */
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CONFIG.expoClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId,
    androidClientId: GOOGLE_CONFIG.androidClientId,
    webClientId: GOOGLE_CONFIG.webClientId,
    scopes: ['profile', 'email'],
  });

  return { request, response, promptAsync };
};

/**
 * Get redirect URI for the app
 */
export const getRedirectUri = () => {
  return makeRedirectUri({
    scheme: 'myapp',
    path: 'google-auth',
  });
};

/**
 * Fetch user info from Google
 * @param {string} accessToken - Google access token
 * @returns {Promise<Object>} - User information from Google
 */
export const getUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    throw error;
  }
};

/**
 * Format Google user data for our backend
 * @param {Object} googleUser - Google user object
 * @returns {Object} - Formatted user data
 */
export const formatGoogleUser = (googleUser) => {
  return {
    name: googleUser.name || '',
    email: googleUser.email || '',
    googleId: googleUser.id || '',
    picture: googleUser.picture || '',
    verified: googleUser.verified_email || false,
  };
};

export default {
  GOOGLE_CONFIG,
  useGoogleAuth,
  getRedirectUri,
  getUserInfo,
  formatGoogleUser,
};
