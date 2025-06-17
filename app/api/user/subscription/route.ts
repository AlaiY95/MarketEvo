// app/api/user/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// GET - Fetch user's subscription details
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If no subscription ID, return null
    if (!user.stripeSubscriptionId) {
      return NextResponse.json({ subscription: null });
    }

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
      expand: ["items.data.price.product"],
    });

    // Format subscription data
    const subscriptionData = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      plan: {
        id: subscription.items.data[0].price.id,
        name: (subscription.items.data[0].price.product as any)?.name || "Premium Plan",
        description: (subscription.items.data[0].price.product as any)?.description,
        amount: subscription.items.data[0].price.unit_amount || 0,
        currency: subscription.items.data[0].price.currency,
        interval: subscription.items.data[0].price.recurring?.interval || "month",
        intervalCount: subscription.items.data[0].price.recurring?.interval_count || 1,
      },
    };

    return NextResponse.json({ subscription: subscriptionData });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

// DELETE - Cancel subscription at period end
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.stripeSubscriptionId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscriptionStatus: subscription.status,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}

// PATCH - Reactivate subscription (remove cancel_at_period_end)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.stripeSubscriptionId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    // Reactivate subscription
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update user in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscriptionStatus: subscription.status,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json({ error: "Failed to reactivate subscription" }, { status: 500 });
  }
}
