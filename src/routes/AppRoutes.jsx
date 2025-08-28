import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import SuperAdminLayout from '@/layouts/SuperAdminLayout';
import AdminLayout from '@/layouts/AdminLayout';
import SuperAdminDashboard from '@/pages/SuperAdmin/SuperAdminDashboard';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import CustomerManagement from '@/pages/Admin/CustomerManagement';
import LifeInsuranceManagement from '@/pages/Admin/LifeInsuranceManagement';
import AdminManagement from '@/pages/SuperAdmin/AdminManagement';
import DeletedCustomers from '@/pages/SuperAdmin/DeletedCustomers';
import DeletedLifeInsurancePolicies from '@/pages/SuperAdmin/DeletedLifeInsurancePolicies';
import ComingSoon from '@/components/admin/ComingSoon';
import { FileText, UserCheck, BarChart3, Database, Bell, Settings, HelpCircle } from 'lucide-react';


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
        <Route path="dashboard" element={<AdminDashboard adminData={adminData} />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="life-insurance" element={<LifeInsuranceManagement />} />
        <Route 
          path="applications" 
          element={
            <ComingSoon 
              title="Applications" 
              description="Manage and track all customer applications, submissions, and processing status."
              icon={FileText}
            />
          } 
        />
        <Route 
          path="consultants" 
          element={
            <ComingSoon 
              title="Consultants" 
              description="Manage consultant profiles, assignments, and performance tracking."
              icon={UserCheck}
            />
          } 
        />
        <Route 
          path="reports" 
          element={
            <ComingSoon 
              title="Reports" 
              description="Generate detailed analytics, performance reports, and business insights."
              icon={BarChart3}
            />
          } 
        />
        <Route 
          path="database" 
          element={
            <ComingSoon 
              title="Database" 
              description="Advanced data management, backup, and system configuration tools."
              icon={Database}
            />
          } 
        />
        <Route 
          path="notifications" 
          element={
            <ComingSoon 
              title="Notifications" 
              description="Manage system notifications, alerts, and communication preferences."
              icon={Bell}
            />
          } 
        />
        <Route 
          path="settings" 
          element={
            <ComingSoon 
              title="Settings" 
              description="Configure system settings, user preferences, and security options."
              icon={Settings}
            />
          } 
        />
        <Route 
          path="help" 
          element={
            <ComingSoon 
              title="Help" 
              description="Access documentation, tutorials, and support resources."
              icon={HelpCircle}
            />
          } 
        />
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