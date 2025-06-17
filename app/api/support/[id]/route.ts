// app/api/support/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Update individual support ticket
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const ticketId = params.id;

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
    }

    if (!status || !["open", "in-progress", "closed"].includes(status)) {
      return NextResponse.json(
        {
          error: "Valid status required (open, in-progress, closed)",
        },
        { status: 400 }
      );
    }

    // Update the ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
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

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating support ticket:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
