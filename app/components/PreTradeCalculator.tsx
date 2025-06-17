// app/components/PreTradeCalculator.tsx
'use client';

import { useState, useEffect } from 'react';

interface TradeSetup {
  accountBalance: number;
  riskPerTrade: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
}

interface ParsedAnalysis {
  entryPoint?: number;
  stopLoss?: number;
  target?: number;
  pattern?: string;
  confidence?: string;
}

interface PreTradeCalculatorProps {
  tradeSetup: TradeSetup;
  setTradeSetup: (setup: TradeSetup | ((prev: TradeSetup) => TradeSetup)) => void;
  parsedAnalysis: ParsedAnalysis | null;
  colorScheme?: 'blue' | 'green' | 'red';
  tradingStyle: string;
}

export default function PreTradeCalculator({ 
  tradeSetup, 
  setTradeSetup, 
  parsedAnalysis, 
  colorScheme = 'blue',
  tradingStyle 
}: PreTradeCalculatorProps) {
  
  // Local state to track if we've applied analysis data
  const [hasAppliedAnalysis, setHasAppliedAnalysis] = useState(false);

  // Color scheme mappings
  const colors = {
    blue: {
      ring: 'focus:ring-blue-500',
      border: 'focus:border-blue-500',
      bg: 'bg-blue-50',
      borderColor: 'border-blue-200',
      text: 'text-blue-800'
    },
    green: {
      ring: 'focus:ring-green-500',
      border: 'focus:border-green-500', 
      bg: 'bg-green-50',
      borderColor: 'border-green-200',
      text: 'text-green-800'
    },
    red: {
      ring: 'focus:ring-red-500',
      border: 'focus:border-red-500',
      bg: 'bg-red-50', 
      borderColor: 'border-red-200',
      text: 'text-red-800'
    }
  };

  const currentColors = colors[colorScheme];

  // Apply analysis data to trade setup when analysis becomes available
  useEffect(() => {
    if (parsedAnalysis && !hasAppliedAnalysis) {
      console.log('🔄 Applying analysis to trade setup:', parsedAnalysis);
      
      setTradeSetup(prev => ({
        ...prev,
        entryPrice: parsedAnalysis.entryPoint || prev.entryPrice,
        stopLoss: parsedAnalysis.stopLoss || prev.stopLoss,
        takeProfit: parsedAnalysis.target || prev.takeProfit
      }));
      
      setHasAppliedAnalysis(true);
    }
  }, [parsedAnalysis, hasAppliedAnalysis, setTradeSetup]);

  // Reset applied flag when analysis is cleared
  useEffect(() => {
    if (!parsedAnalysis) {
      setHasAppliedAnalysis(false);
    }
  }, [parsedAnalysis]);

  // Trade Setup Calculations
  const calculateTradeMetrics = () => {
    const { accountBalance, riskPerTrade } = tradeSetup;
    const entryPrice = parsedAnalysis?.entryPoint || 0;
    const stopLoss = parsedAnalysis?.stopLoss || 0;
    const takeProfit = parsedAnalysis?.target || 0;
    
    if (!entryPrice || !stopLoss) return null;

    const riskAmount = (accountBalance * riskPerTrade) / 100;
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    const positionSize = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
    const totalPosition = positionSize * entryPrice;
    
    let riskRewardRatio = 0;
    if (takeProfit && riskPerShare > 0) {
      const rewardPerShare = Math.abs(takeProfit - entryPrice);
      riskRewardRatio = rewardPerShare / riskPerShare;
    }

    return {
      riskAmount,
      riskPerShare,
      positionSize,
      totalPosition,
      riskRewardRatio,
      potentialProfit: takeProfit ? Math.abs(takeProfit - entryPrice) * positionSize : 0
    };
  };

  const metrics = calculateTradeMetrics();

  // Determine if we have valid analysis data to display
  const hasValidAnalysis = parsedAnalysis && 
    (parsedAnalysis.entryPoint || parsedAnalysis.stopLoss || parsedAnalysis.target);

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-lg">📊</span>
        <h3 className="text-lg font-bold text-gray-900">Pre-Trade Setup Calculator</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Define your risk parameters for {tradingStyle.toLowerCase()} trading analysis
      </p>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <div>Has Analysis: {parsedAnalysis ? 'Yes' : 'No'}</div>
          <div>Has Applied: {hasAppliedAnalysis ? 'Yes' : 'No'}</div>
          <div>Valid Analysis: {hasValidAnalysis ? 'Yes' : 'No'}</div>
          {parsedAnalysis && (
            <div className="ml-2 mt-1">
              <div>Entry: {parsedAnalysis.entryPoint || 'N/A'}</div>
              <div>Stop: {parsedAnalysis.stopLoss || 'N/A'}</div>
              <div>Target: {parsedAnalysis.target || 'N/A'}</div>
            </div>
          )}
        </div>
      )}

      {/* User Risk Parameters - Always Editable */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Balance ($)
          </label>
          <input
            type="number"
            value={tradeSetup.accountBalance}
            onChange={(e) => setTradeSetup(prev => ({ ...prev, accountBalance: Number(e.target.value) }))}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white ${currentColors.ring} ${currentColors.border}`}
            style={{ color: '#111827', fontWeight: '500' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Risk Per Trade (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={tradeSetup.riskPerTrade}
            onChange={(e) => setTradeSetup(prev => ({ ...prev, riskPerTrade: Number(e.target.value) }))}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white ${currentColors.ring} ${currentColors.border}`}
            style={{ color: '#111827', fontWeight: '500' }}
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 1-2% for most strategies</p>
        </div>
      </div>

      {/* AI-Provided Trade Levels - Display from Analysis */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Price ($) 
            <span className="text-xs text-gray-500 ml-1">(from AI analysis)</span>
          </label>
          {hasValidAnalysis && parsedAnalysis?.entryPoint ? (
            <div 
              className={`w-full px-3 py-2 ${currentColors.bg} ${currentColors.borderColor} border rounded-lg font-bold text-xl`}
              style={{ 
                color: colorScheme === 'blue' ? '#1e40af' : 
                       colorScheme === 'green' ? '#166534' : '#991b1b' 
              }}
            >
              ${parsedAnalysis.entryPoint.toFixed(2)}
            </div>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg italic" style={{ color: '#6b7280' }}>
              Waiting for AI analysis...
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stop Loss ($)
            <span className="text-xs text-gray-500 ml-1">(from AI analysis)</span>
          </label>
          {hasValidAnalysis && parsedAnalysis?.stopLoss ? (
            <div 
              className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-lg font-bold text-xl"
              style={{ color: '#991b1b' }}
            >
              ${parsedAnalysis.stopLoss.toFixed(2)}
            </div>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 italic">
              Waiting for AI analysis...
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Take Profit ($)
            <span className="text-xs text-gray-500 ml-1">(from AI analysis)</span>
          </label>
          {hasValidAnalysis && parsedAnalysis?.target ? (
            <div 
              className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded-lg font-bold text-xl"
              style={{ color: '#166534' }}
            >
              ${parsedAnalysis.target.toFixed(2)}
            </div>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 italic">
              Waiting for AI analysis...
            </div>
          )}
        </div>
      </div>

      {/* Calculated Metrics */}
      {metrics && hasValidAnalysis && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Calculated Trade Metrics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#374151' }}>Risk Amount:</span>
              <span style={{ color: '#111827', fontWeight: '600' }}>${metrics.riskAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#374151' }}>Position Size:</span>
              <span style={{ color: '#111827', fontWeight: '600' }}>{metrics.positionSize} shares</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#374151' }}>Total Position:</span>
              <span style={{ color: '#111827', fontWeight: '600' }}>${metrics.totalPosition.toFixed(2)}</span>
            </div>
            {metrics.riskRewardRatio > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#374151' }}>Risk/Reward:</span>
                <span style={{ 
                  fontWeight: '600',
                  color: metrics.riskRewardRatio >= 2 ? '#059669' : 
                         metrics.riskRewardRatio >= 1.5 ? '#d97706' : '#dc2626'
                }}>
                  1:{metrics.riskRewardRatio.toFixed(2)}
                </span>
              </div>
            )}
            {metrics.potentialProfit > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#374151' }}>Potential Profit:</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>${metrics.potentialProfit.toFixed(2)}</span>
              </div>
            )}
            {parsedAnalysis?.confidence && (
              <div className="flex justify-between">
                <span style={{ color: '#374151' }}>AI Confidence:</span>
                <span style={{ 
                  fontWeight: '600',
                  color: parsedAnalysis.confidence === 'High' ? '#059669' :
                         parsedAnalysis.confidence === 'Medium' ? '#d97706' : '#dc2626'
                }}>
                  {parsedAnalysis.confidence}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Analysis Yet */}
      {!hasValidAnalysis && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-blue-600 text-lg mr-3">📊</span>
            <div>
              <h4 className="font-medium text-blue-800">Ready for Analysis</h4>
              <p className="text-blue-700 text-sm">
                Upload a chart to get AI-powered entry, stop loss, and target recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}