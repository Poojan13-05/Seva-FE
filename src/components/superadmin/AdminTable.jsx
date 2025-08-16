// src/components/superadmin/AdminTable.jsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Key,
  Calendar,
  Mail,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { useAdmins, useToggleAdminStatus, useDeleteAdmin } from '@/hooks/useAdmin';
import { format } from 'date-fns';

const AdminTable = ({ filters, selectedAdmins, setSelectedAdmins, onEditAdmin, onResetPassword }) => {
  const { data, isLoading, error } = useAdmins(filters);
  const toggleStatusMutation = useToggleAdminStatus();
  const deleteAdminMutation = useDeleteAdmin();

  const admins = data?.data?.admins || [];
  const pagination = data?.data?.pagination;

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAdmins(admins.map(admin => admin.id));
    } else {
      setSelectedAdmins([]);
    }
  };

  // Handle individual selection
  const handleSelectAdmin = (adminId, checked) => {
    if (checked) {
      setSelectedAdmins(prev => [...prev, adminId]);
    } else {
      setSelectedAdmins(prev => prev.filter(id => id !== adminId));
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (adminId) => {
    try {
      await toggleStatusMutation.mutateAsync(adminId);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        await deleteAdminMutation.mutateAsync(adminId);
        // Remove from selected if it was selected
        setSelectedAdmins(prev => prev.filter(id => id !== adminId));
      } catch (error) {
        console.error('Error deleting admin:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20">
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-white/20" />
                </TableHead>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4 bg-white/20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="border-white/20">
                  <TableCell>
                    <Skeleton className="h-4 w-4 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
                      <Skeleton className="h-4 w-24 bg-white/20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 bg-white/20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 bg-white/20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="border-red-300/50 bg-red-500/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-red-300" />
        <AlertDescription className="text-red-200">
          {error.message || 'Failed to load admins. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!admins.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8">
        <div className="text-center">
          <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No admins found</h3>
          <p className="text-gray-400">
            {filters.search ? 'Try adjusting your search criteria' : 'No administrators have been created yet'}
          </p>
        </div>
      </div>
    );
  }

  const isAllSelected = admins.length > 0 && selectedAdmins.length === admins.length;
  const isIndeterminate = selectedAdmins.length > 0 && selectedAdmins.length < admins.length;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20 hover:bg-white/5">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onCheckedChange={handleSelectAll}
                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
            </TableHead>
            <TableHead className="text-gray-300">Admin</TableHead>
            <TableHead className="text-gray-300">Contact</TableHead>
            <TableHead className="text-gray-300">Phone</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow 
              key={admin.id} 
              className="border-white/20 hover:bg-white/5 transition-colors"
            >
              <TableCell>
                <Checkbox
                  checked={selectedAdmins.includes(admin.id)}
                  onCheckedChange={(checked) => handleSelectAdmin(admin.id, checked)}
                  className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/10 text-white text-sm">
                      {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">{admin.name}</div>
                    <div className="text-sm text-gray-400">{admin.role}</div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-1 text-gray-300">
                  <Mail className="h-3 w-3" />
                  <span className="text-sm">{admin.email}</span>
                </div>
              </TableCell>
              
              <TableCell>
                {admin.phone ? (
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Phone className="h-3 w-3" />
                    <span className="text-sm">{admin.phone}</span>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">-</span>
                )}
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant={admin.isActive ? "default" : "secondary"}
                  className={admin.isActive 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                  }
                >
                  {admin.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span className="text-sm">
                    {format(new Date(admin.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="bg-white/10 backdrop-blur-md border-white/20"
                  >
                    <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    
                    <DropdownMenuItem 
                      onClick={() => onEditAdmin(admin)}
                      className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Admin
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleToggleStatus(admin.id)}
                      disabled={toggleStatusMutation.isPending}
                      className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      {admin.isActive ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => onResetPassword(admin)}
                      className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Reset Password
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-white/20" />
                    
                    <DropdownMenuItem 
                      onClick={() => handleDeleteAdmin(admin.id)}
                      disabled={deleteAdminMutation.isPending}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTable;