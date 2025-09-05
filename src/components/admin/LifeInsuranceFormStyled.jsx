// src/components/admin/LifeInsuranceFormStyled.jsx
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
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X, 
  FileText,
  User,
  Shield,
  DollarSign,
  UserCheck,
  Upload as UploadIcon,
  StickyNote,
  Activity,
  CreditCard,
  Plus
} from 'lucide-react';
import { lifeInsuranceService } from '@/services/lifeInsuranceService';
import { useCustomersForDropdown } from '@/hooks/useLifeInsurance';

const LifeInsuranceFormStyled = ({ 
  initialData = null, 
  onSubmit, 
  isLoading = false,
  errors = {},
  resetForm = false,
  onResetComplete,
  selectedCustomer = null // Customer details for edit mode
}) => {
  const { data: customersData } = useCustomersForDropdown();
  const customers = customersData?.data?.customers || [];
  
  // If selectedCustomer is provided, always prioritize it and add to customers list
  const allCustomers = selectedCustomer 
    ? [selectedCustomer, ...customers.filter(c => c.value !== selectedCustomer.value)]
    : customers;

  // Form state
  const [formData, setFormData] = useState({
    clientDetails: {
      customer: '',
      insuredName: ''
    },
    insuranceDetails: {
      insuranceCompany: '',
      agencyCode: '',
      policyType: '',
      planName: '',
      paymentMode: '',
      policyNumber: '',
      policyDate: '',
      policyStartDate: '',
      policyEndDate: '',
      bookingDate: '',
      riskStartDate: '',
      policyTerm: '',
      premiumPaymentNumber: '',
      sumInsured: '',
      netPremium: '',
      firstYearGST: '',
      secondYearGST: '',
      thirdYearGST: '',
      totalPremium: '',
      bonus: '',
      fund: ''
    },
    commissionDetails: {
      mainAgentCommissionPercent: '',
      firstYear: '',
      mainAgentCommissionAmount: '',
      mainAgentTDSPercent: '',
      mainAgentTDSAmount: '',
      referenceByName: '',
      brokerName: ''
    },
    nomineeDetails: {
      nomineeName: '',
      nomineeRelationship: '',
      nomineeAge: ''
    },
    riderDetails: {
      termRider: { amount: '', note: '' },
      criticalIllnessRider: { amount: '', note: '' },
      accidentRider: { amount: '', note: '' },
      pwbRider: { amount: '', note: '' },
      othersRider: { amount: '', note: '' }
    },
    bankDetails: {
      bankName: '',
      accountType: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    },
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

  // Existing documents from initialData (for edit mode)
  const [existingDocuments, setExistingDocuments] = useState([]);
  
  // Track policy file deletion
  const [isPolicyFileDeleted, setIsPolicyFileDeleted] = useState(false);

  // Track deleted documents for S3 cleanup
  const [deletedDocuments, setDeletedDocuments] = useState([]);


  

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      // Handle customer ID - it could be a string ID or an object with _id
      const customerData = initialData.clientDetails?.customer;
      let customerId = '';
      
      if (typeof customerData === 'object' && customerData !== null) {
        // Backend sends populated customer object with _id field
        customerId = customerData._id || '';
      } else if (typeof customerData === 'string') {
        customerId = customerData;
      }
      
      const newFormData = {
        clientDetails: {
          customer: customerId,
          insuredName: initialData.clientDetails?.insuredName || ''
        },
        insuranceDetails: {
          insuranceCompany: initialData.insuranceDetails?.insuranceCompany || '',
          agencyCode: initialData.insuranceDetails?.agencyCode || '',
          policyType: initialData.insuranceDetails?.policyType || '',
          planName: initialData.insuranceDetails?.planName || '',
          paymentMode: initialData.insuranceDetails?.paymentMode || '',
          policyNumber: initialData.insuranceDetails?.policyNumber || '',
          policyDate: initialData.insuranceDetails?.policyDate ? new Date(initialData.insuranceDetails.policyDate).toISOString().split('T')[0] : '',
          policyStartDate: initialData.insuranceDetails?.policyStartDate ? new Date(initialData.insuranceDetails.policyStartDate).toISOString().split('T')[0] : '',
          policyEndDate: initialData.insuranceDetails?.policyEndDate ? new Date(initialData.insuranceDetails.policyEndDate).toISOString().split('T')[0] : '',
          bookingDate: initialData.insuranceDetails?.bookingDate ? new Date(initialData.insuranceDetails.bookingDate).toISOString().split('T')[0] : '',
          riskStartDate: initialData.insuranceDetails?.riskStartDate ? new Date(initialData.insuranceDetails.riskStartDate).toISOString().split('T')[0] : '',
          policyTerm: initialData.insuranceDetails?.policyTerm || '',
          premiumPaymentNumber: initialData.insuranceDetails?.premiumPaymentNumber || '',
          sumInsured: initialData.insuranceDetails?.sumInsured || '',
          netPremium: initialData.insuranceDetails?.netPremium || '',
          firstYearGST: initialData.insuranceDetails?.firstYearGST || '',
          secondYearGST: initialData.insuranceDetails?.secondYearGST || '',
          thirdYearGST: initialData.insuranceDetails?.thirdYearGST || '',
          totalPremium: initialData.insuranceDetails?.totalPremium || '',
          bonus: initialData.insuranceDetails?.bonus || '',
          fund: initialData.insuranceDetails?.fund || ''
        },
        commissionDetails: {
          mainAgentCommissionPercent: initialData.commissionDetails?.mainAgentCommissionPercent || '',
          firstYear: initialData.commissionDetails?.firstYear || '',
          mainAgentCommissionAmount: initialData.commissionDetails?.mainAgentCommissionAmount || '',
          mainAgentTDSPercent: initialData.commissionDetails?.mainAgentTDSPercent || '',
          mainAgentTDSAmount: initialData.commissionDetails?.mainAgentTDSAmount || '',
          referenceByName: initialData.commissionDetails?.referenceByName || '',
          brokerName: initialData.commissionDetails?.brokerName || ''
        },
        nomineeDetails: {
          nomineeName: initialData.nomineeDetails?.nomineeName || '',
          nomineeRelationship: initialData.nomineeDetails?.nomineeRelationship || '',
          nomineeAge: initialData.nomineeDetails?.nomineeAge || ''
        },
        riderDetails: {
          termRider: {
            amount: initialData.riderDetails?.termRider?.amount || '',
            note: initialData.riderDetails?.termRider?.note || ''
          },
          criticalIllnessRider: {
            amount: initialData.riderDetails?.criticalIllnessRider?.amount || '',
            note: initialData.riderDetails?.criticalIllnessRider?.note || ''
          },
          accidentRider: {
            amount: initialData.riderDetails?.accidentRider?.amount || '',
            note: initialData.riderDetails?.accidentRider?.note || ''
          },
          pwbRider: {
            amount: initialData.riderDetails?.pwbRider?.amount || '',
            note: initialData.riderDetails?.pwbRider?.note || ''
          },
          othersRider: {
            amount: initialData.riderDetails?.othersRider?.amount || '',
            note: initialData.riderDetails?.othersRider?.note || ''
          }
        },
        bankDetails: {
          bankName: initialData.bankDetails?.bankName || '',
          accountType: initialData.bankDetails?.accountType || '',
          accountNumber: initialData.bankDetails?.accountNumber || '',
          ifscCode: initialData.bankDetails?.ifscCode || '',
          accountHolderName: initialData.bankDetails?.accountHolderName || ''
        },
        notes: {
          note: initialData.notes?.note || ''
        }
      };
      
      setFormData(newFormData);
      
      // Load existing documents for edit mode
      if (initialData.uploadDocuments && initialData.uploadDocuments.length > 0) {
        setExistingDocuments(initialData.uploadDocuments);
      }
    }
  }, [initialData]);


  // Reset form when resetForm prop changes
  useEffect(() => {
    
    if (resetForm && !initialData) {
      setFormData({
        clientDetails: {
          customer: '',
          insuredName: ''
        },
        insuranceDetails: {
          insuranceCompany: '',
          agencyCode: '',
          policyType: '',
          planName: '',
          paymentMode: '',
          policyNumber: '',
          policyDate: '',
          policyStartDate: '',
          policyEndDate: '',
          bookingDate: '',
          riskStartDate: '',
          policyTerm: '',
          premiumPaymentNumber: '',
          sumInsured: '',
          netPremium: '',
          firstYearGST: '',
          secondYearGST: '',
          thirdYearGST: '',
          totalPremium: '',
          bonus: '',
          fund: ''
        },
        commissionDetails: {
          mainAgentCommissionPercent: '',
          firstYear: '',
          mainAgentCommissionAmount: '',
          mainAgentTDSPercent: '',
          mainAgentTDSAmount: '',
          referenceByName: '',
          brokerName: ''
        },
        nomineeDetails: {
          nomineeName: '',
          nomineeRelationship: '',
          nomineeAge: ''
        },
        riderDetails: {
          termRider: { amount: '', note: '' },
          criticalIllnessRider: { amount: '', note: '' },
          accidentRider: { amount: '', note: '' },
          pwbRider: { amount: '', note: '' },
          othersRider: { amount: '', note: '' }
        },
        bankDetails: {
          bankName: '',
          accountType: '',
          accountNumber: '',
          ifscCode: '',
          accountHolderName: ''
        },
        notes: {
          note: ''
        }
      });
      setFiles({
        policyFile: null,
        uploadDocuments: [],
        documentNames: []
      });
      setExistingDocuments([]);
      setIsPolicyFileDeleted(false);
      setDeletedDocuments([]);
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetForm, onResetComplete, initialData]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, nested, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: {
          ...prev[section][nested],
          [field]: value
        }
      }
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleDocumentFileChange = (file, index) => {
    setFiles(prev => {
      const newDocuments = [...prev.uploadDocuments];
      newDocuments[index] = file;
      return { ...prev, uploadDocuments: newDocuments };
    });
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
  };

  const handleDocumentNameChange = (index, name) => {
    setFiles(prev => {
      const newNames = [...prev.documentNames];
      newNames[index] = name;
      return { ...prev, documentNames: newNames };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Include existing documents in form data for edit mode with proper format
    const formattedExistingDocuments = existingDocuments.map(doc => ({
      _id: doc._id,
      documentName: doc.documentName,
      existingUrl: doc.documentUrl,
      existingName: doc.originalName || doc.documentName,
      fileSize: doc.fileSize
    }));

    const updatedFormData = {
      ...formData,
      uploadDocuments: formattedExistingDocuments, // Pass properly formatted existing documents to backend
      deletePolicyFile: isPolicyFileDeleted // Pass policy file deletion flag to backend
    };
    
    if (typeof onSubmit === 'function') {
      onSubmit(updatedFormData, files, { uploadDocuments: deletedDocuments });
    }
  };

  const getFieldError = (section, field) => {
    return errors[section]?.[field];
  };

  return (
    <form id="life-insurance-form" onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="client" className="space-y-4">
        <TabsList className="grid grid-cols-8 w-full bg-white/10">
          <TabsTrigger value="client" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <User className="w-4 h-4" />
            Client
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <Shield className="w-4 h-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="commission" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <DollarSign className="w-4 h-4" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="nominee" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <UserCheck className="w-4 h-4" />
            Nominee
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <UploadIcon className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <StickyNote className="w-4 h-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="riders" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <Activity className="w-4 h-4" />
            Riders
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <CreditCard className="w-4 h-4" />
            Bank
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer" className="text-white">
                    Client Name <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.clientDetails.customer || ''}
                    onValueChange={(value) => handleInputChange('clientDetails', 'customer', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {allCustomers.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          Loading customers...
                        </div>
                      ) : (
                        allCustomers.map(customer => (
                          <SelectItem key={customer.value} value={customer.value} className="text-gray-300 hover:text-white">
                            {customer.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {getFieldError('clientDetails', 'customer') && (
                    <p className="text-red-400 text-sm">{getFieldError('clientDetails', 'customer')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuredName" className="text-white">
                    Insured Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="insuredName"
                    value={formData.clientDetails.insuredName}
                    onChange={(e) => handleInputChange('clientDetails', 'insuredName', e.target.value)}
                    placeholder="Enter insured name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                  {getFieldError('clientDetails', 'insuredName') && (
                    <p className="text-red-400 text-sm">{getFieldError('clientDetails', 'insuredName')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs with glass styling will be implemented here */}
        {/* For now, let's create a simplified version focusing on the most important tabs */}

        {/* Insurance Details Tab - Simplified */}
        <TabsContent value="insurance">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                Insurance Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceCompany" className="text-white">
                    Insurance Company <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.insuranceDetails.insuranceCompany}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'insuranceCompany', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select insurance company" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20 max-h-60">
                      {lifeInsuranceService.getInsuranceCompanies().map(company => (
                        <SelectItem key={company} value={company} className="text-gray-300 hover:text-white">
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('insuranceDetails', 'insuranceCompany') && (
                    <p className="text-red-400 text-sm">{getFieldError('insuranceDetails', 'insuranceCompany')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyType" className="text-white">
                    Policy Type                  </Label>
                  <Select
                    value={formData.insuranceDetails.policyType}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'policyType', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {lifeInsuranceService.getPolicyTypes().map(type => (
                        <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMode" className="text-white">
                    Payment Mode                  </Label>
                  <Select
                    value={formData.insuranceDetails.paymentMode}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'paymentMode', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {lifeInsuranceService.getPaymentModes().map(mode => (
                        <SelectItem key={mode} value={mode} className="text-gray-300 hover:text-white">
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyNumber" className="text-white">
                    Policy Number <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="policyNumber"
                    value={formData.insuranceDetails.policyNumber}
                    onChange={(e) => handleInputChange('insuranceDetails', 'policyNumber', e.target.value)}
                    placeholder="Enter policy number"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                  {getFieldError('insuranceDetails', 'policyNumber') && (
                    <p className="text-red-400 text-sm">{getFieldError('insuranceDetails', 'policyNumber')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planName" className="text-white">
                    Plan Name                  </Label>
                  <Input
                    id="planName"
                    value={formData.insuranceDetails.planName}
                    onChange={(e) => handleInputChange('insuranceDetails', 'planName', e.target.value)}
                    placeholder="Enter plan name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agencyCode" className="text-white">
                    Agency Code                  </Label>
                  <Select
                    value={formData.insuranceDetails.agencyCode}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'agencyCode', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select agency code" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      <SelectItem value="Agency Code" className="text-gray-300 hover:text-white">Agency Code</SelectItem>
                      <SelectItem value="Broker Code" className="text-gray-300 hover:text-white">Broker Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyDate" className="text-white">
                    Policy Date                  </Label>
                  <Input
                    id="policyDate"
                    type="date"
                    value={formData.insuranceDetails.policyDate}
                    onChange={(e) => handleInputChange('insuranceDetails', 'policyDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyStartDate" className="text-white">
                    Policy Start Date                  </Label>
                  <Input
                    id="policyStartDate"
                    type="date"
                    value={formData.insuranceDetails.policyStartDate}
                    onChange={(e) => handleInputChange('insuranceDetails', 'policyStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyEndDate" className="text-white">
                    Policy End Date                  </Label>
                  <Input
                    id="policyEndDate"
                    type="date"
                    value={formData.insuranceDetails.policyEndDate}
                    onChange={(e) => handleInputChange('insuranceDetails', 'policyEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookingDate" className="text-white">
                    Booking Date                  </Label>
                  <Input
                    id="bookingDate"
                    type="date"
                    value={formData.insuranceDetails.bookingDate}
                    onChange={(e) => handleInputChange('insuranceDetails', 'bookingDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskStartDate" className="text-white">
                    Risk Start Date                  </Label>
                  <Input
                    id="riskStartDate"
                    type="date"
                    value={formData.insuranceDetails.riskStartDate}
                    onChange={(e) => handleInputChange('insuranceDetails', 'riskStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyTerm" className="text-white">
                    Policy Term                  </Label>
                  <Input
                    id="policyTerm"
                    type="number"
                    value={formData.insuranceDetails.policyTerm}
                    onChange={(e) => handleInputChange('insuranceDetails', 'policyTerm', e.target.value)}
                    placeholder="Enter policy term in years"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="premiumPaymentNumber" className="text-white">
                    Premium Payment Number                  </Label>
                  <Input
                    id="premiumPaymentNumber"
                    type="number"
                    value={formData.insuranceDetails.premiumPaymentNumber}
                    onChange={(e) => handleInputChange('insuranceDetails', 'premiumPaymentNumber', e.target.value)}
                    placeholder="Enter premium payment number"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sumInsured" className="text-white">
                    Sum Insured                  </Label>
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
                  <Label htmlFor="netPremium" className="text-white">
                    Net Premium                  </Label>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstYearGST" className="text-white">
                    First Year GST                  </Label>
                  <Input
                    id="firstYearGST"
                    type="number"
                    value={formData.insuranceDetails.firstYearGST}
                    onChange={(e) => handleInputChange('insuranceDetails', 'firstYearGST', e.target.value)}
                    placeholder="Enter first year GST"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondYearGST" className="text-white">
                    Second Year GST                  </Label>
                  <Input
                    id="secondYearGST"
                    type="number"
                    value={formData.insuranceDetails.secondYearGST}
                    onChange={(e) => handleInputChange('insuranceDetails', 'secondYearGST', e.target.value)}
                    placeholder="Enter second year GST"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thirdYearGST" className="text-white">
                    Third Year GST                  </Label>
                  <Input
                    id="thirdYearGST"
                    type="number"
                    value={formData.insuranceDetails.thirdYearGST}
                    onChange={(e) => handleInputChange('insuranceDetails', 'thirdYearGST', e.target.value)}
                    placeholder="Enter third year GST"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalPremium" className="text-white">
                    Total Premium                  </Label>
                  <Input
                    id="totalPremium"
                    type="number"
                    value={formData.insuranceDetails.totalPremium}
                    onChange={(e) => handleInputChange('insuranceDetails', 'totalPremium', e.target.value)}
                    placeholder="Enter total premium"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonus" className="text-white">
                    Bonus                  </Label>
                  <Input
                    id="bonus"
                    type="number"
                    value={formData.insuranceDetails.bonus}
                    onChange={(e) => handleInputChange('insuranceDetails', 'bonus', e.target.value)}
                    placeholder="Enter bonus amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund" className="text-white">
                    Fund                  </Label>
                  <Input
                    id="fund"
                    type="number"
                    value={formData.insuranceDetails.fund}
                    onChange={(e) => handleInputChange('insuranceDetails', 'fund', e.target.value)}
                    placeholder="Enter fund amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nominee Details Tab */}
        <TabsContent value="nominee">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UserCheck className="w-5 h-5" />
                Nominee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomineeName" className="text-white">
                    Nominee Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="nomineeName"
                    value={formData.nomineeDetails.nomineeName}
                    onChange={(e) => handleInputChange('nomineeDetails', 'nomineeName', e.target.value)}
                    placeholder="Enter nominee name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                  {getFieldError('nomineeDetails', 'nomineeName') && (
                    <p className="text-red-400 text-sm">{getFieldError('nomineeDetails', 'nomineeName')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomineeRelationship" className="text-white">
                    Nominee Relationship                  </Label>
                  <Input
                    id="nomineeRelationship"
                    value={formData.nomineeDetails.nomineeRelationship}
                    onChange={(e) => handleInputChange('nomineeDetails', 'nomineeRelationship', e.target.value)}
                    placeholder="Enter relationship"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomineeAge" className="text-white">
                    Nominee Age                  </Label>
                  <Input
                    id="nomineeAge"
                    type="number"
                    value={formData.nomineeDetails.nomineeAge}
                    onChange={(e) => handleInputChange('nomineeDetails', 'nomineeAge', e.target.value)}
                    placeholder="Enter nominee age"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Details Tab */}
        <TabsContent value="bank">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="w-5 h-5" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="text-white">
                    Bank Name                  </Label>
                  <Input
                    id="bankName"
                    value={formData.bankDetails.bankName}
                    onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                    placeholder="Enter bank name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType" className="text-white">
                    Account Type                  </Label>
                  <Select
                    value={formData.bankDetails.accountType}
                    onValueChange={(value) => handleInputChange('bankDetails', 'accountType', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      <SelectItem value="savings" className="text-gray-300 hover:text-white">Savings</SelectItem>
                      <SelectItem value="current" className="text-gray-300 hover:text-white">Current</SelectItem>
                      <SelectItem value="salary" className="text-gray-300 hover:text-white">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-white">
                    Account Number                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                    placeholder="Enter account number"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ifscCode" className="text-white">
                    IFSC Code                  </Label>
                  <Input
                    id="ifscCode"
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value.toUpperCase())}
                    placeholder="Enter IFSC code"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolderName" className="text-white">
                    Account Holder Name                  </Label>
                  <Input
                    id="accountHolderName"
                    value={formData.bankDetails.accountHolderName}
                    onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)}
                    placeholder="Enter account holder name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
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
                
                {/* Show existing policy file in edit mode */}
                {initialData?.uploadPolicy?.policyFileUrl && !files.policyFile && !isPolicyFileDeleted && (
                  <Card className="bg-white/10 border-white/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-white" />
                          <span className="text-white font-medium">Current Policy File</span>
                          {initialData.uploadPolicy.originalName && (
                            <span className="text-gray-300 text-sm">({initialData.uploadPolicy.originalName})</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(initialData.uploadPolicy.policyFileUrl, '_blank')}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Mark policy file for deletion
                              setIsPolicyFileDeleted(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="border-2 border-dashed border-white/30 rounded-lg p-4 bg-white/5">
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
                    <p className="text-sm text-white">
                      {initialData?.uploadPolicy?.policyFileUrl ? 'Click to replace policy file' : 'Click to upload policy file'}
                    </p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
                  </label>
                  {files.policyFile && (
                    <div className="mt-2 p-2 bg-white/10 rounded flex items-center justify-between">
                      <span className="text-sm text-white">New: {files.policyFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileChange('policyFile', null)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Existing Documents (for edit mode) */}
              {existingDocuments.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-white">Existing Documents</Label>
                  {existingDocuments.map((doc, index) => (
                    <Card key={`existing-${index}`} className="bg-white/10 border-white/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-white" />
                            <span className="text-white font-medium">{doc.documentName}</span>
                            {doc.originalName && (
                              <span className="text-gray-300 text-sm">({doc.originalName})</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {doc.documentUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(doc.documentUrl, '_blank')}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                View
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const docToDelete = existingDocuments[index];
                                setDeletedDocuments(prev => [...prev, docToDelete]);
                                setExistingDocuments(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Upload New Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Upload New Documents</Label>
                  <Button
                    type="button"
                    onClick={addDocumentField}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Document
                  </Button>
                </div>

                {files.uploadDocuments.map((file, index) => (
                  <Card key={index} className="bg-white/10 border-white/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">New Document {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocumentField(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
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
                              {lifeInsuranceService.getDocumentTypes().map(type => (
                                <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Upload File</Label>
                          <div className="border-2 border-dashed border-white/30 rounded-lg p-2 bg-white/5 h-10">
                            <input
                              id={`documentFile-${index}`}
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentFileChange(e.target.files[0], index)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`documentFile-${index}`}
                              className="flex items-center justify-center cursor-pointer h-full"
                            >
                              <Upload className="w-4 h-4 text-gray-400 mr-2" />
                              <p className="text-sm text-white">Click to upload</p>
                            </label>
                          </div>
                        </div>
                      </div>

                      {file && (
                        <div className="p-2 bg-white/10 rounded flex items-center gap-2">
                          <FileText className="w-4 h-4 text-white" />
                          <span className="text-sm text-white">{file.name}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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

        {/* Commission Tab */}
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
                  <Label htmlFor="firstYear" className="text-white">First Year</Label>
                  <Input
                    id="firstYear"
                    type="number"
                    value={formData.commissionDetails.firstYear}
                    onChange={(e) => handleInputChange('commissionDetails', 'firstYear', e.target.value)}
                    placeholder="Enter first year amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainAgentCommissionAmount" className="text-white">Main Agent Commission Amount</Label>
                  <Input
                    id="mainAgentCommissionAmount"
                    type="number"
                    value={formData.commissionDetails.mainAgentCommissionAmount}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentCommissionAmount', e.target.value)}
                    placeholder="Enter commission amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-3 gap-4">
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

        {/* Riders Tab */}
        <TabsContent value="riders">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="w-5 h-5" />
                Rider Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Term Rider */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Term Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="termRiderAmount" className="text-white">Amount</Label>
                    <Input
                      id="termRiderAmount"
                      type="number"
                      value={formData.riderDetails.termRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'termRider', 'amount', e.target.value)}
                      placeholder="Enter term rider amount"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termRiderNote" className="text-white">Note</Label>
                    <Input
                      id="termRiderNote"
                      value={formData.riderDetails.termRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'termRider', 'note', e.target.value)}
                      placeholder="Enter term rider note"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Critical Illness Rider */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Critical Illness Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="criticalIllnessRiderAmount" className="text-white">Amount</Label>
                    <Input
                      id="criticalIllnessRiderAmount"
                      type="number"
                      value={formData.riderDetails.criticalIllnessRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'criticalIllnessRider', 'amount', e.target.value)}
                      placeholder="Enter critical illness rider amount"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="criticalIllnessRiderNote" className="text-white">Note</Label>
                    <Input
                      id="criticalIllnessRiderNote"
                      value={formData.riderDetails.criticalIllnessRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'criticalIllnessRider', 'note', e.target.value)}
                      placeholder="Enter critical illness rider note"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Accident Rider */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Accident Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accidentRiderAmount" className="text-white">Amount</Label>
                    <Input
                      id="accidentRiderAmount"
                      type="number"
                      value={formData.riderDetails.accidentRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'accidentRider', 'amount', e.target.value)}
                      placeholder="Enter accident rider amount"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accidentRiderNote" className="text-white">Note</Label>
                    <Input
                      id="accidentRiderNote"
                      value={formData.riderDetails.accidentRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'accidentRider', 'note', e.target.value)}
                      placeholder="Enter accident rider note"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* PWB Rider */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">PWB Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pwbRiderAmount" className="text-white">Amount</Label>
                    <Input
                      id="pwbRiderAmount"
                      type="number"
                      value={formData.riderDetails.pwbRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'pwbRider', 'amount', e.target.value)}
                      placeholder="Enter PWB rider amount"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pwbRiderNote" className="text-white">Note</Label>
                    <Input
                      id="pwbRiderNote"
                      value={formData.riderDetails.pwbRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'pwbRider', 'note', e.target.value)}
                      placeholder="Enter PWB rider note"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Others Rider */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Others Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="othersRiderAmount" className="text-white">Amount</Label>
                    <Input
                      id="othersRiderAmount"
                      type="number"
                      value={formData.riderDetails.othersRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'othersRider', 'amount', e.target.value)}
                      placeholder="Enter others rider amount"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="othersRiderNote" className="text-white">Note</Label>
                    <Input
                      id="othersRiderNote"
                      value={formData.riderDetails.othersRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'othersRider', 'note', e.target.value)}
                      placeholder="Enter others rider note"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default LifeInsuranceFormStyled;