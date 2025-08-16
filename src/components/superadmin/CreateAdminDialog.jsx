// src/components/superadmin/CreateAdminDialog.jsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useCreateAdmin } from '@/hooks/useAdmin';

const CreateAdminDialog = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const createAdminMutation = useCreateAdmin();

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 100) {
      newErrors.password = 'Password cannot exceed 100 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    if (!validateForm()) {
      return;
    }

    try {
      await createAdminMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || undefined
      });

      // Reset form and close dialog on success
      handleClose();
    } catch (error) {
      // Error is handled by the hook's onError callback
      console.error('Create admin error:', error);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onOpenChange(false);
  };

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({
      ...prev,
      password,
      confirmPassword: password
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Admin</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new administrator to the system. They will receive an email with their login credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server Error Display */}
          {createAdminMutation.error && (
            <Alert variant="destructive" className="border-red-300/50 bg-red-500/20 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-200">
                {createAdminMutation.error.message || 'Failed to create admin. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
              disabled={createAdminMutation.isPending}
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
              disabled={createAdminMutation.isPending}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number <span className="text-gray-400">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50"
              disabled={createAdminMutation.isPending}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white">
                Password <span className="text-red-400">*</span>
              </Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={generatePassword}
                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                disabled={createAdminMutation.isPending}
              >
                Generate
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Enter password"
                className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50 pr-10"
                disabled={createAdminMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={createAdminMutation.isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50 pr-10"
                disabled={createAdminMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={createAdminMutation.isPending}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createAdminMutation.isPending}
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAdminMutation.isPending}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {createAdminMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Admin'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminDialog;