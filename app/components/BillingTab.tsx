// app/components/BillingTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UserSubscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string | null;
  plan: {
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    interval: string;
    intervalCount: number;
  };
}

interface BillingTabProps {
  onMessage: (type: 'success' | 'error', text: string) => void;
}

export default function BillingTab({ onMessage }: BillingTabProps) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    setCancelling(true);
    try {
      const response = await fetch('/api/user/subscription', {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadSubscription();
        onMessage('success', 'Subscription will be canceled at the end of your billing period');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      onMessage('error', error instanceof Error ? error.message : 'Failed to cancel subscription. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;
    
    setReactivating(true);
    try {
      const response = await fetch('/api/user/subscription', {
        method: 'PATCH',
      });

      if (response.ok) {
        await loadSubscription();
        onMessage('success', 'Subscription has been reactivated successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      onMessage('error', error instanceof Error ? error.message : 'Failed to reactivate subscription. Please try again.');
    } finally {
      setReactivating(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to open billing portal');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      onMessage('error', error instanceof Error ? error.message : 'Failed to open billing portal. Please try again.');
    }
  };

  const formatPrice = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'past_due':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'canceled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'incomplete':
        return 'Incomplete';
      case 'trialing':
        return 'Trial';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h2>
        <p className="text-gray-600">Manage your subscription and billing information</p>
      </div>

      {subscriptionLoading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      ) : subscription ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCardIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Subscription Details</span>
                {getStatusIcon(subscription.status)}
                <span className={`text-sm font-medium ${
                  subscription.status === 'active' ? 'text-green-600' : 
                  subscription.status === 'past_due' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {getStatusText(subscription.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                <div>
                  <p className="mb-2">
                    <span className="font-medium text-gray-900">Plan:</span> {subscription.plan.name}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium text-gray-900">Price:</span> {' '}
                    {formatPrice(subscription.plan.amount, subscription.plan.currency)}/
                    {subscription.plan.interval}
                  </p>
                  {subscription.plan.description && (
                    <p className="text-gray-500">{subscription.plan.description}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium text-gray-900">Current period:</span>
                  </div>
                  <p className="text-sm ml-5">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                  
                  {subscription.cancelAtPeriodEnd && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <p className="text-orange-800 font-medium text-sm flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Subscription ends on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                      <p className="text-orange-700 text-sm mt-1">
                        You'll lose access to premium features after this date.
                      </p>
                    </div>
                  )}
                  
                  {subscription.status === 'past_due' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-800 font-medium text-sm flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Payment Failed
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Please update your payment method to continue your subscription.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleManageBilling}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Manage Billing
            </button>
            
            {subscription.cancelAtPeriodEnd ? (
              <button
                onClick={handleReactivateSubscription}
                disabled={reactivating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {reactivating ? 'Reactivating...' : 'Reactivate Subscription'}
              </button>
            ) : subscription.status === 'active' ? (
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h4>
          <p className="text-gray-600 mb-4">
            Upgrade to unlock premium features and unlimited chart analyses
          </p>
          <button
            onClick={() => router.push('/dashboard/plans')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            View Plans & Subscribe
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Need help?</h4>
        <p className="text-sm text-blue-700 mb-3">
          Contact our support team if you have any billing questions or issues.
        </p>
        <button 
          onClick={() => router.push('/dashboard/support')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}