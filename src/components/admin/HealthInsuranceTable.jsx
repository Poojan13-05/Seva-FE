// src/components/admin/HealthInsuranceTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  User,
  Heart
} from "lucide-react";

const HealthInsuranceTable = ({
  policies = [],
  onView,
  onEdit,
  onDelete
}) => {
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
      'Portability': 'bg-purple-100 text-purple-800'
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

  const getCustomerInfo = (customer) => {
    if (!customer) return { name: 'N/A', id: 'N/A' };
    return {
      name: getCustomerName(customer),
      id: customer.customerId || 'N/A'
    };
  };

  if (policies.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">No Health Insurance Policies Found</h3>
            <p className="text-gray-500 mt-1">Create your first health insurance policy to get started.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
      <Table>
        <TableHeader>
          <TableRow className="bg-white/10 border-white/10">
            <TableHead className="font-semibold text-gray-300">Policy Details</TableHead>
            <TableHead className="font-semibold text-gray-300">Customer</TableHead>
            <TableHead className="font-semibold text-gray-300">Insurance Company</TableHead>
            <TableHead className="font-semibold text-gray-300">Type</TableHead>
            <TableHead className="font-semibold text-gray-300">Sum Insured</TableHead>
            <TableHead className="font-semibold text-gray-300">Premium</TableHead>
            <TableHead className="font-semibold text-gray-300">Policy Dates</TableHead>
            <TableHead className="font-semibold text-gray-300">Status</TableHead>
            <TableHead className="font-semibold text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => {
            const customer = getCustomerInfo(policy.clientDetails?.customer);

            return (
              <TableRow key={policy._id} className="border-white/10">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-white">
                      {policy.insuranceDetails?.policyNumber || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {policy.insuranceDetails?.planName || 'No plan name'}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm flex items-center gap-1 text-white">
                      <User className="w-3 h-3" />
                      {customer.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {customer.id}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-white">
                    {policy.insuranceDetails?.insuranceCompany?.length > 30
                      ? `${policy.insuranceDetails.insuranceCompany.substring(0, 30)}...`
                      : policy.insuranceDetails?.insuranceCompany || 'N/A'
                    }
                  </div>
                  <div className="text-xs text-gray-400">
                    {policy.insuranceDetails?.agencyBrokerCode || 'N/A'}
                  </div>
                </TableCell>

                <TableCell>
                  {getPolicyTypeBadge(policy.insuranceDetails?.policyType)}
                  <div className="text-xs text-gray-400 mt-1">
                    {policy.insuranceDetails?.insuranceType || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {policy.insuranceDetails?.paymentMode || 'N/A'}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="font-medium text-sm text-white">
                    {formatCurrency(policy.insuranceDetails?.sumInsured)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Term: {policy.insuranceDetails?.policyTerm || 'N/A'} years
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-white">
                      {formatCurrency(policy.insuranceDetails?.totalPremium)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Net: {formatCurrency(policy.insuranceDetails?.netPremium)}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm text-white">
                      Booking: {formatDate(policy.insuranceDetails?.policyBookingDate)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Start: {formatDate(policy.insuranceDetails?.policyStartDate)}
                    </div>
                    <div className="text-xs text-gray-400">
                      End: {formatDate(policy.insuranceDetails?.policyEndDate)}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {getStatusBadge(policy.isActive)}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white/10 backdrop-blur-md border-white/20" forceMount>
                      <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onView?.(policy);
                        }}
                        className="cursor-pointer text-gray-300 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEdit?.(policy);
                        }}
                        className="cursor-pointer text-gray-300 hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Policy
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete?.(policy._id);
                        }}
                        className="text-red-600 focus:text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Policy
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default HealthInsuranceTable;
