// app/api/user/usage/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        email: true,
        isPremium: true,
        analysesUsed: true,
        lastResetDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if we need to reset daily usage (but DON'T increment)
    const today = new Date().toDateString(); // Use toDateString() to match your register route format
    let updatedUser = user;

    if (user.lastResetDate !== today) {
      // Reset usage for new day - ONLY reset, don't increment
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          analysesUsed: 0,
          lastResetDate: today,
        },
        select: {
          id: true,
          email: true,
          isPremium: true,
          analysesUsed: true,
          lastResetDate: true,
          createdAt: true,
        },
      });
    }

    // Define usage limits
    const maxAnalyses = updatedUser.isPremium ? 999 : 3;
    const remainingAnalyses = Math.max(0, maxAnalyses - updatedUser.analysesUsed);

    return NextResponse.json({
      success: true,
      usage: {
        ...updatedUser,
        maxAnalyses,
        remainingAnalyses,
        canAnalyze: updatedUser.isPremium || updatedUser.analysesUsed < maxAnalyses,
      },
    });
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 });
  }
}
