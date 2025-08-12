// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { authService, tokenManager, adminDataManager } from '../services/authService';

// Login mutation hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // The mutation function
    mutationFn: authService.login,
    
    // ✅ IMPORTANT: Disable automatic retries for login
    retry: false,
    
    // What happens when login succeeds
    onSuccess: (data) => {
      console.log('✅ Login successful:', data);
      
      // Extract token and admin data from response
      const { accessToken, admin } = data.data;
      
      // Store token and admin data in localStorage FIRST
      tokenManager.setToken(accessToken);
      adminDataManager.setAdminData(admin);
      
      // Set the admin data in query cache
      queryClient.setQueryData(['auth', 'profile'], data);
      
      // Trigger a custom event to notify components of auth state change
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isAuthenticated: true, adminData: admin } 
      }));
    },
    
    // What happens when login fails
    onError: (error) => {
      console.error('❌ Login failed:', error);
      
      // Clear any existing auth data on login failure
      tokenManager.removeToken();
      adminDataManager.removeAdminData();
      
      // Clear auth queries from cache
      queryClient.removeQueries({ queryKey: ['auth'] });
      
      // Trigger auth state change event
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isAuthenticated: false, adminData: null } 
      }));
    },
  });
};

// Profile query hook - gets current user data
export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authService.getProfile,
    
    // ✅ IMPORTANT: Only run this query if user is authenticated
    enabled: tokenManager.isAuthenticated(),
    
    // ✅ IMPORTANT: Don't retry on authentication errors
    retry: (failureCount, error) => {
      // Never retry on 401 (unauthorized) or 403 (forbidden)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Only retry server errors (5xx) up to 2 times
      if (error?.response?.status >= 500) {
        return failureCount < 2;
      }
      return false;
    },
    
    // Don't refetch automatically to prevent loops
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    
    // Set initial data from localStorage if available
    initialData: () => {
      const adminData = adminDataManager.getAdminData();
      if (adminData && tokenManager.isAuthenticated()) {
        return {
          success: true,
          data: { admin: adminData }
        };
      }
      return undefined;
    },
    
    // Clear auth data if profile fetch fails with 401
    onError: (error) => {
      if (error?.response?.status === 401) {
        console.log('Profile fetch failed with 401 - clearing auth data');
        tokenManager.removeToken();
        adminDataManager.removeAdminData();
        
        // Trigger auth state change event
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { isAuthenticated: false, adminData: null } 
        }));
      }
    }
  });
};

// Logout mutation hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    
    // Don't retry logout
    retry: false,
    
    onSuccess: () => {
      console.log('✅ Logout successful');
      
      // Clear all auth data
      tokenManager.removeToken();
      adminDataManager.removeAdminData();
      
      // Clear all queries from cache
      queryClient.clear();
      
      // Trigger auth state change event
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isAuthenticated: false, adminData: null } 
      }));
      
      // Redirect to login page
      window.location.href = '/login';
    },
    
    onError: (error) => {
      console.error('❌ Logout error:', error);
      
      // Even if logout API fails, clear local data
      tokenManager.removeToken();
      adminDataManager.removeAdminData();
      queryClient.clear();
      
      // Trigger auth state change event
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isAuthenticated: false, adminData: null } 
      }));
      
      window.location.href = '/login';
    },
    
    // Always clear data regardless of success/failure
    onSettled: () => {
      tokenManager.removeToken();
      adminDataManager.removeAdminData();
      queryClient.clear();
    }
  });
};

// Custom hook to get authentication state with immediate updates
export const useAuthState = () => {
  const { data: profileData, isLoading, error } = useProfile();
  
  // State for immediate auth updates
  const [authState, setAuthState] = useState(() => {
    const hasToken = tokenManager.isAuthenticated();
    const storedAdminData = adminDataManager.getAdminData();
    return {
      hasToken,
      adminData: storedAdminData,
      isAuthenticated: hasToken && !!storedAdminData
    };
  });
  
  // Listen for auth state changes
  useEffect(() => {
    const handleAuthStateChange = (event) => {
      console.log('Auth state changed via event:', event.detail);
      const { isAuthenticated, adminData } = event.detail;
      setAuthState({
        hasToken: isAuthenticated,
        adminData,
        isAuthenticated
      });
    };
    
    window.addEventListener('authStateChanged', handleAuthStateChange);
    return () => window.removeEventListener('authStateChanged', handleAuthStateChange);
  }, []);
  
  // Use the most up-to-date admin data
  const adminData = profileData?.data?.admin || authState.adminData || adminDataManager.getAdminData();
  const hasToken = tokenManager.isAuthenticated();
  const isAuthenticated = hasToken && !!adminData;
  
  // Only show loading if we have a token but no admin data AND query is loading
  const shouldShowLoading = hasToken && !adminData && isLoading;
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('useAuthState:', {
      hasToken,
      hasStoredAdminData: !!adminDataManager.getAdminData(),
      hasProfileData: !!profileData?.data?.admin,
      hasAdminData: !!adminData,
      isAuthenticated,
      shouldShowLoading,
      adminRole: adminData?.role,
      isLoading,
      authStateFromEvent: authState
    });
  }
  
  return {
    isAuthenticated,
    adminData,
    isLoading: shouldShowLoading,
    error,
    isSuperAdmin: adminData?.role === 'super_admin',
    isAdmin: adminData?.role === 'admin',
  };
};

// Custom hook for protected operations (only for authenticated users)
export const useAuthenticatedQuery = (queryKey, queryFn, options = {}) => {
  const { isAuthenticated } = useAuthState();
  
  return useQuery({
    queryKey,
    queryFn,
    enabled: isAuthenticated && (options.enabled !== false),
    retry: false, // Don't retry protected queries
    ...options,
  });
};

// Custom hook for authenticated mutations
export const useAuthenticatedMutation = (mutationFn, options = {}) => {
  const { isAuthenticated } = useAuthState();
  
  return useMutation({
    mutationFn,
    retry: false, // Don't retry mutations
    ...options,
    // Add authentication check before mutation
    onMutate: async (variables) => {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      // Call original onMutate if provided
      if (options.onMutate) {
        return await options.onMutate(variables);
      }
    },
  });
};