// src/components/admin/CreateVehicleInsuranceDialog.jsx
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
import { Loader2, AlertTriangle, Car } from 'lucide-react';
import { useCreateVehicleInsurance } from '@/hooks/useVehicleInsurance';
import VehicleInsuranceFormStyled from './VehicleInsuranceFormStyled';

const CreateVehicleInsuranceDialog = ({ open, onOpenChange }) => {
  const [errors, setErrors] = useState({});
  const [resetForm, setResetForm] = useState(false);
  const createVehicleInsurance = useCreateVehicleInsurance();

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

      // Validate insurance details
      if (!formData.insuranceDetails?.policyNumber?.trim()) {
        validationErrors.insuranceDetails = validationErrors.insuranceDetails || {};
        validationErrors.insuranceDetails.policyNumber = 'Policy number is required';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await createVehicleInsurance.mutateAsync({ policyData: formData, files });
      setResetForm(true); // Trigger form reset
      onOpenChange(false);
    } catch (error) {
      setErrors({
        general: error.message || 'Failed to create vehicle insurance policy. Please try again.'
      });
    }
  };

  const handleClose = () => {
    if (!createVehicleInsurance.isPending) {
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
            <Car className="w-5 h-5" />
            Create Vehicle Insurance Policy
          </DialogTitle>
          <DialogDescription>
            Create a new vehicle insurance policy with complete details including client, insurance, premium, and vehicle information.
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <VehicleInsuranceFormStyled
            onSubmit={handleSubmit}
            isLoading={createVehicleInsurance.isPending}
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
            disabled={createVehicleInsurance.isPending}
            className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="vehicle-insurance-form"
            disabled={createVehicleInsurance.isPending}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {createVehicleInsurance.isPending ? (
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

export default CreateVehicleInsuranceDialog;
