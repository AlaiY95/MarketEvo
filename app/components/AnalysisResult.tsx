// app/components/AnalysisResult.tsx
import { ChartAnalysis } from '@/lib/types';

interface AnalysisResultProps {
  analysis: ChartAnalysis;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Bullish': return 'text-green-600';
      case 'Bearish': return 'text-red-600';
      case 'Sideways': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Function to format the explanation text with proper line breaks and heading styles
  const formatExplanation = (text: string) => {
    // First, let's clean up the original text to remove inconsistent spacing around headings
    let cleaned = text
      // Remove any existing line breaks around common headings
      .replace(/\s*(Key points?[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Key risks? to monitor[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Strategy[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Risk management[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Entry strategy[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Exit strategy[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Technical analysis[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Market outlook[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Trading plan[:\s]*)\s*\n*/gi, ' $1 ')
      .replace(/\s*(Important notes?[:\s]*)\s*\n*/gi, ' $1 ');

    // Now format consistently
    let formatted = cleaned
      // Add line breaks before numbered points
      .replace(/(\d+\.\s)/g, '\n$1')
      // Add line breaks before bullet points
      .replace(/([•·-]\s)/g, '\n$1')
      // Add line breaks before common headings and wrap them in bold tags
      .replace(/(Key points?[:\s]*)/gi, '\n**$1**')
      .replace(/(Key risks? to monitor[:\s]*)/gi, '\n**$1**')
      .replace(/(Strategy[:\s]*)/gi, '\n**$1**')
      .replace(/(Risk management[:\s]*)/gi, '\n**$1**')
      .replace(/(Entry strategy[:\s]*)/gi, '\n**$1**')
      .replace(/(Exit strategy[:\s]*)/gi, '\n**$1**')
      .replace(/(Technical analysis[:\s]*)/gi, '\n**$1**')
      .replace(/(Market outlook[:\s]*)/gi, '\n**$1**')
      .replace(/(Trading plan[:\s]*)/gi, '\n**$1**')
      .replace(/(Important notes?[:\s]*)/gi, '\n**$1**')
      // Add line breaks before "Consider" or "Given" at start of sentences
      .replace(/\.\s+(Consider|Given|The|This)/g, '.\n$1')
      // Clean up multiple line breaks
      .replace(/\n\s*\n/g, '\n')
      // Remove leading line break
      .replace(/^\n/, '');

    return formatted;
  };

  // Function to render formatted text with bold headings
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is a heading - remove ** and make it bold with color
        const heading = part.slice(2, -2);
        return (
          <span key={index} className="font-bold text-gray-900 block mt-3 mb-0">
            {heading}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chart Analysis</h2>
      
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Pattern</h3>
          <p className="text-lg font-medium text-blue-700">{analysis.pattern}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Confidence</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(analysis.confidence)}`}>
            {analysis.confidence}
          </span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Trend</h3>
          <p className={`text-lg font-medium ${getTrendColor(analysis.trend)}`}>
            {analysis.trend}
          </p>
        </div>
      </div>

      {/* Trading Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-3">Entry & Targets</h3>
          <div className="space-y-2">
            {analysis.entryPoint && (
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Point:</span>
                <span className="font-medium text-green-700">{analysis.entryPoint}</span>
              </div>
            )}
            {analysis.target && (
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium text-green-700">{analysis.target}</span>
              </div>
            )}
            {analysis.riskReward && (
              <div className="flex justify-between">
                <span className="text-gray-600">Risk:Reward:</span>
                <span className="font-medium text-blue-700">{analysis.riskReward}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-3">Risk Management</h3>
          <div className="space-y-2">
            {analysis.stopLoss && (
              <div className="flex justify-between">
                <span className="text-gray-600">Stop Loss:</span>
                <span className="font-medium text-red-700">{analysis.stopLoss}</span>
              </div>
            )}
            {analysis.timeframe && (
              <div className="flex justify-between">
                <span className="text-gray-600">Timeframe:</span>
                <span className="font-medium text-gray-700">{analysis.timeframe}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-1">Analysis Explanation</h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {renderFormattedText(formatExplanation(analysis.explanation))}
        </div>
      </div>
    </div>
  );
}