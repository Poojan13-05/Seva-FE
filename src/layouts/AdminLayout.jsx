import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { cn } from "@/lib/utils";

const AdminLayout = ({ adminData, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <AdminSidebar 
        adminData={adminData} 
        onLogout={onLogout} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Navbar */}
      <AdminNavbar 
        adminData={adminData} 
        onLogout={onLogout} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 pt-16",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
