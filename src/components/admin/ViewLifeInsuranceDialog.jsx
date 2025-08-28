// src/components/admin/ViewLifeInsuranceDialog.jsx
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
  Shield, 
  DollarSign, 
  UserCheck,
  CreditCard,
  FileText,
  Activity,
  StickyNote,
  ExternalLink,
  Calendar,
  Clock,
  Hash,
  Building2,
  Upload,
  UserX
} from 'lucide-react';
import { format } from 'date-fns';

const ViewLifeInsuranceDialog = ({ open, onOpenChange, policy }) => {
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
      'Renewal': 'bg-orange-100 text-orange-800'
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
              <p className="text-sm text-gray-400 mb-1">Insured Name</p>
              <p className="text-white font-medium">{policy.clientDetails?.insuredName || 'N/A'}</p>
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
              <p className="text-sm text-gray-400 mb-1">Plan Name</p>
              <p className="text-white">{policy.insuranceDetails?.planName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Payment Mode</p>
              <p className="text-white">{policy.insuranceDetails?.paymentMode || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Policy Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.policyDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Start Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.policyStartDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">End Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.policyEndDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Policy Term</p>
              <p className="text-white">{policy.insuranceDetails?.policyTerm || 'N/A'} years</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Agency Code</p>
              <p className="text-white">{policy.insuranceDetails?.agencyCode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Booking Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.bookingDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Risk Start Date</p>
              <p className="text-white">{formatDate(policy.insuranceDetails?.riskStartDate)}</p>
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
            <span>Premium & Financial Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Sum Insured</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(policy.insuranceDetails?.sumInsured)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Net Premium</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(policy.insuranceDetails?.netPremium)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Premium</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(policy.insuranceDetails?.totalPremium)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Premium Payment Number</p>
                <p className="text-white">{policy.insuranceDetails?.premiumPaymentNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">1st Year GST</p>
              <p className="text-white">{formatCurrency(policy.insuranceDetails?.firstYearGST)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">2nd Year GST</p>
              <p className="text-white">{formatCurrency(policy.insuranceDetails?.secondYearGST)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">3rd Year GST</p>
              <p className="text-white">{formatCurrency(policy.insuranceDetails?.thirdYearGST)}</p>
            </div>
          </div>

          {(policy.insuranceDetails?.bonus || policy.insuranceDetails?.fund) && (
            <>
              <Separator className="bg-white/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policy.insuranceDetails?.bonus && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Bonus</p>
                    <p className="text-white">{formatCurrency(policy.insuranceDetails.bonus)}</p>
                  </div>
                )}
                {policy.insuranceDetails?.fund && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Fund</p>
                    <p className="text-white">{formatCurrency(policy.insuranceDetails.fund)}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Commission Details */}
      {(policy.commissionDetails?.mainAgentCommissionPercent || policy.commissionDetails?.brokerName) && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <DollarSign className="h-5 w-5 text-yellow-400" />
              <span>Commission Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policy.commissionDetails?.mainAgentCommissionPercent && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Commission (%)</p>
                  <p className="text-white font-medium">{policy.commissionDetails.mainAgentCommissionPercent}%</p>
                </div>
              )}
              {policy.commissionDetails?.mainAgentCommissionAmount && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Commission Amount</p>
                  <p className="text-white">{formatCurrency(policy.commissionDetails.mainAgentCommissionAmount)}</p>
                </div>
              )}
              {policy.commissionDetails?.mainAgentTDSPercent && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">TDS (%)</p>
                  <p className="text-white">{policy.commissionDetails.mainAgentTDSPercent}%</p>
                </div>
              )}
              {policy.commissionDetails?.mainAgentTDSAmount && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">TDS Amount</p>
                  <p className="text-white">{formatCurrency(policy.commissionDetails.mainAgentTDSAmount)}</p>
                </div>
              )}
              {policy.commissionDetails?.brokerName && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Broker Name</p>
                  <p className="text-white">{policy.commissionDetails.brokerName}</p>
                </div>
              )}
              {policy.commissionDetails?.referenceByName && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Reference By</p>
                  <p className="text-white">{policy.commissionDetails.referenceByName}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderNomineeAndBankDetails = () => (
    <div className="space-y-6">
      {/* Nominee Details */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <UserCheck className="h-5 w-5 text-green-400" />
            <span>Nominee Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Nominee Name</p>
              <p className="text-white font-medium">{policy.nomineeDetails?.nomineeName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Relationship</p>
              <p className="text-white">{policy.nomineeDetails?.nomineeRelationship || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Age</p>
              <p className="text-white">{policy.nomineeDetails?.nomineeAge || 'N/A'} years</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <CreditCard className="h-5 w-5 text-blue-400" />
            <span>Bank Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Bank Name</p>
              <p className="text-white font-medium">{policy.bankDetails?.bankName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Account Type</p>
              <p className="text-white">{policy.bankDetails?.accountType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Account Number</p>
              <p className="text-white font-mono">
                {policy.bankDetails?.accountNumber || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">IFSC Code</p>
              <p className="text-white font-mono">{policy.bankDetails?.ifscCode || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-400 mb-1">Account Holder Name</p>
              <p className="text-white">{policy.bankDetails?.accountHolderName || 'N/A'}</p>
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
      {/* Rider Details */}
      {(policy.riderDetails && Object.values(policy.riderDetails).some(rider => rider?.amount)) && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Activity className="h-5 w-5 text-orange-400" />
              <span>Rider Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(policy.riderDetails).map(([key, rider]) => (
              rider?.amount && (
                <div key={key} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="mb-3">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Amount</p>
                      <p className="text-white font-medium">{formatCurrency(rider.amount)}</p>
                    </div>
                    {rider.note && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Note</p>
                        <p className="text-white">{rider.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </CardContent>
        </Card>
      )}

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
            <span>Life Insurance Policy Details</span>
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
                      <Shield className="h-8 w-8" />
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
                      <span>Plan: {policy.insuranceDetails?.planName || 'N/A'}</span>
                    </p>
                    <p className="text-gray-400 flex items-center space-x-2 mt-1">
                      <User className="h-3 w-3" />
                      <span>Insured: {policy.clientDetails?.insuredName || getCustomerName(customer)}</span>
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
                        <><UserCheck className="h-3 w-3 mr-1" />Active</>
                      ) : (
                        <><UserX className="h-3 w-3 mr-1" />Inactive</>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-400">Policy Date</p>
                <p className="text-white flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {policy.insuranceDetails?.policyDate ? format(new Date(policy.insuranceDetails.policyDate), 'MMM dd, yyyy') : 'N/A'}
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
              <TabsList className="grid w-full grid-cols-5 bg-white/10">
                <TabsTrigger value="details" className="data-[state=active]:bg-white/20">
                  Details
                </TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-white/20">
                  Financial
                </TabsTrigger>
                <TabsTrigger value="nominee" className="data-[state=active]:bg-white/20">
                  Nominee
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

              <TabsContent value="nominee" className="space-y-6 mt-6">
                {renderNomineeAndBankDetails()}
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

export default ViewLifeInsuranceDialog;