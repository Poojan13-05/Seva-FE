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
      color: "text-white",
      bgColor: "bg-gray-800",
      change: "+18%",
      changeType: "positive"
    },
    {
      title: "Active Admins",
      value: "12",
      icon: Shield,
      color: "text-white",
      bgColor: "bg-gray-800",
      change: "+2",
      changeType: "positive"
    },
    {
      title: "System Health",
      value: "99.8%",
      icon: Activity,
      color: "text-white",
      bgColor: "bg-gray-800",
      change: "Optimal",
      changeType: "neutral"
    },
    {
      title: "Revenue",
      value: "$287,560",
      icon: TrendingUp,
      color: "text-white",
      bgColor: "bg-gray-800",
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
      color: "text-white"
    },
    {
      id: 2,
      type: "success",
      message: "Security scan completed successfully",
      time: "1 hour ago",
      icon: CheckCircle,
      color: "text-white"
    },
    {
      id: 3,
      type: "info",
      message: "New admin registration pending approval",
      time: "2 hours ago",
      icon: Shield,
      color: "text-white"
    },
    {
      id: 4,
      type: "alert",
      message: "Database optimization recommended",
      time: "4 hours ago",
      icon: Database,
      color: "text-white"
    }
  ];

  const quickStats = [
    { label: "Active Sessions", value: "1,234", color: "text-white" },
    { label: "Pending Reviews", value: "56", color: "text-white" },
    { label: "System Uptime", value: "99.9%", color: "text-white" },
    { label: "Data Transfer", value: "2.4 TB", color: "text-white" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Complete system overview and administrative controls</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-white' : 'text-gray-400'}`}>{stat.change}</span>
                    {stat.changeType === 'positive' && <span className="text-gray-400 text-sm ml-1">from last month</span>}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Bar */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 hover:bg-white/15 transition-all duration-300">
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
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-white mr-2" />
              System Alerts
            </h3>
            <Button variant="outline" size="sm" className="text-gray-400 border-white/30 hover:bg-white/10 backdrop-blur-sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {systemAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-colors border border-white/10">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
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
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-white text-lg font-semibold mb-6">Super Admin Controls</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <Shield className="h-6 w-6 text-white" />
              <span className="text-sm">Manage Admins</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <Users className="h-6 w-6 text-white" />
              <span className="text-sm">User Management</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <Activity className="h-6 w-6 text-white" />
              <span className="text-sm">System Monitor</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <Globe className="h-6 w-6 text-white" />
              <span className="text-sm">Global Settings</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-white text-lg font-semibold mb-4">User Analytics</h3>
          <div className="h-32 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
            <BarChart3 className="h-8 w-8 text-gray-600" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-white text-lg font-semibold mb-4">Revenue Trends</h3>
          <div className="h-32 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
            <TrendingUp className="h-8 w-8 text-gray-600" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-white text-lg font-semibold mb-4">System Performance</h3>
          <div className="h-32 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
            <Activity className="h-8 w-8 text-gray-600" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
