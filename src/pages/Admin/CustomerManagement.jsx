// src/pages/Admin/CustomerManagement.jsx
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
import {
  Search,
  Plus,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

import CustomerStatsCards from '@/components/admin/CustomerStatsCards';
import CustomerTable from '@/components/admin/CustomerTable';
import CreateCustomerDialog from '@/components/admin/CreateCustomerDialog';
import EditCustomerDialog from '@/components/admin/EditCustomerDialog';
import ViewCustomerDialog from '@/components/admin/ViewCustomerDialog';
import { useCustomers, useExportCustomers, useCustomerListState } from '@/hooks/useCustomer';

const CustomerManagement = () => {
  const { filters, updateFilter, resetFilters } = useCustomerListState();
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data, isLoading, refetch } = useCustomers(filters);
  const exportMutation = useExportCustomers();

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || 1;

  // Handle search
  const handleSearch = (value) => {
    updateFilter('search', value);
  };

  // Handle customer type filter
  const handleCustomerTypeFilter = (value) => {
    updateFilter('customerType', value);
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

  // Handle export
  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Handle view customer
  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
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
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <p className="text-gray-400 mt-2">
            Manage your customer database and their information
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <CustomerStatsCards />

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
                  placeholder="Search customers..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
                />
              </div>

              {/* Customer Type Filter */}
              <Select value={filters.customerType} onValueChange={handleCustomerTypeFilter}>
                <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="all" className="text-gray-300 hover:text-white">
                    All Types
                  </SelectItem>
                  <SelectItem value="individual" className="text-gray-300 hover:text-white">
                    Individual
                  </SelectItem>
                  <SelectItem value="corporate" className="text-gray-300 hover:text-white">
                    Corporate
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
                  <SelectItem value="personalDetails.firstName-asc" className="text-gray-300 hover:text-white">
                    Name A-Z
                  </SelectItem>
                  <SelectItem value="personalDetails.firstName-desc" className="text-gray-300 hover:text-white">
                    Name Z-A
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filters */}
              {(filters.search || filters.customerType !== 'all' || filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') && (
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

            {/* Export Button */}
            <Button 
              onClick={handleExport}
              disabled={exportMutation.isPending}
              variant="outline"
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-2" />
              {exportMutation.isPending ? 'Exporting...' : 'Export Excel'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Customer Table */}
      <CustomerTable
        filters={filters}
        selectedCustomers={selectedCustomers}
        setSelectedCustomers={setSelectedCustomers}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {((currentPage - 1) * filters.limit) + 1} to {Math.min(currentPage * filters.limit, pagination.totalCount)} of {pagination.totalCount} customers
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

      {/* Dialogs */}
      <CreateCustomerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <EditCustomerDialog
        customer={editingCustomer}
        open={!!editingCustomer}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
      />

      <ViewCustomerDialog
        customer={viewingCustomer}
        open={!!viewingCustomer}
        onOpenChange={(open) => !open && setViewingCustomer(null)}
      />
    </div>
  );
};

export default CustomerManagement;