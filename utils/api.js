// Helper to get local IP from Expo packager
// This ensures it works on any machine without hardcoding IPs
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getLocalIpAddress = () => {
  if (__DEV__) {
    try {
      // Try to get the host URI from Expo config
      const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
      
      if (hostUri) {
        // hostUri is usually in the format "192.168.x.x:8081"
        const address = hostUri.split(':')[0];
        return address;
      }
    } catch (e) {
      console.warn('Failed to detect local IP, falling back to localhost', e);
    }
  }
  return 'localhost'; // Fallback
};

// Production backend (Vercel)
const PRODUCTION_API_URL = 'https://village-work.vercel.app';

// Dynamic base URL calculation
const getBaseUrl = () => {
  // 1. If ENV var is set, use it (highest priority)
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // 2. If production build (APK/TestFlight), use production URL
  if (!__DEV__) {
    return PRODUCTION_API_URL;
  }

  // 3. Development: Use detected local IP
  const localIp = getLocalIpAddress();
  
  // For Android Simulator, localhost refers to the device itself, so we use 10.0.2.2
  // But since we are getting the packager IP, it usually returns the correct LAN IP (e.g. 192.168.x.x)
  // which works for both Android/iOS simulators and physical devices.
  return `http://${localIp}:5001`;
};

export const API_BASE_URL = getBaseUrl();

// Log the API URL for debugging
console.log('🌐 API Base URL:', API_BASE_URL);

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setAuth(token, user) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
    ['userRole', user?.role || 'worker'],
  ]);
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, 'userRole']);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 Using auth token: ${token.substring(0, 20)}...`);
    } else {
      console.warn('⚠️ Auth requested but no token found');
    }
  }

  console.log(`🌐 API Request: ${method} ${path}`);
  if (body) {
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  console.log(`📡 Response status: ${res.status} ${res.statusText}`);

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && (data.error || data.message)) ||
      `Request failed (${res.status})`;
    console.error(`❌ API Error: ${message}`);
    console.error('Response data:', data);
    
    // Check for "User not found" or other critical auth errors
    // distinct from just "Unauthorized" (which might mean just login needed)
    // But here we want to aggressively clear invalid state
    if (res.status === 401) {
      if (
        (typeof message === 'string' && message.includes('User not found')) ||
        message.includes('Token expired') ||
        message.includes('Invalid token')
      ) {
        console.warn('🔒 Critical Auth Error detected. Clearing session...');
        await clearAuth();
        // Since we don't have direct access to navigation here, 
        // the App needs to react to the cleared token (e.g. via Context listening to Storage)
        // or the caller of this request needs to handle the redirect.
      }
    }

    const error = new Error(message);
    error.response = { data, status: res.status };
    throw error;
  }

  console.log(`✅ API Success:`, data);
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

