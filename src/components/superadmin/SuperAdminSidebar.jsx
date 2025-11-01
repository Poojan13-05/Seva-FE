import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  UserCheck,
  Database,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Globe,
  Trash2
} from 'lucide-react';

const sidebarItems = [
  // {
  //   title: "Dashboard",
  //   icon: LayoutDashboard,
  //   href: "/superadmin/dashboard",
  //   color: "text-white"
  // },
  {
    title: "Admin Management",
    icon: Shield,
    href: "/super-admin/admins",
    color: "text-white"
  },
  {
    title: "Deleted Customers",
    icon: Trash2,
    href: "/super-admin/deleted-customers",
    color: "text-white"
  },
  {
    title: "Deleted Life Insurance",
    icon: FileText,
    href: "/super-admin/deleted-life-insurance",
    color: "text-white"
  },
  {
    title: "Deleted Health Insurance",
    icon: FileText,
    href: "/super-admin/deleted-health-insurance",
    color: "text-white"
  },
  // {
  //   title: "Users",
  //   icon: Users,
  //   href: "/superadmin/users",
  //   color: "text-white"
  // },
  // {
  //   title: "Applications",
  //   icon: FileText,
  //   href: "/superadmin/applications",
  //   color: "text-white"
  // },
  // {
  //   title: "Consultants",
  //   icon: UserCheck,
  //   href: "/superadmin/consultants",
  //   color: "text-white"
  // },
  // {
  //   title: "System Activity",
  //   icon: Activity,
  //   href: "/superadmin/activity",
  //   color: "text-white"
  // },
  // {
  //   title: "Analytics",
  //   icon: BarChart3,
  //   href: "/superadmin/analytics",
  //   color: "text-white"
  // },
  // {
  //   title: "Database",
  //   icon: Database,
  //   href: "/superadmin/database",
  //   color: "text-white"
  // }
];

const bottomItems = [
  // {
  //   title: "System Settings",
  //   icon: Settings,
  //   href: "/superadmin/settings",
  //   color: "text-white"
  // },
  // {
  //   title: "Global Config",
  //   icon: Globe,
  //   href: "/superadmin/config",
  //   color: "text-white"
  // },
  // {
  //   title: "Help & Support",
  //   icon: HelpCircle,
  //   href: "/superadmin/help",
  //   color: "text-white"
  // }
];

const SuperAdminSidebar = ({ adminData, onLogout, collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-white/10 backdrop-blur-md border-r border-white/20 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">SEVA Consultancy</h2>
              <p className="text-gray-400 text-xs">Super Admin</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm p-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Admin Info */}
      {!collapsed && (
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <span className="text-white font-semibold text-sm">
                {adminData?.name ? adminData.name.charAt(0).toUpperCase() : 'S'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {adminData?.name || 'Super Admin'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {adminData?.email || 'superadmin@sevaconsultancy.com'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "text-gray-300 hover:text-white hover:bg-white/10 ",
                collapsed && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5", item.color)} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
        
        {/* <Separator className="my-4 bg-white/20" />
        
        {bottomItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "text-gray-300 hover:text-white hover:bg-white/10 ",
                collapsed && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5", item.color)} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })} */}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/20">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 backdrop-blur-sm",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
