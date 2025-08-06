import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  UserCheck, 
  TrendingUp,
  Shield,
  Activity,
  Globe,
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "5,847",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      change: "+18%",
      changeType: "positive"
    },
    {
      title: "Active Admins",
      value: "12",
      icon: Shield,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      change: "+2",
      changeType: "positive"
    },
    {
      title: "System Health",
      value: "99.8%",
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      change: "Optimal",
      changeType: "neutral"
    },
    {
      title: "Revenue",
      value: "$287,560",
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
      change: "+24%",
      changeType: "positive"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Server backup scheduled in 2 hours",
      time: "15 minutes ago",
      icon: Server,
      color: "text-yellow-400"
    },
    {
      id: 2,
      type: "success",
      message: "Security scan completed successfully",
      time: "1 hour ago",
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      id: 3,
      type: "info",
      message: "New admin registration pending approval",
      time: "2 hours ago",
      icon: Shield,
      color: "text-blue-400"
    },
    {
      id: 4,
      type: "alert",
      message: "Database optimization recommended",
      time: "4 hours ago",
      icon: Database,
      color: "text-orange-400"
    }
  ];

  const quickStats = [
    { label: "Active Sessions", value: "1,234", color: "text-green-400" },
    { label: "Pending Reviews", value: "56", color: "text-yellow-400" },
    { label: "System Uptime", value: "99.9%", color: "text-blue-400" },
    { label: "Data Transfer", value: "2.4 TB", color: "text-purple-400" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Complete system overview and administrative controls</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-900 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">All Systems Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-400' : 'text-gray-400'}`}>{stat.change}</span>
                    {stat.changeType === 'positive' && <span className="text-gray-400 text-sm ml-1">from last month</span>}
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Bar */}
      <Card className="bg-gray-900 border-gray-800 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-gray-400 text-xs">{stat.label}</p>
              <p className={`${stat.color} text-lg font-bold mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              System Alerts
            </h3>
            <Button variant="outline" size="sm" className="text-gray-400 border-gray-700 hover:bg-gray-800">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {systemAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <Icon className={`h-4 w-4 ${alert.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{alert.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Super Admin Actions */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-white text-lg font-semibold mb-6">Super Admin Controls</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-20 flex-col space-y-2 bg-purple-900 hover:bg-purple-800 border-purple-700">
              <Shield className="h-6 w-6 text-purple-400" />
              <span className="text-sm">Manage Admins</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-blue-900 hover:bg-blue-800 border-blue-700">
              <Users className="h-6 w-6 text-blue-400" />
              <span className="text-sm">User Management</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-green-900 hover:bg-green-800 border-green-700">
              <Activity className="h-6 w-6 text-green-400" />
              <span className="text-sm">System Monitor</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-orange-900 hover:bg-orange-800 border-orange-700">
              <Globe className="h-6 w-6 text-orange-400" />
              <span className="text-sm">Global Settings</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-white text-lg font-semibold mb-4">User Analytics</h3>
          <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-gray-600" />
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Revenue Trends</h3>
          <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-gray-600" />
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-white text-lg font-semibold mb-4">System Performance</h3>
          <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <Activity className="h-8 w-8 text-gray-600" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
