// app/api/dev/toggle-premium/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

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

    // Toggle premium status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: !user.isPremium,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
      },
    });
  } catch (error) {
    console.error("Error toggling premium:", error);
    return NextResponse.json({ error: "Failed to toggle premium" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
