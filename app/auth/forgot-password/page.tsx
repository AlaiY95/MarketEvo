// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEmailSent(true);
      } else {
        setError(data.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setError('An error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = email && isValidEmail(email);

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">What's next?</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Check your inbox (and spam folder)</p>
                <p>• Click the reset link in the email</p>
                <p>• Create a new password</p>
                <p>• Sign in with your new password</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 text-center block"
              >
                Back to Sign In
              </Link>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                  setError('');
                }}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Try Different Email
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Didn't receive the email? </span>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setError('');
                }}
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>

            {/* Back to Sign In */}
            <div className="text-center">
              <Link 
                href="/auth/signin" 
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/auth/signup" className="text-purple-600 hover:text-purple-500 font-medium">
              Sign up
            </Link>
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Security Note</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• The reset link will expire in 1 hour for security</p>
              <p>• Check your spam folder if you don't see the email</p>
              <p>• Only the most recent reset link will be valid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}