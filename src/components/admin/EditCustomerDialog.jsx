// src/components/admin/EditCustomerDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  AlertTriangle, 
  Plus, 
  X, 
  Upload, 
  User, 
  Building2, 
  Users, 
  FileText,
  Camera,
  Save,
  Edit
} from 'lucide-react';
import { useUpdateCustomer } from '@/hooks/useCustomer';

// Indian states list
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

// Document types
const DOCUMENT_TYPES = [
  { value: 'aadhaar_card', label: 'Aadhaar Card' },
  { value: 'pan_card', label: 'PAN Card' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'mediclaim', label: 'Mediclaim' },
  { value: 'rc_book', label: 'RC Book' },
  { value: 'other', label: 'Other File' }
];

// Relationship types
const RELATIONSHIPS = [
  'husband', 'wife', 'daughter', 'brother', 'sister', 'son', 
  'mother', 'father', 'mother_in_law', 'father_in_law', 
  'daughter_in_law', 'nephew', 'other'
];

const EditCustomerDialog = ({ customer, open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    customerType: 'individual',
    personalDetails: {
      firstName: '',
      middleName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      state: '',
      city: '',
      country: 'India',
      address: '',
      birthPlace: '',
      birthDate: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      education: '',
      maritalStatus: '',
      businessOrJob: '',
      nameOfBusinessJob: '',
      typeOfDuty: '',
      annualIncome: '',
      panNumber: '',
      gstNumber: '',
      profilePhoto: ''
    },
    corporateDetails: [],
    familyDetails: [],
    documents: [],
    additionalDocuments: []
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    documents: [],
    additionalDocuments: []
  });
  
  const [errors, setErrors] = useState({});
  const updateMutation = useUpdateCustomer();

  // Initialize form data when customer changes
  useEffect(() => {
    if (customer && open) {
      setFormData({
        customerType: customer.customerType || 'individual',
        personalDetails: {
          firstName: customer.personalDetails?.firstName || '',
          middleName: customer.personalDetails?.middleName || '',
          lastName: customer.personalDetails?.lastName || '',
          mobileNumber: customer.personalDetails?.mobileNumber || '',
          email: customer.personalDetails?.email || '',
          state: customer.personalDetails?.state || '',
          city: customer.personalDetails?.city || '',
          country: customer.personalDetails?.country || 'India',
          address: customer.personalDetails?.address || '',
          birthPlace: customer.personalDetails?.birthPlace || '',
          birthDate: customer.personalDetails?.birthDate || '',
          age: customer.personalDetails?.age || '',
          gender: customer.personalDetails?.gender || '',
          height: customer.personalDetails?.height || '',
          weight: customer.personalDetails?.weight || '',
          education: customer.personalDetails?.education || '',
          maritalStatus: customer.personalDetails?.maritalStatus || '',
          businessOrJob: customer.personalDetails?.businessOrJob || '',
          nameOfBusinessJob: customer.personalDetails?.nameOfBusinessJob || '',
          typeOfDuty: customer.personalDetails?.typeOfDuty || '',
          annualIncome: customer.personalDetails?.annualIncome || '',
          panNumber: customer.personalDetails?.panNumber || '',
          gstNumber: customer.personalDetails?.gstNumber || '',
          profilePhoto: customer.personalDetails?.profilePhoto || ''
        },
        corporateDetails: customer.corporateDetails || [],
        familyDetails: customer.familyDetails || [],
        documents: customer.documents || [],
        additionalDocuments: customer.additionalDocuments || []
      });
      setErrors({});
      setFiles({
        profilePhoto: null,
        documents: [],
        additionalDocuments: []
      });
      setActiveTab("personal");
    }
  }, [customer, open]);

  // Handle form field changes
  const handleFieldChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear field-specific error
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: null
      }));
    }
  };

  // Handle array field changes (corporate, family, documents)
  const handleArrayFieldChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add new item to array sections
  const addArrayItem = (section) => {
    const newItem = section === 'corporateDetails' ? {
      companyName: '',
      mobileNumber: '',
      email: '',
      state: '',
      city: '',
      address: '',
      annualIncome: '',
      panNumber: ''
    } : section === 'familyDetails' ? {
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      age: '',
      height: '',
      weight: '',
      gender: '',
      relationship: '',
      panNumber: '',
      mobileNumber: ''
    } : section === 'documents' ? {
      documentType: '',
      file: null
    } : {
      name: '',
      file: null
    };

    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  // Remove item from array sections
  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Handle file uploads
  const handleFileChange = (type, file, index = null) => {
    if (type === 'profilePhoto') {
      setFiles(prev => ({ ...prev, profilePhoto: file }));
    } else if (type === 'documents' && index !== null) {
      setFiles(prev => ({
        ...prev,
        documents: prev.documents.map((item, i) => i === index ? file : item)
      }));
      // Also update the formData
      handleArrayFieldChange('documents', index, 'file', file);
    } else if (type === 'additionalDocuments' && index !== null) {
      setFiles(prev => ({
        ...prev,
        additionalDocuments: prev.additionalDocuments.map((item, i) => i === index ? file : item)
      }));
      // Also update the formData
      handleArrayFieldChange('additionalDocuments', index, 'file', file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer type validation
    if (!formData.customerType) {
      newErrors['customerType'] = 'Customer type is required';
    }

    // Personal details validation (for individual customers)
    if (formData.customerType === 'individual') {
      if (!formData.personalDetails.firstName.trim()) {
        newErrors['personalDetails.firstName'] = 'First name is required';
      }
      if (!formData.personalDetails.lastName.trim()) {
        newErrors['personalDetails.lastName'] = 'Last name is required';
      }
      if (!formData.personalDetails.mobileNumber) {
        newErrors['personalDetails.mobileNumber'] = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.personalDetails.mobileNumber)) {
        newErrors['personalDetails.mobileNumber'] = 'Please enter a valid Indian mobile number';
      }
      if (!formData.personalDetails.email) {
        newErrors['personalDetails.email'] = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.personalDetails.email)) {
        newErrors['personalDetails.email'] = 'Please enter a valid email address';
      }
      if (!formData.personalDetails.state) {
        newErrors['personalDetails.state'] = 'State is required';
      }
      if (!formData.personalDetails.city) {
        newErrors['personalDetails.city'] = 'City is required';
      }
      if (!formData.personalDetails.address.trim()) {
        newErrors['personalDetails.address'] = 'Address is required';
      }
      if (!formData.personalDetails.birthDate) {
        newErrors['personalDetails.birthDate'] = 'Birth date is required';
      }
      if (!formData.personalDetails.gender) {
        newErrors['personalDetails.gender'] = 'Gender is required';
      }
      if (!formData.personalDetails.maritalStatus) {
        newErrors['personalDetails.maritalStatus'] = 'Marital status is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Clean the form data to handle empty enum fields
      const cleanedFormData = {
        ...formData,
        personalDetails: {
          ...formData.personalDetails,
          // Remove empty businessOrJob field or set to undefined to avoid enum validation error
          businessOrJob: formData.personalDetails.businessOrJob || undefined,
          // Convert empty strings to null/undefined for optional fields
          height: formData.personalDetails.height || undefined,
          weight: formData.personalDetails.weight || undefined,
          age: formData.personalDetails.age || undefined,
          annualIncome: formData.personalDetails.annualIncome || undefined,
          panNumber: formData.personalDetails.panNumber || undefined,
          gstNumber: formData.personalDetails.gstNumber || undefined,
          birthPlace: formData.personalDetails.birthPlace || undefined,
          education: formData.personalDetails.education || undefined,
          nameOfBusinessJob: formData.personalDetails.nameOfBusinessJob || undefined,
          typeOfDuty: formData.personalDetails.typeOfDuty || undefined
        }
      };

      // Prepare files for upload
      const uploadFiles = {};
      
      if (files.profilePhoto) {
        uploadFiles.profilePhoto = files.profilePhoto;
      }
      
      if (formData.documents.length > 0) {
        uploadFiles.documents = formData.documents.map(doc => doc.file).filter(Boolean);
        uploadFiles.documentTypes = formData.documents.map(doc => doc.documentType);
      }
      
      if (formData.additionalDocuments.length > 0) {
        uploadFiles.additionalDocuments = formData.additionalDocuments.map(doc => doc.file).filter(Boolean);
        uploadFiles.additionalDocumentNames = formData.additionalDocuments.map(doc => doc.name);
      }

      await updateMutation.mutateAsync({
        customerId: customer._id,
        customerData: cleanedFormData,
        files: uploadFiles
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Update customer error:', error);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Edit Customer</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update customer information and details.
          </DialogDescription>
        </DialogHeader>

        {/* Server Error Display */}
        {updateMutation.error && (
          <Alert variant="destructive" className="border-red-300/50 bg-red-500/20 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4 text-red-300" />
            <AlertDescription className="text-red-200">
              {updateMutation.error.message || 'Failed to update customer. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Type Selection - Changed to Dropdown */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Customer Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="customerType" className="text-white">
                  Select Customer Type <span className="text-red-400">*</span>
                </Label>
                <Select 
                  value={formData.customerType} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, customerType: value }));
                    // Clear customer type error
                    if (errors['customerType']) {
                      setErrors(prev => ({ ...prev, customerType: null }));
                    }
                  }}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Select customer type">
                      <div className="flex items-center space-x-2">
                        {formData.customerType === 'individual' ? (
                          <>
                            <User className="h-4 w-4" />
                            <span>Individual</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="h-4 w-4" />
                            <span>Corporate</span>
                          </>
                        )}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                    <SelectItem value="individual" className="text-gray-300 hover:text-white">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Individual</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="corporate" className="text-gray-300 hover:text-white">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4" />
                        <span>Corporate</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors['customerType'] && (
                  <p className="text-red-400 text-sm">{errors['customerType']}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-black">
                Personal Details
              </TabsTrigger>
              <TabsTrigger value="family" className="data-[state=active]:bg-white data-[state=active]:text-black">
                Family Details
              </TabsTrigger>
              <TabsTrigger value="corporate" className="data-[state=active]:bg-white data-[state=active]:text-black">
                Corporate Details
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:text-black">
                Documents
              </TabsTrigger>
            </TabsList>

            {/* Personal Details Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        First Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.personalDetails.firstName}
                        onChange={(e) => handleFieldChange('personalDetails', 'firstName', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                      {errors['personalDetails.firstName'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.firstName']}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="middleName" className="text-white">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.personalDetails.middleName}
                        onChange={(e) => handleFieldChange('personalDetails', 'middleName', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">
                        Last Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.personalDetails.lastName}
                        onChange={(e) => handleFieldChange('personalDetails', 'lastName', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                      {errors['personalDetails.lastName'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.lastName']}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber" className="text-white">
                        Mobile Number <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="mobileNumber"
                        value={formData.personalDetails.mobileNumber}
                        onChange={(e) => handleFieldChange('personalDetails', 'mobileNumber', e.target.value)}
                        placeholder="10-digit mobile number"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                      {errors['personalDetails.mobileNumber'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.mobileNumber']}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.personalDetails.email}
                        onChange={(e) => handleFieldChange('personalDetails', 'email', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                      {errors['personalDetails.email'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.email']}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">
                        State <span className="text-red-400">*</span>
                      </Label>
                      <Select 
                        value={formData.personalDetails.state} 
                        onValueChange={(value) => handleFieldChange('personalDetails', 'state', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state} className="text-gray-300 hover:text-white">
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors['personalDetails.state'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.state']}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">
                        City <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.personalDetails.city}
                        onChange={(e) => handleFieldChange('personalDetails', 'city', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                      {errors['personalDetails.city'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.city']}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-white">Country</Label>
                      <Input
                        id="country"
                        value={formData.personalDetails.country}
                        onChange={(e) => handleFieldChange('personalDetails', 'country', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">
                      Address <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.personalDetails.address}
                      onChange={(e) => handleFieldChange('personalDetails', 'address', e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                      rows={3}
                      disabled={updateMutation.isPending}
                    />
                    {errors['personalDetails.address'] && (
                      <p className="text-red-400 text-sm">{errors['personalDetails.address']}</p>
                    )}
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-white">
                        Birth Date <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.personalDetails.birthDate}
                        onChange={(e) => handleFieldChange('personalDetails', 'birthDate', e.target.value)}
                        className="bg-white/10 border-white/30 text-white"
                        disabled={updateMutation.isPending}
                      />
                      {errors['personalDetails.birthDate'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.birthDate']}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-white">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.personalDetails.age}
                        onChange={(e) => handleFieldChange('personalDetails', 'age', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-white">
                        Gender <span className="text-red-400">*</span>
                      </Label>
                      <Select 
                        value={formData.personalDetails.gender} 
                        onValueChange={(value) => handleFieldChange('personalDetails', 'gender', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                          <SelectItem value="male" className="text-gray-300 hover:text-white">Male</SelectItem>
                          <SelectItem value="female" className="text-gray-300 hover:text-white">Female</SelectItem>
                          <SelectItem value="other" className="text-gray-300 hover:text-white">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors['personalDetails.gender'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.gender']}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus" className="text-white">
                        Marital Status <span className="text-red-400">*</span>
                      </Label>
                      <Select 
                        value={formData.personalDetails.maritalStatus} 
                        onValueChange={(value) => handleFieldChange('personalDetails', 'maritalStatus', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                          <SelectItem value="married" className="text-gray-300 hover:text-white">Married</SelectItem>
                          <SelectItem value="unmarried" className="text-gray-300 hover:text-white">Unmarried</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors['personalDetails.maritalStatus'] && (
                        <p className="text-red-400 text-sm">{errors['personalDetails.maritalStatus']}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-white">Height (feet)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={formData.personalDetails.height}
                        onChange={(e) => handleFieldChange('personalDetails', 'height', e.target.value)}
                        placeholder="e.g., 5.8"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.personalDetails.weight}
                        onChange={(e) => handleFieldChange('personalDetails', 'weight', e.target.value)}
                        placeholder="e.g., 70"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-white">Education</Label>
                      <Input
                        id="education"
                        value={formData.personalDetails.education}
                        onChange={(e) => handleFieldChange('personalDetails', 'education', e.target.value)}
                        placeholder="e.g., Bachelor's Degree"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                  </div>

                  {/* Birth Place */}
                  <div className="space-y-2">
                    <Label htmlFor="birthPlace" className="text-white">Birth Place</Label>
                    <Input
                      id="birthPlace"
                      value={formData.personalDetails.birthPlace}
                      onChange={(e) => handleFieldChange('personalDetails', 'birthPlace', e.target.value)}
                      placeholder="Enter birth place"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                      disabled={updateMutation.isPending}
                    />
                  </div>

                  {/* Business/Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessOrJob" className="text-white">Business / Job</Label>
                      <Select 
                        value={formData.personalDetails.businessOrJob} 
                        onValueChange={(value) => handleFieldChange('personalDetails', 'businessOrJob', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                          <SelectItem value="business" className="text-gray-300 hover:text-white">Business</SelectItem>
                          <SelectItem value="job" className="text-gray-300 hover:text-white">Job</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nameOfBusinessJob" className="text-white">Name of Business/Job</Label>
                      <Input
                        id="nameOfBusinessJob"
                        value={formData.personalDetails.nameOfBusinessJob}
                        onChange={(e) => handleFieldChange('personalDetails', 'nameOfBusinessJob', e.target.value)}
                        placeholder="Enter business/job name"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typeOfDuty" className="text-white">Type of Duty</Label>
                    <Input
                      id="typeOfDuty"
                      value={formData.personalDetails.typeOfDuty}
                      onChange={(e) => handleFieldChange('personalDetails', 'typeOfDuty', e.target.value)}
                      placeholder="Enter type of duty"
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                      disabled={updateMutation.isPending}
                    />
                  </div>

                  {/* Financial Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annualIncome" className="text-white">Annual Income</Label>
                      <Input
                        id="annualIncome"
                        type="number"
                        value={formData.personalDetails.annualIncome}
                        onChange={(e) => handleFieldChange('personalDetails', 'annualIncome', e.target.value)}
                        placeholder="Enter annual income"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="panNumber" className="text-white">PAN Number</Label>
                      <Input
                        id="panNumber"
                        value={formData.personalDetails.panNumber}
                        onChange={(e) => handleFieldChange('personalDetails', 'panNumber', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber" className="text-white">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={formData.personalDetails.gstNumber}
                        onChange={(e) => handleFieldChange('personalDetails', 'gstNumber', e.target.value.toUpperCase())}
                        placeholder="GST Number"
                        className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="space-y-2">
                    <Label className="text-white">Profile Photo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-white/10 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                        {files.profilePhoto ? (
                          <img 
                            src={URL.createObjectURL(files.profilePhoto)} 
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Camera className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('profilePhoto', e.target.files[0])}
                          className="bg-white/10 border-white/30 text-white"
                          disabled={updateMutation.isPending}
                        />
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Family Details Tab */}
            <TabsContent value="family" className="space-y-6">
              <Card className="bg-white/5 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Family Members</span>
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={() => addArrayItem('familyDetails')}
                    className="bg-white/20 hover:bg-white/30 text-white"
                    disabled={updateMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Family Member
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.familyDetails.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No family members added yet</p>
                      <p className="text-gray-500 text-sm">Click "Add Family Member" to get started</p>
                    </div>
                  ) : (
                    formData.familyDetails.map((family, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                            Family Member {index + 1}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('familyDetails', index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            disabled={updateMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">
                                First Name <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                value={family.firstName}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'firstName', e.target.value)}
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">Middle Name</Label>
                              <Input
                                value={family.middleName}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'middleName', e.target.value)}
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">
                                Last Name <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                value={family.lastName}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'lastName', e.target.value)}
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">
                                Birth Date <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                type="date"
                                value={family.birthDate}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'birthDate', e.target.value)}
                                className="bg-white/10 border-white/30 text-white"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">
                                Age <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                type="number"
                                value={family.age}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'age', e.target.value)}
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">
                                Gender <span className="text-red-400">*</span>
                              </Label>
                              <Select 
                                value={family.gender} 
                                onValueChange={(value) => handleArrayFieldChange('familyDetails', index, 'gender', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                                  <SelectItem value="male" className="text-gray-300 hover:text-white">Male</SelectItem>
                                  <SelectItem value="female" className="text-gray-300 hover:text-white">Female</SelectItem>
                                  <SelectItem value="other" className="text-gray-300 hover:text-white">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">
                                Relationship <span className="text-red-400">*</span>
                              </Label>
                              <Select 
                                value={family.relationship} 
                                onValueChange={(value) => handleArrayFieldChange('familyDetails', index, 'relationship', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                                  {RELATIONSHIPS.map((rel) => (
                                    <SelectItem key={rel} value={rel} className="text-gray-300 hover:text-white">
                                      {rel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">Height (feet)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={family.height}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'height', e.target.value)}
                                placeholder="e.g., 5.8"
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">Weight (kg)</Label>
                              <Input
                                type="number"
                                value={family.weight}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'weight', e.target.value)}
                                placeholder="e.g., 70"
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">PAN Number</Label>
                              <Input
                                value={family.panNumber}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'panNumber', e.target.value.toUpperCase())}
                                placeholder="ABCDE1234F"
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">Mobile Number</Label>
                              <Input
                                value={family.mobileNumber}
                                onChange={(e) => handleArrayFieldChange('familyDetails', index, 'mobileNumber', e.target.value)}
                                placeholder="10-digit mobile number"
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Corporate Details Tab */}
            <TabsContent value="corporate" className="space-y-6">
              <Card className="bg-white/5 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Corporate Details</span>
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={() => addArrayItem('corporateDetails')}
                    className="bg-white/20 hover:bg-white/30 text-white"
                    disabled={updateMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Corporate Detail
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.corporateDetails.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No corporate details added yet</p>
                      <p className="text-gray-500 text-sm">Click "Add Corporate Detail" to get started</p>
                    </div>
                  ) : (
                    formData.corporateDetails.map((corp, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                            Corporate Detail {index + 1}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('corporateDetails', index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            disabled={updateMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">
                                Company Name <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                value={corp.companyName}
                                onChange={(e) => handleArrayFieldChange('corporateDetails', index, 'companyName', e.target.value)}
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">
                                PAN Number <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                value={corp.panNumber}
                                onChange={(e) => handleArrayFieldChange('corporateDetails', index, 'panNumber', e.target.value.toUpperCase())}
                                placeholder="ABCDE1234F"
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">
                                Mobile Number <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                value={corp.mobileNumber}
                                onChange={(e) => handleArrayFieldChange('corporateDetails', index, 'mobileNumber', e.target.value)}
                                placeholder="10-digit mobile number"
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">
                                Email <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                type="email"
                                value={corp.email}
                                onChange={(e) => handleArrayFieldChange('corporateDetails', index, 'email', e.target.value)}
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">
                                State <span className="text-red-400">*</span>
                              </Label>
                              <Select 
                                value={corp.state} 
                                onValueChange={(value) => handleArrayFieldChange('corporateDetails', index, 'state', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                                  {INDIAN_STATES.map((state) => (
                                    <SelectItem key={state} value={state} className="text-gray-300 hover:text-white">
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">
                                City <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                value={corp.city}
                                onChange={(e) => handleArrayFieldChange('corporateDetails', index, 'city', e.target.value)}
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">
                              Address <span className="text-red-400">*</span>
                            </Label>
                            <Textarea
                              value={corp.address}
                              onChange={(e) => handleArrayFieldChange('corporateDetails', index, 'address', e.target.value)}
                              className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                              rows={3}
                              disabled={updateMutation.isPending}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Annual Income</Label>
                            <Input
                              type="number"
                              value={corp.annualIncome}
                              onChange={(e) => handleArrayFieldChange('corporateDetails', index, 'annualIncome', e.target.value)}
                              placeholder="Enter annual income"
                              className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                              disabled={updateMutation.isPending}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Documents */}
                <Card className="bg-white/5 border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Documents</span>
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={() => addArrayItem('documents')}
                      className="bg-white/20 hover:bg-white/30 text-white"
                      disabled={updateMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.documents.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No documents added yet</p>
                      </div>
                    ) : (
                      formData.documents.map((doc, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              Document {index + 1}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem('documents', index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              disabled={updateMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-white">
                                Document Type <span className="text-red-400">*</span>
                              </Label>
                              <Select 
                                value={doc.documentType} 
                                onValueChange={(value) => handleArrayFieldChange('documents', index, 'documentType', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                  <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                                  {DOCUMENT_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value} className="text-gray-300 hover:text-white">
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-white">
                                Upload File <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange('documents', e.target.files[0], index)}
                                className="bg-white/10 border-white/30 text-white"
                                disabled={updateMutation.isPending}
                              />
                              <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG up to 5MB</p>
                            </div>
                            
                            {doc.file && (
                              <div className="flex items-center space-x-2 text-green-400">
                                <Upload className="h-4 w-4" />
                                <span className="text-sm">{doc.file.name}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Additional Documents */}
                <Card className="bg-white/5 border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Additional Documents</span>
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={() => addArrayItem('additionalDocuments')}
                      className="bg-white/20 hover:bg-white/30 text-white"
                      disabled={updateMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.additionalDocuments.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No additional documents added yet</p>
                      </div>
                    ) : (
                      formData.additionalDocuments.map((doc, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                              Additional Doc {index + 1}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem('additionalDocuments', index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              disabled={updateMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-white">
                                Document Name <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                value={doc.name}
                                onChange={(e) => handleArrayFieldChange('additionalDocuments', index, 'name', e.target.value)}
                                placeholder="Enter document name"
                                className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                                disabled={updateMutation.isPending}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-white">
                                Upload File <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange('additionalDocuments', e.target.files[0], index)}
                                className="bg-white/10 border-white/30 text-white"
                                disabled={updateMutation.isPending}
                              />
                              <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG up to 5MB</p>
                            </div>
                            
                            {doc.file && (
                              <div className="flex items-center space-x-2 text-green-400">
                                <Upload className="h-4 w-4" />
                                <span className="text-sm">{doc.file.name}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Customer
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
