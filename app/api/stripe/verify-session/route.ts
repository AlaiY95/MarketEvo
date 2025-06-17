// app/api/stripe/verify-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify the session belongs to the current user
    if (checkoutSession.customer_email !== session.user.email) {
      return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
    }

    // Check if payment was successful
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "Payment not completed",
          status: checkoutSession.payment_status,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      session: {
        id: checkoutSession.id,
        paymentStatus: checkoutSession.payment_status,
        customerEmail: checkoutSession.customer_email,
        amountTotal: checkoutSession.amount_total,
        currency: checkoutSession.currency,
      },
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 });
  }
}
