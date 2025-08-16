// src/components/superadmin/EditAdminDialog.jsx
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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Calendar, Mail, Phone } from 'lucide-react';
import { useUpdateAdmin } from '@/hooks/useAdmin';
import { format } from 'date-fns';

const EditAdminDialog = ({ admin, open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const updateAdminMutation = useUpdateAdmin();

  // Initialize form data when admin changes
  useEffect(() => {
    if (admin) {
      const initialData = {
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        isActive: admin.isActive ?? true
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [admin]);

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Check if form has changes
      if (admin) {
        const hasFormChanges = 
          newData.name !== (admin.name || '') ||
          newData.email !== (admin.email || '') ||
          newData.phone !== (admin.phone || '') ||
          newData.isActive !== (admin.isActive ?? true);
        setHasChanges(hasFormChanges);
      }
      
      return newData;
    });
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation (optional)
    if (formData.phone.trim()) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !hasChanges || !admin) {
      return;
    }

    try {
      await updateAdminMutation.mutateAsync({
        adminId: admin.id,
        adminData: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          isActive: formData.isActive
        }
      });

      // Close dialog on success
      handleClose();
    } catch (error) {
      // Error is handled by the hook's onError callback
      console.error('Update admin error:', error);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setErrors({});
    setHasChanges(false);
    onOpenChange(false);
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Admin</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update administrator information and permissions.
          </DialogDescription>
        </DialogHeader>

        {/* Admin Info Header */}
        <div className="bg-white/5 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-white">{admin.name}</h4>
              <Badge 
                variant={admin.isActive ? "default" : "secondary"}
                className={admin.isActive 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {admin.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3" />
              <span>{admin.email}</span>
            </div>
            {admin.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span>{admin.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <span>Created {format(new Date(admin.createdAt), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server Error Display */}
          {updateAdminMutation.error && (
            <Alert variant="destructive" className="border-red-300/50 bg-red-500/20 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-200">
                {updateAdminMutation.error.message || 'Failed to update admin. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-white">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
              disabled={updateAdminMutation.isPending}
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-white">
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
              disabled={updateAdminMutation.isPending}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-white">
              Phone Number <span className="text-gray-400">(optional)</span>
            </Label>
            <Input
              id="edit-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
              disabled={updateAdminMutation.isPending}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="space-y-2">
            <Label className="text-white">Status</Label>
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
                disabled={updateAdminMutation.isPending}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500/50"
              />
              <span className="text-sm text-gray-300">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Inactive admins cannot log in to the system
            </p>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateAdminMutation.isPending}
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateAdminMutation.isPending || !hasChanges}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 disabled:opacity-50"
            >
              {updateAdminMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Admin'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminDialog;