// app/components/UpgradePromptModal.tsx
'use client';

import { useRouter } from 'next/navigation';
import { XMarkIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'limit_reached' | 'feature_locked' | 'grace_period';
  details?: {
    message?: string;
    resetDate?: Date;
    remaining?: number;
  };
}

export default function UpgradePromptModal({ 
  isOpen, 
  onClose, 
  trigger, 
  details 
}: UpgradePromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/dashboard/plans?utm_source=usage_limit');
    onClose();
  };

  const getModalContent = () => {
    switch (trigger) {
      case 'limit_reached':
        return {
          title: 'Analysis Limit Reached',
          icon: '📊',
          description: details?.message || 'You\'ve reached your daily analysis limit.',
          resetInfo: details?.resetDate ? `Resets ${details.resetDate.toLocaleDateString()}` : 'Resets tomorrow',
          ctaText: 'Upgrade for Unlimited Access',
          benefits: [
            '✨ Unlimited chart analyses',
            '📈 Advanced pattern recognition',
            '🎯 Priority AI processing',
            '📱 Mobile app access',
            '💬 Priority support'
          ]
        };
      
      case 'grace_period':
        return {
          title: 'Grace Period Active',
          icon: '⏰',
          description: `You have ${details?.remaining || 0} analyses remaining in your grace period.`,
          resetInfo: 'Grace period ends soon',
          ctaText: 'Reactivate Premium',
          benefits: [
            '🔄 Immediate access restoration',
            '✨ Unlimited analyses',
            '📊 All premium features',
            '💎 Exclusive trading insights'
          ]
        };

      case 'feature_locked':
      default:
        return {
          title: 'Premium Feature',
          icon: '🔒',
          description: 'This feature is available for premium users only.',
          resetInfo: '',
          ctaText: 'Unlock Premium Features',
          benefits: [
            '🚀 All trading tools unlocked',
            '✨ Unlimited chart analyses',
            '📊 Advanced analytics',
            '🎯 Priority support'
          ]
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{content.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
                {content.resetInfo && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {content.resetInfo}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">{content.description}</p>

          {/* Benefits */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
              Premium Benefits
            </h4>
            <ul className="space-y-2">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Starting at</p>
              <p className="text-2xl font-bold text-blue-600">$29<span className="text-sm text-gray-500">/month</span></p>
              <p className="text-xs text-gray-500">or save 40% annually</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {content.ctaText}
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Continue with Free Plan
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime • No hidden fees • 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}