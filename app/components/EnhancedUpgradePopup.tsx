// app/components/EnhancedUpgradePopup.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSpecialOffer } from '@/lib/useSpecialOffer';
import { useUpgradeHandler } from '@/lib/upgradeHandler';
import SpecialOfferPopup from './SpecialOfferPopup';

interface EnhancedUpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  analysesUsed: number;
  maxAnalyses: number;
  source?: string; // Track where popup was triggered from
}

export default function EnhancedUpgradePopup({ 
  isOpen, 
  onClose, 
  analysesUsed, 
  maxAnalyses,
  source = 'usage_limit'
}: EnhancedUpgradePopupProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [upgrading, setUpgrading] = useState(false);
  
  const { 
    showSpecialOffer, 
    trackUpgradeAttempt, 
    acceptSpecialOffer, 
    closeSpecialOffer,
    resetOfferState 
  } = useSpecialOffer();

  const { handleUpgrade, redirectToPlans } = useUpgradeHandler();

  // Track upgrade attempt when popup opens
  useEffect(() => {
    if (isOpen) {
      trackUpgradeAttempt();
    }
  }, [isOpen, trackUpgradeAttempt]);

  // Handle special offer acceptance
  const handleSpecialOfferAccept = async (planType: 'monthly' | 'annual') => {
    setUpgrading(true);
    await handleUpgrade({
      plan: planType,
      source: `special_offer_${source}`,
      specialOffer: true,
      discountCode: 'SPECIAL50', // 50% off special offer
    });
    acceptSpecialOffer(planType);
    setUpgrading(false);
  };

  // Show special offer popup if triggered
  if (showSpecialOffer) {
    return (
      <SpecialOfferPopup
        isOpen={showSpecialOffer}
        onClose={closeSpecialOffer}
        onAccept={handleSpecialOfferAccept}
        upgrading={upgrading}
      />
    );
  }

  if (!isOpen) return null;

  const plans = {
    monthly: {
      price: '$29',
      period: 'per month',
      savings: null,
      total: '$29/month',
      description: 'Perfect for trying premium features'
    },
    annual: {
      price: '$199',
      period: 'per year',
      savings: 'Save $149 per year (43% off)',
      total: '$16.58/month',
      description: 'Best value for serious traders'
    }
  };

  const features = [
    '✨ Unlimited chart analyses',
    '🎯 Advanced pattern recognition',
    '⚡ Priority AI processing',
    '📊 Advanced risk management tools',
    '📈 Export analysis reports',
    '📱 Mobile app access',
    '💬 Priority email support',
    '🔔 Real-time alerts (coming soon)'
  ];

  // Check if user has reached their limit
  const hasReachedLimit = analysesUsed >= maxAnalyses;

  const handleUpgradeClick = async () => {
    setUpgrading(true);
    
    await handleUpgrade({
      plan: selectedPlan,
      source: `popup_${source}`,
      specialOffer: false,
    });
    
    setUpgrading(false);
  };

  const handleViewPlans = () => {
    redirectToPlans(`popup_${source}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={upgrading}
            >
              ✕
            </button>
          </div>

          {/* Usage Status - Dynamic based on usage */}
          <div className="mb-6">
            {hasReachedLimit ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2">🚫 Daily Limit Reached</h3>
                <p className="text-red-700 text-sm">
                  You've used {analysesUsed}/{maxAnalyses} free analyses today. 
                  Upgrade now to continue analyzing charts!
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">🚀 Unlock Premium Features</h3>
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
                disabled={upgrading}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                } disabled:opacity-50`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('annual')}
                disabled={upgrading}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
                  selectedPlan === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                } disabled:opacity-50`}
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
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
              <div className="text-blue-600 text-sm font-medium">
                {plans[selectedPlan].total}
              </div>
              <div className="text-gray-600 text-xs mt-2">
                {plans[selectedPlan].description}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Premium Features:</h3>
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start text-sm text-gray-700">
                  <span className="mr-2 mt-0.5">{feature.split(' ')[0]}</span>
                  <span>{feature.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button 
              onClick={handleUpgradeClick}
              disabled={upgrading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {upgrading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating checkout...
                </>
              ) : (
                `Upgrade to ${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan`
              )}
            </button>
            
            <button
              onClick={handleViewPlans}
              disabled={upgrading}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors disabled:opacity-50"
            >
              View All Plans & Details
            </button>
            
            <button 
              onClick={onClose}
              disabled={upgrading}
              className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 disabled:opacity-50"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-green-500">🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-500">↩️</span>
                <span>14-Day Guarantee</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-purple-500">⚡</span>
                <span>Instant Access</span>
              </div>
            </div>
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
                disabled={upgrading}
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