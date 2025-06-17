// app/api/support/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create new support ticket
export async function POST(request: Request) {
  try {
    const { userId, email, reason, subject, message } = await request.json();

    if (!email || !reason || !subject || !message) {
      return NextResponse.json(
        {
          error: "Missing required fields: email, reason, subject, message",
        },
        { status: 400 }
      );
    }

    // Determine priority based on reason
    let priority = "normal";
    if (reason.includes("Urgent") || subject.toLowerCase().includes("urgent")) {
      priority = "urgent";
    } else if (reason === "Technical Issue" || reason === "Account Problem") {
      priority = "high";
    } else if (reason === "Feature Request") {
      priority = "low";
    }

    // Create support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: userId || null,
        email,
        reason,
        subject,
        message,
        priority,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Get support tickets (for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const whereClause: any = {};
    if (status !== "all") {
      whereClause.status = status;
    }

    // Get tickets with user info
    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      orderBy: [
        { priority: "desc" }, // urgent first
        { createdAt: "desc" }, // newest first
      ],
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            isPremium: true,
          },
        },
      },
    });

    // Get total count
    const totalCount = await prisma.supportTicket.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      tickets,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
