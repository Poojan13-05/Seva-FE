// src/components/admin/LifeInsuranceForm.jsx
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
import { 
  Upload, 
  X, 
  FileText,
  AlertTriangle,
  User,
  Shield,
  DollarSign,
  UserCheck,
  Upload as UploadIcon,
  StickyNote,
  Activity,
  CreditCard,
  FileImage,
  Plus
} from 'lucide-react';
import { lifeInsuranceService } from '@/services/lifeInsuranceService';
import { useCustomersForDropdown } from '@/hooks/useLifeInsurance';

const LifeInsuranceForm = ({ 
  initialData = null, 
  onSubmit, 
  isLoading = false,
  errors = {}
}) => {
  const { data: customersData } = useCustomersForDropdown();
  const customers = customersData?.data?.customers || [];

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

  // Preview states
  const [filePreviews, setFilePreviews] = useState({
    policyFile: null,
    uploadDocuments: []
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        clientDetails: {
          customer: initialData.clientDetails?.customer?._id || '',
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
      });
    }
  }, [initialData]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, files);
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

        {/* Insurance Details Tab */}
        <TabsContent value="insurance">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Insurance Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Insurance Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceCompany">Insurance Company *</Label>
                  <Select
                    value={formData.insuranceDetails.insuranceCompany}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'insuranceCompany', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance company" />
                    </SelectTrigger>
                    <SelectContent>
                      {lifeInsuranceService.getInsuranceCompanies().map(company => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agencyCode">Agency Code *</Label>
                  <Select
                    value={formData.insuranceDetails.agencyCode}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'agencyCode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agency code" />
                    </SelectTrigger>
                    <SelectContent>
                      {lifeInsuranceService.getAgencyCodes().map(code => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyType">Policy Type *</Label>
                  <Select
                    value={formData.insuranceDetails.policyType}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'policyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                    <SelectContent>
                      {lifeInsuranceService.getPolicyTypes().map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name *</Label>
                  <Input
                    id="planName"
                    value={formData.insuranceDetails.planName}
                    onChange={(e) => handleInputChange('insuranceDetails', 'planName', e.target.value)}
                    placeholder="Enter plan name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode *</Label>
                  <Select
                    value={formData.insuranceDetails.paymentMode}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'paymentMode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {lifeInsuranceService.getPaymentModes().map(mode => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Policy Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Policy Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number *</Label>
                    <Input
                      id="policyNumber"
                      value={formData.insuranceDetails.policyNumber}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyNumber', e.target.value)}
                      placeholder="Enter policy number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyDate">Policy Date *</Label>
                    <Input
                      id="policyDate"
                      type="date"
                      value={formData.insuranceDetails.policyDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyStartDate">Policy Start Date *</Label>
                    <Input
                      id="policyStartDate"
                      type="date"
                      value={formData.insuranceDetails.policyStartDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyStartDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyEndDate">Policy End Date *</Label>
                    <Input
                      id="policyEndDate"
                      type="date"
                      value={formData.insuranceDetails.policyEndDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyEndDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bookingDate">Booking Date *</Label>
                    <Input
                      id="bookingDate"
                      type="date"
                      value={formData.insuranceDetails.bookingDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'bookingDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="riskStartDate">Risk Start Date *</Label>
                    <Input
                      id="riskStartDate"
                      type="date"
                      value={formData.insuranceDetails.riskStartDate}
                      onChange={(e) => handleInputChange('insuranceDetails', 'riskStartDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyTerm">Policy Term (Years) *</Label>
                    <Input
                      id="policyTerm"
                      type="number"
                      value={formData.insuranceDetails.policyTerm}
                      onChange={(e) => handleInputChange('insuranceDetails', 'policyTerm', e.target.value)}
                      placeholder="Enter policy term in years"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premiumPaymentNumber">Premium Payment Number *</Label>
                    <Input
                      id="premiumPaymentNumber"
                      type="number"
                      value={formData.insuranceDetails.premiumPaymentNumber}
                      onChange={(e) => handleInputChange('insuranceDetails', 'premiumPaymentNumber', e.target.value)}
                      placeholder="Enter premium payment number"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Financial Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sumInsured">Sum Insured *</Label>
                    <Input
                      id="sumInsured"
                      type="number"
                      value={formData.insuranceDetails.sumInsured}
                      onChange={(e) => handleInputChange('insuranceDetails', 'sumInsured', e.target.value)}
                      placeholder="Enter sum insured"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="netPremium">Net Premium *</Label>
                    <Input
                      id="netPremium"
                      type="number"
                      value={formData.insuranceDetails.netPremium}
                      onChange={(e) => handleInputChange('insuranceDetails', 'netPremium', e.target.value)}
                      placeholder="Enter net premium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstYearGST">1st Year GST *</Label>
                    <Input
                      id="firstYearGST"
                      type="number"
                      value={formData.insuranceDetails.firstYearGST}
                      onChange={(e) => handleInputChange('insuranceDetails', 'firstYearGST', e.target.value)}
                      placeholder="Enter 1st year GST"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondYearGST">2nd Year GST *</Label>
                    <Input
                      id="secondYearGST"
                      type="number"
                      value={formData.insuranceDetails.secondYearGST}
                      onChange={(e) => handleInputChange('insuranceDetails', 'secondYearGST', e.target.value)}
                      placeholder="Enter 2nd year GST"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thirdYearGST">3rd Year GST *</Label>
                    <Input
                      id="thirdYearGST"
                      type="number"
                      value={formData.insuranceDetails.thirdYearGST}
                      onChange={(e) => handleInputChange('insuranceDetails', 'thirdYearGST', e.target.value)}
                      placeholder="Enter 3rd year GST"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalPremium">Total Premium *</Label>
                    <Input
                      id="totalPremium"
                      type="number"
                      value={formData.insuranceDetails.totalPremium}
                      onChange={(e) => handleInputChange('insuranceDetails', 'totalPremium', e.target.value)}
                      placeholder="Enter total premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bonus">Bonus</Label>
                    <Input
                      id="bonus"
                      type="number"
                      value={formData.insuranceDetails.bonus}
                      onChange={(e) => handleInputChange('insuranceDetails', 'bonus', e.target.value)}
                      placeholder="Enter bonus amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fund">Fund</Label>
                    <Input
                      id="fund"
                      type="number"
                      value={formData.insuranceDetails.fund}
                      onChange={(e) => handleInputChange('insuranceDetails', 'fund', e.target.value)}
                      placeholder="Enter fund amount"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Details Tab */}
        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Commission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainAgentCommissionPercent">Main Agent Commission (%)</Label>
                  <Input
                    id="mainAgentCommissionPercent"
                    type="number"
                    value={formData.commissionDetails.mainAgentCommissionPercent}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentCommissionPercent', e.target.value)}
                    placeholder="Enter commission percentage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstYear">1st Year</Label>
                  <Input
                    id="firstYear"
                    type="number"
                    value={formData.commissionDetails.firstYear}
                    onChange={(e) => handleInputChange('commissionDetails', 'firstYear', e.target.value)}
                    placeholder="Enter first year amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainAgentCommissionAmount">Main Agent Commission Amount</Label>
                  <Input
                    id="mainAgentCommissionAmount"
                    type="number"
                    value={formData.commissionDetails.mainAgentCommissionAmount}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentCommissionAmount', e.target.value)}
                    placeholder="Enter commission amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainAgentTDSPercent">Main Agent TDS (%)</Label>
                  <Input
                    id="mainAgentTDSPercent"
                    type="number"
                    value={formData.commissionDetails.mainAgentTDSPercent}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentTDSPercent', e.target.value)}
                    placeholder="Enter TDS percentage"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainAgentTDSAmount">Main Agent TDS Amount</Label>
                  <Input
                    id="mainAgentTDSAmount"
                    type="number"
                    value={formData.commissionDetails.mainAgentTDSAmount}
                    onChange={(e) => handleInputChange('commissionDetails', 'mainAgentTDSAmount', e.target.value)}
                    placeholder="Enter TDS amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceByName">Reference By Name</Label>
                  <Input
                    id="referenceByName"
                    value={formData.commissionDetails.referenceByName}
                    onChange={(e) => handleInputChange('commissionDetails', 'referenceByName', e.target.value)}
                    placeholder="Enter reference name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerName">Broker Name</Label>
                  <Input
                    id="brokerName"
                    value={formData.commissionDetails.brokerName}
                    onChange={(e) => handleInputChange('commissionDetails', 'brokerName', e.target.value)}
                    placeholder="Enter broker name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nominee Details Tab */}
        <TabsContent value="nominee">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Nominee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomineeName">Nominee Name *</Label>
                  <Input
                    id="nomineeName"
                    value={formData.nomineeDetails.nomineeName}
                    onChange={(e) => handleInputChange('nomineeDetails', 'nomineeName', e.target.value)}
                    placeholder="Enter nominee name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomineeRelationship">Nominee Relationship *</Label>
                  <Input
                    id="nomineeRelationship"
                    value={formData.nomineeDetails.nomineeRelationship}
                    onChange={(e) => handleInputChange('nomineeDetails', 'nomineeRelationship', e.target.value)}
                    placeholder="Enter relationship"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomineeAge">Nominee Age *</Label>
                  <Input
                    id="nomineeAge"
                    type="number"
                    value={formData.nomineeDetails.nomineeAge}
                    onChange={(e) => handleInputChange('nomineeDetails', 'nomineeAge', e.target.value)}
                    placeholder="Enter nominee age"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadIcon className="w-5 h-5" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Policy File Upload */}
              <div className="space-y-2">
                <Label htmlFor="policyFile">Upload Policy File</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
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
                    <p className="text-sm text-gray-600">Click to upload policy file</p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
                  </label>
                  {files.policyFile && (
                    <div className="mt-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                      <span className="text-sm">{files.policyFile.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileChange('policyFile', null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Upload Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Upload Documents</Label>
                  <button
                    type="button"
                    onClick={addDocumentField}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>

                {files.uploadDocuments.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Document {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeDocumentField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Document Name</Label>
                        <Select
                          value={files.documentNames[index] || ''}
                          onValueChange={(value) => handleDocumentNameChange(index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            {lifeInsuranceService.getDocumentTypes().map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Upload File</Label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentFileChange(e.target.files[0], index)}
                          className="w-full text-sm border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    </div>

                    {file && (
                      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="w-5 h-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={formData.notes.note}
                  onChange={(e) => handleInputChange('notes', 'note', e.target.value)}
                  placeholder="Enter any additional notes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Riders Tab */}
        <TabsContent value="riders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Rider Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Term Rider */}
              <div className="space-y-2">
                <h4 className="font-medium">Term Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="termRiderAmount">Amount</Label>
                    <Input
                      id="termRiderAmount"
                      type="number"
                      value={formData.riderDetails.termRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'termRider', 'amount', e.target.value)}
                      placeholder="Enter term rider amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termRiderNote">Note</Label>
                    <Input
                      id="termRiderNote"
                      value={formData.riderDetails.termRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'termRider', 'note', e.target.value)}
                      placeholder="Enter term rider note"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Critical Illness Rider */}
              <div className="space-y-2">
                <h4 className="font-medium">Critical Illness Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="criticalIllnessRiderAmount">Amount</Label>
                    <Input
                      id="criticalIllnessRiderAmount"
                      type="number"
                      value={formData.riderDetails.criticalIllnessRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'criticalIllnessRider', 'amount', e.target.value)}
                      placeholder="Enter critical illness rider amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="criticalIllnessRiderNote">Note</Label>
                    <Input
                      id="criticalIllnessRiderNote"
                      value={formData.riderDetails.criticalIllnessRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'criticalIllnessRider', 'note', e.target.value)}
                      placeholder="Enter critical illness rider note"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Accident Rider */}
              <div className="space-y-2">
                <h4 className="font-medium">Accident Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accidentRiderAmount">Amount</Label>
                    <Input
                      id="accidentRiderAmount"
                      type="number"
                      value={formData.riderDetails.accidentRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'accidentRider', 'amount', e.target.value)}
                      placeholder="Enter accident rider amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accidentRiderNote">Note</Label>
                    <Input
                      id="accidentRiderNote"
                      value={formData.riderDetails.accidentRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'accidentRider', 'note', e.target.value)}
                      placeholder="Enter accident rider note"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* PWB Rider */}
              <div className="space-y-2">
                <h4 className="font-medium">PWB Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pwbRiderAmount">Amount</Label>
                    <Input
                      id="pwbRiderAmount"
                      type="number"
                      value={formData.riderDetails.pwbRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'pwbRider', 'amount', e.target.value)}
                      placeholder="Enter PWB rider amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pwbRiderNote">Note</Label>
                    <Input
                      id="pwbRiderNote"
                      value={formData.riderDetails.pwbRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'pwbRider', 'note', e.target.value)}
                      placeholder="Enter PWB rider note"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Others Rider */}
              <div className="space-y-2">
                <h4 className="font-medium">Others Rider</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="othersRiderAmount">Amount</Label>
                    <Input
                      id="othersRiderAmount"
                      type="number"
                      value={formData.riderDetails.othersRider.amount}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'othersRider', 'amount', e.target.value)}
                      placeholder="Enter others rider amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="othersRiderNote">Note</Label>
                    <Input
                      id="othersRiderNote"
                      value={formData.riderDetails.othersRider.note}
                      onChange={(e) => handleNestedInputChange('riderDetails', 'othersRider', 'note', e.target.value)}
                      placeholder="Enter others rider note"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Details Tab */}
        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankDetails.bankName}
                    onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Input
                    id="accountType"
                    value={formData.bankDetails.accountType}
                    onChange={(e) => handleInputChange('bankDetails', 'accountType', e.target.value)}
                    placeholder="Enter account type"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input
                    id="ifscCode"
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value.toUpperCase())}
                    placeholder="Enter IFSC code"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                <Input
                  id="accountHolderName"
                  value={formData.bankDetails.accountHolderName}
                  onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)}
                  placeholder="Enter account holder name"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default LifeInsuranceForm;