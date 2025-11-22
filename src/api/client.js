import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import Storage from '../utils/storage';
import { ASYNC_STORAGE_KEYS } from '../config/constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = await Storage.get(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      await Storage.remove(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
      await Storage.remove(ASYNC_STORAGE_KEYS.USER_DATA);
      // You can trigger logout here
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;