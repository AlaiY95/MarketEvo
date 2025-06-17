// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CheckIcon, ExclamationCircleIcon, UserIcon, CameraIcon } from '@heroicons/react/24/outline';

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

interface ValidationErrors {
  displayName?: string;
  tradingBio?: string;
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

      console.log('Raw API response:', data);
    console.log('User name:', data.user?.name);
    console.log('User displayName:', data.user?.displayName);
      
      if (data.success) {
        setUserProfile(data.user);
        const profileData = {
          displayName: data.user.name || '',
          email: data.user.email || '',
          timezone: data.user.timezone || 'Eastern Time (ET)',
          tradingBio: data.user.tradingBio || '',
        };
        
        setFormData(prev => ({
          ...prev,
          ...profileData
        }));

        console.log('Setting displayName to:', data.user.displayName || '');
        
        setTimeout(() => {
  console.log('Form displayName value after update:', formData.displayName);
}, 100);

        setOriginalFormData({
           displayName: data.user.displayName || '',
          timezone: profileData.timezone,
          tradingBio: profileData.tradingBio,
        });
        console.log('Setting originalFormData displayName to:', data.user.displayName || '');
        
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
    
    // Clear validation error for this field
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
        
        // Update the session with new name
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
    // Validate passwords match
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
        // Clear password fields
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
    // Prioritize displayName, only use realName if displayName is empty
    const nameToUse = displayName || realName || 'User';
    return nameToUse
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
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
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {getInitials(formData.displayName, userProfile?.name)}
                </div>
                <button 
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="Upload photo (coming soon)"
                  onClick={() => showMessage('error', 'Photo upload feature coming soon!')}
                >
                  <CameraIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Profile Photo</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a custom profile photo. JPG, GIF or PNG. 1MB max.
                </p>
                <button 
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={() => showMessage('error', 'Photo upload feature coming soon!')}
                >
                  Change Photo (Coming Soon)
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  placeholder="Enter your display name for the trading community"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is how other traders will see your name. Different from your account name.
                </p>
                {validationErrors.displayName && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.displayName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  title="Email cannot be changed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trading Bio
                </label>
                <textarea
                  value={formData.tradingBio}
                  onChange={(e) => handleInputChange('tradingBio', e.target.value)}
                  rows={4}
                  maxLength={500}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 ${
                    validationErrors.tradingBio ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your trading style, experience, and focus areas (e.g., Day trader focused on tech stocks, swing trading momentum plays...)"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-xs ${
                    formData.tradingBio.length > 450 ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {formData.tradingBio.length}/500 characters
                  </p>
                  {validationErrors.tradingBio && (
                    <p className="text-red-600 text-sm">{validationErrors.tradingBio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information with Real Name Display */}
            {userProfile && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Name</p>
                    <p className="font-medium">{userProfile.name || 'Not provided'}</p>
                    <p className="text-xs text-gray-500">Your registered name (private)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Display Name</p>
                    <p className="font-medium">{userProfile.displayName || 'Not set'}</p>
                    <p className="text-xs text-gray-500">Public name for trading community</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      userProfile.isPremium 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userProfile.isPremium ? '✨ Premium Account' : '🆓 Free Account'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{formatJoinDate(userProfile.createdAt)}</p>
                  </div>
                </div>
                {!userProfile.isPremium && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Upgrade to Premium</p>
                        <p className="text-sm text-gray-600">Get unlimited analyses and priority support</p>
                      </div>
                      <button 
                        onClick={() => window.location.href = '/dashboard/plans'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button 
                onClick={handleResetForm}
                disabled={!hasUnsavedChanges}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset Changes
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading || !hasUnsavedChanges}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Billing Tab - Same as before */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing Information</h2>
              <p className="text-gray-600">Manage your subscription and payment methods</p>
            </div>

            {/* Current Plan */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                  <p className="text-gray-600">
                    {userProfile?.isPremium ? 'Premium Plan' : 'Free Tier'}
                  </p>
                  {userProfile?.isPremium && (
                    <p className="text-sm text-gray-500 mt-1">
                      Unlimited chart analyses • Priority support
                    </p>
                  )}
                </div>
                {!userProfile?.isPremium && (
                  <button 
                    onClick={() => window.location.href = '/dashboard/plans'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-4">No payment methods added</p>
                <button 
                  onClick={() => showMessage('error', 'Payment integration coming soon!')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add Payment Method
                </button>
              </div>
            </div>

            {/* Billing History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No billing history</p>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab - Same as before */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
              <p className="text-gray-600">Manage your account security</p>
            </div>

            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>

            {/* Security Options */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Security Options</h3>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
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

              <div className="flex items-center justify-between py-4">
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