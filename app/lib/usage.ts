// app/lib/usage.ts
// Client-side utility functions that call API endpoints instead of using Prisma directly

export async function getUserUsage(userId: string) {
  try {
    const response = await fetch(`/api/user/usage?userId=${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user usage");
    }

    return data.usage;
  } catch (error) {
    console.error("Error getting user usage:", error);
    throw error;
  }
}

export async function getUserAnalyses(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    tradingStyle?: string;
  } = {}
) {
  try {
    const params = new URLSearchParams({
      userId,
      ...(options.limit && { limit: options.limit.toString() }),
      ...(options.offset && { offset: options.offset.toString() }),
      ...(options.tradingStyle && { tradingStyle: options.tradingStyle }),
    });

    const response = await fetch(`/api/user/analyses?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user analyses");
    }

    return data;
  } catch (error) {
    console.error("Error getting user analyses:", error);
    throw error;
  }
}

export async function createAnalysis(analysisData: {
  userId: string;
  imageName: string;
  imageSize?: number;
  tradingStyle: string;
  pattern?: string;
  confidence?: string;
  timeframe?: string;
  trend?: string;
  entryPoint?: number;
  stopLoss?: number;
  target?: number;
  riskReward?: string;
  explanation?: string;
  fullAnalysis?: string;
}) {
  try {
    const response = await fetch("/api/user/analyses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analysisData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create analysis");
    }

    return data.analysis;
  } catch (error) {
    console.error("Error creating analysis:", error);
    throw error;
  }
}

// Helper function to check if user can perform more analyses
export function canUserAnalyze(usage: any): boolean {
  return usage.isPremium || usage.analysesUsed < usage.maxAnalyses;
}

// Helper function to get remaining analyses for free users
export function getRemainingAnalyses(usage: any): number {
  if (usage.isPremium) return 999; // "Unlimited"
  return Math.max(0, usage.maxAnalyses - usage.analysesUsed);
}
