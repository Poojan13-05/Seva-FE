// src/components/admin/HealthInsuranceForm.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  FileText,
  AlertTriangle,
  User,
  Heart,
  DollarSign,
  UserCheck,
  Upload as UploadIcon,
  StickyNote,
  Users,
  FileImage,
  Plus,
  Minus
} from 'lucide-react';
import { healthInsuranceService } from '@/services/healthInsuranceService';
import { useCustomersForDropdown } from '@/hooks/useHealthInsurance';

const HealthInsuranceForm = ({
  initialData = null,
  onSubmit,
  isLoading = false,
  errors = {},
  selectedCustomer = null
}) => {
  const { data: customersData } = useCustomersForDropdown();
  const customersFromAPI = customersData?.data?.customers || [];

  // Merge selected customer with fetched customers to ensure it's in the dropdown
  const customers = React.useMemo(() => {
    if (!selectedCustomer) return customersFromAPI;

    // Check if selected customer already exists in the list
    const exists = customersFromAPI.some(c => c.value === selectedCustomer.value);

    if (exists) {
      return customersFromAPI;
    }

    // Add selected customer to the beginning of the list
    return [selectedCustomer, ...customersFromAPI];
  }, [customersFromAPI, selectedCustomer]);

  // Form state - initialize with selectedCustomer if available
  const [formData, setFormData] = useState({
    clientDetails: {
      customer: selectedCustomer?.value || initialData?.clientDetails?.customer?._id || initialData?.clientDetails?.customer || ''
    },
    insuranceDetails: {
      insuranceCompany: '',
      agencyBrokerCode: '',
      policyType: '',
      insuranceType: '',
      planName: '',
      policyNumber: '',
      policyBookingDate: '',
      policyStartDate: '',
      policyEndDate: '',
      policyTerm: '',
      paymentMode: '',
      claimProcess: '',
      sumInsured: '',
      netPremium: '',
      gstPercent: '',
      totalPremium: ''
    },
    commissionDetails: {
      mainAgentCommissionPercent: '',
      mainAgentCommission: '',
      mainAgentTDSPercent: '',
      mainAgentTDSAmount: '',
      referenceByName: '',
      brokerName: ''
    },
    familyDetails: [],
    notes: {
      note: ''
    }
  });

  // File states
  const [files, setFiles] = useState({
    policyFile: null,
    uploadDocuments: [],
    documentNames: []
  });

  // Preview states
  const [filePreviews, setFilePreviews] = useState({
    policyFile: null,
    uploadDocuments: []
  });

  // Existing documents state (for edit mode)
  const [existingDocuments, setExistingDocuments] = useState({
    policyFile: null,
    uploadDocuments: []
  });

  // Deleted files tracking
  const [deletedFiles, setDeletedFiles] = useState({
    policyFile: null,
    uploadDocuments: []
  });

  // Load initial data if editing - run when initialData or selectedCustomer changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        clientDetails: {
          customer: selectedCustomer?.value || initialData.clientDetails?.customer?._id || initialData.clientDetails?.customer || ''
        },
        insuranceDetails: {
          insuranceCompany: initialData.insuranceDetails?.insuranceCompany || '',
          agencyBrokerCode: initialData.insuranceDetails?.agencyBrokerCode || '',
          policyType: initialData.insuranceDetails?.policyType || '',
          insuranceType: initialData.insuranceDetails?.insuranceType || '',
          planName: initialData.insuranceDetails?.planName || '',
          policyNumber: initialData.insuranceDetails?.policyNumber || '',
          policyBookingDate: initialData.insuranceDetails?.policyBookingDate ? new Date(initialData.insuranceDetails.policyBookingDate).toISOString().split('T')[0] : '',
          policyStartDate: initialData.insuranceDetails?.policyStartDate ? new Date(initialData.insuranceDetails.policyStartDate).toISOString().split('T')[0] : '',
          policyEndDate: initialData.insuranceDetails?.policyEndDate ? new Date(initialData.insuranceDetails.policyEndDate).toISOString().split('T')[0] : '',
          policyTerm: initialData.insuranceDetails?.policyTerm || '',
          paymentMode: initialData.insuranceDetails?.paymentMode || '',
          claimProcess: initialData.insuranceDetails?.claimProcess || '',
          sumInsured: initialData.insuranceDetails?.sumInsured || '',
          netPremium: initialData.insuranceDetails?.netPremium || '',
          gstPercent: initialData.insuranceDetails?.gstPercent || '',
          totalPremium: initialData.insuranceDetails?.totalPremium || ''
        },
        commissionDetails: {
          mainAgentCommissionPercent: initialData.commissionDetails?.mainAgentCommissionPercent || '',
          mainAgentCommission: initialData.commissionDetails?.mainAgentCommission || '',
          mainAgentTDSPercent: initialData.commissionDetails?.mainAgentTDSPercent || '',
          mainAgentTDSAmount: initialData.commissionDetails?.mainAgentTDSAmount || '',
          referenceByName: initialData.commissionDetails?.referenceByName || '',
          brokerName: initialData.commissionDetails?.brokerName || ''
        },
        familyDetails: initialData.familyDetails || [],
        notes: {
          note: initialData.notes?.note || ''
        }
      });

      // Load existing policy file
      if (initialData.uploadPolicy?.policyFileUrl) {
        setExistingDocuments(prev => ({
          ...prev,
          policyFile: {
            url: initialData.uploadPolicy.policyFileUrl,
            name: initialData.uploadPolicy.originalName || 'Policy File'
          }
        }));
      }

      // Load existing documents
      if (initialData.uploadDocuments && initialData.uploadDocuments.length > 0) {
        setExistingDocuments(prev => ({
          ...prev,
          uploadDocuments: initialData.uploadDocuments.map(doc => ({
            _id: doc._id,
            url: doc.documentUrl,
            name: doc.originalName || doc.documentName,
            documentName: doc.documentName,
            fileSize: doc.fileSize
          }))
        }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount - selectedCustomer is already in initial state

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));

    // Create preview for policy file
    if (field === 'policyFile' && file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews(prev => ({ ...prev, [field]: previewUrl }));
    }
  };

  const handleDocumentFileChange = (file, index) => {
    setFiles(prev => {
      const newDocuments = [...prev.uploadDocuments];
      newDocuments[index] = file;
      return { ...prev, uploadDocuments: newDocuments };
    });

    // Create preview
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews(prev => {
        const newPreviews = [...prev.uploadDocuments];
        newPreviews[index] = previewUrl;
        return { ...prev, uploadDocuments: newPreviews };
      });
    }
  };

  const addDocumentField = () => {
    setFiles(prev => ({
      ...prev,
      uploadDocuments: [...prev.uploadDocuments, null],
      documentNames: [...prev.documentNames, '']
    }));
  };

  const removeDocumentField = (index) => {
    setFiles(prev => ({
      ...prev,
      uploadDocuments: prev.uploadDocuments.filter((_, i) => i !== index),
      documentNames: prev.documentNames.filter((_, i) => i !== index)
    }));
    setFilePreviews(prev => ({
      ...prev,
      uploadDocuments: prev.uploadDocuments.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentNameChange = (index, name) => {
    setFiles(prev => {
      const newNames = [...prev.documentNames];
      newNames[index] = name;
      return { ...prev, documentNames: newNames };
    });
  };

  // Family Details handlers
  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyDetails: [
        ...prev.familyDetails,
        {
          firstName: '',
          lastName: '',
          birthDate: '',
          gender: '',
          height: '',
          weight: '',
          relationship: '',
          panNumber: '',
          mobileNumber: '',
          sumInsured: ''
        }
      ]
    }));
  };

  const removeFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.filter((_, i) => i !== index)
    }));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFormData(prev => {
      const newFamilyDetails = [...prev.familyDetails];
      newFamilyDetails[index] = {
        ...newFamilyDetails[index],
        [field]: value
      };
      return { ...prev, familyDetails: newFamilyDetails };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data with existing documents that weren't deleted
    const submissionData = { ...formData };

    // If policy file was deleted, set the flag for backend
    if (deletedFiles.policyFile) {
      submissionData.deletePolicyFile = true;
    }

    // Add existing documents to uploadDocuments array with proper format for backend
    const existingDocsForSubmit = existingDocuments.uploadDocuments.map(doc => ({
      _id: doc._id,
      documentName: doc.documentName,
      existingUrl: doc.url,
      existingName: doc.name,
      fileSize: doc.fileSize
    }));

    // If there are existing documents, set them in the submission data
    if (existingDocsForSubmit.length > 0) {
      submissionData.uploadDocuments = existingDocsForSubmit;
    }

    onSubmit(submissionData, files, deletedFiles);
  };

  // Handler to remove existing policy file
  const handleRemoveExistingPolicyFile = () => {
    if (existingDocuments.policyFile) {
      setDeletedFiles(prev => ({
        ...prev,
        policyFile: existingDocuments.policyFile.url
      }));
      setExistingDocuments(prev => ({
        ...prev,
        policyFile: null
      }));
    }
  };

  // Handler to remove existing document
  const handleRemoveExistingDocument = (docId, docUrl) => {
    setDeletedFiles(prev => ({
      ...prev,
      uploadDocuments: [...prev.uploadDocuments, { _id: docId, documentUrl: docUrl }]
    }));
    setExistingDocuments(prev => ({
      ...prev,
      uploadDocuments: prev.uploadDocuments.filter(doc => doc._id !== docId)
    }));
  };

  const getFieldError = (section, field) => {
    return errors[section]?.[field];
  };

  return (
    <form id="health-insurance-form" onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="client" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full bg-white/10">
          <TabsTrigger value="client" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <User className="w-4 h-4" />
            Client
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <Heart className="w-4 h-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="commission" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <DollarSign className="w-4 h-4" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <Users className="w-4 h-4" />
            Family
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <UploadIcon className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <StickyNote className="w-4 h-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        {/* Client Details Tab */}
        <TabsContent value="client">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                Client Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-white">
                  Client Name <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.clientDetails.customer}
                  onValueChange={(value) => handleInputChange('clientDetails', 'customer', value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                    {customers.map(customer => (
                      <SelectItem key={customer.value} value={customer.value} className="text-gray-300 hover:text-white">
                        {customer.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('clientDetails', 'customer') && (
                  <p className="text-red-400 text-sm">{getFieldError('clientDetails', 'customer')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Details Tab */}
        <TabsContent value="insurance">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="w-5 h-5" />
                Insurance Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Insurance Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceCompany" className="text-white">Insurance Company <span className="text-red-400">*</span></Label>
                  <Select
                    value={formData.insuranceDetails.insuranceCompany}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'insuranceCompany', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select insurance company" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {healthInsuranceService.getInsuranceCompanies().map(company => (
                        <SelectItem key={company} value={company} className="text-gray-300 hover:text-white">
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agencyBrokerCode" className="text-white">Agency/Broker Code</Label>
                  <Select
                    value={formData.insuranceDetails.agencyBrokerCode}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'agencyBrokerCode', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select code" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {healthInsuranceService.getAgencyBrokerCodes().map(code => (
                        <SelectItem key={code} value={code} className="text-gray-300 hover:text-white">
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyType" className="text-white">Policy Type</Label>
                  <Select
                    value={formData.insuranceDetails.policyType}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'policyType', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {healthInsuranceService.getPolicyTypes().map(type => (
                        <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceType" className="text-white">Insurance Type</Label>
                  <Select
                    value={formData.insuranceDetails.insuranceType}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'insuranceType', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {healthInsuranceService.getInsuranceTypes().map(type => (
                        <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planName" className="text-white">Plan Name</Label>
                  <Input
                    id="planName"
                    value={formData.insuranceDetails.planName}
                    onChange={(e) => handleInputChange('insuranceDetails', 'planName', e.target.value)}
                    placeholder="Enter plan name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Policy Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Policy Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber" className="text-white">Policy Number <span className="text-red-400">*</span></Label>
                    <Input
                      id="policyNumber"
                      value={formData.insuranceDetails.policyNumber}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyNumber', e.target.value)}
                      placeholder="Enter policy number"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyBookingDate" className="text-white">Policy Booking Date</Label>
                    <Input
                      id="policyBookingDate"
                      type="date"
                      value={formData.insuranceDetails.policyBookingDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyBookingDate', e.target.value)}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyStartDate" className="text-white">Policy Start Date</Label>
                    <Input
                      id="policyStartDate"
                      type="date"
                      value={formData.insuranceDetails.policyStartDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyStartDate', e.target.value)}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyEndDate" className="text-white">Policy End Date</Label>
                    <Input
                      id="policyEndDate"
                      type="date"
                      value={formData.insuranceDetails.policyEndDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyEndDate', e.target.value)}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyTerm" className="text-white">Policy Term (Years)</Label>
                    <Input
                      id="policyTerm"
                      type="number"
                      value={formData.insuranceDetails.policyTerm}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyTerm', e.target.value)}
                      placeholder="Enter policy term"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode" className="text-white">Payment Mode</Label>
                    <Select
                      value={formData.insuranceDetails.paymentMode}
                      onValueChange={(value) => handleInputChange('insuranceDetails', 'paymentMode', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                        {healthInsuranceService.getPaymentModes().map(mode => (
                          <SelectItem key={mode} value={mode} className="text-gray-300 hover:text-white">
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claimProcess" className="text-white">Claim Process</Label>
                    <Select
                      value={formData.insuranceDetails.claimProcess}
                      onValueChange={(value) => handleInputChange('insuranceDetails', 'claimProcess', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select claim process" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                        {healthInsuranceService.getClaimProcessTypes().map(type => (
                          <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Financial Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Financial Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sumInsured" className="text-white">Sum Insured</Label>
                    <Input
                      id="sumInsured"
                      type="number"
                      value={formData.insuranceDetails.sumInsured}
                      onChange={(e) => handleInputChange('insuranceDetails', 'sumInsured', e.target.value)}
                      placeholder="Enter sum insured"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="netPremium" className="text-white">Net Premium</Label>
                    <Input
                      id="netPremium"
                      type="number"
                      value={formData.insuranceDetails.netPremium}
                      onChange={(e) => handleInputChange('insuranceDetails', 'netPremium', e.target.value)}
                      placeholder="Enter net premium"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstPercent" className="text-white">GST Percent</Label>
                    <Input
                      id="gstPercent"
                      type="number"
                      value={formData.insuranceDetails.gstPercent}
                      onChange={(e) => handleInputChange('insuranceDetails', 'gstPercent', e.target.value)}
                      placeholder="Enter GST percent"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalPremium" className="text-white">Total Premium</Label>
                    <Input
                      id="totalPremium"
                      type="number"
                      value={formData.insuranceDetails.totalPremium}
                      onChange={(e) => handleInputChange('insuranceDetails', 'totalPremium', e.target.value)}
                      placeholder="Enter total premium"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Details Tab */}
        <TabsContent value="commission">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5" />
                Commission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainAgentCommissionPercent" className="text-white">Main Agent Commission (%)</Label>
                  <Input
                    id="mainAgentCommissionPercent"
                    type="number"
                    value={formData.commissionDetails.mainAgentCommissionPercent}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentCommissionPercent', e.target.value)}
                    placeholder="Enter commission percentage"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainAgentCommission" className="text-white">Main Agent Commission Amount</Label>
                  <Input
                    id="mainAgentCommission"
                    type="number"
                    value={formData.commissionDetails.mainAgentCommission}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentCommission', e.target.value)}
                    placeholder="Enter commission amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainAgentTDSPercent" className="text-white">Main Agent TDS (%)</Label>
                  <Input
                    id="mainAgentTDSPercent"
                    type="number"
                    value={formData.commissionDetails.mainAgentTDSPercent}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentTDSPercent', e.target.value)}
                    placeholder="Enter TDS percentage"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainAgentTDSAmount" className="text-white">Main Agent TDS Amount</Label>
                  <Input
                    id="mainAgentTDSAmount"
                    type="number"
                    value={formData.commissionDetails.mainAgentTDSAmount}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentTDSAmount', e.target.value)}
                    placeholder="Enter TDS amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referenceByName" className="text-white">Reference By Name</Label>
                  <Input
                    id="referenceByName"
                    value={formData.commissionDetails.referenceByName}
                    onChange={(e) => handleInputChange('commissionDetails', 'referenceByName', e.target.value)}
                    placeholder="Enter reference name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerName" className="text-white">Broker Name</Label>
                  <Input
                    id="brokerName"
                    value={formData.commissionDetails.brokerName}
                    onChange={(e) => handleInputChange('commissionDetails', 'brokerName', e.target.value)}
                    placeholder="Enter broker name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Details Tab */}
        <TabsContent value="family">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Family Details
                </div>
                <Button
                  type="button"
                  onClick={addFamilyMember}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Family Member
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.familyDetails.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No family members added yet</p>
                  <p className="text-sm">Click "Add Family Member" to start</p>
                </div>
              ) : (
                formData.familyDetails.map((member, index) => (
                  <Card key={index} className="bg-white/5 border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">Family Member {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          size="sm"
                          variant="destructive"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        >
                          <Minus className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">First Name</Label>
                          <Input
                            value={member.firstName}
                            onChange={(e) => handleFamilyMemberChange(index, 'firstName', e.target.value)}
                            placeholder="Enter first name"
                            className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Last Name</Label>
                          <Input
                            value={member.lastName}
                            onChange={(e) => handleFamilyMemberChange(index, 'lastName', e.target.value)}
                            placeholder="Enter last name"
                            className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Birth Date</Label>
                          <Input
                            type="date"
                            value={member.birthDate}
                            onChange={(e) => handleFamilyMemberChange(index, 'birthDate', e.target.value)}
                            className="bg-white/10 border-white/30 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Gender</Label>
                          <Select
                            value={member.gender}
                            onValueChange={(value) => handleFamilyMemberChange(index, 'gender', value)}
                          >
                            <SelectTrigger className="bg-white/10 border-white/30 text-white">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                              {healthInsuranceService.getGenderOptions().map(gender => (
                                <SelectItem key={gender} value={gender} className="text-gray-300 hover:text-white">
                                  {gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Relationship</Label>
                          <Select
                            value={member.relationship}
                            onValueChange={(value) => handleFamilyMemberChange(index, 'relationship', value)}
                          >
                            <SelectTrigger className="bg-white/10 border-white/30 text-white">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                              {healthInsuranceService.getRelationshipOptions().map(rel => (
                                <SelectItem key={rel} value={rel} className="text-gray-300 hover:text-white">
                                  {rel}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Height (feet)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={member.height}
                            onChange={(e) => handleFamilyMemberChange(index, 'height', e.target.value)}
                            placeholder="e.g., 5.6"
                            className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Weight (kg)</Label>
                          <Input
                            type="number"
                            value={member.weight}
                            onChange={(e) => handleFamilyMemberChange(index, 'weight', e.target.value)}
                            placeholder="Enter weight"
                            className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">PAN Number</Label>
                          <Input
                            value={member.panNumber}
                            onChange={(e) => handleFamilyMemberChange(index, 'panNumber', e.target.value.toUpperCase())}
                            placeholder="Enter PAN"
                            maxLength={10}
                            className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Mobile Number</Label>
                          <Input
                            value={member.mobileNumber}
                            onChange={(e) => handleFamilyMemberChange(index, 'mobileNumber', e.target.value)}
                            placeholder="Enter mobile"
                            maxLength={10}
                            className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Sum Insured</Label>
                        <Input
                          type="number"
                          value={member.sumInsured}
                          onChange={(e) => handleFamilyMemberChange(index, 'sumInsured', e.target.value)}
                          placeholder="Enter sum insured"
                          className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UploadIcon className="w-5 h-5" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Policy File Upload */}
              <div className="space-y-2">
                <Label htmlFor="policyFile" className="text-white">Upload Policy File</Label>

                {/* Existing Policy File */}
                {existingDocuments.policyFile && (
                  <div className="mb-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-sm text-white font-medium">Current File: {existingDocuments.policyFile.name}</p>
                        <a
                          href={existingDocuments.policyFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          View File
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveExistingPolicyFile}
                      className="text-red-400 hover:text-red-500"
                      title="Remove existing file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="border-2 border-dashed border-white/20 rounded-lg p-4">
                  <input
                    id="policyFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('policyFile', e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="policyFile"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-300">
                      {existingDocuments.policyFile ? 'Click to replace policy file' : 'Click to upload policy file'}
                    </p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
                  </label>
                  {files.policyFile && (
                    <div className="mt-2 p-2 bg-white/5 rounded flex items-center justify-between">
                      <span className="text-sm text-white">{files.policyFile.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileChange('policyFile', null)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Upload Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Upload Documents</Label>
                  <Button
                    type="button"
                    onClick={addDocumentField}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Document
                  </Button>
                </div>

                {/* Existing Documents */}
                {existingDocuments.uploadDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white">Existing Documents</h4>
                    {existingDocuments.uploadDocuments.map((doc) => (
                      <div key={doc._id} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <FileImage className="w-4 h-4 text-blue-400" />
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">{doc.documentName}</p>
                              <p className="text-xs text-gray-400">{doc.name}</p>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300"
                              >
                                View Document
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingDocument(doc._id, doc.url)}
                            className="text-red-400 hover:text-red-500"
                            title="Remove document"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Documents */}
                {files.uploadDocuments.length > 0 && (
                  <h4 className="text-sm font-medium text-white">New Documents</h4>
                )}

                {files.uploadDocuments.map((file, index) => (
                  <div key={index} className="border border-white/20 rounded-lg p-4 space-y-3 bg-white/5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Document {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeDocumentField(index)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Document Name</Label>
                        <Select
                          value={files.documentNames[index] || ''}
                          onValueChange={(value) => handleDocumentNameChange(index, value)}
                        >
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                            {healthInsuranceService.getDocumentTypes().map(type => (
                              <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Upload File</Label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentFileChange(e.target.files[0], index)}
                          className="w-full text-sm border border-white/30 rounded-md p-2 bg-white/10 text-white"
                        />
                      </div>
                    </div>

                    {file && (
                      <div className="p-2 bg-white/5 rounded flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-white">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <StickyNote className="w-5 h-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="note" className="text-white">Note</Label>
                <Textarea
                  id="note"
                  value={formData.notes.note}
                  onChange={(e) => handleInputChange('notes', 'note', e.target.value)}
                  placeholder="Enter any additional notes..."
                  rows={4}
                  className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default HealthInsuranceForm;
