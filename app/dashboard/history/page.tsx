// app/dashboard/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FEATURE_FLAGS } from '../../lib/features';
import Link from 'next/link';
import EnhancedUpgradePopup from '../../components/EnhancedUpgradePopup';

interface ChartAnalysis {
  id: string;
  imageName: string;
  imageSize: number;
  tradingStyle: string;
  pattern: string | null;
  confidence: string | null;
  timeframe: string | null;
  trend: string | null;
  entryPoint: number | null;
  stopLoss: number | null;
  target: number | null;
  riskReward: string | null;
  explanation: string | null;
  createdAt: string;
}

interface TradingMetrics {
  tradesAnalyzed: number;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  lessonsCompleted: number;
  // Additional metrics for history page
  swingAnalyses: number;
  dayAnalyses: number;
  scalpAnalyses: number;
  bullishCount: number;
  bearishCount: number;
  sidewaysCount: number;
}

export default function TradeHistory() {
  const { data: session } = useSession();
  const [analyses, setAnalyses] = useState<ChartAnalysis[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ChartAnalysis | null>(null);
  const [filter, setFilter] = useState<'all' | 'swing' | 'day' | 'scalp'>('all');
  const [userUsage, setUserUsage] = useState<any>(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserData();
    }
  }, [session?.user?.id]);

  const loadUserData = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Load metrics and usage in parallel
      const [metricsResponse, usageResponse] = await Promise.all([
        fetch(`/api/user/trading-metrics?userId=${session.user.id}`),
        fetch(`/api/user/usage?userId=${session.user.id}`)
      ]);

      const [metricsData, usageData] = await Promise.all([
        metricsResponse.json(),
        usageResponse.json()
      ]);

      if (metricsData.success) {
        setMetrics(metricsData.metrics);
      }

      if (usageData.success) {
        setUserUsage(usageData.usage);
      }

      // Load analyses for the table (paginated in the future)
      loadAnalyses();
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const loadAnalyses = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/user/analyses?userId=${session.user.id}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
    setLoading(false);
  };

  const filteredAnalyses = analyses.filter(analysis => 
    filter === 'all' || analysis.tradingStyle === filter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrendColor = (trend: string | null) => {
    switch (trend) {
      case 'Bullish': return 'text-green-600 bg-green-100';
      case 'Bearish': return 'text-red-600 bg-red-100';
      case 'Sideways': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: string | null) => {
    switch (confidence) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const requiresPremiumForHistory = !FEATURE_FLAGS.freeHistoryAccess;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your trade history</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Premium check - Updated to show upgrade popup
  if (requiresPremiumForHistory && !userUsage?.isPremium) {
    return (
      <>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trade History</h1>
            <p className="text-gray-600 mt-1">Track your analysis performance and insights</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
            <div className="text-blue-600 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock Your Trading History</h2>
            <p className="text-gray-600 mb-6">
              Upgrade to Premium to access your complete trading history, performance analytics, and advanced insights.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => setShowUpgradePopup(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Upgrade to Premium
              </button>
              <div className="text-center">
                <Link 
                  href="/dashboard/plans"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View detailed pricing plans →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Popup */}
        <EnhancedUpgradePopup
          isOpen={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          analysesUsed={userUsage?.analysesUsed || 0}
          maxAnalyses={userUsage?.maxAnalyses || 5}
          source="history_premium_required"
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* User Status Banner */}
        {userUsage && (
          <div className={`border rounded-lg p-4 ${
            userUsage.isPremium 
              ? 'bg-green-50 border-green-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                {userUsage.isPremium ? (
                  <>
                    <h4 className="font-medium text-green-800">✓ Premium Account</h4>
                    <p className="text-green-700 text-sm">
                      Unlimited chart analyses • Complete trade history • Priority support
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-medium text-blue-800">Free Account</h4>
                    <p className="text-blue-700 text-sm">
                      {Math.max(0, userUsage.maxAnalyses - userUsage.analysesUsed)} analyses remaining today • 
                      Full trade history access • Upgrade for unlimited analyses
                    </p>
                  </>
                )}
              </div>
              {!userUsage.isPremium && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowUpgradePopup(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-medium transition-colors"
                  >
                    Upgrade Now
                  </button>
                  <Link
                    href="/dashboard/plans"
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 font-medium transition-colors"
                  >
                    View Plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trade History</h1>
            <p className="text-gray-600 mt-1">
              Your complete analysis history and performance insights
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/dashboard/swing-trading"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              + New Analysis
            </Link>
          </div>
        </div>

        {/* Stats Cards - Using Database Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📊</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Analyses</h3>
                  <p className="text-2xl font-bold text-blue-600">{metrics.tradesAnalyzed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📈</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Swing Analyses</h3>
                  <p className="text-2xl font-bold text-green-600">{metrics.swingAnalyses || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🎯</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
                  <p className="text-2xl font-bold text-purple-600">{metrics.winRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⚡</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Profit Factor</h3>
                  <p className="text-2xl font-bold text-orange-600">{metrics.profitFactor}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Summary */}
        {metrics && (
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-medium text-gray-700">Trading Styles</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Swing:</span>
                    <span className="font-semibold text-gray-900">{metrics.swingAnalyses || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Day:</span>
                    <span className="font-semibold text-gray-900">{metrics.dayAnalyses || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Scalp:</span>
                    <span className="font-semibold text-gray-900">{metrics.scalpAnalyses || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-medium text-gray-700">Market Bias</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Bullish:</span>
                    <span className="font-semibold text-green-600">{metrics.bullishCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Bearish:</span>
                    <span className="font-semibold text-red-600">{metrics.bearishCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Sideways:</span>
                    <span className="font-semibold text-blue-600">{metrics.sidewaysCount || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-medium text-gray-700">Learning Progress</h3>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-orange-600">{metrics.lessonsCompleted}</div>
                  <div className="text-sm text-gray-600">Lessons completed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex space-x-2">
            {(['all', 'swing', 'day', 'scalp'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption === 'all' ? 'All' : `${filterOption} Trading`}
              </button>
            ))}
          </div>
        </div>

        {/* Analyses List */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          {filteredAnalyses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
              <p className="text-gray-600 mb-4">
                Start analyzing charts to build your trading history and track your performance
              </p>
              <Link
                href="/dashboard/swing-trading"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Analyze Your First Chart
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chart & Pattern
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Trend
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry/Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk/Reward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAnalyses.map((analysis) => (
                    <tr key={analysis.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {analysis.pattern || 'Pattern Analysis'}
                          </div>
                          <div className="text-sm text-gray-500">{analysis.imageName}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(analysis.confidence)}`}>
                            {analysis.confidence || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 mb-1 capitalize">
                            {analysis.tradingStyle}
                          </span>
                          <br />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTrendColor(analysis.trend)}`}>
                            {analysis.trend || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {analysis.entryPoint && (
                            <div>Entry: <span className="font-medium">{analysis.entryPoint}</span></div>
                          )}
                          {analysis.target && (
                            <div>Target: <span className="font-medium text-green-600">{analysis.target}</span></div>
                          )}
                          {analysis.stopLoss && (
                            <div>Stop: <span className="font-medium text-red-600">{analysis.stopLoss}</span></div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{analysis.riskReward || 'N/A'}</span>
                        {analysis.timeframe && (
                          <div className="text-xs text-gray-500">{analysis.timeframe}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(analysis.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedAnalysis(analysis)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Analysis Detail Modal */}
        {selectedAnalysis && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Analysis Details</h3>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Pattern</h4>
                  <p className="text-gray-900">{selectedAnalysis.pattern}</p>
                </div>
                
                {selectedAnalysis.explanation && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Analysis</h4>
                    <p className="text-gray-900 leading-relaxed">{selectedAnalysis.explanation}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Trading Details</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Style: {selectedAnalysis.tradingStyle}</li>
                      <li>Confidence: {selectedAnalysis.confidence}</li>
                      <li>Trend: {selectedAnalysis.trend}</li>
                      <li>Timeframe: {selectedAnalysis.timeframe}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Price Levels</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Entry: {selectedAnalysis.entryPoint}</li>
                      <li>Target: {selectedAnalysis.target}</li>
                      <li>Stop Loss: {selectedAnalysis.stopLoss}</li>
                      <li>Risk/Reward: {selectedAnalysis.riskReward}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Popup for non-premium users */}
      {userUsage && !userUsage.isPremium && (
        <EnhancedUpgradePopup
          isOpen={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          analysesUsed={userUsage.analysesUsed || 0}
          maxAnalyses={userUsage.maxAnalyses || 5}
          source="history_upgrade_banner"
        />
      )}
    </>
  );
}