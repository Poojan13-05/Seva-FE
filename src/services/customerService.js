// src/services/customerService.js
import api from '../lib/api';

export const customerService = {
  // Get all customers with pagination, search, and filtering
  getCustomers: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        customerType = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const response = await api.get('/customers', {
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
      console.error('Error fetching customers:', error);
      throw error.response?.data || error;
    }
  },

  // Get customer statistics for dashboard
  getCustomerStats: async () => {
    try {
      const response = await api.get('/customers/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error.response?.data || error;
    }
  },

  // Create new customer
  createCustomer: async (customerData, files = {}) => {
    try {
      const formData = new FormData();
      
      // Add customer data as JSON strings
      if (customerData.personalDetails) {
        formData.append('personalDetails', JSON.stringify(customerData.personalDetails));
      }
      if (customerData.corporateDetails && customerData.corporateDetails.length > 0) {
        formData.append('corporateDetails', JSON.stringify(customerData.corporateDetails));
      }
      if (customerData.familyDetails && customerData.familyDetails.length > 0) {
        formData.append('familyDetails', JSON.stringify(customerData.familyDetails));
      }
      
      // Add customer type
      formData.append('customerType', customerData.customerType);
      
      // Add files
      if (files.profilePhoto) {
        formData.append('profilePhoto', files.profilePhoto);
      }
      
      if (files.documents && files.documents.length > 0) {
        files.documents.forEach((file, index) => {
          formData.append('documents', file);
          formData.append('documentTypes', files.documentTypes[index] || 'other');
        });
      }
      
      if (files.additionalDocuments && files.additionalDocuments.length > 0) {
        files.additionalDocuments.forEach((file, index) => {
          formData.append('additionalDocuments', file);
          formData.append('additionalDocumentNames', files.additionalDocumentNames[index] || file.name);
        });
      }

      const response = await api.post('/customers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error.response?.data || error;
    }
  },

  // Get customer by ID
  getCustomerById: async (customerId) => {
    try {
      const response = await api.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error.response?.data || error;
    }
  },

  // Update customer
  updateCustomer: async (customerId, customerData, files = {}) => {
    try {
      const formData = new FormData();
      
      // Add customer data as JSON strings
      if (customerData.personalDetails) {
        formData.append('personalDetails', JSON.stringify(customerData.personalDetails));
      }
      if (customerData.corporateDetails) {
        formData.append('corporateDetails', JSON.stringify(customerData.corporateDetails));
      }
      if (customerData.familyDetails) {
        formData.append('familyDetails', JSON.stringify(customerData.familyDetails));
      }
      
      // Send complete document arrays (existing + new)
      if (customerData.documents) {
        formData.append('documents', JSON.stringify(customerData.documents));
      }
      if (customerData.additionalDocuments) {
        formData.append('additionalDocuments', JSON.stringify(customerData.additionalDocuments));
      }
      
      // Add customer type
      if (customerData.customerType) {
        formData.append('customerType', customerData.customerType);
      }
      
      // Add new files if any
      if (files.profilePhoto) {
        formData.append('profilePhoto', files.profilePhoto);
      }
      
      // FIXED: Use consistent field names for new documents
      if (files.documents && files.documents.length > 0) {
        files.documents.forEach((file, index) => {
          formData.append('newDocuments', file);
          if (files.documentTypes && files.documentTypes[index]) {
            formData.append('newDocumentTypes', files.documentTypes[index]);
          }
        });
      }
      
      if (files.additionalDocuments && files.additionalDocuments.length > 0) {
        files.additionalDocuments.forEach((file, index) => {
          formData.append('newAdditionalDocuments', file);
          if (files.additionalDocumentNames && files.additionalDocumentNames[index]) {
            formData.append('newAdditionalDocumentNames', files.additionalDocumentNames[index]);
          }
        });
      }

      const response = await api.put(`/customers/${customerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error.response?.data || error;
    }
  },

  // Toggle customer status
  toggleCustomerStatus: async (customerId) => {
    try {
      const response = await api.patch(`/customers/${customerId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling customer status:', error);
      throw error.response?.data || error;
    }
  },

  // Delete customer (soft delete)
  deleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error.response?.data || error;
    }
  },

  // Delete document
  deleteDocument: async (customerId, documentId, documentType = 'documents') => {
    try {
      const response = await api.delete(`/customers/${customerId}/documents/${documentId}?documentType=${documentType}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error.response?.data || error;
    }
  },

  // Export customers to Excel
  exportCustomers: async () => {
    try {
      const response = await api.get('/customers/export');
      return response.data;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error.response?.data || error;
    }
  }
};