// src/components/admin/EditHealthInsuranceDialog.jsx
import React, { useState } from 'react';
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
import { useUpdateHealthInsurance, useHealthInsurance } from '@/hooks/useHealthInsurance';
import HealthInsuranceForm from './HealthInsuranceForm';

const EditHealthInsuranceDialog = ({ open, onOpenChange, policy }) => {
  const [errors, setErrors] = useState({});
  const [resetForm, setResetForm] = useState(false);
  const updateHealthInsurance = useUpdateHealthInsurance();

  // Fetch full policy details with populated customer data
  const { data: fullPolicyData, isLoading: isLoadingPolicy } = useHealthInsurance(
    open && policy?._id ? policy._id : null
  );

  // Use full policy data if available, otherwise fallback to provided policy
  const policyToUse = fullPolicyData?.data?.healthInsurance || policy;

  // Format customer data from policy for dropdown
  const selectedCustomer = React.useMemo(() => {
    if (!policyToUse?.clientDetails?.customer) return null;
    

    const customer = policyToUse.clientDetails.customer;

    // Handle both populated and non-populated customer data
    if (typeof customer === 'string') {
      // If customer is just an ID string, we can't format it properly
      return null;
    }

   

    return {
      value: customer._id,
      label: `${customer.customerId} - ${customer.personalDetails?.firstName || ''} ${customer.personalDetails?.lastName || ''}`.trim(),
      email: customer.personalDetails?.email || ''
    };
  }, [policyToUse]);
  
 console.log(">>>>>>>>>>>>>>>HELLOOOO",selectedCustomer);

  const handleSubmit = async (formData, files, deletedFiles = {}) => {
    try {
      setErrors({});

      // Validate only essential required fields
      const validationErrors = {};

      // Validate client details - only customer is required
      if (!formData.clientDetails?.customer ||
          formData.clientDetails.customer === '' ||
          formData.clientDetails.customer === null ||
          formData.clientDetails.customer === undefined) {
        validationErrors.clientDetails = validationErrors.clientDetails || {};
        validationErrors.clientDetails.customer = 'Please select a customer';
      }

      // Validate insurance details - only company and policy number are required
      if (!formData.insuranceDetails?.insuranceCompany) {
        validationErrors.insuranceDetails = validationErrors.insuranceDetails || {};
        validationErrors.insuranceDetails.insuranceCompany = 'Insurance company is required';
      }

      if (!formData.insuranceDetails?.policyNumber?.trim()) {
        validationErrors.insuranceDetails = validationErrors.insuranceDetails || {};
        validationErrors.insuranceDetails.policyNumber = 'Policy number is required';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await updateHealthInsurance.mutateAsync({
        policyId: policyToUse._id,
        policyData: formData,
        files,
        deletedFiles
      });
      onOpenChange(false);
    } catch (error) {
      setErrors({
        general: error.message || 'Failed to update health insurance policy. Please try again.'
      });
    }
  };

  const handleClose = () => {
    if (!updateHealthInsurance.isPending) {
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleResetComplete = () => {
    setResetForm(false); // Reset the reset flag
  };

  if (!policy) return null;

  // Show loading state while fetching full policy details OR if we don't have customer data yet
  const shouldShowLoading = isLoadingPolicy || (open && !fullPolicyData) || (open && !selectedCustomer);

  if (shouldShowLoading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Health Insurance Policy
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <span className="ml-3 text-white">Loading policy details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Health Insurance Policy
          </DialogTitle>
          <DialogDescription>
            Update the health insurance policy details for {policyToUse.insuranceDetails?.policyNumber || 'this policy'}.
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <HealthInsuranceForm
            key={`${policyToUse._id}-${selectedCustomer?.value || 'no-customer'}`}
            initialData={policyToUse}
            onSubmit={handleSubmit}
            isLoading={updateHealthInsurance.isPending}
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
            disabled={updateHealthInsurance.isPending}
            className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="health-insurance-form"
            disabled={updateHealthInsurance.isPending}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {updateHealthInsurance.isPending ? (
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

export default EditHealthInsuranceDialog;
