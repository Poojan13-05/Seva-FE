// src/components/admin/ComingSoon.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Construction,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoon = ({ title, description, icon: Icon = Construction }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>

        {/* Coming Soon Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 p-6 bg-white/10 rounded-full border border-white/20 w-fit">
              <Icon className="h-16 w-16 text-white" />
            </div>
            <CardTitle className="text-2xl mb-2">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {description || `The ${title} section is currently under development. We're working hard to bring you this feature soon!`}
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Feature in development</span>
            </div>

            <div className="pt-4">
              <Link to="/admin/dashboard">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                >
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="mt-8 bg-white/5 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-xl">What's Coming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Modern Interface</h3>
                <p className="text-sm text-gray-400">Clean and intuitive design matching the admin panel</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Advanced Features</h3>
                <p className="text-sm text-gray-400">Comprehensive functionality for efficient management</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm text-gray-400">Live data synchronization and notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComingSoon;
