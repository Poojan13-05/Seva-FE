// src/services/healthInsuranceService.js
import api from '../lib/api';

export const healthInsuranceService = {
  // Get all health insurance policies with pagination, search, and filtering
  getHealthInsurancePolicies: async (params = {}) => {
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

      const response = await api.get('/health-insurance', {
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

  // Get health insurance statistics for dashboard
  getHealthInsuranceStats: async () => {
    try {
      const response = await api.get('/health-insurance/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get customers for dropdown
  getCustomersForDropdown: async () => {
    try {
      const response = await api.get('/health-insurance/customers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get customer by ID for edit dialog
  getCustomerById: async (customerId) => {
    try {
      const response = await api.get(`/health-insurance/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new health insurance policy
  createHealthInsurance: async (policyData, files = {}) => {
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
      if (policyData.familyDetails) {
        formData.append('familyDetails', JSON.stringify(policyData.familyDetails));
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

      const response = await api.post('/health-insurance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get health insurance policy by ID
  getHealthInsuranceById: async (policyId) => {
    try {
      const response = await api.get(`/health-insurance/${policyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update health insurance policy
  updateHealthInsurance: async (policyId, policyData, files = {}, deletedFiles = {}) => {
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
      if (policyData.familyDetails) {
        formData.append('familyDetails', JSON.stringify(policyData.familyDetails));
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

      const response = await api.put(`/health-insurance/${policyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle health insurance policy status
  toggleHealthInsuranceStatus: async (policyId) => {
    try {
      const response = await api.patch(`/health-insurance/${policyId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete health insurance policy (soft delete)
  deleteHealthInsurance: async (policyId) => {
    try {
      const response = await api.delete(`/health-insurance/${policyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hard delete health insurance policy (super admin only)
  hardDeleteHealthInsurance: async (policyId) => {
    try {
      const response = await api.delete(`/health-insurance/${policyId}/hard`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete document
  deleteDocument: async (policyId, documentId) => {
    try {
      const response = await api.delete(`/health-insurance/${policyId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Insurance companies list
  getInsuranceCompanies: () => [
    'Acko General Insurance Limited',
    'Aditya Birla Health Insurance',
    'Agriculture Insurance Company of India Ltd',
    'Bajaj Allianz General Insurance Company Limited',
    'Care Health Insurance Ltd',
    'Cholamandalam MS General Insurance Co Ltd',
    'ECGC Limited',
    'Future Generali India Insurance Co Ltd',
    'Go digital General Insurance Limited',
    'HDFC General Insurance Co Ltd',
    'ICICI Lombard General Insurance Co. Ltd',
    'IFFCO TOKIO General Insurance Co. Ltd',
    'Kotak Mahindra General Insurance Company Limited',
    'Kshema General Insurance Limited',
    'Liberty General Insurance Ltd',
    'Magma HDI General Insurance Co. Ltd',
    'Manipal Cigna Health Insurance Company Limited',
    'National Insurance Co. Ltd',
    'Navi General Insurance Limited',
    'Niva Bupa Health Insurance Co Ltd',
    'Raheja QBE General Insurance Co Ltd',
    'Reliance General Insurance Co Ltd',
    'Royal Sundaram General Co. Ltd',
    'SBI General Insurance Company Ltd',
    'Shriram General Insurance Company Ltd',
    'Star Health Allied Insurance Co Ltd',
    'Tata AIG General Insurance Co Ltd',
    'The New India Assurance Co. Ltd',
    'The Oriental Insurance Company Limited',
    'United India Insurance Company Ltd',
    'Universal Sompo General Insurance Co Ltd',
    'Zuno General Insurance Ltd'
  ],

  // Document types list
  getDocumentTypes: () => [
    'Document',
    'Aadhaar Card',
    'Pancard',
    'Driving Licencse',
    'RC Book',
    'Mediclaim',
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
    'Renewal',
    'Portability'
  ],

  // Agency/Broker codes list
  getAgencyBrokerCodes: () => [
    'Agency Code',
    'Broker Code'
  ],

  // Insurance types list
  getInsuranceTypes: () => [
    'Single',
    'Floater'
  ],

  // Claim process list
  getClaimProcessTypes: () => [
    'Inhouse',
    'TPA'
  ],

  // Gender list
  getGenderOptions: () => [
    'Male',
    'Female',
    'Other'
  ],

  // Relationship list
  getRelationshipOptions: () => [
    'Husband',
    'Wife',
    'Daughter',
    'Son',
    'Brother',
    'Sister'
  ]
};
