// src/components/superadmin/ResetPasswordDialog.jsx
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
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Key, 
  RefreshCw,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { useResetAdminPassword } from '@/hooks/useAdmin';

const ResetPasswordDialog = ({ admin, open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const resetPasswordMutation = useResetAdminPassword();

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

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (formData.newPassword.length > 100) {
      newErrors.newPassword = 'Password cannot exceed 100 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !admin) {
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        adminId: admin.id,
        newPassword: formData.newPassword
      });

      // Close dialog on success
      handleClose();
    } catch (error) {
      // Error is handled by the hook's onError callback
      console.error('Reset password error:', error);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setFormData({
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setCopied(false);
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
      newPassword: password,
      confirmPassword: password
    }));
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    if (formData.newPassword) {
      try {
        await navigator.clipboard.writeText(formData.newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            <Key className="h-5 w-5" />
            <span>Reset Password</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Set a new password for this administrator. They will need to use this password to log in.
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
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Mail className="h-3 w-3" />
            <span>{admin.email}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server Error Display */}
          {resetPasswordMutation.error && (
            <Alert variant="destructive" className="border-red-300/50 bg-red-500/20 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-200">
                {resetPasswordMutation.error.message || 'Failed to reset password. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Warning Alert */}
          <Alert className="border-yellow-300/50 bg-yellow-500/20 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-300" />
            <AlertDescription className="text-yellow-200">
              The admin will need to use this new password to log in. Make sure to share it securely.
            </AlertDescription>
          </Alert>

          {/* New Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reset-password" className="text-white">
                New Password <span className="text-red-400">*</span>
              </Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={generatePassword}
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                  disabled={resetPasswordMutation.isPending}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                {formData.newPassword && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={copyPassword}
                    className="text-green-400 hover:text-green-300 p-0 h-auto"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <Input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50 pr-10"
                disabled={resetPasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={resetPasswordMutation.isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-sm">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirm-reset-password" className="text-white">
              Confirm New Password <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirm-reset-password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-white/50 pr-10"
                disabled={resetPasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={resetPasswordMutation.isPending}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="space-y-2">
              <Label className="text-white text-sm">Password Strength</Label>
              <div className="space-y-1">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => {
                    const strength = Math.min(4, Math.floor(formData.newPassword.length / 3));
                    return (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded ${
                          i < strength
                            ? strength === 1
                              ? 'bg-red-500'
                              : strength === 2
                              ? 'bg-yellow-500'
                              : strength === 3
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                            : 'bg-gray-600'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">
                  {formData.newPassword.length < 6
                    ? 'Weak'
                    : formData.newPassword.length < 9
                    ? 'Fair'
                    : formData.newPassword.length < 12
                    ? 'Good'
                    : 'Strong'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={resetPasswordMutation.isPending}
              className="border-white/30 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending || !formData.newPassword}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 hover:text-red-300"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;