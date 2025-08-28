// src/components/admin/EditLifeInsuranceDialog.jsx
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Edit } from 'lucide-react';
import { useUpdateLifeInsurance } from '@/hooks/useLifeInsurance';
import LifeInsuranceFormStyled from './LifeInsuranceFormStyled';

const EditLifeInsuranceDialog = ({ open, onOpenChange, policy }) => {
  const [errors, setErrors] = useState({});
  const [resetForm, setResetForm] = useState(false);
  const updateLifeInsurance = useUpdateLifeInsurance();

  // Format customer data from policy for dropdown
  const selectedCustomer = policy?.clientDetails?.customer ? {
    value: policy.clientDetails.customer._id,
    label: `${policy.clientDetails.customer.customerId} - ${policy.clientDetails.customer.personalDetails.firstName} ${policy.clientDetails.customer.personalDetails.lastName}`,
    email: policy.clientDetails.customer.personalDetails.email
  } : null;


  const handleSubmit = async (formData, files, deletedFiles = {}) => {
    try {
      setErrors({});

      // Validate required fields
      const validationErrors = {};

      // Validate client details
      if (!formData.clientDetails?.customer || 
          formData.clientDetails.customer === '' || 
          formData.clientDetails.customer === null || 
          formData.clientDetails.customer === undefined) {
        validationErrors.clientDetails = validationErrors.clientDetails || {};
        validationErrors.clientDetails.customer = 'Please select a customer';
      }

      if (!formData.clientDetails?.insuredName?.trim()) {
        validationErrors.clientDetails = validationErrors.clientDetails || {};
        validationErrors.clientDetails.insuredName = 'Insured name is required';
      }

      // Validate insurance details
      if (!formData.insuranceDetails?.insuranceCompany) {
        validationErrors.insuranceDetails = validationErrors.insuranceDetails || {};
        validationErrors.insuranceDetails.insuranceCompany = 'Insurance company is required';
      }

      if (!formData.insuranceDetails?.policyNumber?.trim()) {
        validationErrors.insuranceDetails = validationErrors.insuranceDetails || {};
        validationErrors.insuranceDetails.policyNumber = 'Policy number is required';
      }

      // Validate nominee details  
      if (!formData.nomineeDetails?.nomineeName?.trim()) {
        validationErrors.nomineeDetails = validationErrors.nomineeDetails || {};
        validationErrors.nomineeDetails.nomineeName = 'Nominee name is required';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await updateLifeInsurance.mutateAsync({ 
        policyId: policy._id, 
        policyData: formData, 
        files,
        deletedFiles
      });
      onOpenChange(false);
    } catch (error) {
      setErrors({ 
        general: error.message || 'Failed to update life insurance policy. Please try again.' 
      });
    }
  };

  const handleClose = () => {
    if (!updateLifeInsurance.isPending) {
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleResetComplete = () => {
    setResetForm(false); // Reset the reset flag
  };

  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Life Insurance Policy
          </DialogTitle>
          <DialogDescription>
            Update the life insurance policy details for {policy.insuranceDetails?.policyNumber || 'this policy'}.
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <LifeInsuranceFormStyled
            initialData={policy}
            onSubmit={handleSubmit}
            isLoading={updateLifeInsurance.isPending}
            errors={errors}
            resetForm={resetForm}
            onResetComplete={handleResetComplete}
            selectedCustomer={selectedCustomer}
          />
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={updateLifeInsurance.isPending}
            className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="life-insurance-form"
            disabled={updateLifeInsurance.isPending}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {updateLifeInsurance.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Policy'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLifeInsuranceDialog;