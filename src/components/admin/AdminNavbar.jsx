import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import { cn } from "@/lib/utils";

const AdminNavbar = ({ adminData, onLogout, collapsed, setCollapsed, sidebarCollapsed }) => {
  return (
    <header className={cn(
      "fixed top-0 z-30 h-16 bg-white/10 backdrop-blur-md border-b border-white/20 transition-all duration-300",
      sidebarCollapsed ? "left-16 right-0" : "left-64 right-0"
    )}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/admin.png" alt={adminData?.name} />
                  <AvatarFallback className="bg-gray-800 text-white">
                    {adminData?.name ? adminData.name.charAt(0).toUpperCase() : 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white/10 backdrop-blur-md border-white/20" align="end" forceMount>
              <DropdownMenuLabel className="font-normal text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {adminData?.name || 'Admin User'}
                  </p>
                  <p className="text-xs leading-none text-gray-400">
                    {adminData?.email || 'admin@sevaconsultancy.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-red-400 hover:text-red-300 hover:bg-white/10 backdrop-blur-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
