// src/hooks/useHealthInsurance.js
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { healthInsuranceService } from '../services/healthInsuranceService';
import { toast } from 'sonner';

// Query keys for caching
export const healthInsuranceKeys = {
  all: ['health-insurance'],
  lists: () => [...healthInsuranceKeys.all, 'list'],
  list: (params) => [...healthInsuranceKeys.lists(), params],
  stats: () => [...healthInsuranceKeys.all, 'stats'],
  detail: (id) => [...healthInsuranceKeys.all, 'detail', id],
  customers: () => [...healthInsuranceKeys.all, 'customers'],
};

// Hook to get health insurance policies list with pagination, search, filtering
export const useHealthInsurancePolicies = (params = {}) => {
  return useQuery({
    queryKey: healthInsuranceKeys.list(params),
    queryFn: () => healthInsuranceService.getHealthInsurancePolicies(params),
    keepPreviousData: true,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch health insurance policies');
    }
  });
};

// Hook to get health insurance statistics
export const useHealthInsuranceStats = () => {
  return useQuery({
    queryKey: healthInsuranceKeys.stats(),
    queryFn: healthInsuranceService.getHealthInsuranceStats,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch health insurance statistics');
    }
  });
};

// Hook to get customers for dropdown
export const useCustomersForDropdown = () => {
  return useQuery({
    queryKey: healthInsuranceKeys.customers(),
    queryFn: healthInsuranceService.getCustomersForDropdown,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customers');
    }
  });
};

// Hook to get customer by ID
export const useCustomerById = (customerId) => {
  return useQuery({
    queryKey: [...healthInsuranceKeys.customers(), 'detail', customerId],
    queryFn: () => healthInsuranceService.getCustomerById(customerId),
    enabled: !!customerId,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customer details');
    }
  });
};

// Hook to get health insurance policy by ID
export const useHealthInsurance = (policyId, options = {}) => {
  return useQuery({
    queryKey: healthInsuranceKeys.detail(policyId),
    queryFn: () => healthInsuranceService.getHealthInsuranceById(policyId),
    enabled: !!policyId,
    retry: 2,
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache the data
    refetchOnMount: true, // Always refetch on mount
    ...options,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch health insurance policy details');
    }
  });
};

// Hook to create health insurance policy
export const useCreateHealthInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyData, files }) => healthInsuranceService.createHealthInsurance(policyData, files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.stats() });
      toast.success('Health Insurance policy created successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to create health insurance policy';
      toast.error(message);
    }
  });
};

// Hook to update health insurance policy
export const useUpdateHealthInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, policyData, files, deletedFiles }) =>
      healthInsuranceService.updateHealthInsurance(policyId, policyData, files, deletedFiles),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        healthInsuranceKeys.detail(variables.policyId),
        data
      );
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.lists() });
      toast.success('Health Insurance policy updated successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to update health insurance policy';
      toast.error(message);
    }
  });
};

// Hook to toggle health insurance policy status
export const useToggleHealthInsuranceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: healthInsuranceService.toggleHealthInsuranceStatus,
    onSuccess: (data, policyId) => {
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.stats() });
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.detail(policyId) });

      const status = data.data.healthInsurance.isActive ? 'activated' : 'deactivated';
      toast.success(`Health Insurance policy ${status} successfully`);
    },
    onError: (error) => {
      const message = error.message || 'Failed to toggle health insurance policy status';
      toast.error(message);
    }
  });
};

// Hook to delete health insurance policy (soft delete)
export const useDeleteHealthInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: healthInsuranceService.deleteHealthInsurance,
    onSuccess: (data, policyId) => {
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.stats() });
      queryClient.removeQueries({ queryKey: healthInsuranceKeys.detail(policyId) });
      toast.success('Health Insurance policy deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete health insurance policy';
      toast.error(message);
    }
  });
};

// Hook to hard delete health insurance policy (super admin only)
export const useHardDeleteHealthInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: healthInsuranceService.hardDeleteHealthInsurance,
    onSuccess: (data, policyId) => {
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.stats() });
      queryClient.removeQueries({ queryKey: healthInsuranceKeys.detail(policyId) });
      toast.success('Health Insurance policy permanently deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to permanently delete health insurance policy';
      toast.error(message);
    }
  });
};

// Hook to delete document
export const useDeleteHealthInsuranceDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, documentId }) =>
      healthInsuranceService.deleteDocument(policyId, documentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthInsuranceKeys.detail(variables.policyId) });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete document';
      toast.error(message);
    }
  });
};

// Custom hook for managing health insurance list state (filters, pagination)
export const useHealthInsuranceListState = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    insuranceCompany: 'all',
    policyType: 'all',
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
      insuranceCompany: 'all',
      policyType: 'all',
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
