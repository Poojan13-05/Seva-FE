// src/hooks/useVehicleInsurance.js
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vehicleInsuranceService } from '../services/vehicleInsuranceService';
import { toast } from 'sonner';

// Query keys for caching
export const vehicleInsuranceKeys = {
  all: ['vehicle-insurance'],
  lists: () => [...vehicleInsuranceKeys.all, 'list'],
  list: (params) => [...vehicleInsuranceKeys.lists(), params],
  stats: () => [...vehicleInsuranceKeys.all, 'stats'],
  detail: (id) => [...vehicleInsuranceKeys.all, 'detail', id],
  customers: () => [...vehicleInsuranceKeys.all, 'customers'],
};

// Hook to get vehicle insurance policies list with pagination, search, filtering
export const useVehicleInsurancePolicies = (params = {}) => {
  return useQuery({
    queryKey: vehicleInsuranceKeys.list(params),
    queryFn: () => vehicleInsuranceService.getVehicleInsurancePolicies(params),
    keepPreviousData: true,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch vehicle insurance policies');
    }
  });
};

// Hook to get vehicle insurance statistics
export const useVehicleInsuranceStats = () => {
  return useQuery({
    queryKey: vehicleInsuranceKeys.stats(),
    queryFn: vehicleInsuranceService.getVehicleInsuranceStats,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch vehicle insurance statistics');
    }
  });
};

// Hook to get customers for dropdown
export const useCustomersForDropdown = () => {
  return useQuery({
    queryKey: vehicleInsuranceKeys.customers(),
    queryFn: vehicleInsuranceService.getCustomersForDropdown,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customers');
    }
  });
};

// Hook to get customer by ID
export const useCustomerById = (customerId) => {
  return useQuery({
    queryKey: [...vehicleInsuranceKeys.customers(), 'detail', customerId],
    queryFn: () => vehicleInsuranceService.getCustomerById(customerId),
    enabled: !!customerId,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch customer details');
    }
  });
};

// Hook to get vehicle insurance policy by ID
export const useVehicleInsurance = (policyId, options = {}) => {
  return useQuery({
    queryKey: vehicleInsuranceKeys.detail(policyId),
    queryFn: () => vehicleInsuranceService.getVehicleInsuranceById(policyId),
    enabled: !!policyId,
    retry: 2,
    refetchOnMount: true,
    ...options,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch vehicle insurance policy details');
    }
  });
};

// Hook to create vehicle insurance policy
export const useCreateVehicleInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyData, files }) => vehicleInsuranceService.createVehicleInsurance(policyData, files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.stats() });
      toast.success('Vehicle Insurance policy created successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to create vehicle insurance policy';
      toast.error(message);
    }
  });
};

// Hook to update vehicle insurance policy
export const useUpdateVehicleInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, policyData, files, deletedFiles }) =>
      vehicleInsuranceService.updateVehicleInsurance(policyId, policyData, files, deletedFiles),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        vehicleInsuranceKeys.detail(variables.policyId),
        data
      );
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.lists() });
      toast.success('Vehicle Insurance policy updated successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to update vehicle insurance policy';
      toast.error(message);
    }
  });
};

// Hook to toggle vehicle insurance policy status
export const useToggleVehicleInsuranceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleInsuranceService.toggleVehicleInsuranceStatus,
    onSuccess: (data, policyId) => {
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.stats() });
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.detail(policyId) });

      const status = data.data.vehicleInsurance.isActive ? 'activated' : 'deactivated';
      toast.success(`Vehicle Insurance policy ${status} successfully`);
    },
    onError: (error) => {
      const message = error.message || 'Failed to toggle vehicle insurance policy status';
      toast.error(message);
    }
  });
};

// Hook to delete vehicle insurance policy
export const useDeleteVehicleInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleInsuranceService.deleteVehicleInsurance,
    onSuccess: (data, policyId) => {
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.stats() });
      queryClient.removeQueries({ queryKey: vehicleInsuranceKeys.detail(policyId) });
      toast.success('Vehicle Insurance policy deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete vehicle insurance policy';
      toast.error(message);
    }
  });
};

// Hook to delete document
export const useDeleteVehicleInsuranceDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, documentId }) =>
      vehicleInsuranceService.deleteDocument(policyId, documentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: vehicleInsuranceKeys.detail(variables.policyId) });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      const message = error.message || 'Failed to delete document';
      toast.error(message);
    }
  });
};

// Custom hook for managing vehicle insurance list state (filters, pagination)
export const useVehicleInsuranceListState = () => {
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
