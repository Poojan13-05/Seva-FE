// src/components/admin/VehicleInsuranceFormStyled.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  CheckSquare,
  UploadIcon,
  StickyNote,
  Calendar,
  Plus,
  Car
} from 'lucide-react';
import { vehicleInsuranceService } from '@/services/vehicleInsuranceService';
import { useCustomersForDropdown } from '@/hooks/useVehicleInsurance';

const VehicleInsuranceFormStyled = ({
  initialData = null,
  onSubmit,
  isLoading = false,
  errors = {},
  resetForm = false,
  onResetComplete,
  selectedCustomer = null // Customer details for edit mode
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
      customer: selectedCustomer?.value || initialData?.clientDetails?.customer?._id || initialData?.clientDetails?.customer || '',
      referenceByName: ''
    },
    insuranceDetails: {
      insuranceCompany: '',
      agencyBrokerCode: '',
      policyType: '',
      insuranceType: '',
      policyNumber: '',
      policyBookingDate: '',
      policyStartDate: '',
      policyEndDate: '',
      previousPolicyNumber: '',
      ncb: '',
      vehicleType: '',
      classOfVehicle: '',
      cngIdv: '',
      totalIdv: '',
      registrationNumber: '',
      engineNumber: '',
      chassisNumber: '',
      mfy: '',
      make: '',
      model: '',
      variant: '',
      seatingCapacity: '',
      discount: '',
      loading: ''
    },
    legalLiabilityAndCovers: {
      numberOfPersonsNonFarePaying: '',
      imt28NumberOfPersons: '',
      covers: {
        paCoverPaidDriver: false,
        commercialPrivatePurpose: false,
        ownPremisesOnly: false,
        lampsTyresTubes: false,
        toolOfTrade: false,
        financierHPA: false,
        cngLpg: false,
        batteryKilowatt: false,
        electricalAccessories: false,
        nonElectricalAccessories: false,
        zeroDepreciation: false,
        returnToInvoice: false,
        roadsideAssistance: false,
        keyReplacement: false,
        inconvenienceAllowance: false,
        lossOfPersonalBelongings: false,
        consumable: false,
        engineProtector: false,
        emiProtector: false,
        medicalExpenseExtension: false,
        batterySecure: false,
        additionalTowingCover: false,
        multipleDamageCover: false,
        zeroExcessCover: false,
        tyreGuard: false,
        rimSafeguard: false,
        lossOfIncome: false,
        ncbProtection: false
      }
    },
    premiumCommissionDetails: {
      tpPremium: '',
      netPremium: '',
      gstAmount: '',
      totalPremium: '',
      payOut: '',
      mainAgentCommissionPercent: '',
      mainAgentCommissionView: '',
      mainAgentTDSPercent: '',
      mainAgentTDSAmount: '',
      brokerName: ''
    },
    registrationPermitValidity: {
      statePermitStartDate: '',
      statePermitEndDate: '',
      fitnessStartDate: '',
      fitnessEndDate: '',
      rcStartDate: '',
      rcEndDate: '',
      nationalPermitStartDate: '',
      nationalPermitEndDate: '',
      pucStartDate: '',
      pucEndDate: '',
      rtoTaxStartDate: '',
      rtoTaxEndDate: ''
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

  // Load initial data if editing - run once on mount
  useEffect(() => {
    if (initialData) {
      // Prioritize selectedCustomer value for customer field
      let customerId = '';
      if (selectedCustomer?.value) {
        customerId = selectedCustomer.value;
      } else {
        const customerData = initialData.clientDetails?.customer;
        if (typeof customerData === 'object' && customerData !== null) {
          customerId = customerData._id || '';
        } else if (typeof customerData === 'string') {
          customerId = customerData;
        }
      }

      const newFormData = {
        clientDetails: {
          customer: customerId,
          referenceByName: initialData.clientDetails?.referenceByName || ''
        },
        insuranceDetails: {
          insuranceCompany: initialData.insuranceDetails?.insuranceCompany || '',
          agencyBrokerCode: initialData.insuranceDetails?.agencyBrokerCode || '',
          policyType: initialData.insuranceDetails?.policyType || '',
          insuranceType: initialData.insuranceDetails?.insuranceType || '',
          policyNumber: initialData.insuranceDetails?.policyNumber || '',
          policyBookingDate: initialData.insuranceDetails?.policyBookingDate ? new Date(initialData.insuranceDetails.policyBookingDate).toISOString().split('T')[0] : '',
          policyStartDate: initialData.insuranceDetails?.policyStartDate ? new Date(initialData.insuranceDetails.policyStartDate).toISOString().split('T')[0] : '',
          policyEndDate: initialData.insuranceDetails?.policyEndDate ? new Date(initialData.insuranceDetails.policyEndDate).toISOString().split('T')[0] : '',
          previousPolicyNumber: initialData.insuranceDetails?.previousPolicyNumber || '',
          ncb: initialData.insuranceDetails?.ncb || '',
          vehicleType: initialData.insuranceDetails?.vehicleType || '',
          classOfVehicle: initialData.insuranceDetails?.classOfVehicle || '',
          cngIdv: initialData.insuranceDetails?.cngIdv || '',
          totalIdv: initialData.insuranceDetails?.totalIdv || '',
          registrationNumber: initialData.insuranceDetails?.registrationNumber || '',
          engineNumber: initialData.insuranceDetails?.engineNumber || '',
          chassisNumber: initialData.insuranceDetails?.chassisNumber || '',
          mfy: initialData.insuranceDetails?.mfy || '',
          make: initialData.insuranceDetails?.make || '',
          model: initialData.insuranceDetails?.model || '',
          variant: initialData.insuranceDetails?.variant || '',
          seatingCapacity: initialData.insuranceDetails?.seatingCapacity || '',
          discount: initialData.insuranceDetails?.discount || '',
          loading: initialData.insuranceDetails?.loading || ''
        },
        legalLiabilityAndCovers: {
          numberOfPersonsNonFarePaying: initialData.legalLiabilityAndCovers?.numberOfPersonsNonFarePaying || '',
          imt28NumberOfPersons: initialData.legalLiabilityAndCovers?.imt28NumberOfPersons || '',
          covers: {
            paCoverPaidDriver: initialData.legalLiabilityAndCovers?.covers?.paCoverPaidDriver || false,
            commercialPrivatePurpose: initialData.legalLiabilityAndCovers?.covers?.commercialPrivatePurpose || false,
            ownPremisesOnly: initialData.legalLiabilityAndCovers?.covers?.ownPremisesOnly || false,
            lampsTyresTubes: initialData.legalLiabilityAndCovers?.covers?.lampsTyresTubes || false,
            toolOfTrade: initialData.legalLiabilityAndCovers?.covers?.toolOfTrade || false,
            financierHPA: initialData.legalLiabilityAndCovers?.covers?.financierHPA || false,
            cngLpg: initialData.legalLiabilityAndCovers?.covers?.cngLpg || false,
            batteryKilowatt: initialData.legalLiabilityAndCovers?.covers?.batteryKilowatt || false,
            electricalAccessories: initialData.legalLiabilityAndCovers?.covers?.electricalAccessories || false,
            nonElectricalAccessories: initialData.legalLiabilityAndCovers?.covers?.nonElectricalAccessories || false,
            zeroDepreciation: initialData.legalLiabilityAndCovers?.covers?.zeroDepreciation || false,
            returnToInvoice: initialData.legalLiabilityAndCovers?.covers?.returnToInvoice || false,
            roadsideAssistance: initialData.legalLiabilityAndCovers?.covers?.roadsideAssistance || false,
            keyReplacement: initialData.legalLiabilityAndCovers?.covers?.keyReplacement || false,
            inconvenienceAllowance: initialData.legalLiabilityAndCovers?.covers?.inconvenienceAllowance || false,
            lossOfPersonalBelongings: initialData.legalLiabilityAndCovers?.covers?.lossOfPersonalBelongings || false,
            consumable: initialData.legalLiabilityAndCovers?.covers?.consumable || false,
            engineProtector: initialData.legalLiabilityAndCovers?.covers?.engineProtector || false,
            emiProtector: initialData.legalLiabilityAndCovers?.covers?.emiProtector || false,
            medicalExpenseExtension: initialData.legalLiabilityAndCovers?.covers?.medicalExpenseExtension || false,
            batterySecure: initialData.legalLiabilityAndCovers?.covers?.batterySecure || false,
            additionalTowingCover: initialData.legalLiabilityAndCovers?.covers?.additionalTowingCover || false,
            multipleDamageCover: initialData.legalLiabilityAndCovers?.covers?.multipleDamageCover || false,
            zeroExcessCover: initialData.legalLiabilityAndCovers?.covers?.zeroExcessCover || false,
            tyreGuard: initialData.legalLiabilityAndCovers?.covers?.tyreGuard || false,
            rimSafeguard: initialData.legalLiabilityAndCovers?.covers?.rimSafeguard || false,
            lossOfIncome: initialData.legalLiabilityAndCovers?.covers?.lossOfIncome || false,
            ncbProtection: initialData.legalLiabilityAndCovers?.covers?.ncbProtection || false
          }
        },
        premiumCommissionDetails: {
          tpPremium: initialData.premiumCommissionDetails?.tpPremium || '',
          netPremium: initialData.premiumCommissionDetails?.netPremium || '',
          gstAmount: initialData.premiumCommissionDetails?.gstAmount || '',
          totalPremium: initialData.premiumCommissionDetails?.totalPremium || '',
          payOut: initialData.premiumCommissionDetails?.payOut || '',
          mainAgentCommissionPercent: initialData.premiumCommissionDetails?.mainAgentCommissionPercent || '',
          mainAgentCommissionView: initialData.premiumCommissionDetails?.mainAgentCommissionView || '',
          mainAgentTDSPercent: initialData.premiumCommissionDetails?.mainAgentTDSPercent || '',
          mainAgentTDSAmount: initialData.premiumCommissionDetails?.mainAgentTDSAmount || '',
          brokerName: initialData.premiumCommissionDetails?.brokerName || ''
        },
        registrationPermitValidity: {
          statePermitStartDate: initialData.registrationPermitValidity?.statePermitStartDate ? new Date(initialData.registrationPermitValidity.statePermitStartDate).toISOString().split('T')[0] : '',
          statePermitEndDate: initialData.registrationPermitValidity?.statePermitEndDate ? new Date(initialData.registrationPermitValidity.statePermitEndDate).toISOString().split('T')[0] : '',
          fitnessStartDate: initialData.registrationPermitValidity?.fitnessStartDate ? new Date(initialData.registrationPermitValidity.fitnessStartDate).toISOString().split('T')[0] : '',
          fitnessEndDate: initialData.registrationPermitValidity?.fitnessEndDate ? new Date(initialData.registrationPermitValidity.fitnessEndDate).toISOString().split('T')[0] : '',
          rcStartDate: initialData.registrationPermitValidity?.rcStartDate ? new Date(initialData.registrationPermitValidity.rcStartDate).toISOString().split('T')[0] : '',
          rcEndDate: initialData.registrationPermitValidity?.rcEndDate ? new Date(initialData.registrationPermitValidity.rcEndDate).toISOString().split('T')[0] : '',
          nationalPermitStartDate: initialData.registrationPermitValidity?.nationalPermitStartDate ? new Date(initialData.registrationPermitValidity.nationalPermitStartDate).toISOString().split('T')[0] : '',
          nationalPermitEndDate: initialData.registrationPermitValidity?.nationalPermitEndDate ? new Date(initialData.registrationPermitValidity.nationalPermitEndDate).toISOString().split('T')[0] : '',
          pucStartDate: initialData.registrationPermitValidity?.pucStartDate ? new Date(initialData.registrationPermitValidity.pucStartDate).toISOString().split('T')[0] : '',
          pucEndDate: initialData.registrationPermitValidity?.pucEndDate ? new Date(initialData.registrationPermitValidity.pucEndDate).toISOString().split('T')[0] : '',
          rtoTaxStartDate: initialData.registrationPermitValidity?.rtoTaxStartDate ? new Date(initialData.registrationPermitValidity.rtoTaxStartDate).toISOString().split('T')[0] : '',
          rtoTaxEndDate: initialData.registrationPermitValidity?.rtoTaxEndDate ? new Date(initialData.registrationPermitValidity.rtoTaxEndDate).toISOString().split('T')[0] : ''
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount - selectedCustomer is already in initial state

  // Reset form when resetForm prop changes
  useEffect(() => {
    if (resetForm && !initialData) {
      setFormData({
        clientDetails: {
          customer: '',
          referenceByName: ''
        },
        insuranceDetails: {
          insuranceCompany: '',
          agencyBrokerCode: '',
          policyType: '',
          insuranceType: '',
          policyNumber: '',
          policyBookingDate: '',
          policyStartDate: '',
          policyEndDate: '',
          previousPolicyNumber: '',
          ncb: '',
          vehicleType: '',
          classOfVehicle: '',
          cngIdv: '',
          totalIdv: '',
          registrationNumber: '',
          engineNumber: '',
          chassisNumber: '',
          mfy: '',
          make: '',
          model: '',
          variant: '',
          seatingCapacity: '',
          discount: '',
          loading: ''
        },
        legalLiabilityAndCovers: {
          numberOfPersonsNonFarePaying: '',
          imt28NumberOfPersons: '',
          covers: {
            paCoverPaidDriver: false,
            commercialPrivatePurpose: false,
            ownPremisesOnly: false,
            lampsTyresTubes: false,
            toolOfTrade: false,
            financierHPA: false,
            cngLpg: false,
            batteryKilowatt: false,
            electricalAccessories: false,
            nonElectricalAccessories: false,
            zeroDepreciation: false,
            returnToInvoice: false,
            roadsideAssistance: false,
            keyReplacement: false,
            inconvenienceAllowance: false,
            lossOfPersonalBelongings: false,
            consumable: false,
            engineProtector: false,
            emiProtector: false,
            medicalExpenseExtension: false,
            batterySecure: false,
            additionalTowingCover: false,
            multipleDamageCover: false,
            zeroExcessCover: false,
            tyreGuard: false,
            rimSafeguard: false,
            lossOfIncome: false,
            ncbProtection: false
          }
        },
        premiumCommissionDetails: {
          tpPremium: '',
          netPremium: '',
          gstAmount: '',
          totalPremium: '',
          payOut: '',
          mainAgentCommissionPercent: '',
          mainAgentCommissionView: '',
          mainAgentTDSPercent: '',
          mainAgentTDSAmount: '',
          brokerName: ''
        },
        registrationPermitValidity: {
          statePermitStartDate: '',
          statePermitEndDate: '',
          fitnessStartDate: '',
          fitnessEndDate: '',
          rcStartDate: '',
          rcEndDate: '',
          nationalPermitStartDate: '',
          nationalPermitEndDate: '',
          pucStartDate: '',
          pucEndDate: '',
          rtoTaxStartDate: '',
          rtoTaxEndDate: ''
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

  const handleCheckboxChange = (section, nested, field, checked) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: {
          ...prev[section][nested],
          [field]: checked
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
    <form id="vehicle-insurance-form" onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="client" className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full bg-white/10">
          <TabsTrigger value="client" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <User className="w-4 h-4" />
            Client
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <Shield className="w-4 h-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="covers" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <CheckSquare className="w-4 h-4" />
            Covers
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <DollarSign className="w-4 h-4" />
            Premium
          </TabsTrigger>
          <TabsTrigger value="validity" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-black">
            <Calendar className="w-4 h-4" />
            Validity
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer" className="text-white">
                    Customer <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.clientDetails.customer || ''}
                    onValueChange={(value) => handleInputChange('clientDetails', 'customer', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {customers.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          Loading customers...
                        </div>
                      ) : (
                        customers.map(customer => (
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
                  <Label htmlFor="referenceByName" className="text-white">
                    Reference By Name
                  </Label>
                  <Input
                    id="referenceByName"
                    value={formData.clientDetails.referenceByName}
                    onChange={(e) => handleInputChange('clientDetails', 'referenceByName', e.target.value)}
                    placeholder="Enter reference name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Details Tab */}
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
                      {vehicleInsuranceService.getInsuranceCompanies().map(company => (
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
                  <Label htmlFor="agencyBrokerCode" className="text-white">
                    Agency/Broker Code
                  </Label>
                  <Select
                    value={formData.insuranceDetails.agencyBrokerCode}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'agencyBrokerCode', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select code type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {vehicleInsuranceService.getAgencyBrokerCodes().map(code => (
                        <SelectItem key={code} value={code} className="text-gray-300 hover:text-white">
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyType" className="text-white">
                    Policy Type
                  </Label>
                  <Select
                    value={formData.insuranceDetails.policyType}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'policyType', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {vehicleInsuranceService.getPolicyTypes().map(type => (
                        <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceType" className="text-white">
                    Insurance Type
                  </Label>
                  <Select
                    value={formData.insuranceDetails.insuranceType}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'insuranceType', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {vehicleInsuranceService.getInsuranceTypes().map(type => (
                        <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="policyBookingDate" className="text-white">
                    Policy Booking Date
                  </Label>
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
                  <Label htmlFor="policyStartDate" className="text-white">
                    Policy Start Date
                  </Label>
                  <Input
                    id="policyStartDate"
                    type="date"
                    value={formData.insuranceDetails.policyStartDate}
                    onChange={(e) => handleInputChange('insuranceDetails', 'policyStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyEndDate" className="text-white">
                    Policy End Date
                  </Label>
                  <Input
                    id="policyEndDate"
                    type="date"
                    value={formData.insuranceDetails.policyEndDate}
                    onChange={(e) => handleInputChange('insuranceDetails', 'policyEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousPolicyNumber" className="text-white">
                    Previous Policy Number
                  </Label>
                  <Input
                    id="previousPolicyNumber"
                    value={formData.insuranceDetails.previousPolicyNumber}
                    onChange={(e) => handleInputChange('insuranceDetails', 'previousPolicyNumber', e.target.value)}
                    placeholder="Enter previous policy number"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ncb" className="text-white">
                    NCB
                  </Label>
                  <Input
                    id="ncb"
                    value={formData.insuranceDetails.ncb}
                    onChange={(e) => handleInputChange('insuranceDetails', 'ncb', e.target.value)}
                    placeholder="Enter NCB"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="text-white">
                    Vehicle Type
                  </Label>
                  <Select
                    value={formData.insuranceDetails.vehicleType}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'vehicleType', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {vehicleInsuranceService.getVehicleTypes().map(type => (
                        <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classOfVehicle" className="text-white">
                    Class of Vehicle
                  </Label>
                  <Select
                    value={formData.insuranceDetails.classOfVehicle}
                    onValueChange={(value) => handleInputChange('insuranceDetails', 'classOfVehicle', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select class of vehicle" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20 max-h-60">
                      {vehicleInsuranceService.getClassOfVehicle().map(cls => (
                        <SelectItem key={cls} value={cls} className="text-gray-300 hover:text-white">
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cngIdv" className="text-white">
                    CNG IDV
                  </Label>
                  <Input
                    id="cngIdv"
                    value={formData.insuranceDetails.cngIdv}
                    onChange={(e) => handleInputChange('insuranceDetails', 'cngIdv', e.target.value)}
                    placeholder="Enter CNG IDV"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalIdv" className="text-white">
                    Total IDV
                  </Label>
                  <Input
                    id="totalIdv"
                    value={formData.insuranceDetails.totalIdv}
                    onChange={(e) => handleInputChange('insuranceDetails', 'totalIdv', e.target.value)}
                    placeholder="Enter total IDV"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber" className="text-white">
                    Registration Number/RTO
                  </Label>
                  <Input
                    id="registrationNumber"
                    value={formData.insuranceDetails.registrationNumber}
                    onChange={(e) => handleInputChange('insuranceDetails', 'registrationNumber', e.target.value)}
                    placeholder="Enter registration number/RTO"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engineNumber" className="text-white">
                    Engine Number
                  </Label>
                  <Input
                    id="engineNumber"
                    value={formData.insuranceDetails.engineNumber}
                    onChange={(e) => handleInputChange('insuranceDetails', 'engineNumber', e.target.value)}
                    placeholder="Enter engine number"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chassisNumber" className="text-white">
                    Chassis Number
                  </Label>
                  <Input
                    id="chassisNumber"
                    value={formData.insuranceDetails.chassisNumber}
                    onChange={(e) => handleInputChange('insuranceDetails', 'chassisNumber', e.target.value)}
                    placeholder="Enter chassis number"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mfy" className="text-white">
                    MFY (Year of Manufacture)
                  </Label>
                  <Input
                    id="mfy"
                    value={formData.insuranceDetails.mfy}
                    onChange={(e) => handleInputChange('insuranceDetails', 'mfy', e.target.value)}
                    placeholder="Enter year of manufacture"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make" className="text-white">
                    Make
                  </Label>
                  <Input
                    id="make"
                    value={formData.insuranceDetails.make}
                    onChange={(e) => handleInputChange('insuranceDetails', 'make', e.target.value)}
                    placeholder="Enter make"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="text-white">
                    Model
                  </Label>
                  <Input
                    id="model"
                    value={formData.insuranceDetails.model}
                    onChange={(e) => handleInputChange('insuranceDetails', 'model', e.target.value)}
                    placeholder="Enter model"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variant" className="text-white">
                    Variant
                  </Label>
                  <Input
                    id="variant"
                    value={formData.insuranceDetails.variant}
                    onChange={(e) => handleInputChange('insuranceDetails', 'variant', e.target.value)}
                    placeholder="Enter variant"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seatingCapacity" className="text-white">
                    Seating Capacity
                  </Label>
                  <Input
                    id="seatingCapacity"
                    value={formData.insuranceDetails.seatingCapacity}
                    onChange={(e) => handleInputChange('insuranceDetails', 'seatingCapacity', e.target.value)}
                    placeholder="Enter seating capacity"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-white">
                    Discount
                  </Label>
                  <Input
                    id="discount"
                    value={formData.insuranceDetails.discount}
                    onChange={(e) => handleInputChange('insuranceDetails', 'discount', e.target.value)}
                    placeholder="Enter discount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loading" className="text-white">
                    Loading
                  </Label>
                  <Input
                    id="loading"
                    value={formData.insuranceDetails.loading}
                    onChange={(e) => handleInputChange('insuranceDetails', 'loading', e.target.value)}
                    placeholder="Enter loading"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Liability, Financier, Accessories, Add-Ons & Optional Covers Tab */}
        <TabsContent value="covers">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckSquare className="w-5 h-5" />
                Legal Liability, Financier, Accessories, Add-Ons & Optional Covers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfPersonsNonFarePaying" className="text-white">
                    No. of persons for legal liability to Non-Fare Paying Passengers (Employees)
                  </Label>
                  <Input
                    id="numberOfPersonsNonFarePaying"
                    value={formData.legalLiabilityAndCovers.numberOfPersonsNonFarePaying}
                    onChange={(e) => handleInputChange('legalLiabilityAndCovers', 'numberOfPersonsNonFarePaying', e.target.value)}
                    placeholder="Enter number of persons"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imt28NumberOfPersons" className="text-white">
                    IMT 28 - No. of Persons for legal liability to paid Driver/Cleaner/Conductor
                  </Label>
                  <Input
                    id="imt28NumberOfPersons"
                    value={formData.legalLiabilityAndCovers.imt28NumberOfPersons}
                    onChange={(e) => handleInputChange('legalLiabilityAndCovers', 'imt28NumberOfPersons', e.target.value)}
                    placeholder="Enter number of persons"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <Separator className="bg-white/20" />

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paCoverPaidDriver"
                      checked={formData.legalLiabilityAndCovers.covers.paCoverPaidDriver}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'paCoverPaidDriver', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="paCoverPaidDriver" className="text-white cursor-pointer">PA cover for Paid Driver (IMT 17)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="commercialPrivatePurpose"
                      checked={formData.legalLiabilityAndCovers.covers.commercialPrivatePurpose}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'commercialPrivatePurpose', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="commercialPrivatePurpose" className="text-white cursor-pointer">Is vehicle used for both commercial & private purpose (IMT 34)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ownPremisesOnly"
                      checked={formData.legalLiabilityAndCovers.covers.ownPremisesOnly}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'ownPremisesOnly', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="ownPremisesOnly" className="text-white cursor-pointer">Is vehicle use limited to own premises (IMT 13)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lampsTyresTubes"
                      checked={formData.legalLiabilityAndCovers.covers.lampsTyresTubes}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'lampsTyresTubes', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="lampsTyresTubes" className="text-white cursor-pointer">Is cover for Lamps, Tyres and Tubes etc required (IMT 23)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="toolOfTrade"
                      checked={formData.legalLiabilityAndCovers.covers.toolOfTrade}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'toolOfTrade', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="toolOfTrade" className="text-white cursor-pointer">Is vehicle used as Tool of Trade – Overturning cover required (IMT 47)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="financierHPA"
                      checked={formData.legalLiabilityAndCovers.covers.financierHPA}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'financierHPA', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="financierHPA" className="text-white cursor-pointer">Financier / HPA</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cngLpg"
                      checked={formData.legalLiabilityAndCovers.covers.cngLpg}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'cngLpg', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="cngLpg" className="text-white cursor-pointer">CNG / LPG</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="batteryKilowatt"
                      checked={formData.legalLiabilityAndCovers.covers.batteryKilowatt}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'batteryKilowatt', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="batteryKilowatt" className="text-white cursor-pointer">Battery Kilowatt for 2W</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="electricalAccessories"
                      checked={formData.legalLiabilityAndCovers.covers.electricalAccessories}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'electricalAccessories', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="electricalAccessories" className="text-white cursor-pointer">Electrical Accessories</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nonElectricalAccessories"
                      checked={formData.legalLiabilityAndCovers.covers.nonElectricalAccessories}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'nonElectricalAccessories', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="nonElectricalAccessories" className="text-white cursor-pointer">Non-Electrical Accessories</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="zeroDepreciation"
                      checked={formData.legalLiabilityAndCovers.covers.zeroDepreciation}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'zeroDepreciation', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="zeroDepreciation" className="text-white cursor-pointer">Zero Depreciation</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="returnToInvoice"
                      checked={formData.legalLiabilityAndCovers.covers.returnToInvoice}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'returnToInvoice', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="returnToInvoice" className="text-white cursor-pointer">Return to Invoice</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="roadsideAssistance"
                      checked={formData.legalLiabilityAndCovers.covers.roadsideAssistance}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'roadsideAssistance', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="roadsideAssistance" className="text-white cursor-pointer">Roadside Assistance</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keyReplacement"
                      checked={formData.legalLiabilityAndCovers.covers.keyReplacement}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'keyReplacement', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="keyReplacement" className="text-white cursor-pointer">Key Replacement</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inconvenienceAllowance"
                      checked={formData.legalLiabilityAndCovers.covers.inconvenienceAllowance}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'inconvenienceAllowance', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="inconvenienceAllowance" className="text-white cursor-pointer">Inconvenience Allowance</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lossOfPersonalBelongings"
                      checked={formData.legalLiabilityAndCovers.covers.lossOfPersonalBelongings}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'lossOfPersonalBelongings', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="lossOfPersonalBelongings" className="text-white cursor-pointer">Loss of Personal Belongings</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consumable"
                      checked={formData.legalLiabilityAndCovers.covers.consumable}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'consumable', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="consumable" className="text-white cursor-pointer">Consumable</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="engineProtector"
                      checked={formData.legalLiabilityAndCovers.covers.engineProtector}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'engineProtector', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="engineProtector" className="text-white cursor-pointer">Engine Protector</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emiProtector"
                      checked={formData.legalLiabilityAndCovers.covers.emiProtector}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'emiProtector', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="emiProtector" className="text-white cursor-pointer">EMI Protector</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="medicalExpenseExtension"
                      checked={formData.legalLiabilityAndCovers.covers.medicalExpenseExtension}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'medicalExpenseExtension', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="medicalExpenseExtension" className="text-white cursor-pointer">Medical Expense Extension</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="batterySecure"
                      checked={formData.legalLiabilityAndCovers.covers.batterySecure}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'batterySecure', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="batterySecure" className="text-white cursor-pointer">Battery Secure</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="additionalTowingCover"
                      checked={formData.legalLiabilityAndCovers.covers.additionalTowingCover}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'additionalTowingCover', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="additionalTowingCover" className="text-white cursor-pointer">Additional Towing Cover</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="multipleDamageCover"
                      checked={formData.legalLiabilityAndCovers.covers.multipleDamageCover}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'multipleDamageCover', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="multipleDamageCover" className="text-white cursor-pointer">Multiple Damage Cover</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="zeroExcessCover"
                      checked={formData.legalLiabilityAndCovers.covers.zeroExcessCover}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'zeroExcessCover', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="zeroExcessCover" className="text-white cursor-pointer">Zero Excess Cover</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tyreGuard"
                      checked={formData.legalLiabilityAndCovers.covers.tyreGuard}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'tyreGuard', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="tyreGuard" className="text-white cursor-pointer">Tyre Guard</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rimSafeguard"
                      checked={formData.legalLiabilityAndCovers.covers.rimSafeguard}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'rimSafeguard', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="rimSafeguard" className="text-white cursor-pointer">Rim Safeguard</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lossOfIncome"
                      checked={formData.legalLiabilityAndCovers.covers.lossOfIncome}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'lossOfIncome', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="lossOfIncome" className="text-white cursor-pointer">Loss of Income</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ncbProtection"
                      checked={formData.legalLiabilityAndCovers.covers.ncbProtection}
                      onCheckedChange={(checked) => handleCheckboxChange('legalLiabilityAndCovers', 'covers', 'ncbProtection', checked)}
                      className="border-white/30"
                    />
                    <Label htmlFor="ncbProtection" className="text-white cursor-pointer">NCB Protection</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Premium & Commission Details Tab */}
        <TabsContent value="premium">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5" />
                Premium & Commission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tpPremium" className="text-white">TP Premium</Label>
                  <Input
                    id="tpPremium"
                    type="number"
                    value={formData.premiumCommissionDetails.tpPremium}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'tpPremium', e.target.value)}
                    placeholder="Enter TP premium"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="netPremium" className="text-white">Net Premium</Label>
                  <Input
                    id="netPremium"
                    type="number"
                    value={formData.premiumCommissionDetails.netPremium}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'netPremium', e.target.value)}
                    placeholder="Enter net premium"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstAmount" className="text-white">GST Amount</Label>
                  <Input
                    id="gstAmount"
                    type="number"
                    value={formData.premiumCommissionDetails.gstAmount}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'gstAmount', e.target.value)}
                    placeholder="Enter GST amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalPremium" className="text-white">Total Premium</Label>
                  <Input
                    id="totalPremium"
                    type="number"
                    value={formData.premiumCommissionDetails.totalPremium}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'totalPremium', e.target.value)}
                    placeholder="Enter total premium"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payOut" className="text-white">PayOut</Label>
                  <Select
                    value={formData.premiumCommissionDetails.payOut}
                    onValueChange={(value) => handleInputChange('premiumCommissionDetails', 'payOut', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select payout type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                      {vehicleInsuranceService.getPayOutTypes().map(type => (
                        <SelectItem key={type} value={type} className="text-gray-300 hover:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainAgentCommissionPercent" className="text-white">Main Agent Commission %</Label>
                  <Input
                    id="mainAgentCommissionPercent"
                    type="number"
                    value={formData.premiumCommissionDetails.mainAgentCommissionPercent}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'mainAgentCommissionPercent', e.target.value)}
                    placeholder="Enter commission %"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainAgentCommissionView" className="text-white">Main Agent Commission View</Label>
                  <Input
                    id="mainAgentCommissionView"
                    type="number"
                    value={formData.premiumCommissionDetails.mainAgentCommissionView}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'mainAgentCommissionView', e.target.value)}
                    placeholder="Enter commission view"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainAgentTDSPercent" className="text-white">Main Agent TDS %</Label>
                  <Input
                    id="mainAgentTDSPercent"
                    type="number"
                    value={formData.premiumCommissionDetails.mainAgentTDSPercent}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'mainAgentTDSPercent', e.target.value)}
                    placeholder="Enter TDS %"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainAgentTDSAmount" className="text-white">Main Agent TDS Amount</Label>
                  <Input
                    id="mainAgentTDSAmount"
                    type="number"
                    value={formData.premiumCommissionDetails.mainAgentTDSAmount}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'mainAgentTDSAmount', e.target.value)}
                    placeholder="Enter TDS amount"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerName" className="text-white">Broker Name</Label>
                  <Input
                    id="brokerName"
                    value={formData.premiumCommissionDetails.brokerName}
                    onChange={(e) => handleInputChange('premiumCommissionDetails', 'brokerName', e.target.value)}
                    placeholder="Enter broker name"
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registration & Permit Validity Tab */}
        <TabsContent value="validity">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5" />
                Registration & Permit Validity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statePermitStartDate" className="text-white">State Permit Start Date</Label>
                  <Input
                    id="statePermitStartDate"
                    type="date"
                    value={formData.registrationPermitValidity.statePermitStartDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'statePermitStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statePermitEndDate" className="text-white">State Permit End Date</Label>
                  <Input
                    id="statePermitEndDate"
                    type="date"
                    value={formData.registrationPermitValidity.statePermitEndDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'statePermitEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fitnessStartDate" className="text-white">Fitness Start Date</Label>
                  <Input
                    id="fitnessStartDate"
                    type="date"
                    value={formData.registrationPermitValidity.fitnessStartDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'fitnessStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitnessEndDate" className="text-white">Fitness End Date</Label>
                  <Input
                    id="fitnessEndDate"
                    type="date"
                    value={formData.registrationPermitValidity.fitnessEndDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'fitnessEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rcStartDate" className="text-white">RC Start Date</Label>
                  <Input
                    id="rcStartDate"
                    type="date"
                    value={formData.registrationPermitValidity.rcStartDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'rcStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rcEndDate" className="text-white">RC End Date</Label>
                  <Input
                    id="rcEndDate"
                    type="date"
                    value={formData.registrationPermitValidity.rcEndDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'rcEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationalPermitStartDate" className="text-white">National Permit Start Date</Label>
                  <Input
                    id="nationalPermitStartDate"
                    type="date"
                    value={formData.registrationPermitValidity.nationalPermitStartDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'nationalPermitStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalPermitEndDate" className="text-white">National Permit End Date</Label>
                  <Input
                    id="nationalPermitEndDate"
                    type="date"
                    value={formData.registrationPermitValidity.nationalPermitEndDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'nationalPermitEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pucStartDate" className="text-white">PUC Start Date</Label>
                  <Input
                    id="pucStartDate"
                    type="date"
                    value={formData.registrationPermitValidity.pucStartDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'pucStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pucEndDate" className="text-white">PUC End Date</Label>
                  <Input
                    id="pucEndDate"
                    type="date"
                    value={formData.registrationPermitValidity.pucEndDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'pucEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rtoTaxStartDate" className="text-white">RTO Tax Start Date</Label>
                  <Input
                    id="rtoTaxStartDate"
                    type="date"
                    value={formData.registrationPermitValidity.rtoTaxStartDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'rtoTaxStartDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rtoTaxEndDate" className="text-white">RTO Tax End Date</Label>
                  <Input
                    id="rtoTaxEndDate"
                    type="date"
                    value={formData.registrationPermitValidity.rtoTaxEndDate}
                    onChange={(e) => handleInputChange('registrationPermitValidity', 'rtoTaxEndDate', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
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
                              {vehicleInsuranceService.getDocumentTypes().map(type => (
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
      </Tabs>
    </form>
  );
};

export default VehicleInsuranceFormStyled;
