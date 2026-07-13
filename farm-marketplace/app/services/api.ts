import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// REPLACE THIS WITH YOUR ACTUAL IP ADDRESS
// Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux) to find it
const YOUR_COMPUTER_IP = ' 172.17.3.100'; // CHANGE THIS TO YOUR IP

// Get the correct base URL based on the platform
const getBaseUrl = () => {
  // For Android emulator - use computer's IP
  if (Platform.OS === 'android') {
    return `http://${YOUR_COMPUTER_IP}:5000/api`;
  }
  
  // For iOS simulator
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  }
  
  // Default fallback
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();

console.log('📡 API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout
});

// Add token to requests if available
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response from server. URL:', error.config?.url);
      console.error('Make sure backend is running on port 5000');
      console.error('Check if firewall is blocking the connection');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;