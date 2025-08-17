// src/components/admin/ViewCustomerDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Eye,
  User, 
  Building2, 
  Users, 
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Hash,
  Building,
  UserCheck,
  UserX,
  Clock,
  Edit,
  Download,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

const ViewCustomerDialog = ({ customer, open, onOpenChange }) => {
  if (!customer) return null;

  const getCustomerName = () => {
    if (customer.customerType === 'individual' && customer.personalDetails) {
      const { firstName, middleName, lastName } = customer.personalDetails;
      return [firstName, middleName, lastName].filter(Boolean).join(' ');
    } else if (customer.customerType === 'corporate' && customer.corporateDetails?.length > 0) {
      return customer.corporateDetails[0].companyName;
    }
    return 'N/A';
  };

  const getCustomerContact = () => {
    if (customer.customerType === 'individual' && customer.personalDetails) {
      return {
        email: customer.personalDetails.email,
        phone: customer.personalDetails.mobileNumber,
        alternatePhone: customer.personalDetails.alternateNumber
      };
    } else if (customer.customerType === 'corporate' && customer.corporateDetails?.length > 0) {
      return {
        email: customer.corporateDetails[0].email,
        phone: customer.corporateDetails[0].mobileNumber,
        alternatePhone: customer.corporateDetails[0].alternateNumber
      };
    }
    return { email: 'N/A', phone: 'N/A', alternatePhone: 'N/A' };
  };

  const getCustomerAddress = () => {
    const details = customer.customerType === 'individual' 
      ? customer.personalDetails 
      : customer.corporateDetails?.[0];
    
    if (!details) return 'N/A';
    
    const addressParts = [
      details.address,
      details.city,
      details.state,
      details.pincode
    ].filter(Boolean);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
  };

  const customerName = getCustomerName();
  const contact = getCustomerContact();
  const address = getCustomerAddress();

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <User className="h-5 w-5 text-blue-400" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">First Name</p>
              <p className="text-white font-medium">{customer.personalDetails?.firstName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Middle Name</p>
              <p className="text-white font-medium">{customer.personalDetails?.middleName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Last Name</p>
              <p className="text-white font-medium">{customer.personalDetails?.lastName || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-white">{customer.personalDetails?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Mobile Number</p>
              <p className="text-white">{customer.personalDetails?.mobileNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">State</p>
              <p className="text-white">{customer.personalDetails?.state || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">City</p>
              <p className="text-white">{customer.personalDetails?.city || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Country</p>
              <p className="text-white">{customer.personalDetails?.country || 'N/A'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Address</p>
            <p className="text-white">{customer.personalDetails?.address || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {customer.personalDetails?.birthDate && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Birth Date</p>
                <p className="text-white">
                  {format(new Date(customer.personalDetails.birthDate), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400 mb-1">Birth Place</p>
              <p className="text-white">{customer.personalDetails?.birthPlace || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Age</p>
              <p className="text-white">{customer.personalDetails?.age || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Gender</p>
              <p className="text-white capitalize">{customer.personalDetails?.gender || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Height</p>
              <p className="text-white">{customer.personalDetails?.height ? `${customer.personalDetails.height} feet` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Weight</p>
              <p className="text-white">{customer.personalDetails?.weight ? `${customer.personalDetails.weight} kg` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Education</p>
              <p className="text-white">{customer.personalDetails?.education || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Marital Status</p>
              <p className="text-white capitalize">{customer.personalDetails?.maritalStatus || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Business/Job Type</p>
              <p className="text-white capitalize">{customer.personalDetails?.businessOrJob || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Business/Job Name</p>
              <p className="text-white">{customer.personalDetails?.nameOfBusinessJob || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Type of Duty</p>
              <p className="text-white">{customer.personalDetails?.typeOfDuty || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Annual Income</p>
              <p className="text-white">
                {customer.personalDetails?.annualIncome ? `₹${customer.personalDetails.annualIncome.toLocaleString()}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">PAN Number</p>
              <p className="text-white font-mono">{customer.personalDetails?.panNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">GST Number</p>
              <p className="text-white font-mono">{customer.personalDetails?.gstNumber || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCorporateDetails = () => (
    <div className="space-y-6">
      {/* Corporate Information */}
      {customer.corporateDetails && customer.corporateDetails.length > 0 ? (
        customer.corporateDetails.map((corp, index) => (
          <Card key={index} className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Building2 className="h-5 w-5 text-purple-400" />
                <span>Corporate Details {customer.corporateDetails.length > 1 ? `(${index + 1})` : ''}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Company Name</p>
                  <p className="text-white font-medium">{corp.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">PAN Number</p>
                  <p className="text-white font-mono">{corp.panNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Mobile Number</p>
                  <p className="text-white">{corp.mobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white">{corp.email || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">State</p>
                  <p className="text-white">{corp.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">City</p>
                  <p className="text-white">{corp.city || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Address</p>
                <p className="text-white">{corp.address || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Annual Income</p>
                <p className="text-white">
                  {corp.annualIncome ? `₹${corp.annualIncome.toLocaleString()}` : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Building2 className="h-5 w-5 text-purple-400" />
              <span>Corporate Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center py-4">No corporate details available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderFamilyDetails = () => (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Users className="h-5 w-5 text-green-400" />
          <span>Family Members</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customer.familyDetails && customer.familyDetails.length > 0 ? (
          <div className="space-y-4">
            {customer.familyDetails.map((family, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="mb-3">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    Family Member {index + 1}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">First Name</p>
                    <p className="text-white font-medium">{family.firstName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Middle Name</p>
                    <p className="text-white">{family.middleName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Last Name</p>
                    <p className="text-white font-medium">{family.lastName || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Birth Date</p>
                    <p className="text-white">
                      {family.birthDate ? format(new Date(family.birthDate), 'MMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Age</p>
                    <p className="text-white">{family.age || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Gender</p>
                    <p className="text-white capitalize">{family.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Relationship</p>
                    <p className="text-white capitalize">
                      {family.relationship ? family.relationship.replace('_', ' ') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Height</p>
                    <p className="text-white">{family.height ? `${family.height} feet` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Weight</p>
                    <p className="text-white">{family.weight ? `${family.weight} kg` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">PAN Number</p>
                    <p className="text-white font-mono">{family.panNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Mobile Number</p>
                    <p className="text-white">{family.mobileNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">No family members added</p>
        )}
      </CardContent>
    </Card>
  );

  const renderContactDetails = () => (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Phone className="h-5 w-5 text-green-400" />
          <span>Contact Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">{contact.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Primary Phone</p>
              <p className="text-white">{contact.phone}</p>
            </div>
          </div>
          
          {contact.alternatePhone && contact.alternatePhone !== 'N/A' && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Alternate Phone</p>
                <p className="text-white">{contact.alternatePhone}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p className="text-white">{address}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Standard Documents */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <FileText className="h-5 w-5 text-yellow-400" />
            <span>Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customer.documents && customer.documents.length > 0 ? (
            <div className="space-y-3">
              {customer.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">
                        {doc.documentType ? doc.documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Document'}
                      </p>
                      {/* <p className="text-sm text-gray-400">{doc.filename || doc.name || 'Unknown file'}</p> */}
                    </div>
                  </div>
                  {doc.documentUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                      onClick={() => window.open(doc.documentUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No documents uploaded</p>
          )}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <FileText className="h-5 w-5 text-orange-400" />
            <span>Additional Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customer.additionalDocuments && customer.additionalDocuments.length > 0 ? (
            <div className="space-y-3">
              {customer.additionalDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">{doc.name || 'Additional Document'}</p>
                      {/* <p className="text-sm text-gray-400">{doc.filename || 'Unknown file'}</p> */}
                    </div>
                  </div>
                  {doc.documentUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                      onClick={() => window.open(doc.documentUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No additional documents uploaded</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-white/20 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Eye className="h-5 w-5 text-blue-400" />
            <span>Customer Details</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            View detailed information about the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh] pr-2">
          {/* Customer Header */}
          <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarImage 
                    src={customer.personalDetails?.profilePhoto || customer.profilePhoto} 
                    alt={customerName}
                  />
                  <AvatarFallback className="bg-white/10 text-white text-lg">
                    {customer.customerType === 'individual' ? (
                      customerName.split(' ').map(n => n[0]).join('').slice(0, 2) || <User className="h-8 w-8" />
                    ) : (
                      <Building2 className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{customerName}</h3>
                    <p className="text-gray-400 flex items-center space-x-2">
                      <Hash className="h-3 w-3" />
                      <span>ID: {customer.customerId || customer._id}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="secondary"
                      className={customer.customerType === 'individual' 
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30" 
                        : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                      }
                    >
                      {customer.customerType === 'individual' ? 'Individual' : 'Corporate'}
                    </Badge>
                    
                    <Badge 
                      variant={customer.isActive !== false ? "default" : "secondary"}
                      className={customer.isActive !== false
                        ? "bg-green-500/20 text-green-400 border-green-500/30" 
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {customer.isActive !== false ? (
                        <><UserCheck className="h-3 w-3 mr-1" />Active</>
                      ) : (
                        <><UserX className="h-3 w-3 mr-1" />Inactive</>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-white flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {customer.createdAt ? format(new Date(customer.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </p>
                {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
                  <>
                    <p className="text-sm text-gray-400 mt-2">Last Updated</p>
                    <p className="text-white flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(customer.updatedAt), 'MMM dd, yyyy')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="details" className="data-[state=active]:bg-white/20">
                  Details
                </TabsTrigger>
                <TabsTrigger value="family" className="data-[state=active]:bg-white/20">
                  Family
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-white/20">
                  Contact
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-white/20">
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                {customer.customerType === 'individual' ? renderPersonalDetails() : renderCorporateDetails()}
              </TabsContent>

              <TabsContent value="family" className="space-y-6 mt-6">
                {renderFamilyDetails()}
              </TabsContent>

              <TabsContent value="contact" className="space-y-6 mt-6">
                {renderContactDetails()}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 mt-6">
                {renderDocuments()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomerDialog;
