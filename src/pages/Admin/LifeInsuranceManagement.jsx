// src/pages/Admin/LifeInsuranceManagement.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { 
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Shield,
  AlertCircle,
  Loader2
} from "lucide-react";

// Components
import LifeInsuranceStatsCards from '@/components/admin/LifeInsuranceStatsCards';
import LifeInsuranceTable from '@/components/admin/LifeInsuranceTable';
import CreateLifeInsuranceDialog from '@/components/admin/CreateLifeInsuranceDialog';
import EditLifeInsuranceDialog from '@/components/admin/EditLifeInsuranceDialog';
import ViewLifeInsuranceDialog from '@/components/admin/ViewLifeInsuranceDialog';

// Hooks
import {
  useLifeInsurancePolicies,
  useLifeInsuranceListState,
  useDeleteLifeInsurance
} from '@/hooks/useLifeInsurance';

// Services
import { lifeInsuranceService } from '@/services/lifeInsuranceService';

const LifeInsuranceManagement = () => {
  const { filters, updateFilter, resetFilters } = useLifeInsuranceListState();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Query hooks
  const {
    data: policiesData,
    isLoading,
    isError,
    refetch
  } = useLifeInsurancePolicies(filters);

  // Mutation hooks
  const deletePolicy = useDeleteLifeInsurance();

  // Data
  const policies = policiesData?.data?.lifeInsurancePolicies || [];
  const pagination = policiesData?.data?.pagination;
  const filterOptions = policiesData?.data?.filters;

  // Handlers
  const handleSearch = (searchTerm) => {
    updateFilter('search', searchTerm);
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setViewDialogOpen(true);
  };

  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setEditDialogOpen(true);
  };

  const handleDelete = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this life insurance policy? This action cannot be undone.')) {
      try {
        await deletePolicy.mutateAsync(policyId);
      } catch (error) {
        // Error handling is done by the hook
      }
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handlePageChange = (page) => {
    updateFilter('page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Shield className="w-6 h-6" />
            Life Insurance Management
          </h1>
          <p className="text-gray-300">
            Manage life insurance policies, track premiums, and monitor policy details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <LifeInsuranceStatsCards />

      {/* Filters and Search */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search policies..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
              />
            </div>

            {/* Insurance Company Filter */}
            <Select
              value={filters.insuranceCompany}
              onValueChange={(value) => updateFilter('insuranceCompany', value)}
            >
              <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                <SelectItem value="all" className="text-gray-300 hover:text-white">
                  All Companies
                </SelectItem>
                {lifeInsuranceService.getInsuranceCompanies().map(company => (
                  <SelectItem key={company} value={company} className="text-gray-300 hover:text-white">
                    {company.length > 30 ? `${company.substring(0, 30)}...` : company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Policy Type Filter */}
            <Select
              value={filters.policyType}
              onValueChange={(value) => updateFilter('policyType', value)}
            >
              <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                <SelectItem value="all" className="text-gray-300 hover:text-white">
                  All Types
                </SelectItem>
                <SelectItem value="New" className="text-gray-300 hover:text-white">
                  New
                </SelectItem>
                <SelectItem value="Renewal" className="text-gray-300 hover:text-white">
                  Renewal
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select 
              value={`${filters.sortBy}-${filters.sortOrder}`} 
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                updateFilter('sortBy', sortBy);
                updateFilter('sortOrder', sortOrder);
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
                <SelectItem value="policyDate-desc" className="text-gray-300 hover:text-white">
                  Policy Date (New-Old)
                </SelectItem>
                <SelectItem value="policyDate-asc" className="text-gray-300 hover:text-white">
                  Policy Date (Old-New)
                </SelectItem>
                <SelectItem value="sumInsured-desc" className="text-gray-300 hover:text-white">
                  Sum Insured (High-Low)
                </SelectItem>
                <SelectItem value="sumInsured-asc" className="text-gray-300 hover:text-white">
                  Sum Insured (Low-High)
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            {(filters.search || filters.insuranceCompany !== 'all' || filters.policyType !== 'all' || filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') && (
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>Life Insurance Policies</span>
            {pagination && (
              <span className="text-sm font-normal text-gray-300">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load life insurance policies. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <LifeInsuranceTable
                policies={policies}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    showPreviousNext
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateLifeInsuranceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditLifeInsuranceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        policy={selectedPolicy}
      />

      <ViewLifeInsuranceDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        policy={selectedPolicy}
      />
    </div>
  );
};

export default LifeInsuranceManagement;