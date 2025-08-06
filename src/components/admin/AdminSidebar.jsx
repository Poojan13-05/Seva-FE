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
  ChevronRight
} from 'lucide-react';

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    color: "text-blue-400"
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    color: "text-green-400"
  },
  {
    title: "Applications",
    icon: FileText,
    href: "/admin/applications",
    color: "text-orange-400"
  },
  {
    title: "Consultants",
    icon: UserCheck,
    href: "/admin/consultants",
    color: "text-purple-400"
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/admin/reports",
    color: "text-pink-400"
  },
  {
    title: "Database",
    icon: Database,
    href: "/admin/database",
    color: "text-cyan-400"
  }
];

const bottomItems = [
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
    color: "text-yellow-400"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-400"
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/admin/help",
    color: "text-indigo-400"
  }
];

const AdminSidebar = ({ adminData, onLogout, collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">SEVA Consultancy</h2>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Admin Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {adminData?.name ? adminData.name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {adminData?.name || 'Admin User'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {adminData?.email || 'admin@sevaconsultancy.com'}
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
                isActive 
                  ? "bg-gray-800 text-white border border-gray-700" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800",
                collapsed && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-blue-400" : item.color)} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
        
        <Separator className="my-4 bg-gray-800" />
        
        {bottomItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-gray-800 text-white border border-gray-700" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800",
                collapsed && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-blue-400" : item.color)} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800",
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

export default AdminSidebar;
