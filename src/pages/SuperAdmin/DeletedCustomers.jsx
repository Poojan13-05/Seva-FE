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
  User,
  Building,
  Calendar,
  AlertTriangle,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { superAdminService } from '@/services/adminService';

const DeletedCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    customerType: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  });
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({ open: false, customer: null });

  // Fetch deleted customers
  const fetchDeletedCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await superAdminService.getDeletedCustomers({
        page,
        limit: pagination.limit,
        ...filters
      });
      
      if (response.success) {
        setCustomers(response.data.customers);
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to fetch deleted customers');
      }
    } catch (error) {
      console.error('Error fetching deleted customers:', error);
      toast.error('Failed to fetch deleted customers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch deleted customer stats
  const fetchDeletedCustomerStats = async () => {
    try {
      const response = await superAdminService.getDeletedCustomerStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching deleted customer stats:', error);
    }
  };

  // Handle permanent deletion
  const handlePermanentDelete = async (customer) => {
    setConfirmDeleteDialog({ open: true, customer });
  };

  // Confirm permanent deletion
  const confirmPermanentDelete = async () => {
    const customer = confirmDeleteDialog.customer;
    if (!customer) return;

    try {
      setDeletingCustomerId(customer._id);
      const response = await superAdminService.permanentlyDeleteCustomer(customer._id);
      
      if (response.success) {
        toast.success('Customer permanently deleted successfully');
        fetchDeletedCustomers(pagination.currentPage);
        fetchDeletedCustomerStats();
        setConfirmDeleteDialog({ open: false, customer: null });
      } else {
        toast.error('Failed to permanently delete customer');
      }
    } catch (error) {
      console.error('Error permanently deleting customer:', error);
      toast.error('Failed to permanently delete customer');
    } finally {
      setDeletingCustomerId(null);
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
    fetchDeletedCustomers(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchDeletedCustomers(pagination.currentPage);
    fetchDeletedCustomerStats();
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchDeletedCustomers(1);
  }, [filters]);

  useEffect(() => {
    fetchDeletedCustomerStats();
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
          <h1 className="text-3xl font-bold text-white">Deleted Customers</h1>
          <p className="text-gray-400 mt-2">
            Manage permanently deleted customer records and cleanup data
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
              <div className="text-2xl font-bold text-white">{stats.totalDeletedCustomers}</div>
              <p className="text-xs text-gray-400">
                Permanently removed
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Individual</CardTitle>
              <User className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.deletedIndividualCustomers}</div>
              <p className="text-xs text-gray-400">
                {stats.individualPercentage}% of deleted
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Corporate</CardTitle>
              <Building className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.deletedCorporateCustomers}</div>
              <p className="text-xs text-gray-400">
                {stats.corporatePercentage}% of deleted
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Recently Deleted</CardTitle>
              <Calendar className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.recentlyDeletedCustomers}</div>
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
                  placeholder="Search deleted customers..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
                />
              </div>

              {/* Customer Type Filter */}
              <Select value={filters.customerType} onValueChange={(value) => handleFilterChange('customerType', value)}>
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
                  <SelectItem value="customerId-asc" className="text-gray-300 hover:text-white">
                    Customer ID A-Z
                  </SelectItem>
                  <SelectItem value="customerId-desc" className="text-gray-300 hover:text-white">
                    Customer ID Z-A
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filters */}
              {(filters.search || filters.customerType !== 'all' || filters.sortBy !== 'updatedAt' || filters.sortOrder !== 'desc') && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ search: '', customerType: 'all', sortBy: 'updatedAt', sortOrder: 'desc' })}
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

      {/* Customers Table */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Deleted Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[100px] bg-white/20" />
                  <Skeleton className="h-4 w-[150px] bg-white/20" />
                  <Skeleton className="h-4 w-[200px] bg-white/20" />
                  <Skeleton className="h-4 w-[100px] bg-white/20" />
                  <Skeleton className="h-4 w-[80px] bg-white/20" />
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8">
              <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">No Deleted Customers</h3>
              <p className="text-gray-400">No customers have been deleted yet.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20 hover:bg-white/5">
                    <TableHead className="text-gray-300">Customer ID</TableHead>
                    <TableHead className="text-gray-300">Name/Company</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Mobile</TableHead>
                    <TableHead className="text-gray-300">Documents</TableHead>
                    <TableHead className="text-gray-300">Deleted Date</TableHead>
                    <TableHead className="text-gray-300">Deleted By</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer._id} className="border-white/20 hover:bg-white/5">
                      <TableCell className="font-mono text-white">
                        {customer.customerId}
                      </TableCell>
                      <TableCell className="text-white">
                        {customer.customerType === 'individual' 
                          ? `${customer.personalDetails?.firstName || ''} ${customer.personalDetails?.lastName || ''}`.trim() || 'N/A'
                          : customer.corporateDetails?.[0]?.companyName || 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.customerType === 'individual' ? 'default' : 'secondary'} 
                               className="bg-white/10 text-white border-white/20">
                          <User className="h-3 w-3 mr-1" />
                          {customer.customerType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {customer.personalDetails?.email || customer.corporateDetails?.[0]?.email || 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {customer.personalDetails?.mobileNumber || customer.corporateDetails?.[0]?.mobileNumber || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-gray-300">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">
                            {(customer.documents?.length || 0) + (customer.additionalDocuments?.length || 0)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-300">
                        {formatDate(customer.updatedAt)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {customer.lastUpdatedBy?.name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handlePermanentDelete(customer)}
                          disabled={deletingCustomerId === customer._id}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-400/30"
                        >
                          {deletingCustomerId === customer._id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
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
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} customers
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteDialog.open} onOpenChange={(open) => setConfirmDeleteDialog({ open, customer: null })}>
        <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              Permanently Delete Customer
            </DialogTitle>
            <DialogDescription className="space-y-2 text-gray-300">
              {confirmDeleteDialog.customer && (
                <>
                  <p>
                    This will permanently delete <strong className="text-white">{confirmDeleteDialog.customer.customerId}</strong> and all associated data:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Customer profile and personal information</li>
                    <li>All uploaded documents ({(confirmDeleteDialog.customer.documents?.length || 0) + (confirmDeleteDialog.customer.additionalDocuments?.length || 0)} files)</li>
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
              onClick={() => setConfirmDeleteDialog({ open: false, customer: null })}
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmPermanentDelete}
              disabled={deletingCustomerId !== null}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingCustomerId ? (
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
    </div>
  );
};

export default DeletedCustomers;