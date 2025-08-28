// src/components/admin/LifeInsuranceStatsCards.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  TrendingUp, 
  RefreshCw, 
  IndianRupee,
  FileText,
  Activity 
} from 'lucide-react';
import { useLifeInsuranceStats } from '@/hooks/useLifeInsurance';

const LifeInsuranceStatsCards = () => {
  const { data, isLoading, error } = useLifeInsuranceStats();
  const stats = data?.data?.stats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20 bg-white/20" />
              <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 col-span-full">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-red-400">Failed to load life insurance statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Policies",
      value: stats?.totalPolicies || 0,
      icon: Shield,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20",
      description: "Active life insurance policies"
    },
    {
      title: "New Policies",
      value: stats?.newPolicies || 0,
      icon: TrendingUp,
      iconColor: "text-green-400",
      bgColor: "bg-green-500/20",
      description: "New policy additions",
      badge: stats?.newPolicyPercentage ? `${Math.round(stats.newPolicyPercentage)}%` : null
    },
    {
      title: "Renewal Policies",
      value: stats?.renewalPolicies || 0,
      icon: RefreshCw,
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/20",
      description: "Policy renewals",
      badge: stats?.renewalPolicyPercentage ? `${Math.round(stats.renewalPolicyPercentage)}%` : null
    },
    {
      title: "Total Sum Insured",
      value: formatCurrency(stats?.totalSumInsured || 0),
      icon: IndianRupee,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/20",
      description: "Total coverage amount",
      isLarge: true
    },
    {
      title: "Recent Policies",
      value: stats?.recentPolicies || 0,
      icon: FileText,
      iconColor: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
      description: "Added in last 30 days"
    },
    {
      title: "Active Status",
      value: `${((stats?.totalPolicies || 0) > 0 ? 100 : 0)}%`,
      icon: Activity,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      description: "System operational status"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statsCards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <Card 
            key={index} 
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor} border border-white/20`}>
                <IconComponent className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className={`text-2xl font-bold text-white ${card.isLarge ? 'text-lg' : ''}`}>
                  {typeof card.value === 'string' && card.value.length > 10 && card.isLarge 
                    ? card.value.replace('₹', '₹ ') 
                    : typeof card.value === 'number' 
                      ? card.value.toLocaleString()
                      : card.value
                  }
                </div>
                {card.badge && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/10 text-white border-white/20 text-xs"
                  >
                    {card.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LifeInsuranceStatsCards;