// app/dashboard/settings/page.tsx
'use client';

import BillingTab from '@/components/BillingTab';

import { shouldHidePricing } from '@/lib/utm';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  CheckIcon, 
  ExclamationCircleIcon, 
  UserIcon, 
  CameraIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

type TabType = 'profile' | 'billing' | 'security';

interface UserProfile {
  id: string;
  name: string;        // Real name from registration
  displayName?: string; // Public display name
  email: string;
  timezone?: string;
  tradingBio?: string;
  isPremium: boolean;
  createdAt?: string;
}

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

interface ValidationErrors {
  displayName?: string;
  tradingBio?: string;
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    timezone: 'Eastern Time (ET)',
    tradingBio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: true
  });

  const [originalFormData, setOriginalFormData] = useState({
    displayName: '',
    timezone: 'Eastern Time (ET)',
    tradingBio: '',
  });

  // Load user profile on mount
  useEffect(() => {
    if (session?.user?.email) {
      loadUserProfile();
      loadSubscription();
    }
  }, [session?.user?.email]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.displayName !== originalFormData.displayName ||
      formData.timezone !== originalFormData.timezone ||
      formData.tradingBio !== originalFormData.tradingBio;
    
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalFormData]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
        
        const profileData = {
          displayName: data.user.displayName || '',
          email: data.user.email || '',
          timezone: data.user.timezone || 'Eastern Time (ET)',
          tradingBio: data.user.tradingBio || '',
        };

        setFormData(prev => ({
          ...prev,
          ...profileData
        }));

        setOriginalFormData({
          displayName: profileData.displayName,
          timezone: profileData.timezone,
          tradingBio: profileData.tradingBio,
        });
      } else {
        showMessage('error', data.error || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

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
        showMessage('success', 'Subscription will be canceled at the end of your billing period');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      showMessage('error', error instanceof Error ? error.message : 'Failed to cancel subscription. Please try again.');
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
        showMessage('success', 'Subscription has been reactivated successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      showMessage('error', error instanceof Error ? error.message : 'Failed to reactivate subscription. Please try again.');
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
      showMessage('error', error instanceof Error ? error.message : 'Failed to open billing portal. Please try again.');
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

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (formData.displayName.length > 100) {
      errors.displayName = 'Display name must be less than 100 characters';
    }
    
    if (formData.tradingBio && formData.tradingBio.length > 500) {
      errors.tradingBio = 'Trading bio must be less than 500 characters';
    }
    
    return errors;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSaveProfile = async () => {
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showMessage('error', 'Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName.trim(),
          timezone: formData.timezone,
          tradingBio: formData.tradingBio.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setUserProfile(data.user);
        setOriginalFormData({
          displayName: formData.displayName,
          timezone: formData.timezone,
          tradingBio: formData.tradingBio,
        });
        
        await updateSession();
        showMessage('success', 'Profile updated successfully!');
      } else {
        showMessage('error', data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleResetForm = () => {
    setFormData(prev => ({
      ...prev,
      displayName: originalFormData.displayName,
      timezone: originalFormData.timezone,
      tradingBio: originalFormData.tradingBio,
    }));
    setValidationErrors({});
  };

  const handleUpdatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      showMessage('error', 'New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        showMessage('success', 'Password updated successfully!');
      } else {
        showMessage('error', data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showMessage('error', 'Failed to update password');
    }
    setLoading(false);
  };

  const getInitials = (displayName: string, realName?: string) => {
    const nameToUse = displayName || realName || 'User';
    return nameToUse
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: '👤' },
    { id: 'billing' as TabType, label: 'Billing', icon: '💳' },
    { id: 'security' as TabType, label: 'Security', icon: '🔒' },
  ];

  const timezoneOptions = [
    'Eastern Time (ET)',
    'Central Time (CT)',
    'Mountain Time (MT)',
    'Pacific Time (PT)',
    'Alaska Time (AT)',
    'Hawaii Time (HT)',
    'Greenwich Mean Time (GMT)',
    'Central European Time (CET)',
    'Japan Standard Time (JST)',
    'Australian Eastern Time (AET)'
  ];

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`rounded-lg p-4 border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckIcon className="h-5 w-5 mr-2 text-green-600" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-600" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && activeTab === 'profile' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 text-yellow-600" />
            You have unsaved changes. Don't forget to save your profile updates.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
              <p className="text-gray-600">Update your personal information and trading preferences</p>
            </div>

            {/* Profile Photo Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {getInitials(formData.displayName, userProfile?.name)}
                </div>
                <button 
                  className="absolute -bottom-0 -right-0 bg-white rounded-full p-1 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => showMessage('error', 'Photo upload feature coming soon!')}
                >
                  <CameraIcon className="h-3 w-3 text-gray-600" />
                </button>
              </div>
              <div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <span>📤</span>
                  <span>Upload Photo</span>
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 ${
                      validationErrors.displayName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                    maxLength={100}
                  />
                  {validationErrors.displayName && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.displayName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    {timezoneOptions.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trading Bio
                  </label>
                  <textarea
                    value={formData.tradingBio}
                    onChange={(e) => handleInputChange('tradingBio', e.target.value)}
                    rows={2}
                    maxLength={500}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 ${
                      validationErrors.tradingBio ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                onClick={handleResetForm}
                disabled={!hasUnsavedChanges}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading || !hasUnsavedChanges}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Billing Tab with Full Stripe Integration */}
        {/* {activeTab === 'billing' && (
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
        )} */}
        {activeTab === 'billing' && (
  <BillingTab onMessage={showMessage} />
)}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Security Settings</h2>
              <p className="text-gray-600">Manage your account security</p>
            </div>

            {/* Password Change */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password *
        </label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password *
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div className="flex justify-end pt-2"> {/* Added pt-2 for minimal spacing */}
        <button
          onClick={handleUpdatePassword}
          disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>

    {/* Security Options - More Compact */}
    <div className="space-y-3 pt-4 border-t border-gray-200"> {/* Changed from space-y-4 pt-6 */}
      <h3 className="text-lg font-semibold text-gray-900">Security Options</h3>
      
      <div className="flex items-center justify-between py-3 border-b border-gray-200"> {/* Changed from py-4 */}
        <div>
          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600">Add an extra layer of security (Coming Soon)</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer opacity-50">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={formData.twoFactorEnabled}
            onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
            disabled
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between py-3"> {/* Changed from py-4 */}
        <div>
          <h4 className="font-medium text-gray-900">Session Timeout</h4>
          <p className="text-sm text-gray-600">Automatically log out after inactivity (Coming Soon)</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer opacity-50">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={formData.sessionTimeout}
            onChange={(e) => handleInputChange('sessionTimeout', e.target.checked)}
            disabled
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}