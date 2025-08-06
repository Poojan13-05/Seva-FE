// src/stores/authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // This will be replaced with actual API call later
          const mockResponse = {
            success: true,
            data: {
              admin: {
                id: '1',
                email: credentials.email,
                name: 'John Doe',
                role: credentials.email.includes('super') ? 'super_admin' : 'admin',
                phone: '+1234567890',
                lastLogin: new Date().toISOString(),
                createdAt: new Date().toISOString()
              },
              accessToken: 'mock-jwt-token-' + Date.now(),
              tokenType: 'Bearer'
            }
          }

          if (mockResponse.success) {
            set({
              admin: mockResponse.data.admin,
              accessToken: mockResponse.data.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
            return { success: true }
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Login failed'
          })
          return { success: false, error: error.message }
        }
      },

      logout: () => {
        set({
          admin: null,
          accessToken: null,
          isAuthenticated: false,
          error: null
        })
      },

      refreshToken: async () => {
        const { accessToken } = get()
        if (!accessToken) return false

        try {
          // This will be replaced with actual API call later
          const mockResponse = {
            success: true,
            data: {
              accessToken: 'refreshed-token-' + Date.now(),
              tokenType: 'Bearer'
            }
          }

          if (mockResponse.success) {
            set({
              accessToken: mockResponse.data.accessToken
            })
            return true
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          // If refresh fails, logout user
          get().logout()
          return false
        }
      },

      // Helper getters
      isAdmin: () => {
        const { admin } = get()
        return admin?.role === 'admin'
      },

      isSuperAdmin: () => {
        const { admin } = get()
        return admin?.role === 'super_admin'
      },

      getAuthHeader: () => {
        const { accessToken } = get()
        return accessToken ? `Bearer ${accessToken}` : null
      }
    }),
    {
      name: 'seva-auth-storage',
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore