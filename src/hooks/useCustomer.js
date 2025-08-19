// src/hooks/useCustomer.js
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { toast } from 'sonner';

// Query keys for caching
export const customerKeys = {
  all: ['customers'],
  lists: () => [...customerKeys.all, 'list'],
  list: (params) => [...customerKeys.lists(), params],
  stats: () => [...customerKeys.all, 'stats'],
  detail: (id) => [...customerKeys.all, 'detail', id],
};

// Hook to get customers list with pagination, search, filtering
export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
    keepPreviousData: true,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customers');
    }
  });
};

// Hook to get customer statistics
export const useCustomerStats = () => {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: customerService.getCustomerStats,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customer statistics');
    }
  });
};

// Hook to get customer by ID
export const useCustomer = (customerId) => {
  return useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => customerService.getCustomerById(customerId),
    enabled: !!customerId,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customer details');
    }
  });
};

// Hook to create customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerData, files }) => customerService.createCustomer(customerData, files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      toast.success('Customer created successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to create customer';
      toast.error(message);
    }
  });
};

// Hook to update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, customerData, files, deletedFiles }) => 
      customerService.updateCustomer(customerId, customerData, files, deletedFiles),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        customerKeys.detail(variables.customerId),
        data
      );
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to update customer';
      toast.error(message);
    }
  });
};

// Hook to toggle customer status
export const useToggleCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.toggleCustomerStatus,
    onSuccess: (data, customerId) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(customerId) });
      
      const status = data.data.customer.isActive ? 'activated' : 'deactivated';
      toast.success(`Customer ${status} successfully`);
    },
    onError: (error) => {
      const message = error.message || 'Failed to toggle customer status';
      toast.error(message);
    }
  });
};

// Hook to delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: (data, customerId) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      queryClient.removeQueries({ queryKey: customerKeys.detail(customerId) });
      toast.success('Customer deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete customer';
      toast.error(message);
    }
  });
};

// Hook to delete document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, documentId, documentType }) => 
      customerService.deleteDocument(customerId, documentId, documentType),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete document';
      toast.error(message);
    }
  });
};

// Hook to export customers
export const useExportCustomers = () => {
  return useMutation({
    mutationFn: customerService.exportCustomers,
    onSuccess: (data) => {
      // Handle the export data - could trigger download
      toast.success('Customer data exported successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to export customer data';
      toast.error(message);
    }
  });
};

// Custom hook for managing customer list state (filters, pagination)
export const useCustomerListState = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    customerType: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }) // Reset to page 1 when changing filters
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      customerType: 'all',
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