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

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.password === 'password') {
        const userData = {
          id: '1',
          name: formData.email.includes('superadmin') ? 'Super Administrator' : 'Administrator',
          email: formData.email,
          role: formData.email.includes('superadmin') ? 'super_admin' : 'admin',
          phone: '+91 98765 43210',
          lastLogin: new Date().toISOString()
        };
        
        onLogin(userData);
        
        // Navigate based on role
        if (userData.role === 'super_admin') {
          navigate('/super-admin/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/3 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/3 rounded-full"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-16 bg-white/10 rounded-full transform rotate-45"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-12 bg-white/10 rounded-full transform -rotate-45"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-20 bg-white/10 rounded-full transform rotate-12"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-14 bg-white/10 rounded-full transform -rotate-12"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              Insurance CRM Platform
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block text-white/90">SEVA</span>
              <span className="block text-4xl font-light text-white/70">Consultancy</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-lg">
              Streamline your insurance operations with our comprehensive CRM solution. 
              Manage clients, track policies, and drive growth with intelligent automation.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Client Management</h3>
                <p className="text-white/70 text-sm">Comprehensive customer relationship tools</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Policy Tracking</h3>
                <p className="text-white/70 text-sm">Real-time policy status and renewals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Analytics & Reports</h3>
                <p className="text-white/70 text-sm">Data-driven insights for business growth</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">
              Trusted by <span className="font-semibold text-white">500+</span> insurance professionals worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">USER LOGIN</h2>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Username or Email"
                  required
                  disabled={isLoading}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900/20 rounded-lg"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900/20 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}

export default LoginPage