// app/components/UsageDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

interface UsageSummary {
  isPremium: boolean;
  daily: {
    used: number;
    limit: number;
    remaining: number;
  };
  monthly: {
    used: number;
    limit: number;
    remaining: number;
  };
  message: string;
}

interface UsageDisplayProps {
  compact?: boolean;
  showUpgradeButton?: boolean;
  className?: string;
}

export default function UsageDisplay({ 
  compact = false, 
  showUpgradeButton = true,
  className = "" 
}: UsageDisplayProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsage();
    }
  }, [session?.user?.email]);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/user/usage-summary');
      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!usage) return null;

  if (usage.isPremium) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-purple-900">Premium Active</span>
        </div>
        <p className="text-sm text-purple-700 mt-1">Unlimited chart analyses</p>
      </div>
    );
  }

  // Free user display
  const dailyPercentage = (usage.daily.used / usage.daily.limit) * 100;
  const monthlyPercentage = (usage.monthly.used / usage.monthly.limit) * 100;
  const isNearLimit = dailyPercentage >= 80 || monthlyPercentage >= 80;
  const isAtLimit = usage.daily.remaining === 0 || usage.monthly.remaining === 0;

  if (compact) {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {Math.min(usage.daily.remaining, usage.monthly.remaining)} analyses left
          </span>
        </div>
        {showUpgradeButton && !usage.isPremium && (
          <button
            onClick={() => router.push('/dashboard/plans')}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Upgrade
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Usage Limits</span>
        </div>
        {isAtLimit && (
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Daily Usage */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Daily</span>
          <span className="text-sm font-medium text-gray-900">
            {usage.daily.used}/{usage.daily.limit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              dailyPercentage >= 100 ? 'bg-red-500' :
              dailyPercentage >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Monthly Usage */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Monthly</span>
          <span className="text-sm font-medium text-gray-900">
            {usage.monthly.used}/{usage.monthly.limit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              monthlyPercentage >= 100 ? 'bg-red-500' :
              monthlyPercentage >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Status Message */}
      <div className={`text-sm p-2 rounded ${
        isAtLimit ? 'bg-red-50 text-red-700 border border-red-200' :
        isNearLimit ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
        'bg-blue-50 text-blue-700 border border-blue-200'
      }`}>
        {isAtLimit ? (
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>Limit reached. Resets tomorrow or upgrade now!</span>
          </div>
        ) : (
          usage.message
        )}
      </div>

      {/* Upgrade Button */}
      {showUpgradeButton && !usage.isPremium && (
        <button
          onClick={() => router.push('/dashboard/plans')}
          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Upgrade for Unlimited Access
        </button>
      )}
    </div>
  );
}