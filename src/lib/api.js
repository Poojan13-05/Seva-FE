// src/lib/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('seva_access_token');
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // ✅ IMPORTANT: Don't attempt token refresh for login or refresh endpoints
    const isLoginRequest = originalRequest.url?.includes('/auth/login');
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');
    
    // If token expired and we haven't already tried to refresh
    // AND this is not a login or refresh request
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !isLoginRequest && 
        !isRefreshRequest) {
      
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshResponse = await api.post('/auth/refresh');
        const newToken = refreshResponse.data.data.accessToken;
        
        // Save new token
        localStorage.setItem('seva_access_token', newToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('seva_access_token');
        localStorage.removeItem('seva_admin_data');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For login failures, just let the error pass through
    if (isLoginRequest && error.response?.status === 401) {
      // Clear any existing auth data on login failure
      localStorage.removeItem('seva_access_token');
      localStorage.removeItem('seva_admin_data');
    }
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;