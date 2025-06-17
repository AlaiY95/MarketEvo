// app/api/user/reset-usage/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset usage counter and update reset date
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        analysesUsed: 0,
        lastResetDate: today,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        analysesUsed: updatedUser.analysesUsed,
        lastResetDate: updatedUser.lastResetDate,
      },
    });
  } catch (error) {
    console.error("Error resetting usage:", error);
    return NextResponse.json({ error: "Failed to reset usage" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
