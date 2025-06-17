// app/api/user/analyses/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const tradingStyle = searchParams.get("tradingStyle"); // optional filter

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Build where clause
    const whereClause: any = { userId };
    if (tradingStyle && tradingStyle !== "all") {
      whereClause.tradingStyle = tradingStyle;
    }

    // Get user's analyses
    const analyses = await prisma.chartAnalysis.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        imageName: true,
        imageSize: true,
        tradingStyle: true,
        pattern: true,
        confidence: true,
        timeframe: true,
        trend: true,
        entryPoint: true,
        stopLoss: true,
        target: true,
        riskReward: true,
        explanation: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get total count for pagination
    const totalCount = await prisma.chartAnalysis.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      analyses,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user analyses:", error);
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST endpoint to create new analysis
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, imageName, imageSize, tradingStyle, pattern, confidence, timeframe, trend, entryPoint, stopLoss, target, riskReward, explanation, fullAnalysis } = body;

    if (!userId || !imageName || !tradingStyle) {
      return NextResponse.json(
        {
          error: "Missing required fields: userId, imageName, tradingStyle",
        },
        { status: 400 }
      );
    }

    // Check user's usage limits before creating
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true, analysesUsed: true, lastResetDate: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check daily reset
    const today = new Date().toISOString().split("T")[0];
    let currentUsage = user.analysesUsed;

    if (user.lastResetDate !== today) {
      // Reset usage for new day
      await prisma.user.update({
        where: { id: userId },
        data: {
          analysesUsed: 0,
          lastResetDate: today,
        },
      });
      currentUsage = 0;
    }

    // Check if user can create more analyses
    if (!user.isPremium && currentUsage >= 3) {
      return NextResponse.json(
        {
          error: "Daily analysis limit reached. Upgrade to premium for unlimited analyses.",
        },
        { status: 403 }
      );
    }

    // Create the analysis
    const analysis = await prisma.chartAnalysis.create({
      data: {
        userId,
        imageName,
        imageSize: imageSize || 0,
        tradingStyle,
        pattern,
        confidence,
        timeframe,
        trend,
        entryPoint,
        stopLoss,
        target,
        riskReward,
        explanation,
        fullAnalysis: fullAnalysis || "",
      },
    });

    // Increment user's usage count
    await prisma.user.update({
      where: { id: userId },
      data: {
        analysesUsed: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error creating analysis:", error);
    return NextResponse.json({ error: "Failed to create analysis" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
