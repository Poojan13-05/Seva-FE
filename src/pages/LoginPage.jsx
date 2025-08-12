import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  EyeIcon, 
  EyeOffIcon, 
  ShieldIcon, 
  MailIcon, 
  LockIcon, 
  LoaderIcon, 
  AlertTriangleIcon,
  LogInIcon 
} from "@/components/ui/icons";
import { useLogin } from '@/hooks/useAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Use the login mutation hook
  const loginMutation = useLogin();

  // Extract loading state and error from the mutation
  const isLoading = loginMutation.isPending;
  const error = loginMutation.error;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (loginMutation.error) {
      loginMutation.reset();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    // Call the login mutation
    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        
        // Get the admin role from response
        const adminRole = data.data.admin.role;
        
        // Navigate based on role with replace to prevent back navigation to login
        if (adminRole === 'super_admin') {
          navigate('/super-admin/dashboard', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      },
      onError: (error) => {
        console.error('Login failed:', error);
        // Error is automatically handled by the mutation
      }
    });
  };

  // Get error message for display
  const getErrorMessage = () => {
    if (!error) return '';
    
    // Handle different error types
    if (error.message) {
      return error.message;
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    return 'Login failed. Please try again.';
  };

  return (
    <div className="min-h-screen geometric-texture-bg flex items-center justify-center p-4 lg:p-8">
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto">
        {/* Top Section - Welcome Text and Login Form Side by Side */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
          {/* Left Side - Welcome Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              Insurance CRM Platform
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Welcome to
              <span className="block text-white/90">SEVA</span>
              <span className="block text-2xl lg:text-4xl font-light text-white/70">Consultancy</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Streamline your insurance operations with our comprehensive CRM solution. 
              Manage clients, track policies, and drive growth with intelligent automation.
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto lg:ml-auto lg:mr-0">
            {/* Glass Effect Card Container */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
              {/* Logo and Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">USER LOGIN</h2>
                <p className="text-gray-300 text-sm">Sign in to access your dashboard</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6 border-red-300/50 bg-red-500/20 backdrop-blur-sm">
                  <AlertTriangleIcon className="h-4 w-4 text-red-300" />
                  <AlertDescription className="text-red-200">
                    {getErrorMessage()}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Username or Email"
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-gray-300 focus:border-white/50 focus:ring-white/20 rounded-lg"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      disabled={isLoading}
                      className="pl-10 pr-10 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-gray-300 focus:border-white/50 focus:ring-white/20 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 hover:border-white/50"
                  disabled={isLoading || !formData.email || !formData.password}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "LOGIN"
                  )}
                </Button>
              </form>


            </div>
          </div>
        </div>

        {/* Bottom Section - Horizontal Feature Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Client Management</h3>
                <p className="text-white/70 text-sm">Comprehensive customer relationship tools</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Policy Tracking</h3>
                <p className="text-white/70 text-sm">Real-time policy status and renewals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Analytics & Reports</h3>
                <p className="text-white/70 text-sm">Data-driven insights for business growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 pt-6 border-t border-white/20 text-center max-w-7xl mx-auto">
          <p className="text-white/60 text-sm">
            Trusted by <span className="font-semibold text-white">500+</span> insurance professionals worldwide
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;