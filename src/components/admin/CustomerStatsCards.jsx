// src/components/admin/CustomerStatsCards.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  Building2, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { useCustomerStats } from '@/hooks/useCustomer';

const CustomerStatsCards = () => {
  const { data: statsData, isLoading, error } = useCustomerStats();
  
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
            <p className="text-red-400">Failed to load customer statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      description: "All registered customers",
      color: "text-white",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Individual",
      value: stats?.individualCustomers || 0,
      icon: UserCheck,
      description: "Individual customers",
      color: "text-white",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      badge: stats?.individualPercentage ? `${stats.individualPercentage}%` : null
    },
    {
      title: "Corporate",
      value: stats?.corporateCustomers || 0,
      icon: Building2,
      description: "Corporate customers",
      color: "text-white",
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-400",
      badge: stats?.corporatePercentage ? `${stats.corporatePercentage}%` : null
    },
    {
      title: "New This Month",
      value: stats?.recentCustomers || 0,
      icon: TrendingUp,
      description: "Added in last 30 days",
      color: "text-white",
      bgColor: "bg-orange-500/20",
      iconColor: "text-orange-400"
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

export default CustomerStatsCards;