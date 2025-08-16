// src/pages/SuperAdmin/AdminManagement.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

import AdminStatsCards from '@/components/superadmin/AdminStatsCards';
import AdminTable from '@/components/superadmin/AdminTable';
import CreateAdminDialog from '@/components/superadmin/CreateAdminDialog';
import EditAdminDialog from '@/components/superadmin/EditAdminDialog';
import ResetPasswordDialog from '@/components/superadmin/ResetPasswordDialog';
import { useAdmins, useBulkUpdateAdmins, useAdminListState } from '@/hooks/useAdmin';

const AdminManagement = () => {
  const { filters, updateFilter, resetFilters } = useAdminListState();
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [resettingPassword, setResettingPassword] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data, isLoading, refetch } = useAdmins(filters);
  const bulkUpdateMutation = useBulkUpdateAdmins();

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || 1;

  // Handle search
  const handleSearch = (value) => {
    updateFilter('search', value);
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    updateFilter('status', value);
  };

  // Handle sorting
  const handleSort = (sortBy, sortOrder) => {
    updateFilter('sortBy', sortBy);
    updateFilter('sortOrder', sortOrder);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    updateFilter('page', page);
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedAdmins.length === 0) {
      return;
    }

    try {
      await bulkUpdateMutation.mutateAsync({
        adminIds: selectedAdmins,
        action
      });
      setSelectedAdmins([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  // Handle edit admin
  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
  };

  // Handle reset password
  const handleResetPassword = (admin) => {
    setResettingPassword(admin);
  };

  // Calculate page range for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Management</h1>
          <p className="text-gray-400 mt-2">
            Manage system administrators and their permissions
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards />

      {/* Filters and Actions */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search admins..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
                />
              </div>

              {/* Status Filter */}
              <Select value={filters.status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40 bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="all" className="text-gray-300 hover:text-white">
                    All Status
                  </SelectItem>
                  <SelectItem value="active" className="text-gray-300 hover:text-white">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive" className="text-gray-300 hover:text-white">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select 
                value={`${filters.sortBy}-${filters.sortOrder}`} 
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleSort(sortBy, sortOrder);
                }}
              >
                <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="createdAt-desc" className="text-gray-300 hover:text-white">
                    Newest First
                  </SelectItem>
                  <SelectItem value="createdAt-asc" className="text-gray-300 hover:text-white">
                    Oldest First
                  </SelectItem>
                  <SelectItem value="name-asc" className="text-gray-300 hover:text-white">
                    Name A-Z
                  </SelectItem>
                  <SelectItem value="name-desc" className="text-gray-300 hover:text-white">
                    Name Z-A
                  </SelectItem>
                  <SelectItem value="email-asc" className="text-gray-300 hover:text-white">
                    Email A-Z
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filters */}
              {(filters.search || filters.status !== 'all' || filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') && (
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedAdmins.length > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {selectedAdmins.length} selected
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={bulkUpdateMutation.isPending}
                      className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/10 backdrop-blur-md border-white/20">
                    <DropdownMenuLabel className="text-white">Bulk Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('activate')}
                      className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate Selected
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('deactivate')}
                      className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate Selected
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-white/20" />
                    
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Admin Table */}
      <AdminTable
        filters={filters}
        selectedAdmins={selectedAdmins}
        setSelectedAdmins={setSelectedAdmins}
        onEditAdmin={handleEditAdmin}
        onResetPassword={handleResetPassword}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {((currentPage - 1) * filters.limit) + 1} to {Math.min(currentPage * filters.limit, pagination.totalCount)} of {pagination.totalCount} admins
              </div>
              
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <Button
                    key={index}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={typeof page !== 'number'}
                    className={
                      page === currentPage 
                        ? "bg-white text-black hover:bg-white/90" 
                        : "border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                    }
                  >
                    {page}
                  </Button>
                ))}

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TODO: Add dialogs for create/edit/reset password in next step */}
      {/* These will be implemented in Step 6 */}

      {/* Create Admin Dialog */}
      <CreateAdminDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {/* Edit Admin Dialog */}
      <EditAdminDialog
        admin={editingAdmin}
        open={!!editingAdmin}
        onOpenChange={(open) => !open && setEditingAdmin(null)}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        admin={resettingPassword}
        open={!!resettingPassword}
        onOpenChange={(open) => !open && setResettingPassword(null)}
      />
    </div>
  );
};

export default AdminManagement;