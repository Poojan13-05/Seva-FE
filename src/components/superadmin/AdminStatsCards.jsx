// src/components/superadmin/AdminStatsCards.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp,
  Shield
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdmin';

const AdminStatsCards = () => {
  const { data: statsData, isLoading, error } = useAdminStats();
  
  const stats = statsData?.data?.stats;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 col-span-full">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-red-400">Failed to load admin statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Admins",
      value: stats?.totalAdmins || 0,
      icon: Users,
      description: "Total system administrators",
      color: "text-white",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Active Admins",
      value: stats?.activeAdmins || 0,
      icon: UserCheck,
      description: "Currently active administrators",
      color: "text-white",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      badge: stats?.activePercentage ? `${stats.activePercentage}%` : null
    },
    {
      title: "Inactive Admins",
      value: stats?.inactiveAdmins || 0,
      icon: UserX,
      description: "Deactivated administrators",
      color: "text-white",
      bgColor: "bg-red-500/20",
      iconColor: "text-red-400"
    },
    {
      title: "Recent Admins",
      value: stats?.recentAdmins || 0,
      icon: TrendingUp,
      description: "Created in last 30 days",
      color: "text-white",
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card 
            key={index} 
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor} border border-white/20`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-white">
                  {stat.value.toLocaleString()}
                </div>
                {stat.badge && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/10 text-white border-white/20 text-xs"
                  >
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;