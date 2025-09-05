// src/components/admin/CustomerTable.jsx
import React, { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Mail,
  Phone,
  AlertTriangle,
  Building2,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useCustomers, useDeleteCustomer } from '@/hooks/useCustomer';
import { format } from 'date-fns';

const CustomerTable = ({ filters, selectedCustomers, setSelectedCustomers, onViewCustomer, onEditCustomer }) => {
  const { data, isLoading, error } = useCustomers(filters);
  const deleteCustomerMutation = useDeleteCustomer();

  const customers = data?.data?.customers || [];
  const pagination = data?.data?.pagination;

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map(customer => customer._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  // Handle individual selection
  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await deleteCustomerMutation.mutateAsync(customerId);
        // Remove from selected if it was selected
        setSelectedCustomers(prev => prev.filter(id => id !== customerId));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  // Get customer display name
  const getCustomerName = (customer) => {
    if (customer.customerType === 'individual' && customer.personalDetails) {
      const { firstName, middleName, lastName } = customer.personalDetails;
      return [firstName, middleName, lastName].filter(Boolean).join(' ');
    } else if (customer.customerType === 'corporate' && customer.corporateDetails?.length > 0) {
      return customer.corporateDetails[0].companyName;
    }
    return 'N/A';
  };

  // Get customer contact info
  const getCustomerContact = (customer) => {
    if (customer.customerType === 'individual' && customer.personalDetails) {
      return {
        email: customer.personalDetails.email,
        phone: customer.personalDetails.mobileNumber
      };
    } else if (customer.customerType === 'corporate' && customer.corporateDetails?.length > 0) {
      return {
        email: customer.corporateDetails[0].email,
        phone: customer.corporateDetails[0].mobileNumber
      };
    }
    return { email: 'N/A', phone: 'N/A' };
  };

  // Get customer location
  const getCustomerLocation = (customer) => {
    if (customer.customerType === 'individual' && customer.personalDetails) {
      const { city, state } = customer.personalDetails;
      return city && state ? `${city}, ${state}` : 'N/A';
    } else if (customer.customerType === 'corporate' && customer.corporateDetails?.length > 0) {
      const { city, state } = customer.corporateDetails[0];
      return city && state ? `${city}, ${state}` : 'N/A';
    }
    return 'N/A';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20">
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16 bg-white/20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-white/20" />
                </TableHead>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4 bg-white/20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="border-white/20">
                  <TableCell>
                    <Skeleton className="h-4 w-4 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
                      <Skeleton className="h-4 w-24 bg-white/20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 bg-white/20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20 bg-white/20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 bg-white/20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="border-red-300/50 bg-red-500/20 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-red-300" />
        <AlertDescription className="text-red-200">
          {error.message || 'Failed to load customers. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!customers.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No customers found</h3>
          <p className="text-gray-400">
            {filters.search ? 'Try adjusting your search criteria' : 'No customers have been added yet'}
          </p>
        </div>
      </div>
    );
  }

  const isAllSelected = customers.length > 0 && selectedCustomers.length === customers.length;
  const isIndeterminate = selectedCustomers.length > 0 && selectedCustomers.length < customers.length;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20 hover:bg-white/5">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onCheckedChange={handleSelectAll}
                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
            </TableHead>
            <TableHead className="text-gray-300">Customer</TableHead>
            <TableHead className="text-gray-300">Contact</TableHead>
            <TableHead className="text-gray-300">Location</TableHead>
            <TableHead className="text-gray-300">Type</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const customerName = getCustomerName(customer);
            const contact = getCustomerContact(customer);
            const location = getCustomerLocation(customer);
            
            return (
              <TableRow 
                key={customer._id} 
                className="border-white/20 hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedCustomers.includes(customer._id)}
                    onCheckedChange={(checked) => handleSelectCustomer(customer._id, checked)}
                    className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={customer.personalDetails?.profilePhoto} />
                      <AvatarFallback className="bg-white/10 text-white text-sm">
                        {customer.customerType === 'individual' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">{customerName}</div>
                      <div className="text-sm text-gray-400 flex items-center">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {customer.customerId}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Mail className="h-3 w-3" />
                      <span className="text-sm truncate max-w-[150px]">{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Phone className="h-3 w-3" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-1 text-gray-300">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{location}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={customer.customerType === 'individual' 
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30" 
                      : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    }
                  >
                    {customer.customerType === 'individual' ? 'Individual' : 'Corporate'}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={customer.isActive ? "default" : "secondary"}
                    className={customer.isActive 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">
                      {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="bg-white/10 backdrop-blur-md border-white/20"
                    >
                      <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/20" />
                      
                      <DropdownMenuItem 
                        onClick={() => onViewCustomer(customer)}
                        className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => onEditCustomer(customer)}
                        className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                      </DropdownMenuItem>
                      
                      
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCustomer(customer._id)}
                        disabled={deleteCustomerMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Customer
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

export default CustomerTable;