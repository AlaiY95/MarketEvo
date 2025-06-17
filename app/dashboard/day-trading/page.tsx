// app/dashboard/day-trading/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AnalysisResult from '../../components/AnalysisResult';
import ImageUpload from '../../components/ImageUpload';
import EnhancedUpgradePopup from '../../components/EnhancedUpgradePopup';
import PreTradeCalculator from '../../components/PreTradeCalculator';
import { ChartAnalysis, parseAnalysis, UserUsage } from '../../lib/types';

interface AnalysisResponse {
  success?: boolean;
  analysis?: string;
  error?: string;
  details?: string;
  timestamp?: string;
}

interface TradeSetup {
  accountBalance: number;
  riskPerTrade: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
}

export default function DayTrading() {
  const { data: session } = useSession();
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [parsedAnalysis, setParsedAnalysis] = useState<ChartAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [userUsage, setUserUsage] = useState<UserUsage | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'setup' | 'history'>('setup');

  // Trade Setup Calculator State
  const [tradeSetup, setTradeSetup] = useState<TradeSetup>({
    accountBalance: 10000,
    riskPerTrade: 1,
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0
  });

  // Load saved analysis and user usage on component mount
  useEffect(() => {
    const savedResult = localStorage.getItem('lastDayAnalysis');
    const savedParsed = localStorage.getItem('lastDayParsed');
    const savedImage = localStorage.getItem('lastDayImage');
    const savedSetup = localStorage.getItem('dayTradeSetup');
    
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (error) {
        console.error('Failed to load saved result:', error);
      }
    }
    
    if (savedParsed) {
      try {
        const parsed = JSON.parse(savedParsed);
        console.log('🔍 Restored parsed analysis from localStorage:', parsed);
        setParsedAnalysis(parsed);
      } catch (error) {
        console.error('Failed to load saved analysis:', error);
      }
    }

    if (savedImage) {
      setUploadedImage(savedImage);
    }

    if (savedSetup) {
      try {
        setTradeSetup(JSON.parse(savedSetup));
      } catch (error) {
        console.error('Failed to load saved setup:', error);
      }
    }
  }, []);

  // Load user usage data when session is available
  useEffect(() => {
    if (session?.user?.id) {
      loadUserUsage();
    }
  }, [session?.user?.id]);

  const loadUserUsage = async () => {
    if (!session?.user?.id) return;
    
    setUsageLoading(true);
    try {
      const response = await fetch(`/api/user/usage?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setUserUsage(data.usage);
      } else {
        console.error('Failed to load usage:', data.error);
      }
    } catch (error) {
      console.error('Error loading usage:', error);
    }
    setUsageLoading(false);
  };

  // Save trade setup whenever it changes
  useEffect(() => {
    localStorage.setItem('dayTradeSetup', JSON.stringify(tradeSetup));
  }, [tradeSetup]);

  // Save analysis results to localStorage whenever they change
  useEffect(() => {
    if (result) {
      localStorage.setItem('lastDayAnalysis', JSON.stringify(result));
    }
  }, [result]);

  useEffect(() => {
    if (parsedAnalysis) {
      console.log('🔍 Saving parsed analysis to localStorage:', parsedAnalysis);
      localStorage.setItem('lastDayParsed', JSON.stringify(parsedAnalysis));
    }
  }, [parsedAnalysis]);

  const analyzeDayChart = async (file: File) => {
    if (!session?.user?.id) {
      return;
    }

    // Check if user can analyze
    try {
      const response = await fetch(`/api/user/can-analyze?userId=${session.user.id}`);
      const data = await response.json();
      
      if (!data.canAnalyze) {
        setShowUpgradePopup(true);
        return;
      }
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return;
    }

    setLoading(true);
    setResult(null);
    setParsedAnalysis(null);
    
    try {
      // Store uploaded image for preview
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setUploadedImage(imageData);
        localStorage.setItem('lastDayImage', imageData);
      };
      reader.readAsDataURL(file);

      // Create FormData and send to API with day trading context
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tradingStyle', 'day');
      formData.append('userId', session.user.id);
      
      // Include calculator data if available
      if (tradeSetup.accountBalance && tradeSetup.riskPerTrade) {
        formData.append('calculatorData', JSON.stringify(tradeSetup));
      }
      
      const response = await fetch('/api/analyze-chart', {
        method: 'POST',
        body: formData,
      });
      
      const data: AnalysisResponse = await response.json();
      console.log('🔍 Raw API response:', data); 
      setResult(data);
      
      if (data.success && data.analysis) {
        try {
          const parsed = parseAnalysis(data.analysis);
          console.log('🔍 Parsed analysis (detailed):', JSON.stringify(parsed, null, 2));
          
          if (parsed) {
            // Check if we have numeric values
            console.log('🔍 Numeric values check:', {
              entryPoint: parsed.entryPoint,
              stopLoss: parsed.stopLoss,
              target: parsed.target,
              hasEntry: typeof parsed.entryPoint === 'number',
              hasStop: typeof parsed.stopLoss === 'number',
              hasTarget: typeof parsed.target === 'number'
            });
            
            setParsedAnalysis(parsed);
            
            // Only update tradeSetup if we have valid numeric values
            if (parsed.entryPoint || parsed.stopLoss || parsed.target) {
              setTradeSetup(prev => ({
                ...prev,
                entryPrice: parsed.entryPoint || prev.entryPrice,
                stopLoss: parsed.stopLoss || prev.stopLoss,
                takeProfit: parsed.target || prev.takeProfit
              }));
            }
            
            await loadUserUsage();
          } else {
            console.warn('⚠️ Failed to parse analysis, but got response:', data.analysis);
          }
        } catch (parseError) {
          console.error('❌ Error parsing analysis:', parseError);
          console.log('Raw analysis text:', data.analysis);
        }
      }
    } catch (error) {
      console.error('Day analysis error:', error);
      setResult({ 
        error: 'Analysis failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
    
    setLoading(false);
  };

  const clearAll = () => {
    setResult(null);
    setParsedAnalysis(null);
    setUploadedImage(null);
    localStorage.removeItem('lastDayAnalysis');
    localStorage.removeItem('lastDayParsed');
    localStorage.removeItem('lastDayImage');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to analyze charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🕐</span>
                <h1 className="text-3xl font-bold text-gray-900">Day Trading</h1>
                {/* Info tooltip */}
                <div className="relative group">
                  <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">
                    i
                  </div>
                  {/* Tooltip content */}
                  <div className="absolute left-0 top-6 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Optimal Timeframes</h4>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>• 15-minute charts (primary)</li>
                          <li>• 1-hour charts</li>
                          <li>• 4-hour for context</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Key Strategies</h4>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>• Breakout patterns</li>
                          <li>• Momentum trading</li>
                          <li>• Support/resistance plays</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                Intraday analysis for same-day trading opportunities (15m-4H timeframes)
              </p>
            </div>
            
            {/* Usage Indicator */}
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-medium">15m/1H Charts Recommended</span>
              </div>
              
              {!usageLoading && userUsage && !userUsage.isPremium && (
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-100 px-4 py-2 rounded-lg">
                    <span className="text-orange-800 font-medium">
                      {Math.max(0, userUsage.maxAnalyses - userUsage.analysesUsed)} analyses remaining today
                    </span>
                  </div>
                  <button
                    onClick={() => setShowUpgradePopup(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    Upgrade
                  </button>
                </div>
              )}
              
              {!usageLoading && userUsage?.isPremium && (
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">✓ Premium - Unlimited</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-yellow-600 text-lg mr-3">⚠️</span>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Important: Not Financial Advice</h3>
              <p className="text-yellow-700 text-sm">
                All analysis provided is for educational and informational purposes only. Trading involves risk. 
                Always conduct your own research and consider consulting a financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Chart Analysis */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6">
                {/* Image Upload - Clean and Prominent */}
                <div className="text-center mb-6">
                  <ImageUpload onUpload={analyzeDayChart} loading={loading} />
                </div>

                {/* Usage warning for free users */}
                {!usageLoading && userUsage && !userUsage.isPremium && userUsage.analysesUsed >= userUsage.maxAnalyses && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Daily Limit Reached</h4>
                    <p className="text-red-700 text-sm mb-3">
                      You've used all {userUsage.maxAnalyses} free analyses today. Upgrade to Premium for unlimited access!
                    </p>
                    <button 
                      onClick={() => setShowUpgradePopup(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Upgrade Now
                    </button>
                  </div>
                )}



                {/* Chart Analysis Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-blue-600 text-lg mr-3">ℹ️</span>
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Chart Analysis Information</h3>
                      <p className="text-blue-700 text-sm">
                        Our AI analyzes intraday patterns and momentum for same-day trading opportunities. 
                        Best with 15m-1H charts showing clear price action and volume data.
                      </p>
                    </div>
                  </div>
                </div>

                {(result || parsedAnalysis) && (
                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={clearAll}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 font-medium"
                    >
                      Clear Analysis
                    </button>
                  </div>
                )}

                {/* Analysis Status */}
                {loading && (
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
                    <p className="text-green-700 font-medium">Analyzing day trading opportunity...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chart Analysis Results - Positioned in Left Column */}
            {parsedAnalysis && (
              <div className="mt-8">
                <AnalysisResult analysis={parsedAnalysis} />
              </div>
            )}
          </div>

          {/* Right Column - Trade Setup & Day Trading Info */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow border">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('setup')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${
                      activeTab === 'setup'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Trade Setup
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${
                      activeTab === 'history'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    History
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'setup' && (
                  <PreTradeCalculator 
                    tradeSetup={tradeSetup}
                    setTradeSetup={setTradeSetup}
                    parsedAnalysis={parsedAnalysis}
                    colorScheme="green"
                    tradingStyle="Day"
                  />
                )}

                {activeTab === 'history' && (
                  <div className="text-center py-8">
                    <span className="text-4xl text-gray-400 mb-4 block">📋</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Day Trading History</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Your day trading analysis history will appear here
                    </p>
                    <button 
                      onClick={() => window.location.href = '/dashboard/history'}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View Full History →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Day Trading Metrics */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Day Trading Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Hold Period</span>
                  <span className="font-medium">30min - 8hours</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Risk/Reward</span>
                  <span className="font-medium text-green-600">1:1.5 - 1:3</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Win Rate Target</span>
                  <span className="font-medium text-blue-600">55-65%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Position Size</span>
                  <span className="font-medium">1-2% risk</span>
                </div>
              </div>
            </div>

            {/* Day Trading Rules */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Day Trading Rules</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-sm text-gray-700">Close all positions by market close</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-sm text-gray-700">Use wider stops than scalping</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-sm text-gray-700">Focus on momentum and breakouts</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-sm text-gray-700">Watch for market open volatility</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">×</span>
                  <span className="text-sm text-gray-700">Don't chase extended moves</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">×</span>
                  <span className="text-sm text-gray-700">Avoid low-volume periods</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display - Keep at bottom */}
        {result && !result.success && (
          <div className="mt-8 bg-white border border-red-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-red-600 mb-2">Analysis Failed</h2>
            <p className="text-red-700 mb-2">{result.error}</p>
            {result.details && (
              <p className="text-sm text-gray-600">{result.details}</p>
            )}
          </div>
        )}
      </div>

      {/* Upgrade Popup */}
      <EnhancedUpgradePopup 
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        analysesUsed={userUsage?.analysesUsed || 0}
        maxAnalyses={userUsage?.maxAnalyses || 3}
      />
    </div>
  );
}