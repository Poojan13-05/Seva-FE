// src/services/authService.js
import api from '../lib/api';

// Authentication service - handles all auth-related API calls
export const authService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // ✅ IMPORTANT: Handle login errors properly to prevent loops
      console.error('Login error:', error);
      
      // Clear any existing auth data on login error
      tokenManager.removeToken();
      adminDataManager.removeAdminData();
      
      // Throw the original error for proper handling by React Query
      throw error.response?.data || error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // ✅ IMPORTANT: Clear auth data on profile fetch errors
      if (error.response?.status === 401) {
        console.log('Profile fetch failed with 401 - clearing auth data in service');
        tokenManager.removeToken();
        adminDataManager.removeAdminData();
      }
      throw error.response?.data || error;
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Token management utilities
export const tokenManager = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('seva_access_token');
  },

  // Set token in localStorage
  setToken: (token) => {
    localStorage.setItem('seva_access_token', token);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('seva_access_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('seva_access_token');
  },
};

// Admin data management
export const adminDataManager = {
  // Get admin data from localStorage
  getAdminData: () => {
    const data = localStorage.getItem('seva_admin_data');
    return data ? JSON.parse(data) : null;
  },

  // Set admin data in localStorage
  setAdminData: (adminData) => {
    localStorage.setItem('seva_admin_data', JSON.stringify(adminData));
  },

  // Remove admin data from localStorage
  removeAdminData: () => {
    localStorage.removeItem('seva_admin_data');
  },

  // Get admin role
  getAdminRole: () => {
    const adminData = adminDataManager.getAdminData();
    return adminData?.role || null;
  },

  // Check if user is super admin
  isSuperAdmin: () => {
    return adminDataManager.getAdminRole() === 'super_admin';
  },

  // Check if user is admin
  isAdmin: () => {
    return adminDataManager.getAdminRole() === 'admin';
  },
};