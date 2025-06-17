// app/components/EnhancedSpecialOfferPopup.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { XMarkIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';

interface EnhancedSpecialOfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (planType: 'monthly' | 'annual') => void;
  upgrading?: boolean;
}

export default function EnhancedSpecialOfferPopup({ 
  isOpen, 
  onClose, 
  onAccept,
  upgrading = false
}: EnhancedSpecialOfferPopupProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { data: session } = useSession();

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose(); // Auto-close when timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 text-center">
          <button
            onClick={onClose}
            disabled={upgrading}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl disabled:opacity-50"
          >
            ✕
          </button>
          <div className="text-2xl font-bold mb-2">🎉 Wait! Special Offer</div>
          <div className="text-lg">
            Get <span className="text-3xl font-black text-yellow-300">50% OFF</span> your first subscription
          </div>
          <div className="text-sm mt-2 opacity-90">
            This exclusive discount expires in:
          </div>
        </div>

        {/* Timer */}
        <div className="bg-red-600 text-white text-center py-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="text-2xl">⏰</div>
            <div className="text-3xl font-bold font-mono">{formatTime(timeLeft)}</div>
          </div>
          <div className="text-sm mt-1 flex items-center justify-center space-x-1">
            <span className="text-yellow-300">⚠️</span>
            <span>Offer expires when timer reaches zero!</span>
          </div>
        </div>

        {/* Offer Options */}
        <div className="p-6 space-y-4">
          {/* Monthly Plan */}
          <button
            onClick={() => onAccept('monthly')}
            disabled={upgrading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-lg font-bold mb-1">Monthly Plan - 50% OFF First Month</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl line-through opacity-60">$29.00</span>
              <span className="text-2xl font-bold text-yellow-300">→ $14.50</span>
              <span className="text-sm">first month</span>
            </div>
            <div className="text-sm mt-1 opacity-80">
              Then $29.00/month • Cancel anytime
            </div>
            {upgrading && (
              <div className="flex items-center justify-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="text-sm">Creating checkout...</span>
              </div>
            )}
          </button>

          {/* Annual Plan */}
          <button
            onClick={() => onAccept('annual')}
            disabled={upgrading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              Best Value
            </div>
            <div className="text-lg font-bold mb-1">Annual Plan - 50% OFF First Year</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl line-through opacity-60">$199.00</span>
              <span className="text-2xl font-bold text-yellow-300">→ $99.50</span>
              <span className="text-sm">first year</span>
            </div>
            <div className="text-sm mt-1 opacity-80">
              Then $199.00/year • Best Value
            </div>
            {upgrading && (
              <div className="flex items-center justify-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="text-sm">Creating checkout...</span>
              </div>
            )}
          </button>

          {/* Decline Option */}
          <button
            onClick={onClose}
            disabled={upgrading}
            className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 disabled:opacity-50"
          >
            No thanks, I'll pay full price later
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 p-4 text-center">
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
      </div>
    </div>
  );
}