// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.jsx'

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered stale after 5 minutes (more conservative)
      staleTime: 5 * 60 * 1000,
      // Time before inactive queries are garbage collected (5 minutes)
      gcTime: 5 * 60 * 1000,
      // ✅ IMPORTANT: Conservative retry for queries
      retry: (failureCount, error) => {
        // Never retry on client errors (4xx) - especially important for auth
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Only retry server errors (5xx) twice
        if (error?.response?.status >= 500) {
          return failureCount < 2;
        }
        return false;
      },
      // Less aggressive refetching to prevent auth loops
      refetchOnWindowFocus: false,
      // Refetch when coming back online
      refetchOnReconnect: false,
      // Don't automatically refetch on mount to prevent auth loops
      refetchOnMount: false,
    },
    mutations: {
      // ✅ IMPORTANT: Never retry mutations (especially login)
      retry: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Show React Query dev tools in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  </StrictMode>,
)