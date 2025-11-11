// src/components/admin/ViewVehicleInsuranceDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  User,
  Car,
  DollarSign,
  CreditCard,
  FileText,
  Shield,
  StickyNote,
  ExternalLink,
  Calendar,
  Clock,
  Hash,
  Upload,
  UserX,
  Check,
  X,
  CalendarCheck
} from 'lucide-react';
import { format } from 'date-fns';

const ViewVehicleInsuranceDialog = ({ open, onOpenChange, policy }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge
        variant={isActive ? "success" : "secondary"}
        className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getPolicyTypeBadge = (type) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Renewal': 'bg-orange-100 text-orange-800',
      'Rollover': 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge variant="outline" className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  const getCustomerName = (customer) => {
    if (!customer) return 'N/A';
    if (customer.personalDetails) {
      return `${customer.personalDetails.firstName || ''} ${customer.personalDetails.lastName || ''}`.trim() || customer.customerId;
    }
    return customer.customerId || 'Unknown Customer';
  };

  if (!policy) return null;

  const customer = policy.clientDetails?.customer;

  const renderPolicyDetails = () => (
    <div className="space-y-6">
      {/* Client Details */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <User className="h-5 w-5 text-blue-400" />
            <span>Client Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Customer</p>
              <p className="text-white font-medium">{getCustomerName(customer)}</p>
              <p className="text-xs text-gray-400">{customer?.customerId || 'N/A'}</p>
              {customer?.personalDetails?.email && (
                <p className="text-xs text-gray-400">{customer.personalDetails.email}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Reference By</p>
              <p className="text-white font-medium">{policy.clientDetails?.referenceByName || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Details */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="h-5 w-5 text-purple-400" />
            <span>Insurance Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Insurance Company</p>
              <p className="text-white font-medium">{policy.insuranceDetails?.insuranceCompany || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Policy Type</p>
              {getPolicyTypeBadge(policy.insuranceDetails?.policyType)}
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              {getStatusBadge(policy.isActive)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Policy Number</p>
              <p className="text-white font-mono">{policy.insuranceDetails?.policyNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Agency/Broker Code</p>
              <p className="text-white">{policy.insuranceDetails?.agencyBrokerCode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Insurance Type</p>
              <p className="text-white">{policy.insuranceDetails?.insuranceType || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Booking Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.policyBookingDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Start Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.policyStartDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">End Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.policyEndDate)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Previous Policy Number</p>
              <p className="text-white">{policy.insuranceDetails?.previousPolicyNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">NCB</p>
              <p className="text-white">{policy.insuranceDetails?.ncb || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Discount</p>
              <p className="text-white">{policy.insuranceDetails?.discount || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Car className="h-5 w-5 text-green-400" />
            <span>Vehicle Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Vehicle Type</p>
              <p className="text-white">{policy.insuranceDetails?.vehicleType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Class of Vehicle</p>
              <p className="text-white">{policy.insuranceDetails?.classOfVehicle || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Registration Number</p>
              <p className="text-white font-mono">{policy.insuranceDetails?.registrationNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Engine Number</p>
              <p className="text-white font-mono">{policy.insuranceDetails?.engineNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Chassis Number</p>
              <p className="text-white font-mono">{policy.insuranceDetails?.chassisNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">MFY</p>
              <p className="text-white">{policy.insuranceDetails?.mfy || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Make</p>
              <p className="text-white">{policy.insuranceDetails?.make || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Model</p>
              <p className="text-white">{policy.insuranceDetails?.model || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Variant</p>
              <p className="text-white">{policy.insuranceDetails?.variant || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Seating Capacity</p>
              <p className="text-white">{policy.insuranceDetails?.seatingCapacity || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">CNG IDV</p>
              <p className="text-white">{policy.insuranceDetails?.cngIdv || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total IDV</p>
              <p className="text-white">{policy.insuranceDetails?.totalIdv || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Loading</p>
              <p className="text-white">{policy.insuranceDetails?.loading || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialDetails = () => (
    <div className="space-y-6">
      {/* Premium Details */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span>Premium & Commission Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">TP Premium</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(policy.premiumCommissionDetails?.tpPremium)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Net Premium</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(policy.premiumCommissionDetails?.netPremium)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">GST Amount</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(policy.premiumCommissionDetails?.gstAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Premium</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(policy.premiumCommissionDetails?.totalPremium)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Pay Out</p>
              <p className="text-white">{policy.premiumCommissionDetails?.payOut || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Broker Name</p>
              <p className="text-white">{policy.premiumCommissionDetails?.brokerName || 'N/A'}</p>
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policy.premiumCommissionDetails?.mainAgentCommissionPercent && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Commission (%)</p>
                <p className="text-white font-medium">{policy.premiumCommissionDetails.mainAgentCommissionPercent}%</p>
              </div>
            )}
            {policy.premiumCommissionDetails?.mainAgentCommissionView && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Commission Amount</p>
                <p className="text-white">{formatCurrency(policy.premiumCommissionDetails.mainAgentCommissionView)}</p>
              </div>
            )}
            {policy.premiumCommissionDetails?.mainAgentTDSPercent && (
              <div>
                <p className="text-sm text-gray-400 mb-1">TDS (%)</p>
                <p className="text-white">{policy.premiumCommissionDetails.mainAgentTDSPercent}%</p>
              </div>
            )}
            {policy.premiumCommissionDetails?.mainAgentTDSAmount && (
              <div>
                <p className="text-sm text-gray-400 mb-1">TDS Amount</p>
                <p className="text-white">{formatCurrency(policy.premiumCommissionDetails.mainAgentTDSAmount)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCoversAndLiability = () => (
    <div className="space-y-6">
      {/* Legal Liability */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="h-5 w-5 text-orange-400" />
            <span>Legal Liability & Add-Ons</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Number of Persons (Non-Fare Paying)</p>
              <p className="text-white">{policy.legalLiabilityAndCovers?.numberOfPersonsNonFarePaying || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">IMT 28 Number of Persons</p>
              <p className="text-white">{policy.legalLiabilityAndCovers?.imt28NumberOfPersons || 'N/A'}</p>
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div>
            <p className="text-sm text-gray-400 mb-3">Covers & Add-Ons</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {policy.legalLiabilityAndCovers?.covers && Object.entries(policy.legalLiabilityAndCovers.covers).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 p-2 rounded-lg bg-white/5">
                  {value ? (
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${value ? 'text-white' : 'text-gray-500'}`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegistrationPermit = () => (
    <div className="space-y-6">
      {/* Registration & Permit Validity */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <CalendarCheck className="h-5 w-5 text-blue-400" />
            <span>Registration & Permit Validity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">State Permit</p>
              <div className="space-y-1">
                <p className="text-white text-sm">
                  <span className="text-gray-400">Start:</span> {formatDate(policy.registrationPermitValidity?.statePermitStartDate)}
                </p>
                <p className="text-white text-sm">
                  <span className="text-gray-400">End:</span> {formatDate(policy.registrationPermitValidity?.statePermitEndDate)}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">National Permit</p>
              <div className="space-y-1">
                <p className="text-white text-sm">
                  <span className="text-gray-400">Start:</span> {formatDate(policy.registrationPermitValidity?.nationalPermitStartDate)}
                </p>
                <p className="text-white text-sm">
                  <span className="text-gray-400">End:</span> {formatDate(policy.registrationPermitValidity?.nationalPermitEndDate)}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Fitness</p>
              <div className="space-y-1">
                <p className="text-white text-sm">
                  <span className="text-gray-400">Start:</span> {formatDate(policy.registrationPermitValidity?.fitnessStartDate)}
                </p>
                <p className="text-white text-sm">
                  <span className="text-gray-400">End:</span> {formatDate(policy.registrationPermitValidity?.fitnessEndDate)}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">RC</p>
              <div className="space-y-1">
                <p className="text-white text-sm">
                  <span className="text-gray-400">Start:</span> {formatDate(policy.registrationPermitValidity?.rcStartDate)}
                </p>
                <p className="text-white text-sm">
                  <span className="text-gray-400">End:</span> {formatDate(policy.registrationPermitValidity?.rcEndDate)}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">PUC</p>
              <div className="space-y-1">
                <p className="text-white text-sm">
                  <span className="text-gray-400">Start:</span> {formatDate(policy.registrationPermitValidity?.pucStartDate)}
                </p>
                <p className="text-white text-sm">
                  <span className="text-gray-400">End:</span> {formatDate(policy.registrationPermitValidity?.pucEndDate)}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">RTO Tax</p>
              <div className="space-y-1">
                <p className="text-white text-sm">
                  <span className="text-gray-400">Start:</span> {formatDate(policy.registrationPermitValidity?.rtoTaxStartDate)}
                </p>
                <p className="text-white text-sm">
                  <span className="text-gray-400">End:</span> {formatDate(policy.registrationPermitValidity?.rtoTaxEndDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Policy File */}
      {policy.uploadPolicy?.policyFileUrl && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Upload className="h-5 w-5 text-purple-400" />
              <span>Policy File</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Policy Document</p>
                  <p className="text-sm text-gray-400">{policy.uploadPolicy.originalName || 'Policy File'}</p>
                  {policy.uploadPolicy.fileSize && (
                    <p className="text-xs text-gray-500">
                      {(policy.uploadPolicy.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                onClick={() => window.open(policy.uploadPolicy.policyFileUrl, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Documents */}
      {policy.uploadDocuments && policy.uploadDocuments.length > 0 && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <FileText className="h-5 w-5 text-yellow-400" />
              <span>Additional Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policy.uploadDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">{doc.documentName || `Document ${index + 1}`}</p>
                      <p className="text-sm text-gray-400">{doc.originalName || 'Unknown file'}</p>
                      {doc.fileSize && (
                        <p className="text-xs text-gray-500">
                          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
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
          </CardContent>
        </Card>
      )}

      {/* No Documents */}
      {(!policy.uploadPolicy?.policyFileUrl && (!policy.uploadDocuments || policy.uploadDocuments.length === 0)) && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <FileText className="h-5 w-5 text-gray-400" />
              <span>Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center py-4">No documents uploaded</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderOtherDetails = () => (
    <div className="space-y-6">
      {/* Notes */}
      {policy.notes?.note && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <StickyNote className="h-5 w-5 text-pink-400" />
              <span>Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white whitespace-pre-wrap">{policy.notes.note}</p>
          </CardContent>
        </Card>
      )}

      {/* System Information */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Clock className="h-5 w-5 text-gray-400" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policy.createdBy && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Created By</p>
                <p className="text-white">{policy.createdBy.name || policy.createdBy.email || 'Unknown'}</p>
                {policy.createdAt && (
                  <p className="text-xs text-gray-500">
                    {format(new Date(policy.createdAt), 'PPpp')}
                  </p>
                )}
              </div>
            )}
            {policy.lastUpdatedBy && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Last Updated By</p>
                <p className="text-white">{policy.lastUpdatedBy.name || policy.lastUpdatedBy.email || 'Unknown'}</p>
                {policy.updatedAt && (
                  <p className="text-xs text-gray-500">
                    {format(new Date(policy.updatedAt), 'PPpp')}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-black/95 border-white/20 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Eye className="h-5 w-5 text-blue-400" />
            <span>Vehicle Insurance Policy Details</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            View complete details for policy {policy.insuranceDetails?.policyNumber || 'N/A'}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh] pr-2">
          {/* Policy Header */}
          <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarImage
                    src={customer?.personalDetails?.profilePhoto}
                    alt={getCustomerName(customer)}
                  />
                  <AvatarFallback className="bg-white/10 text-white text-lg">
                    {customer ? (
                      getCustomerName(customer).split(' ').map(n => n[0]).join('').slice(0, 2) || <User className="h-8 w-8" />
                    ) : (
                      <Car className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {policy.insuranceDetails?.policyNumber || 'N/A'}
                    </h3>
                    <p className="text-gray-400 flex items-center space-x-2">
                      <Hash className="h-3 w-3" />
                      <span>Registration: {policy.insuranceDetails?.registrationNumber || 'N/A'}</span>
                    </p>
                    <p className="text-gray-400 flex items-center space-x-2 mt-1">
                      <Car className="h-3 w-3" />
                      <span>Vehicle: {policy.insuranceDetails?.make} {policy.insuranceDetails?.model || 'N/A'}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getPolicyTypeBadge(policy.insuranceDetails?.policyType)}

                    <Badge
                      variant={policy.isActive ? "default" : "secondary"}
                      className={policy.isActive
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {policy.isActive ? (
                        <><Check className="h-3 w-3 mr-1" />Active</>
                      ) : (
                        <><UserX className="h-3 w-3 mr-1" />Inactive</>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-sm text-gray-400">Booking Date</p>
                <p className="text-white flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {policy.insuranceDetails?.policyBookingDate ? format(new Date(policy.insuranceDetails.policyBookingDate), 'MMM dd, yyyy') : 'N/A'}
                </p>
                {policy.createdAt && (
                  <>
                    <p className="text-sm text-gray-400 mt-2">Created</p>
                    <p className="text-white flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(policy.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/10">
                <TabsTrigger value="details" className="data-[state=active]:bg-white/20">
                  Details
                </TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-white/20">
                  Financial
                </TabsTrigger>
                <TabsTrigger value="covers" className="data-[state=active]:bg-white/20">
                  Covers
                </TabsTrigger>
                <TabsTrigger value="permits" className="data-[state=active]:bg-white/20">
                  Permits
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-white/20">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="other" className="data-[state=active]:bg-white/20">
                  Other
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                {renderPolicyDetails()}
              </TabsContent>

              <TabsContent value="financial" className="space-y-6 mt-6">
                {renderFinancialDetails()}
              </TabsContent>

              <TabsContent value="covers" className="space-y-6 mt-6">
                {renderCoversAndLiability()}
              </TabsContent>

              <TabsContent value="permits" className="space-y-6 mt-6">
                {renderRegistrationPermit()}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 mt-6">
                {renderDocuments()}
              </TabsContent>

              <TabsContent value="other" className="space-y-6 mt-6">
                {renderOtherDetails()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicleInsuranceDialog;
