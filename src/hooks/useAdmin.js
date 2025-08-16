// src/hooks/useAdmin.js
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { toast } from 'sonner'; // Assuming you're using sonner for notifications

// Query keys for caching
export const adminKeys = {
  all: ['admins'],
  lists: () => [...adminKeys.all, 'list'],
  list: (params) => [...adminKeys.lists(), params],
  stats: () => [...adminKeys.all, 'stats'],
  detail: (id) => [...adminKeys.all, 'detail', id],
};

// Hook to get admins list with pagination, search, filtering
export const useAdmins = (params = {}) => {
  return useQuery({
    queryKey: adminKeys.list(params),
    queryFn: () => adminService.getAdmins(params),
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch admins');
    }
  });
};

// Hook to get admin statistics
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: adminService.getAdminStats,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch admin statistics');
    }
  });
};

// Hook to get admin by ID
export const useAdmin = (adminId) => {
  return useQuery({
    queryKey: adminKeys.detail(adminId),
    queryFn: () => adminService.getAdminById(adminId),
    enabled: !!adminId, // Only run if adminId exists
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch admin details');
    }
  });
};

// Hook to create admin
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.createAdmin,
    onSuccess: (data) => {
      // Invalidate and refetch admin lists
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      
      toast.success('Admin created successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to create admin';
      toast.error(message);
    }
  });
};

// Hook to update admin
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId, adminData }) => adminService.updateAdmin(adminId, adminData),
    onSuccess: (data, variables) => {
      // Update the specific admin in cache
      queryClient.setQueryData(
        adminKeys.detail(variables.adminId),
        data
      );
      
      // Invalidate lists to refresh the table
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      
      toast.success('Admin updated successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to update admin';
      toast.error(message);
    }
  });
};

// Hook to toggle admin status
export const useToggleAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.toggleAdminStatus,
    onSuccess: (data, adminId) => {
      // Update admin lists
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      
      // Update specific admin if it's cached
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(adminId) });
      
      const status = data.data.admin.isActive ? 'activated' : 'deactivated';
      toast.success(`Admin ${status} successfully`);
    },
    onError: (error) => {
      const message = error.message || 'Failed to toggle admin status';
      toast.error(message);
    }
  });
};

// Hook to reset admin password
export const useResetAdminPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId, newPassword }) => adminService.resetAdminPassword(adminId, newPassword),
    onSuccess: () => {
      toast.success('Admin password reset successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to reset admin password';
      toast.error(message);
    }
  });
};

// Hook to delete admin
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteAdmin,
    onSuccess: (data, adminId) => {
      // Remove from lists
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      
      // Remove specific admin from cache
      queryClient.removeQueries({ queryKey: adminKeys.detail(adminId) });
      
      toast.success('Admin deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete admin';
      toast.error(message);
    }
  });
};

// Hook for bulk operations
export const useBulkUpdateAdmins = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminIds, action }) => adminService.bulkUpdateAdmins(adminIds, action),
    onSuccess: (data) => {
      // Invalidate all admin queries
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      
      const { action, affectedCount } = data.data;
      toast.success(`Successfully ${action}d ${affectedCount} admin(s)`);
    },
    onError: (error) => {
      const message = error.message || 'Bulk operation failed';
      toast.error(message);
    }
  });
};

// Custom hook for managing admin list state (filters, pagination)
export const useAdminListState = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when changing filters (except page itself)
      ...(key !== 'page' && { page: 1 })
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters
  };
};