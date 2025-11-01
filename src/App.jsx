import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { useAuthState, useLogout } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';

function App() {
  // Get authentication state from our custom hook
  const { isAuthenticated, adminData, isLoading } = useAuthState();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen geometric-texture-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes
        isLoggedIn={isAuthenticated}
        adminData={adminData}
        onLogout={handleLogout}
      />
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
      />
    </BrowserRouter>
  );
}

export default App;