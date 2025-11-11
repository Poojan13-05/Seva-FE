// src/services/adminService.js
import api from '../lib/api';

export const adminService = {
  // Get all admins with pagination, search, and filtering
  getAdmins: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const response = await api.get('/super-admin/admins', {
        params: {
          page,
          limit,
          search,
          status,
          sortBy,
          sortOrder
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error.response?.data || error;
    }
  },

  // Get admin statistics for dashboard
  getAdminStats: async () => {
    try {
      const response = await api.get('/super-admin/admins/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error.response?.data || error;
    }
  },

  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const response = await api.post('/super-admin/admins', adminData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error.response?.data || error;
    }
  },

  // Get admin by ID
  getAdminById: async (adminId) => {
    try {
      const response = await api.get(`/super-admin/admins/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin:', error);
      throw error.response?.data || error;
    }
  },

  // Update admin
  updateAdmin: async (adminId, adminData) => {
    try {
      const response = await api.put(`/super-admin/admins/${adminId}`, adminData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error.response?.data || error;
    }
  },

  // Toggle admin status
  toggleAdminStatus: async (adminId) => {
    try {
      const response = await api.patch(`/super-admin/admins/${adminId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling admin status:', error);
      throw error.response?.data || error;
    }
  },

  // Reset admin password
  resetAdminPassword: async (adminId, newPassword) => {
    try {
      const response = await api.patch(`/super-admin/admins/${adminId}/reset-password`, {
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error resetting admin password:', error);
      throw error.response?.data || error;
    }
  },

  // Delete admin
  deleteAdmin: async (adminId) => {
    try {
      const response = await api.delete(`/super-admin/admins/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error.response?.data || error;
    }
  },

  // Bulk operations
  bulkUpdateAdmins: async (adminIds, action) => {
    try {
      const response = await api.post('/super-admin/admins/bulk', {
        adminIds,
        action
      });
      return response.data;
    } catch (error) {
      console.error('Error in bulk operation:', error);
      throw error.response?.data || error;
    }
  }
};

// Super Admin specific services for customer management
export const superAdminService = {
  // Get deleted customers
  getDeletedCustomers: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        customerType = 'all',
        sortBy = 'updatedAt',
        sortOrder = 'desc'
      } = params;

      const response = await api.get('/super-admin/customers/deleted', {
        params: {
          page,
          limit,
          search,
          customerType,
          sortBy,
          sortOrder
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted customers:', error);
      throw error.response?.data || error;
    }
  },

  // Get deleted customer statistics
  getDeletedCustomerStats: async () => {
    try {
      const response = await api.get('/super-admin/customers/deleted/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted customer stats:', error);
      throw error.response?.data || error;
    }
  },

  // Permanently delete customer
  permanentlyDeleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(`/super-admin/customers/${customerId}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting customer:', error);
      throw error.response?.data || error;
    }
  },

  // Recover customer
  recoverCustomer: async (customerId) => {
    try {
      const response = await api.patch(`/super-admin/customers/${customerId}/recover`);
      return response.data;
    } catch (error) {
      console.error('Error recovering customer:', error);
      throw error.response?.data || error;
    }
  },

  // Get deleted life insurance policies
  getDeletedLifeInsurancePolicies: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        insuranceCompany = 'all',
        policyType = 'all',
        sortBy = 'updatedAt',
        sortOrder = 'desc'
      } = params;

      const response = await api.get('/super-admin/life-insurance/deleted', {
        params: {
          page,
          limit,
          search,
          insuranceCompany,
          policyType,
          sortBy,
          sortOrder
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted life insurance policies:', error);
      throw error.response?.data || error;
    }
  },

  // Get deleted life insurance statistics
  getDeletedLifeInsuranceStats: async () => {
    try {
      const response = await api.get('/super-admin/life-insurance/deleted/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted life insurance stats:', error);
      throw error.response?.data || error;
    }
  },

  // Permanently delete life insurance policy
  permanentlyDeleteLifeInsurancePolicy: async (policyId) => {
    try {
      const response = await api.delete(`/super-admin/life-insurance/${policyId}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting life insurance policy:', error);
      throw error.response?.data || error;
    }
  },

  // Recover life insurance policy
  recoverLifeInsurancePolicy: async (policyId) => {
    try {
      const response = await api.patch(`/super-admin/life-insurance/${policyId}/recover`);
      return response.data;
    } catch (error) {
      console.error('Error recovering life insurance policy:', error);
      throw error.response?.data || error;
    }
  },

  // Get deleted health insurance policies
  getDeletedHealthInsurancePolicies: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        insuranceCompany = 'all',
        policyType = 'all',
        sortBy = 'updatedAt',
        sortOrder = 'desc'
      } = params;

      const response = await api.get('/super-admin/health-insurance/deleted', {
        params: {
          page,
          limit,
          search,
          insuranceCompany,
          policyType,
          sortBy,
          sortOrder
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted health insurance policies:', error);
      throw error.response?.data || error;
    }
  },

  // Get deleted health insurance statistics
  getDeletedHealthInsuranceStats: async () => {
    try {
      const response = await api.get('/super-admin/health-insurance/deleted/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted health insurance stats:', error);
      throw error.response?.data || error;
    }
  },

  // Permanently delete health insurance policy
  permanentlyDeleteHealthInsurancePolicy: async (policyId) => {
    try {
      const response = await api.delete(`/super-admin/health-insurance/${policyId}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting health insurance policy:', error);
      throw error.response?.data || error;
    }
  },

  // Recover health insurance policy
  recoverHealthInsurancePolicy: async (policyId) => {
    try {
      const response = await api.patch(`/super-admin/health-insurance/${policyId}/recover`);
      return response.data;
    } catch (error) {
      console.error('Error recovering health insurance policy:', error);
      throw error.response?.data || error;
    }
  },

  // Get deleted vehicle insurance policies
  getDeletedVehicleInsurancePolicies: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        insuranceCompany = 'all',
        policyType = 'all',
        sortBy = 'updatedAt',
        sortOrder = 'desc'
      } = params;

      const response = await api.get('/super-admin/vehicle-insurance/deleted', {
        params: {
          page,
          limit,
          search,
          insuranceCompany,
          policyType,
          sortBy,
          sortOrder
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted vehicle insurance policies:', error);
      throw error.response?.data || error;
    }
  },

  // Get deleted vehicle insurance statistics
  getDeletedVehicleInsuranceStats: async () => {
    try {
      const response = await api.get('/super-admin/vehicle-insurance/deleted/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted vehicle insurance stats:', error);
      throw error.response?.data || error;
    }
  },

  // Permanently delete vehicle insurance policy
  permanentlyDeleteVehicleInsurancePolicy: async (policyId) => {
    try {
      const response = await api.delete(`/super-admin/vehicle-insurance/${policyId}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting vehicle insurance policy:', error);
      throw error.response?.data || error;
    }
  },

  // Recover vehicle insurance policy
  recoverVehicleInsurancePolicy: async (policyId) => {
    try {
      const response = await api.patch(`/super-admin/vehicle-insurance/${policyId}/recover`);
      return response.data;
    } catch (error) {
      console.error('Error recovering vehicle insurance policy:', error);
      throw error.response?.data || error;
    }
  }
};