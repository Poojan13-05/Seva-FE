import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Trash2,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Shield,
  Building2,
  TrendingUp,
  Calendar,
  Users,
  Undo2
} from 'lucide-react';
import { superAdminService } from '@/services/adminService';
import { lifeInsuranceService } from '@/services/lifeInsuranceService';

const DeletedLifeInsurancePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    insuranceCompany: 'all',
    policyType: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  });
  const [deletingPolicyId, setDeletingPolicyId] = useState(null);
  const [recoveringPolicyId, setRecoveringPolicyId] = useState(null);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({ open: false, policy: null });
  const [confirmRecoverDialog, setConfirmRecoverDialog] = useState({ open: false, policy: null });

  // Fetch deleted policies
  const fetchDeletedPolicies = async (page = 1) => {
    try {
      setLoading(true);
      const response = await superAdminService.getDeletedLifeInsurancePolicies({
        page,
        limit: pagination.limit,
        ...filters
      });
      
      if (response.success) {
        setPolicies(response.data.policies);
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to fetch deleted life insurance policies');
      }
    } catch (error) {
      console.error('Error fetching deleted policies:', error);
      toast.error('Failed to fetch deleted life insurance policies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch deleted policy stats
  const fetchDeletedPolicyStats = async () => {
    try {
      const response = await superAdminService.getDeletedLifeInsuranceStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching deleted policy stats:', error);
    }
  };

  // Handle permanent deletion
  const handlePermanentDelete = async (policy) => {
    setConfirmDeleteDialog({ open: true, policy });
  };

  // Handle recover
  const handleRecover = async (policy) => {
    setConfirmRecoverDialog({ open: true, policy });
  };

  // Confirm permanent deletion
  const confirmPermanentDelete = async () => {
    const policy = confirmDeleteDialog.policy;
    if (!policy) return;

    try {
      setDeletingPolicyId(policy._id);
      const response = await superAdminService.permanentlyDeleteLifeInsurancePolicy(policy._id);
      
      if (response.success) {
        toast.success('Life insurance policy permanently deleted successfully');
        fetchDeletedPolicies(pagination.currentPage);
        fetchDeletedPolicyStats();
        setConfirmDeleteDialog({ open: false, policy: null });
      } else {
        toast.error('Failed to permanently delete life insurance policy');
      }
    } catch (error) {
      console.error('Error permanently deleting policy:', error);
      toast.error('Failed to permanently delete life insurance policy');
    } finally {
      setDeletingPolicyId(null);
    }
  };

  // Confirm recover
  const confirmRecover = async () => {
    const policy = confirmRecoverDialog.policy;
    if (!policy) return;

    try {
      setRecoveringPolicyId(policy._id);
      const response = await superAdminService.recoverLifeInsurancePolicy(policy._id);
      
      if (response.success) {
        toast.success('Life insurance policy recovered successfully');
        fetchDeletedPolicies(pagination.currentPage);
        fetchDeletedPolicyStats();
        setConfirmRecoverDialog({ open: false, policy: null });
      } else {
        toast.error('Failed to recover life insurance policy');
      }
    } catch (error) {
      console.error('Error recovering policy:', error);
      toast.error('Failed to recover life insurance policy');
    } finally {
      setRecoveringPolicyId(null);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchDeletedPolicies(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchDeletedPolicies(pagination.currentPage);
    fetchDeletedPolicyStats();
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchDeletedPolicies(1);
  }, [filters]);

  useEffect(() => {
    fetchDeletedPolicyStats();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Calculate page range for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, pagination.currentPage - delta); i <= Math.min(pagination.totalPages - 1, pagination.currentPage + delta); i++) {
      range.push(i);
    }

    if (pagination.currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.currentPage + delta < pagination.totalPages - 1) {
      rangeWithDots.push('...', pagination.totalPages);
    } else if (pagination.totalPages > 1) {
      rangeWithDots.push(pagination.totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Deleted Life Insurance Policies</h1>
          <p className="text-gray-400 mt-2">
            Manage permanently deleted life insurance policies and cleanup data
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Deleted</CardTitle>
              <Trash2 className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalDeletedPolicies}</div>
              <p className="text-xs text-gray-400">
                Permanently removed
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">New Policies</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.deletedNewPolicies}</div>
              <p className="text-xs text-gray-400">
                {stats.newPolicyPercentage}% of deleted
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Renewals</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.deletedRenewalPolicies}</div>
              <p className="text-xs text-gray-400">
                {stats.renewalPolicyPercentage}% of deleted
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Recently Deleted</CardTitle>
              <Calendar className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.recentlyDeletedPolicies}</div>
              <p className="text-xs text-gray-400">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

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
                  placeholder="Search deleted policies..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
                />
              </div>

              {/* Insurance Company Filter */}
              <Select value={filters.insuranceCompany} onValueChange={(value) => handleFilterChange('insuranceCompany', value)}>
                <SelectTrigger className="w-64 bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="all" className="text-gray-300 hover:text-white">
                    All Companies
                  </SelectItem>
                  {lifeInsuranceService.getInsuranceCompanies().map(company => (
                    <SelectItem key={company} value={company} className="text-gray-300 hover:text-white">
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Policy Type Filter */}
              <Select value={filters.policyType} onValueChange={(value) => handleFilterChange('policyType', value)}>
                <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Filter by type" />
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
                  setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                }}
              >
                <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="updatedAt-desc" className="text-gray-300 hover:text-white">
                    Recently Deleted
                  </SelectItem>
                  <SelectItem value="updatedAt-asc" className="text-gray-300 hover:text-white">
                    Oldest Deleted
                  </SelectItem>
                  <SelectItem value="createdAt-desc" className="text-gray-300 hover:text-white">
                    Recently Created
                  </SelectItem>
                  <SelectItem value="insuranceDetails.policyNumber-asc" className="text-gray-300 hover:text-white">
                    Policy Number A-Z
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filters */}
              {(filters.search || filters.insuranceCompany !== 'all' || filters.policyType !== 'all' || filters.sortBy !== 'updatedAt' || filters.sortOrder !== 'desc') && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ search: '', insuranceCompany: 'all', policyType: 'all', sortBy: 'updatedAt', sortOrder: 'desc' })}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Policies Table */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Deleted Life Insurance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[120px] bg-white/20" />
                  <Skeleton className="h-4 w-[150px] bg-white/20" />
                  <Skeleton className="h-4 w-[100px] bg-white/20" />
                  <Skeleton className="h-4 w-[200px] bg-white/20" />
                  <Skeleton className="h-4 w-[100px] bg-white/20" />
                  <Skeleton className="h-4 w-[80px] bg-white/20" />
                </div>
              ))}
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">No Deleted Policies</h3>
              <p className="text-gray-400">No life insurance policies have been deleted yet.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20 hover:bg-white/5">
                    <TableHead className="text-gray-300">Policy Number</TableHead>
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Insured Name</TableHead>
                    <TableHead className="text-gray-300">Insurance Company</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Sum Insured</TableHead>
                    <TableHead className="text-gray-300">Documents</TableHead>
                    <TableHead className="text-gray-300">Deleted Date</TableHead>
                    <TableHead className="text-gray-300">Deleted By</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy._id} className="border-white/20 hover:bg-white/5">
                      <TableCell className="font-mono text-white">
                        {policy.insuranceDetails?.policyNumber || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">
                            {policy.clientDetails?.customer?.customerId || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-300">
                            {policy.clientDetails?.customer?.personalDetails?.firstName} {policy.clientDetails?.customer?.personalDetails?.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {policy.clientDetails?.insuredName || 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="text-sm">
                          {policy.insuranceDetails?.insuranceCompany || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={policy.insuranceDetails?.policyType === 'New' ? 'default' : 'secondary'} 
                               className="bg-white/10 text-white border-white/20">
                          {policy.insuranceDetails?.policyType || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatCurrency(policy.insuranceDetails?.sumInsured)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-gray-300">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">
                            {((policy.uploadPolicy?.policyFileUrl ? 1 : 0) + (policy.uploadDocuments?.length || 0))}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-300">
                        {formatDate(policy.updatedAt)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {policy.lastUpdatedBy?.name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRecover(policy)}
                            disabled={recoveringPolicyId === policy._id || deletingPolicyId === policy._id}
                            className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-400/30"
                          >
                            {recoveringPolicyId === policy._id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Undo2 className="h-3 w-3" />
                            )}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handlePermanentDelete(policy)}
                            disabled={deletingPolicyId === policy._id || recoveringPolicyId === policy._id}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-400/30"
                          >
                            {deletingPolicyId === policy._id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} policies
              </div>
              
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <Button
                    key={index}
                    variant={page === pagination.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={typeof page !== 'number'}
                    className={
                      page === pagination.currentPage 
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
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialogs */}
      
      {/* Permanent Delete Dialog */}
      <Dialog open={confirmDeleteDialog.open} onOpenChange={(open) => setConfirmDeleteDialog({ open, policy: null })}>
        <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              Permanently Delete Life Insurance Policy
            </DialogTitle>
            <DialogDescription className="space-y-2 text-gray-300">
              {confirmDeleteDialog.policy && (
                <>
                  <p>
                    This will permanently delete policy <strong className="text-white">{confirmDeleteDialog.policy.insuranceDetails?.policyNumber}</strong> and all associated data:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Policy details and client information</li>
                    <li>All uploaded documents ({((confirmDeleteDialog.policy.uploadPolicy?.policyFileUrl ? 1 : 0) + (confirmDeleteDialog.policy.uploadDocuments?.length || 0))} files)</li>
                    <li>Files will be deleted from AWS S3 storage</li>
                    <li>This action cannot be undone</li>
                  </ul>
                  <p className="text-red-400 font-medium">
                    Are you absolutely sure you want to continue?
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDeleteDialog({ open: false, policy: null })}
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmPermanentDelete}
              disabled={deletingPolicyId !== null}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingPolicyId ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Yes, Delete Permanently'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recover Dialog */}
      <Dialog open={confirmRecoverDialog.open} onOpenChange={(open) => setConfirmRecoverDialog({ open, policy: null })}>
        <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <Undo2 className="h-5 w-5 text-green-400 mr-2" />
              Recover Life Insurance Policy
            </DialogTitle>
            <DialogDescription className="space-y-2 text-gray-300">
              {confirmRecoverDialog.policy && (
                <>
                  <p>
                    This will recover policy <strong className="text-white">{confirmRecoverDialog.policy.insuranceDetails?.policyNumber}</strong> and restore:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Policy details and client information</li>
                    <li>All uploaded documents ({((confirmRecoverDialog.policy.uploadPolicy?.policyFileUrl ? 1 : 0) + (confirmRecoverDialog.policy.uploadDocuments?.length || 0))} files)</li>
                    <li>Policy will be moved back to the active policies list</li>
                    <li>All data will be fully restored</li>
                  </ul>
                  <p className="text-green-400 font-medium">
                    Are you sure you want to recover this policy?
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmRecoverDialog({ open: false, policy: null })}
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={confirmRecover}
              disabled={recoveringPolicyId !== null}
              className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-400/30"
            >
              {recoveringPolicyId ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Recovering...
                </>
              ) : (
                <>
                  <Undo2 className="h-4 w-4 mr-2" />
                  Yes, Recover Policy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeletedLifeInsurancePolicies;