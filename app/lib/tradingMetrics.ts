// app/lib/tradingMetrics.ts
import { prisma } from "./prisma";

export interface TradingMetrics {
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

/**
 * Get all trading metrics for a user including detailed breakdown
 */
export async function getUserTradingMetrics(userId: string): Promise<TradingMetrics> {
  const [user, analysisStats] = await Promise.all([
    // Get user metrics
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        analysesUsed: true,
        totalTrades: true,
        winningTrades: true,
        totalProfit: true,
        totalLoss: true,
        lessonsCompleted: true,
      },
    }),
    // Get analysis breakdown stats
    prisma.chartAnalysis.groupBy({
      by: ["tradingStyle", "trend"],
      where: { userId },
      _count: true,
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  // Calculate basic metrics
  const winRate = user.totalTrades > 0 ? (user.winningTrades / user.totalTrades) * 100 : 0;
  const profitFactor = user.totalLoss > 0 ? user.totalProfit / user.totalLoss : 0;

  // Calculate breakdown metrics from analysis stats
  let swingAnalyses = 0;
  let dayAnalyses = 0;
  let scalpAnalyses = 0;
  let bullishCount = 0;
  let bearishCount = 0;
  let sidewaysCount = 0;

  analysisStats.forEach((stat) => {
    const count = stat._count;

    // Count by trading style
    switch (stat.tradingStyle) {
      case "swing":
        swingAnalyses += count;
        break;
      case "day":
        dayAnalyses += count;
        break;
      case "scalp":
        scalpAnalyses += count;
        break;
    }

    // Count by trend
    switch (stat.trend) {
      case "Bullish":
        bullishCount += count;
        break;
      case "Bearish":
        bearishCount += count;
        break;
      case "Sideways":
        sidewaysCount += count;
        break;
    }
  });

  return {
    tradesAnalyzed: user.analysesUsed,
    totalTrades: user.totalTrades,
    winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal
    profitFactor: Math.round(profitFactor * 100) / 100, // Round to 2 decimals
    lessonsCompleted: user.lessonsCompleted,
    swingAnalyses,
    dayAnalyses,
    scalpAnalyses,
    bullishCount,
    bearishCount,
    sidewaysCount,
  };
}

/**
 * Update metrics when a chart analysis is completed
 */
export async function incrementAnalysisCount(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      analysesUsed: {
        increment: 1,
      },
    },
  });
}

/**
 * Update metrics when a trade is closed
 */
export async function updateTradeMetrics(userId: string, isWin: boolean, profitLoss: number): Promise<void> {
  const updateData: any = {
    totalTrades: {
      increment: 1,
    },
  };

  if (isWin) {
    updateData.winningTrades = { increment: 1 };
    updateData.totalProfit = { increment: Math.abs(profitLoss) };
  } else {
    updateData.totalLoss = { increment: Math.abs(profitLoss) };
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
}

/**
 * Update metrics when a lesson is completed
 */
export async function incrementLessonCount(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lessonsCompleted: {
        increment: 1,
      },
    },
  });
}

/**
 * Create a new trade record
 */
export async function createTrade(tradeData: { userId: string; symbol: string; tradingStyle: string; entryPrice: number; stopLoss?: number; takeProfit?: number; quantity: number; notes?: string; analysisId?: string }) {
  return await prisma.trade.create({
    data: tradeData,
  });
}

/**
 * Close a trade and update metrics
 */
export async function closeTrade(tradeId: string, exitPrice: number, notes?: string): Promise<void> {
  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  const profitLoss = (exitPrice - trade.entryPrice) * trade.quantity;
  const isWin = profitLoss > 0;

  // Update trade record
  await prisma.trade.update({
    where: { id: tradeId },
    data: {
      exitPrice,
      exitDate: new Date(),
      status: "closed",
      isWin,
      profitLoss,
      notes,
    },
  });

  // Update user metrics
  await updateTradeMetrics(trade.userId, isWin, profitLoss);
}

/**
 * Get trade history for a user
 */
export async function getUserTrades(userId: string) {
  return await prisma.trade.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Reset metrics (for testing or admin purposes)
 */
export async function resetUserMetrics(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalTrades: 0,
      winningTrades: 0,
      totalProfit: 0.0,
      totalLoss: 0.0,
      lessonsCompleted: 0,
    },
  });
}
