import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure this if you're running on a physical phone:
// In PowerShell (before `npm start` / `expo start`):
// $env:EXPO_PUBLIC_API_BASE_URL="http://<YOUR_PC_IP>:5001"
const ENV_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Production backend (Vercel)
const PRODUCTION_API_URL = 'https://village-work.vercel.app';

// Your computer's local IP address - use this for physical devices and Expo Go
const LOCAL_IP = '192.168.31.14';

// Default base URL:
// - ENV override: EXPO_PUBLIC_API_BASE_URL
// - Production build (APK): Vercel URL
// - Development: local IP (device) or localhost (simulator)
export const API_BASE_URL =
  ENV_BASE_URL ||
  (!__DEV__ ? PRODUCTION_API_URL : 
   (Platform.OS === 'android' || Platform.OS === 'ios') ? `http://${LOCAL_IP}:5001` : 
   'http://localhost:5001');

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

