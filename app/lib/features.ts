// app/lib/features.ts
export const FEATURE_FLAGS = {
  // Toggle trade history premium requirement
  freeHistoryAccess: process.env.NEXT_PUBLIC_FREE_HISTORY === "true" || process.env.NODE_ENV === "development",

  // Other feature flags you might want
  enableScalpTrading: true,
  enableAdvancedAnalytics: false,
  enableEmailAlerts: false,

  // New feature flags for your project
  enableBulkAnalysis: false,
  enableExportFeature: false,
  enableTradingSignals: false,
};

export const isPremiumRequired = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return !FEATURE_FLAGS[feature];
};

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
};
