// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true, // Real name (from registration)
        displayName: true, // Display name (for public display)
        email: true,
        timezone: true,
        tradingBio: true,
        isPremium: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { displayName, timezone, tradingBio } = await request.json();

    // Validate input
    if (!displayName || displayName.trim().length === 0) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    }

    if (displayName.length > 100) {
      return NextResponse.json({ error: "Display name too long" }, { status: 400 });
    }

    if (tradingBio && tradingBio.length > 500) {
      return NextResponse.json({ error: "Trading bio too long" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        displayName: displayName.trim(), // Update display name, NOT the real name
        timezone: timezone || "Eastern Time (ET)",
        tradingBio: tradingBio?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        timezone: true,
        tradingBio: true,
        isPremium: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
