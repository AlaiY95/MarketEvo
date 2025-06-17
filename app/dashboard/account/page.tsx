// app/dashboard/account/page.tsx
'use client';

import { getUserUsage } from '../../lib/usage';
import { useEffect, useState } from 'react';
import { UserUsage } from '../../lib/types';

export default function AccountPage() {
  const [usage, setUsage] = useState<UserUsage | null>(null);

  useEffect(() => {
    setUsage(getUserUsage());
  }, []);

  if (!usage) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {usage.isPremium ? 'Premium Plan' : 'Free Plan'}
            </h3>
            <p className="text-gray-600">
              {usage.isPremium 
                ? 'Unlimited chart analyses' 
                : `${usage.analysesUsed}/${usage.maxAnalyses} analyses used today`
              }
            </p>
          </div>
          
          {!usage.isPremium && (
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Upgrade to Premium
            </button>
          )}
        </div>
        
        {!usage.isPremium && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(usage.analysesUsed / usage.maxAnalyses) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Resets daily at midnight
            </p>
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="border rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">$0</div>
              <div className="text-gray-600">per month</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                2 chart analyses per day
              </li>
              <li className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Basic pattern recognition
              </li>
              <li className="flex items-center text-sm">
                <span className="text-gray-400 mr-2">✗</span>
                Analysis history
              </li>
              <li className="flex items-center text-sm">
                <span className="text-gray-400 mr-2">✗</span>
                Advanced features
              </li>
            </ul>
            
            <button 
              disabled={!usage.isPremium}
              className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg font-medium"
            >
              {usage.isPremium ? 'Downgrade' : 'Current Plan'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-blue-500 rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Recommended
              </span>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Premium</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">$19.99</div>
              <div className="text-gray-600">per month</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited chart analyses
              </li>
              <li className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Advanced AI analysis
              </li>
              <li className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Analysis history & tracking
              </li>
              <li className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </li>
              <li className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Export & share features
              </li>
            </ul>
            
            <button 
              onClick={() => alert('Payment integration coming soon!')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              {usage.isPremium ? 'Current Plan' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}