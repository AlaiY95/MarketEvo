// app/lib/gtag.ts

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface UTMData {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
}

// Basic tracking functions
export const pageview = (url: string): void => {
  if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: EventParams): void => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });

    // Debug logging
    console.log("📊 Analytics Event:", { action, category, label, value });
  } else {
    console.log("⚠️ gtag not available, event not sent:", { action, category, label, value });
  }
};

// UTM Parameter Tracking
export const trackUTMParameters = (): void => {
  if (typeof window === "undefined") return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmData: UTMData = {
    source: urlParams.get("utm_source"),
    medium: urlParams.get("utm_medium"),
    campaign: urlParams.get("utm_campaign"),
    content: urlParams.get("utm_content"),
    term: urlParams.get("utm_term"),
  };

  // Only track if we have UTM parameters
  if (Object.values(utmData).some((value) => value !== null)) {
    event({
      action: "utm_tracking",
      category: "acquisition",
      label: `${utmData.source || "unknown"}_${utmData.medium || "unknown"}`,
      value: 1,
    });

    // Store UTM data for conversion attribution
    sessionStorage.setItem("utm_data", JSON.stringify(utmData));
    console.log("🎯 UTM Parameters tracked:", utmData);
  } else {
    console.log("🎯 No UTM parameters found");
  }
};

// CTA Click Tracking
export const trackCTAClick = (ctaName: string, location: string = "unknown", utmCampaign?: string | null, utmContent?: string | null): void => {
  event({
    action: "cta_click",
    category: "engagement",
    label: `${ctaName}_${location}_${utmCampaign || "unknown"}_${utmContent || "unknown"}`,
    value: 1,
  });
};

// Signup Conversion Tracking
export const trackSignup = (userId?: string | null, signupMethod: string = "unknown"): void => {
  const storedUTMData = sessionStorage.getItem("utm_data");
  const utmData: UTMData = storedUTMData ? JSON.parse(storedUTMData) : {};

  event({
    action: "sign_up",
    category: "conversion",
    label: `${utmData.source || "direct"}_${signupMethod}`,
    value: 1,
  });

  // Set user ID if provided
  if (userId && typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      user_id: userId,
    });
  }

  console.log("🎉 Signup tracked with UTM attribution:", utmData);
};

// Scroll Depth Tracking
export const trackScrollDepth = (percentage: number): void => {
  event({
    action: "scroll_depth",
    category: "engagement",
    label: `${percentage}%`,
    value: percentage,
  });
};

// Section View Tracking
export const trackSectionView = (sectionName: string): void => {
  event({
    action: "section_view",
    category: "engagement",
    label: sectionName,
    value: 1,
  });
};

// Pricing Toggle Tracking
export const trackPricingToggle = (planType: string): void => {
  event({
    action: "pricing_toggle",
    category: "engagement",
    label: planType,
    value: 1,
  });
};

// FAQ Interaction Tracking
export const trackFAQClick = (question: string): void => {
  event({
    action: "faq_click",
    category: "engagement",
    label: question.substring(0, 50), // Limit length for cleaner reports
    value: 1,
  });
};

// Navigation Click Tracking
export const trackNavClick = (navItem: string): void => {
  event({
    action: "nav_click",
    category: "navigation",
    label: navItem,
    value: 1,
  });
};

// Time on Page Tracking
export const trackTimeOnPage = (): (() => void) => {
  const startTime = Date.now();

  return () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    // Only track if user spent more than 10 seconds
    if (timeSpent > 10) {
      event({
        action: "time_on_page",
        category: "engagement",
        label: `${timeSpent}s`,
        value: timeSpent,
      });
    }
  };
};

// Enhanced debug mode
export const enableTrackingDebug = (): void => {
  console.log("🐛 Analytics Debug Mode Enabled");
  console.log("🐛 GA_TRACKING_ID:", GA_TRACKING_ID);
  console.log("🐛 gtag available:", typeof window !== "undefined" ? typeof window.gtag : "server-side");

  if (typeof window !== "undefined") {
    (window as any)._trackingDebug = true;
  }
};

// Comprehensive tracking test
export const testTracking = (): void => {
  console.log("🧪 Testing Analytics Setup...");
  console.log("🧪 Environment check:");
  console.log("  - GA_TRACKING_ID:", GA_TRACKING_ID);
  console.log("  - gtag function:", typeof window !== "undefined" ? typeof window.gtag : "server-side");
  console.log("  - dataLayer:", typeof window !== "undefined" ? window.dataLayer : "server-side");

  // Test basic event
  event({
    action: "test_event",
    category: "debug",
    label: "tracking_test",
    value: 1,
  });

  // Test UTM tracking
  trackUTMParameters();

  // Test CTA click
  trackCTAClick("test_cta", "test_location");

  console.log("✅ Test events sent! Check:");
  console.log("  1. Browser console for event logs");
  console.log("  2. Network tab for google-analytics.com requests");
  console.log("  3. GA4 Real-Time reports (may take 1-2 minutes)");
};

// Check if tracking is properly initialized
export const isTrackingReady = (): boolean => {
  if (typeof window === "undefined") return false;

  const hasGtag = typeof window.gtag === "function";
  const hasTrackingId = !!GA_TRACKING_ID;
  const hasDataLayer = Array.isArray(window.dataLayer);

  console.log("🔍 Tracking readiness check:");
  console.log("  - gtag function:", hasGtag);
  console.log("  - tracking ID:", hasTrackingId);
  console.log("  - dataLayer:", hasDataLayer);

  return hasGtag && hasTrackingId && hasDataLayer;
};

// Export for easier testing
export const trackingUtils = {
  enableTrackingDebug,
  testTracking,
  isTrackingReady,
};
