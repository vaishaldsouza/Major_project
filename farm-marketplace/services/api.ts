import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

// Use your computer's LAN IP. Run `ipconfig` and use the IPv4 address for your
// active network adapter (the one your phone shares with your PC).
let BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.17.1.11:5000/api';

// Map localhost to emulator/LAN IP for mobile devices
if (Platform.OS !== 'web' && BASE_URL.includes('localhost')) {
  if (Platform.OS === 'android' && !Device.isDevice) {
    BASE_URL = BASE_URL.replace('localhost', '10.0.2.2');
  } else {
    // Default to the PC's active LAN/Wi-Fi IP (obtained from ipconfig)
    BASE_URL = BASE_URL.replace('localhost', '172.17.1.11');
  }
}

console.log('📡 API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.config?.method?.toUpperCase(), error.config?.url, error.response.data);
    } else if (error.request) {
      console.error('❌ No response. URL:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;