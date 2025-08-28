// src/services/lifeInsuranceService.js
import api from '../lib/api';

export const lifeInsuranceService = {
  // Get all life insurance policies with pagination, search, and filtering
  getLifeInsurancePolicies: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        insuranceCompany = 'all',
        policyType = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const response = await api.get('/life-insurance', {
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
      throw error.response?.data || error;
    }
  },

  // Get life insurance statistics for dashboard
  getLifeInsuranceStats: async () => {
    try {
      const response = await api.get('/life-insurance/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get customers for dropdown
  getCustomersForDropdown: async () => {
    try {
      const response = await api.get('/life-insurance/customers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get customer by ID for edit dialog
  getCustomerById: async (customerId) => {
    try {
      const response = await api.get(`/life-insurance/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new life insurance policy
  createLifeInsurance: async (policyData, files = {}) => {
    try {
      const formData = new FormData();
      
      // Add policy data as JSON strings
      if (policyData.clientDetails) {
        formData.append('clientDetails', JSON.stringify(policyData.clientDetails));
      }
      if (policyData.insuranceDetails) {
        formData.append('insuranceDetails', JSON.stringify(policyData.insuranceDetails));
      }
      if (policyData.commissionDetails) {
        formData.append('commissionDetails', JSON.stringify(policyData.commissionDetails));
      }
      if (policyData.nomineeDetails) {
        formData.append('nomineeDetails', JSON.stringify(policyData.nomineeDetails));
      }
      if (policyData.riderDetails) {
        formData.append('riderDetails', JSON.stringify(policyData.riderDetails));
      }
      if (policyData.bankDetails) {
        formData.append('bankDetails', JSON.stringify(policyData.bankDetails));
      }
      if (policyData.notes) {
        formData.append('notes', JSON.stringify(policyData.notes));
      }
      
      // Add files
      if (files.policyFile) {
        formData.append('policyFile', files.policyFile);
      }
      
      if (files.uploadDocuments && files.uploadDocuments.length > 0) {
        files.uploadDocuments.forEach((file, index) => {
          if (file) {
            formData.append('uploadDocuments', file);
          }
        });
        
        // Send document names as JSON array
        if (files.documentNames && files.documentNames.length > 0) {
          const validDocumentNames = files.documentNames.filter((name, index) => files.uploadDocuments[index]);
          formData.append('documentNames', JSON.stringify(validDocumentNames));
        }
      }

      const response = await api.post('/life-insurance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get life insurance policy by ID
  getLifeInsuranceById: async (policyId) => {
    try {
      const response = await api.get(`/life-insurance/${policyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update life insurance policy
  updateLifeInsurance: async (policyId, policyData, files = {}, deletedFiles = {}) => {
    try {
      const formData = new FormData();
      
      // Add policy data as JSON strings
      if (policyData.clientDetails) {
        formData.append('clientDetails', JSON.stringify(policyData.clientDetails));
      }
      if (policyData.insuranceDetails) {
        formData.append('insuranceDetails', JSON.stringify(policyData.insuranceDetails));
      }
      if (policyData.commissionDetails) {
        formData.append('commissionDetails', JSON.stringify(policyData.commissionDetails));
      }
      if (policyData.nomineeDetails) {
        formData.append('nomineeDetails', JSON.stringify(policyData.nomineeDetails));
      }
      if (policyData.riderDetails) {
        formData.append('riderDetails', JSON.stringify(policyData.riderDetails));
      }
      if (policyData.bankDetails) {
        formData.append('bankDetails', JSON.stringify(policyData.bankDetails));
      }
      if (policyData.notes) {
        formData.append('notes', JSON.stringify(policyData.notes));
      }

      // Handle policy file deletion flag
      if (policyData.deletePolicyFile) {
        formData.append('deletePolicyFile', 'true');
      }

      // Send complete document arrays (existing + new)
      if (policyData.uploadDocuments) {
        formData.append('uploadDocuments', JSON.stringify(policyData.uploadDocuments));
      }

      // Send information about deleted files
      if (deletedFiles.uploadDocuments && deletedFiles.uploadDocuments.length > 0) {
        formData.append('deletedDocuments', JSON.stringify(deletedFiles.uploadDocuments));
      }
      if (deletedFiles.policyFile) {
        formData.append('deletedPolicyFile', deletedFiles.policyFile);
      }
      
      // Add new files if any
      if (files.policyFile) {
        formData.append('policyFile', files.policyFile);
      }
      
      if (files.uploadDocuments && files.uploadDocuments.length > 0) {
        files.uploadDocuments.forEach((file, index) => {
          if (file) {
            formData.append('newUploadDocuments', file);
          }
        });
        
        // Send new document names as JSON array
        if (files.documentNames && files.documentNames.length > 0) {
          const validDocumentNames = files.documentNames.filter((name, index) => files.uploadDocuments[index]);
          formData.append('newDocumentNames', JSON.stringify(validDocumentNames));
        }
      }

      const response = await api.put(`/life-insurance/${policyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle life insurance policy status
  toggleLifeInsuranceStatus: async (policyId) => {
    try {
      const response = await api.patch(`/life-insurance/${policyId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete life insurance policy (soft delete)
  deleteLifeInsurance: async (policyId) => {
    try {
      const response = await api.delete(`/life-insurance/${policyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete document
  deleteDocument: async (policyId, documentId) => {
    try {
      const response = await api.delete(`/life-insurance/${policyId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Insurance companies list
  getInsuranceCompanies: () => [
    'Acko General Insurance Limited',
    'Agriculture Insurance Company on India Ltd',
    'Bajaj Allianz General Insurance Company Limited',
    'Cholamandalam MS General Insurance Company Limited',
    'ECGC Limited',
    'Future Generali India Insurance Co Ltd',
    'Go digit General Insurance Ltd',
    'HDFC ERGO General Insurance Ltd',
    'ICICI LOMBARD General Insurance Ltd',
    'IFFCO TOKIO General Insurance Co Ltd',
    'Kotak Mahindra General Insurance Company Limited',
    'Kshema General Insurance Limited',
    'Libertly General Insurance Ltd',
    'Magma HDI General Insurance Co Ltd',
    'National Insurance Co Ltd',
    'Navi General Insurance Limited',
    'Raheja QBE General Insurance Co Ltd',
    'Reliance General Insurance Co Ltd',
    'Royal Sundaram General Insurance Co Ltd',
    'SBI General Insurance Co Ltd',
    'Shriram General Insurance Co Ltd',
    'TATA AIG General Insurance Co Ltd',
    'The New India Assurance Co Ltd',
    'The Oriental Insurance Company Limited',
    'United India Insurance Company Limited',
    'Universal Sampo General Insurance Co Ltd',
    'Zuno General Insurance Ltd'
  ],

  // Document types list
  getDocumentTypes: () => [
    'Document',
    'Aadhaar Card',
    'Pancard',
    'Driving License',
    'Mediclaim',
    'RC Book',
    'Other File'
  ],

  // Payment modes list
  getPaymentModes: () => [
    'Yearly',
    'Half Yearly',
    'Quaterly',
    'Monthly',
    'Single'
  ],

  // Policy types list
  getPolicyTypes: () => [
    'New',
    'Renewal'
  ],

  // Agency codes list
  getAgencyCodes: () => [
    'Agency Code',
    'Broker Code'
  ]
};