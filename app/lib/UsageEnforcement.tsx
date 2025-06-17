// app/lib/usageEnforcement.ts
import { prisma } from "@/lib/prisma";

export interface UsageResult {
  allowed: boolean;
  remaining?: number;
  resetDate?: Date;
  reason?: 'premium' | 'within_limit' | 'limit_exceeded' | 'grace_period';
  message?: string;
}

export interface UsageLimits {
  free: {
    daily: number;
    monthly: number;
  };
  premium: {
    daily: number; // -1 means unlimited
    monthly: number; // -1 means unlimited
  };
  gracePeriod: {
    days: number;
    analyses: number;
  };
}

// Default usage limits - easily configurable
export const USAGE_LIMITS: UsageLimits = {
  free: {
    daily: 3,
    monthly: 10,
  },
  premium: {
    daily: -1, // unlimited
    monthly: -1, // unlimited
  },
  gracePeriod: {
    days: 3, // 3 days grace period after subscription ends
    analyses: 5, // 5 analyses during grace period
  },
};

export async function checkUsagePermission(
  userEmail: string,
  analysisType: string = 'chart_analysis'
): Promise<UsageResult> {
  try {
    // Get user with analyses data
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        analyses: {
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today
            },
            // Use analysisType to filter by trading style if needed
            ...(analysisType !== 'chart_analysis' && { tradingStyle: analysisType }),
          },
        },
      },
    });

    if (!user) {
      return {
        allowed: false,
        reason: 'limit_exceeded',
        message: 'User not found',
      };
    }

    // Check if user is premium
    if (user.isPremium) {
      return {
        allowed: true,
        reason: 'premium',
        message: 'Premium user - unlimited access',
      };
    }

    // Check if user is in grace period (recently downgraded)
    const graceResult = await checkGracePeriod(user);
    if (graceResult.allowed) {
      return graceResult;
    }

    // Get usage counts using your existing schema
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [dailyUsage, monthlyUsage] = await Promise.all([
      getDailyUsage(user.id, analysisType),
      getMonthlyUsage(user.id, startOfMonth, analysisType),
    ]);

    // Check daily limit
    if (dailyUsage >= USAGE_LIMITS.free.daily) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      return {
        allowed: false,
        remaining: 0,
        resetDate: tomorrow,
        reason: 'limit_exceeded',
        message: `Daily limit of ${USAGE_LIMITS.free.daily} analyses reached. Resets tomorrow.`,
      };
    }

    // Check monthly limit
    if (monthlyUsage >= USAGE_LIMITS.free.monthly) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

      return {
        allowed: false,
        remaining: 0,
        resetDate: nextMonth,
        reason: 'limit_exceeded',
        message: `Monthly limit of ${USAGE_LIMITS.free.monthly} analyses reached. Resets next month.`,
      };
    }

    // Calculate remaining
    const dailyRemaining = USAGE_LIMITS.free.daily - dailyUsage;
    const monthlyRemaining = USAGE_LIMITS.free.monthly - monthlyUsage;
    const remaining = Math.min(dailyRemaining, monthlyRemaining);

    return {
      allowed: true,
      remaining,
      reason: 'within_limit',
      message: `${remaining} analyses remaining today`,
    };

  } catch (error) {
    console.error('Error checking usage permission:', error);
    return {
      allowed: false,
      reason: 'limit_exceeded',
      message: 'Error checking usage limits',
    };
  }
}

async function checkGracePeriod(user: any): Promise<UsageResult> {
  // If user was never premium, no grace period
  if (!user.subscriptionPeriodEnd) {
    return { allowed: false };
  }

  const now = new Date();
  const graceEndDate = new Date(user.subscriptionPeriodEnd);
  graceEndDate.setDate(graceEndDate.getDate() + USAGE_LIMITS.gracePeriod.days);

  // Check if still in grace period
  if (now <= graceEndDate) {
    // Check grace period usage
    const gracePeriodUsage = await getGracePeriodUsage(user.id, user.subscriptionPeriodEnd);
    
    if (gracePeriodUsage < USAGE_LIMITS.gracePeriod.analyses) {
      const remaining = USAGE_LIMITS.gracePeriod.analyses - gracePeriodUsage;
      
      return {
        allowed: true,
        remaining,
        reason: 'grace_period',
        message: `Grace period: ${remaining} analyses remaining until ${graceEndDate.toLocaleDateString()}`,
      };
    }
  }

  return { allowed: false };
}

// Using your existing ChartAnalysis table
async function getDailyUsage(userId: string, analysisType?: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const whereClause: any = {
    userId,
    createdAt: {
      gte: today,
      lt: tomorrow,
    },
  };

  // Optional: Filter by analysis type (trading style)
  if (analysisType && analysisType !== 'chart_analysis') {
    whereClause.tradingStyle = analysisType;
  }

  const count = await prisma.chartAnalysis.count({
    where: whereClause,
  });

  return count;
}

async function getMonthlyUsage(userId: string, startOfMonth: Date, analysisType?: string): Promise<number> {
  const nextMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1);

  const whereClause: any = {
    userId,
    createdAt: {
      gte: startOfMonth,
      lt: nextMonth,
    },
  };

  // Optional: Filter by analysis type (trading style)
  if (analysisType && analysisType !== 'chart_analysis') {
    whereClause.tradingStyle = analysisType;
  }

  const count = await prisma.chartAnalysis.count({
    where: whereClause,
  });

  return count;
}

async function getGracePeriodUsage(userId: string, subscriptionEndDate: Date): Promise<number> {
  const count = await prisma.chartAnalysis.count({
    where: {
      userId,
      createdAt: {
        gte: subscriptionEndDate,
      },
    },
  });

  return count;
}

// Record usage after successful analysis
export async function recordUsage(
  userId: string,
  analysisType: string = 'chart_analysis'
): Promise<void> {
  try {
    // Update the existing analysesUsed counter
    await prisma.user.update({
      where: { id: userId },
      data: {
        analysesUsed: {
          increment: 1,
        },
        // Update lastResetDate if it's a new day/month
        lastResetDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      },
    });

    console.log(`✅ Usage recorded for user ${userId} (type: ${analysisType})`);
  } catch (error) {
    console.error('Error recording usage:', error);
    // Don't throw error - usage recording shouldn't break the analysis
  }
}

// Helper function to get usage summary for UI
export async function getUserUsageSummary(userEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return null;
    }

    if (user.isPremium) {
      return {
        isPremium: true,
        daily: { used: 0, limit: -1, remaining: -1 },
        monthly: { used: 0, limit: -1, remaining: -1 },
        message: 'Premium - Unlimited analyses',
      };
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [dailyUsage, monthlyUsage] = await Promise.all([
      getDailyUsage(user.id),
      getMonthlyUsage(user.id, startOfMonth),
    ]);

    return {
      isPremium: false,
      daily: {
        used: dailyUsage,
        limit: USAGE_LIMITS.free.daily,
        remaining: Math.max(0, USAGE_LIMITS.free.daily - dailyUsage),
      },
      monthly: {
        used: monthlyUsage,
        limit: USAGE_LIMITS.free.monthly,
        remaining: Math.max(0, USAGE_LIMITS.free.monthly - monthlyUsage),
      },
      message: `${Math.min(
        USAGE_LIMITS.free.daily - dailyUsage,
        USAGE_LIMITS.free.monthly - monthlyUsage
      )} analyses remaining`,
    };
  } catch (error) {
    console.error('Error getting usage summary:', error);
    return null;
  }
}