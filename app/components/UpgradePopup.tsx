// app/components/UpgradePopup.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSpecialOffer } from '@/lib/useSpecialOffer';
import SpecialOfferPopup from './SpecialOfferPopup';

interface UpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  analysesUsed: number;
  maxAnalyses: number;
}

export default function UpgradePopup({ isOpen, onClose, analysesUsed, maxAnalyses }: UpgradePopupProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  
  const { 
    showSpecialOffer, 
    trackUpgradeAttempt, 
    acceptSpecialOffer, 
    closeSpecialOffer,
    resetOfferState 
  } = useSpecialOffer();

  // Track upgrade attempt when popup opens
  useEffect(() => {
    if (isOpen) {
      trackUpgradeAttempt();
    }
  }, [isOpen, trackUpgradeAttempt]);

  // Show special offer popup if triggered
  if (showSpecialOffer) {
    return (
      <SpecialOfferPopup
        isOpen={showSpecialOffer}
        onClose={closeSpecialOffer}
        onAccept={acceptSpecialOffer}
      />
    );
  }

  if (!isOpen) return null;

  const plans = {
    monthly: {
      price: '$29',
      period: 'per month',
      savings: null,
      total: '$29/month'
    },
    annual: {
      price: '$199',
      period: 'per year',
      savings: 'Save $149 per year (43% off)',
      total: '$16.58/month'
    }
  };

  const features = [
    'Unlimited chart analyses',
    'Advanced AI insights',
    'Priority analysis processing',
    'Advanced pattern recognition',
    'Risk management tools',
    'Export analysis reports',
    'Priority email support'
  ];

  // Check if user has reached their limit
  const hasReachedLimit = analysesUsed >= maxAnalyses;

  const handleUpgradeClick = () => {
    // TODO: Integrate with payment system
    alert(`Upgrading to ${selectedPlan} plan - Payment integration coming soon!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Usage Status - Dynamic based on usage */}
          <div className="mb-6">
            {hasReachedLimit ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-800 mb-2">Daily Limit Reached</h3>
                <p className="text-orange-700 text-sm">
                  You've used {analysesUsed}/{maxAnalyses} free analyses today. 
                  Upgrade to get unlimited chart analysis!
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Unlock Premium Features</h3>
                <p className="text-blue-700 text-sm">
                  You've used {analysesUsed}/{maxAnalyses} free analyses today. 
                  Upgrade now for unlimited access and advanced features!
                </p>
              </div>
            )}
          </div>

          {/* Plan Toggle */}
          <div className="mb-6">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('annual')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
                  selectedPlan === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 43%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {plans[selectedPlan].price}
              </div>
              <div className="text-blue-700 text-sm mb-2">
                {plans[selectedPlan].period}
              </div>
              {plans[selectedPlan].savings && (
                <div className="text-green-600 text-sm font-medium mb-2">
                  {plans[selectedPlan].savings}
                </div>
              )}
              <div className="text-blue-600 text-sm">
                {plans[selectedPlan].total}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Premium Features:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button 
              onClick={handleUpgradeClick}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Upgrade to {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan
            </button>
            
            <Link
              href="/dashboard/plans"
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium text-center block"
            >
              View All Plans
            </Link>
            
            <button 
              onClick={onClose}
              className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
            >
              Maybe Later
            </button>
          </div>

          {/* Reset Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Free analyses reset daily at midnight
            </p>
          </div>

          {/* Dev Tools for Testing */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={resetOfferState}
                className="w-full text-xs text-gray-400 hover:text-gray-600"
              >
                🔧 Reset Special Offer State (Dev)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}