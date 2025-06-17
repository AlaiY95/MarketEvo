// app/api/user/can-analyze/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get user with usage data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isPremium: true,
        analysesUsed: true,
        lastResetDate: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if we need to reset daily usage
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    let currentAnalysesUsed = user.analysesUsed;

    if (user.lastResetDate !== today) {
      // Reset usage for new day
      await prisma.user.update({
        where: { id: userId },
        data: {
          analysesUsed: 0,
          lastResetDate: today,
        },
      });
      currentAnalysesUsed = 0;
    }

    // Define usage limits
    const maxAnalyses = user.isPremium ? 999 : 3; // Premium gets "unlimited" (999), free gets 3
    const canAnalyze = user.isPremium || currentAnalysesUsed < maxAnalyses;

    return NextResponse.json({
      success: true,
      canAnalyze: canAnalyze,
      analysesUsed: currentAnalysesUsed,
      maxAnalyses: maxAnalyses,
      isPremium: user.isPremium,
    });
  } catch (error) {
    console.error("Error checking if user can analyze:", error);
    return NextResponse.json({ error: "Failed to check analysis permission" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
