// app/dashboard/support/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SupportPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    reason: '',
    email: session?.user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Technical Issue',
    'Billing Question',
    'Feature Request',
    'Account Problem',
    'Trading Analysis Issue',
    'General Inquiry',
    'Bug Report',
    'Premium Support'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Support ticket #${data.ticket.id.slice(-6)} created successfully! We'll get back to you within 24-48 hours.`);
        setFormData({
          reason: '',
          email: session?.user?.email || '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Failed to submit support request');
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      alert('Failed to submit support request. Please try again.');
    }

    setIsSubmitting(false);
  };

  const isFormValid = formData.reason && formData.email && formData.subject && formData.message;

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl">✉️</span>
        <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
      </div>

      {/* Support Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason for Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Reason for Contact <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                required
              >
                <option value="">Select a reason...</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Your Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">👤</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              We'll use this email to respond to your request.
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of your request..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please provide detailed information about your request, including any steps to reproduce issues..."
              rows={6}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending Support Request...' : 'Send Support Request'}
          </button>
        </form>
      </div>

      {/* Response Time Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Response Time</h2>
        <p className="text-gray-700 leading-relaxed">
          We typically respond to support requests within <strong>24-48 hours</strong> during business days. 
          For urgent issues, please include <strong>"URGENT"</strong> in your subject line.
        </p>
      </div>

      {/* Additional Help Resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Get Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <span className="text-xl">📚</span>
            <div>
              <h3 className="font-medium text-gray-900">Documentation</h3>
              <p className="text-sm text-gray-600">Browse our comprehensive guides and tutorials</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">💬</span>
            <div>
              <h3 className="font-medium text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-600">Get instant help during business hours</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">🎥</span>
            <div>
              <h3 className="font-medium text-gray-900">Video Tutorials</h3>
              <p className="text-sm text-gray-600">Learn how to use our trading analysis tools</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">❓</span>
            <div>
              <h3 className="font-medium text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-600">Find answers to common questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}