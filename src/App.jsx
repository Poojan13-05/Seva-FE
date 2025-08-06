import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const handleLogin = (userData) => {
    setAdminData(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminData(null);
  };

  return (
    <BrowserRouter>
      <AppRoutes 
        isLoggedIn={isLoggedIn}
        adminData={adminData}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;