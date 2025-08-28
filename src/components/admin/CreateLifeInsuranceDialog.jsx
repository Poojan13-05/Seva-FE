// src/components/admin/CreateLifeInsuranceDialog.jsx
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
import { Loader2, AlertTriangle, Shield } from 'lucide-react';
import { useCreateLifeInsurance } from '@/hooks/useLifeInsurance';
import LifeInsuranceFormStyled from './LifeInsuranceFormStyled';

const CreateLifeInsuranceDialog = ({ open, onOpenChange }) => {
  const [errors, setErrors] = useState({});
  const [resetForm, setResetForm] = useState(false);
  const createLifeInsurance = useCreateLifeInsurance();

  const handleSubmit = async (formData, files) => {
    try {
      setErrors({});

      // Validate required fields
      const validationErrors = {};

      // Validate client details
      if (!formData.clientDetails?.customer || formData.clientDetails.customer === '') {
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

      await createLifeInsurance.mutateAsync({ policyData: formData, files });
      setResetForm(true); // Trigger form reset
      onOpenChange(false);
    } catch (error) {
      setErrors({ 
        general: error.message || 'Failed to create life insurance policy. Please try again.' 
      });
    }
  };

  const handleClose = () => {
    if (!createLifeInsurance.isPending) {
      setErrors({});
      setResetForm(true); // Reset form on close
      onOpenChange(false);
    }
  };

  const handleResetComplete = () => {
    setResetForm(false); // Reset the reset flag
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Create Life Insurance Policy
          </DialogTitle>
          <DialogDescription>
            Create a new life insurance policy with complete details including client, insurance, commission, nominee, and bank information.
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
            onSubmit={handleSubmit}
            isLoading={createLifeInsurance.isPending}
            errors={errors}
            resetForm={resetForm}
            onResetComplete={handleResetComplete}
          />
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createLifeInsurance.isPending}
            className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="life-insurance-form"
            disabled={createLifeInsurance.isPending}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {createLifeInsurance.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Policy'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLifeInsuranceDialog;