// app/dashboard/page.tsx - Fixed header styling
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface TradingMetrics {
  tradesAnalyzed: number;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  lessonsCompleted: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get current date
  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  // Load trading metrics
  useEffect(() => {
    if (session?.user?.id) {
      loadTradingMetrics();
    }
  }, [session?.user?.id]);

  const loadTradingMetrics = async () => {
    if (!session?.user?.id) return;
    
    setMetricsLoading(true);
    try {
      const response = await fetch(`/api/user/trading-metrics?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Error loading trading metrics:', error);
    }
    setMetricsLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to access the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">📊</span>
                <h1 className="text-3xl font-bold">
                  {getTimeGreeting()}, {session.user?.name?.split(' ')[0] || 'Trader'}!
                </h1>
              </div>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="text-sm">⭐ {getCurrentDate()}</span>
                <span className="text-sm">• Your trading command center</span>
              </div>
            </div>
            
            {/* Fixed: Darker text for better readability */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/dashboard/swing-trading" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 font-bold rounded-lg transition-all duration-200 border border-white border-opacity-50 hover:border-opacity-80 hover:scale-105 shadow-lg"
              >
                <span className="mr-2">📊</span>
                Swing Trading
              </Link>
              <Link 
                href="/dashboard/scalp-trading" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 font-bold rounded-lg transition-all duration-200 border border-white border-opacity-50 hover:border-opacity-80 hover:scale-105 shadow-lg"
              >
                <span className="mr-2">⚡</span>
                Scalp Trading
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Trading Strategies Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Swing Trading Card */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-xl font-bold text-gray-900">Swing Trading</h3>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">9.3k active</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1">Multi-day to multi-week opportunities</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Analyze market patterns and identify high-probability swing trade setups that 
                develop over days or weeks.
              </p>
              <Link href="/dashboard/swing-trading">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Analyze Swing Charts
                </button>
              </Link>
            </div>
          </div>

          {/* Scalp Trading Card */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-xl font-bold text-gray-900">Scalp Trading</h3>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">5.2k active</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1">Ultra-short term trading opportunities</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Capture small, quick price movements with precise entry and exit points for 
                maximum efficiency.
              </p>
              <Link href="/dashboard/scalp-trading">
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Analyze Scalping Charts
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Trading Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Trades Analyzed</h3>
              {metricsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{metrics?.tradesAnalyzed || 0}</p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Win Rate</h3>
              {metricsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-green-600">{metrics?.winRate || 0}%</p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Profit Factor</h3>
              {metricsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-purple-600">{metrics?.profitFactor || 0}</p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Lessons Completed</h3>
              {metricsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-orange-600">{metrics?.lessonsCompleted || 0}</p>
              )}
            </div>
          </div>
        </div>

        {/* Trading Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trading Tools</h2>
          <p className="text-gray-600 mb-6">Quick access to key features</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/swing-trading" className="bg-white rounded-lg shadow border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Swing Trading</h3>
                  <p className="text-sm text-gray-600">Popular</p>
                  <p className="text-xs text-gray-500 mt-1">Analyze multi-day trading opportunities</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/scalp-trading" className="bg-white rounded-lg shadow border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Scalp Trading</h3>
                  <p className="text-sm text-red-600">New</p>
                  <p className="text-xs text-gray-500 mt-1">Ultra short term trading analysis</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/journal" className="bg-white rounded-lg shadow border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Journal Entries</h3>
                  <p className="text-sm text-gray-600"></p>
                  <p className="text-xs text-gray-500 mt-1">Log and review your trading activity</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/learning" className="bg-white rounded-lg shadow border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Learning Center</h3>
                  <p className="text-sm text-gray-600"></p>
                  <p className="text-xs text-gray-500 mt-1">Master trading patterns and strategies</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Trading Community */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow border">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Trading Community</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  📈 147 traders online
                </span>
              </div>
              <p className="text-gray-600 mt-1">Connect with fellow traders</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">📊</span>
                    <span className="font-medium text-blue-600">Weekly Analysis:</span>
                  </div>
                  <p className="text-gray-700">Market sentiment is <span className="font-medium text-green-600">bullish</span> with strong momentum</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🆕</span>
                    <span className="font-medium text-purple-600">New Content:</span>
                  </div>
                  <p className="text-gray-700">Advanced pattern recognition guide now available</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Explore Learning Content
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Tips */}
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💡</span>
              <h2 className="text-xl font-bold text-gray-900">Trading Tips</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Futures Trading Tip</h3>
              <p className="text-blue-800 text-sm">
                When trading NQ futures, be mindful of overnight holding risks. The Nasdaq futures can be particularly 
                volatile during earnings seasons and economic news releases. Always use proper position sizing based on your account size.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                Explore All Trading Lessons
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}