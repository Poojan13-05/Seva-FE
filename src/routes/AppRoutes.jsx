import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import SuperAdminLayout from '@/layouts/SuperAdminLayout';
import AdminLayout from '@/layouts/AdminLayout';
import SuperAdminDashboard from '@/pages/SuperAdmin/SuperAdminDashboard';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import AdminManagement from '@/pages/SuperAdmin/AdminManagement';

const AppRoutes = ({ isLoggedIn, adminData, onLogout }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          !isLoggedIn ? (
            <LoginPage />
          ) : (
            <Navigate to={adminData?.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard'} replace />
          )
        } 
      />

      {/* Protected Routes - Super Admin */}
      <Route 
        path="/super-admin/*" 
        element={
          isLoggedIn && adminData?.role === 'super_admin' ? (
            <SuperAdminLayout adminData={adminData} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard adminData={adminData} />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route path="admins" element={<AdminManagement />} />
      </Route>

      {/* Protected Routes - Admin */}
      <Route 
        path="/admin/*" 
        element={
          isLoggedIn && adminData?.role === 'admin' ? (
            <AdminLayout adminData={adminData} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<AdminDashboard adminData={adminData} />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          isLoggedIn ? (
            <Navigate to={adminData?.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Catch all - redirect to appropriate dashboard or login */}
      <Route 
        path="*" 
        element={
          isLoggedIn ? (
            <Navigate to={adminData?.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;