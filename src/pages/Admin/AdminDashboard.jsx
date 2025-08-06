import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  UserCheck, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      icon: Users,
      color: "text-white",
      bgColor: "bg-gray-800",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Applications",
      value: "1,234",
      icon: FileText,
      color: "text-white",
      bgColor: "bg-gray-800",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Consultants",
      value: "156",
      icon: UserCheck,
      color: "text-white",
      bgColor: "bg-gray-800",
      change: "+3%",
      changeType: "positive"
    },
    {
      title: "Revenue",
      value: "$125,430",
      icon: TrendingUp,
      color: "text-white",
      bgColor: "bg-gray-800",
      change: "+15%",
      changeType: "positive"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "application",
      message: "New application submitted by John Doe",
      time: "2 minutes ago",
      icon: FileText,
      color: "text-white"
    },
    {
      id: 2,
      type: "user",
      message: "User Sarah Wilson registered",
      time: "15 minutes ago",
      icon: Users,
      color: "text-white"
    },
    {
      id: 3,
      type: "consultant",
      message: "Consultant meeting scheduled",
      time: "1 hour ago",
      icon: Calendar,
      color: "text-white"
    },
    {
      id: 4,
      type: "alert",
      message: "System backup completed",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-white"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your consultancy.</p>
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
                    <span className="text-white text-sm font-medium">{stat.change}</span>
                    <span className="text-gray-400 text-sm ml-1">from last month</span>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
            <Button variant="outline" size="sm" className="text-gray-400 border-white/30 hover:bg-white/10 backdrop-blur-sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-white text-lg font-semibold mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <Users className="h-6 w-6 text-white" />
              <span className="text-sm">Manage Users</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <FileText className="h-6 w-6 text-white" />
              <span className="text-sm">View Applications</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <UserCheck className="h-6 w-6 text-white" />
              <span className="text-sm">Consultant Management</span>
            </Button>
            
            <Button className="h-20 flex-col space-y-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-white" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
        <h3 className="text-white text-lg font-semibold mb-6">Performance Overview</h3>
        <div className="h-64 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Performance charts will be implemented here</p>
            <p className="text-gray-500 text-sm mt-2">Integration with chart library pending</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
