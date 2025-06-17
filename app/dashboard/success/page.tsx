// app/dashboard/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon, SparklesIcon, ChartBarIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionVerified, setSessionVerified] = useState(false);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        // Optional: Verify the session on the backend for extra security
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          setSessionVerified(true);
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        // Don't block the success page if verification fails
      } finally {
        // Show success page after 2 seconds for nice UX
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    verifySession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <CreditCardIcon className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-700 font-medium">Processing your subscription...</p>
          <p className="text-gray-500 text-sm mt-1">This will just take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          {/* Success Animation */}
          <div className="relative mx-auto mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-2 animate-bounce">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <SparklesIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to Premium! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your subscription has been activated successfully
          </p>

          {/* Features Unlocked Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 text-left">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 mr-3">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Premium Features Unlocked
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm">Unlimited chart analyses</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm">Advanced AI insights</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm">Real-time trading alerts</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm">Pattern recognition</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm">Export reports</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">∞</div>
              <div className="text-xs text-gray-600">Daily Analyses</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">⚡</div>
              <div className="text-xs text-gray-600">Priority Queue</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">🎯</div>
              <div className="text-xs text-gray-600">AI Powered</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/dashboard/swing-trading"
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Start Analyzing Charts Now
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                ⚙️ Settings
              </Link>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">🚀 Ready to Trade Smarter?</h3>
            <p className="text-sm text-gray-700 mb-3">
              You now have access to our most advanced trading analysis tools. 
              Start by uploading your first chart for AI-powered insights.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
              <span>📈 Better Analysis</span>
              <span>•</span>
              <span>⚡ Faster Results</span>
              <span>•</span>
              <span>🎯 Higher Accuracy</span>
            </div>
          </div>

          {/* Support Note */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong>Need help getting started?</strong><br />
              Our support team is here to help you make the most of your premium subscription.
            </p>
            <Link 
              href="/dashboard/support" 
              className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Contact Support →
            </Link>
          </div>

          {/* Development Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <div className="text-xs text-gray-600">
                <strong>Development Info:</strong>
              </div>
              {sessionId && (
                <div className="text-xs text-gray-500 mt-1">
                  Session: {sessionId.slice(0, 20)}...
                  {sessionVerified && <span className="text-green-600 ml-2">✓ Verified</span>}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Webhook should process subscription activation
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}