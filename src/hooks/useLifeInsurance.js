// src/hooks/useLifeInsurance.js
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lifeInsuranceService } from '../services/lifeInsuranceService';
import { toast } from 'sonner';

// Query keys for caching
export const lifeInsuranceKeys = {
  all: ['life-insurance'],
  lists: () => [...lifeInsuranceKeys.all, 'list'],
  list: (params) => [...lifeInsuranceKeys.lists(), params],
  stats: () => [...lifeInsuranceKeys.all, 'stats'],
  detail: (id) => [...lifeInsuranceKeys.all, 'detail', id],
  customers: () => [...lifeInsuranceKeys.all, 'customers'],
};

// Hook to get life insurance policies list with pagination, search, filtering
export const useLifeInsurancePolicies = (params = {}) => {
  return useQuery({
    queryKey: lifeInsuranceKeys.list(params),
    queryFn: () => lifeInsuranceService.getLifeInsurancePolicies(params),
    keepPreviousData: true,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch life insurance policies');
    }
  });
};

// Hook to get life insurance statistics
export const useLifeInsuranceStats = () => {
  return useQuery({
    queryKey: lifeInsuranceKeys.stats(),
    queryFn: lifeInsuranceService.getLifeInsuranceStats,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch life insurance statistics');
    }
  });
};

// Hook to get customers for dropdown
export const useCustomersForDropdown = () => {
  return useQuery({
    queryKey: lifeInsuranceKeys.customers(),
    queryFn: lifeInsuranceService.getCustomersForDropdown,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customers');
    }
  });
};

// Hook to get customer by ID
export const useCustomerById = (customerId) => {
  return useQuery({
    queryKey: [...lifeInsuranceKeys.customers(), 'detail', customerId],
    queryFn: () => lifeInsuranceService.getCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customer details');
    }
  });
};

// Hook to get life insurance policy by ID
export const useLifeInsurance = (policyId, options = {}) => {
  return useQuery({
    queryKey: lifeInsuranceKeys.detail(policyId),
    queryFn: () => lifeInsuranceService.getLifeInsuranceById(policyId),
    enabled: !!policyId,
    retry: 2,
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache the data
    refetchOnMount: true, // Always refetch on mount
    ...options,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch life insurance policy details');
    }
  });
};

// Hook to create life insurance policy
export const useCreateLifeInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyData, files }) => lifeInsuranceService.createLifeInsurance(policyData, files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.stats() });
      toast.success('Life Insurance policy created successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to create life insurance policy';
      toast.error(message);
    }
  });
};

// Hook to update life insurance policy
export const useUpdateLifeInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, policyData, files, deletedFiles }) => 
      lifeInsuranceService.updateLifeInsurance(policyId, policyData, files, deletedFiles),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        lifeInsuranceKeys.detail(variables.policyId),
        data
      );
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.lists() });
      toast.success('Life Insurance policy updated successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to update life insurance policy';
      toast.error(message);
    }
  });
};

// Hook to toggle life insurance policy status
export const useToggleLifeInsuranceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lifeInsuranceService.toggleLifeInsuranceStatus,
    onSuccess: (data, policyId) => {
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.stats() });
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.detail(policyId) });
      
      const status = data.data.lifeInsurance.isActive ? 'activated' : 'deactivated';
      toast.success(`Life Insurance policy ${status} successfully`);
    },
    onError: (error) => {
      const message = error.message || 'Failed to toggle life insurance policy status';
      toast.error(message);
    }
  });
};

// Hook to delete life insurance policy
export const useDeleteLifeInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lifeInsuranceService.deleteLifeInsurance,
    onSuccess: (data, policyId) => {
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.stats() });
      queryClient.removeQueries({ queryKey: lifeInsuranceKeys.detail(policyId) });
      toast.success('Life Insurance policy deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete life insurance policy';
      toast.error(message);
    }
  });
};

// Hook to delete document
export const useDeleteLifeInsuranceDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, documentId }) => 
      lifeInsuranceService.deleteDocument(policyId, documentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: lifeInsuranceKeys.detail(variables.policyId) });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete document';
      toast.error(message);
    }
  });
};

// Custom hook for managing life insurance list state (filters, pagination)
export const useLifeInsuranceListState = () => {
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