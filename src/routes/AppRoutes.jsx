import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import SuperAdminLayout from '@/layouts/SuperAdminLayout';
import AdminLayout from '@/layouts/AdminLayout';
import CustomerManagement from '@/pages/Admin/CustomerManagement';
import LifeInsuranceManagement from '@/pages/Admin/LifeInsuranceManagement';
import AdminManagement from '@/pages/SuperAdmin/AdminManagement';
import DeletedCustomers from '@/pages/SuperAdmin/DeletedCustomers';
import DeletedLifeInsurancePolicies from '@/pages/SuperAdmin/DeletedLifeInsurancePolicies';


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
            <Navigate to={adminData?.role === 'super_admin' ? '/super-admin/admins' : '/admin/customers'} replace />
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
        <Route path="" element={<Navigate to="admins" replace />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="deleted-customers" element={<DeletedCustomers/>} />
        <Route path="deleted-life-insurance" element={<DeletedLifeInsurancePolicies/>} />
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
        <Route path="" element={<Navigate to="customers" replace />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="life-insurance" element={<LifeInsuranceManagement />} />
      </Route>

      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          isLoggedIn ? (
            <Navigate to={adminData?.role === 'super_admin' ? '/super-admin/admins' : '/admin/customers'} replace />
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
            <Navigate to={adminData?.role === 'super_admin' ? '/super-admin/admins' : '/admin/customers'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;