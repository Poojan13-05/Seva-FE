// src/services/vehicleInsuranceService.js
import api from '../lib/api';

export const vehicleInsuranceService = {
  // Get all vehicle insurance policies with pagination, search, and filtering
  getVehicleInsurancePolicies: async (params = {}) => {
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

      const response = await api.get('/vehicle-insurance', {
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

  // Get vehicle insurance statistics for dashboard
  getVehicleInsuranceStats: async () => {
    try {
      const response = await api.get('/vehicle-insurance/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get customers for dropdown
  getCustomersForDropdown: async () => {
    try {
      const response = await api.get('/vehicle-insurance/customers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get customer by ID for edit dialog
  getCustomerById: async (customerId) => {
    try {
      const response = await api.get(`/vehicle-insurance/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new vehicle insurance policy
  createVehicleInsurance: async (policyData, files = {}) => {
    try {
      const formData = new FormData();

      // Add policy data as JSON strings
      if (policyData.clientDetails) {
        formData.append('clientDetails', JSON.stringify(policyData.clientDetails));
      }
      if (policyData.insuranceDetails) {
        formData.append('insuranceDetails', JSON.stringify(policyData.insuranceDetails));
      }
      if (policyData.legalLiabilityAndCovers) {
        formData.append('legalLiabilityAndCovers', JSON.stringify(policyData.legalLiabilityAndCovers));
      }
      if (policyData.premiumCommissionDetails) {
        formData.append('premiumCommissionDetails', JSON.stringify(policyData.premiumCommissionDetails));
      }
      if (policyData.registrationPermitValidity) {
        formData.append('registrationPermitValidity', JSON.stringify(policyData.registrationPermitValidity));
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

      const response = await api.post('/vehicle-insurance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get vehicle insurance policy by ID
  getVehicleInsuranceById: async (policyId) => {
    try {
      const response = await api.get(`/vehicle-insurance/${policyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update vehicle insurance policy
  updateVehicleInsurance: async (policyId, policyData, files = {}, deletedFiles = {}) => {
    try {
      const formData = new FormData();

      // Add policy data as JSON strings
      if (policyData.clientDetails) {
        formData.append('clientDetails', JSON.stringify(policyData.clientDetails));
      }
      if (policyData.insuranceDetails) {
        formData.append('insuranceDetails', JSON.stringify(policyData.insuranceDetails));
      }
      if (policyData.legalLiabilityAndCovers) {
        formData.append('legalLiabilityAndCovers', JSON.stringify(policyData.legalLiabilityAndCovers));
      }
      if (policyData.premiumCommissionDetails) {
        formData.append('premiumCommissionDetails', JSON.stringify(policyData.premiumCommissionDetails));
      }
      if (policyData.registrationPermitValidity) {
        formData.append('registrationPermitValidity', JSON.stringify(policyData.registrationPermitValidity));
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

      const response = await api.put(`/vehicle-insurance/${policyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle vehicle insurance policy status
  toggleVehicleInsuranceStatus: async (policyId) => {
    try {
      const response = await api.patch(`/vehicle-insurance/${policyId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete vehicle insurance policy (soft delete)
  deleteVehicleInsurance: async (policyId) => {
    try {
      const response = await api.delete(`/vehicle-insurance/${policyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete document
  deleteDocument: async (policyId, documentId) => {
    try {
      const response = await api.delete(`/vehicle-insurance/${policyId}/documents/${documentId}`);
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
    'Driving License',
    'Mediclaim',
    'RC Book',
    'Other File'
  ],

  // Policy types list
  getPolicyTypes: () => [
    'New',
    'Renewal',
    'Rollover'
  ],

  // Agency/Broker codes list
  getAgencyBrokerCodes: () => [
    'Agency Code',
    'Broker Code'
  ],

  // Insurance types list
  getInsuranceTypes: () => [
    'Package',
    'Liability'
  ],

  // Vehicle types list
  getVehicleTypes: () => [
    'Old Vehicle',
    'New Vehicle'
  ],

  // Class of vehicle list
  getClassOfVehicle: () => [
    'Private Car',
    'Commercial (Truck/GCV)',
    'Two Wheeler',
    'Miscellaneous (JCB/Crane/Agriculture/Tractor)',
    '3 wheeler loading Rickshaw Goods Carrying',
    '3 Wheeler passenger Rikshaw above 5+ seater',
    'Passenger carrying taxi',
    'Passenger carrying maxi',
    'Passenger bus (Route Bus)',
    'Passenger carrying two wheeler'
  ],

  // PayOut types list
  getPayOutTypes: () => [
    'Own Damage Premium',
    'Net Premium',
    'Separate Commission'
  ]
};
