import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '@/components/superadmin/SuperAdminSidebar';
import SuperAdminNavbar from '@/components/superadmin/SuperAdminNavbar';
import { cn } from "@/lib/utils";

const SuperAdminLayout = ({ adminData, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen geometric-texture-bg">
      {/* Sidebar */}
      <SuperAdminSidebar 
        adminData={adminData} 
        onLogout={onLogout} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Navbar */}
      <SuperAdminNavbar 
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

export default SuperAdminLayout;
