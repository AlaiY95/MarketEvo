// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Utility function to safely convert Stripe timestamp to Date
function safeTimestampToDate(timestamp: number | null | undefined): Date | null {
  if (!timestamp || timestamp <= 0) {
    return null;
  }

  const date = new Date(timestamp * 1000);
  return isNaN(date.getTime()) ? null : date;
}

export async function POST(request: NextRequest) {
  console.log("🚀 Webhook received");
  console.log("🚀 Request URL:", request.url);
  console.log("🚀 User-Agent:", request.headers.get("user-agent"));

  // Check if request is coming through ngrok
  const isNgrok = request.headers.get("user-agent")?.includes("ngrok") || request.url.includes("ngrok");
  console.log("🌐 Request via ngrok:", isNgrok);

  let body: string;
  let signature: string | null;

  try {
    // For ngrok, we might need to handle the body differently
    if (isNgrok) {
      console.log("🌐 Handling ngrok request");
      const buffer = await request.arrayBuffer();
      body = new TextDecoder().decode(buffer);
    } else {
      body = await request.text();
    }

    signature = (await headers()).get("stripe-signature");
  } catch (error) {
    console.error("❌ Error reading request:", error);
    return NextResponse.json({ error: "Error reading request" }, { status: 400 });
  }

  console.log("📝 Body length:", body.length);
  console.log("📝 Body preview:", body.substring(0, 200) + "...");
  console.log("📝 Signature:", signature ? `Present (${signature.substring(0, 50)}...)` : "Missing");

  if (!signature) {
    console.error("❌ No Stripe signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  console.log("🔑 Webhook secret configured:", webhookSecret.substring(0, 10) + "...");

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("✅ Webhook signature verified successfully");
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      errorType: error instanceof Error ? error.constructor.name : "Unknown",
      webhookSecret: webhookSecret.substring(0, 15) + "...",
      signaturePreview: signature.substring(0, 50) + "...",
      bodyLength: body.length,
    });

    // Try to parse the signature header to see if it's malformed
    const sigElements = signature.split(",");
    console.log("🔍 Signature elements:", sigElements);

    return NextResponse.json(
      {
        error: "Invalid signature",
        debug: {
          webhookSecretPresent: !!webhookSecret,
          signaturePresent: !!signature,
          bodyLength: body.length,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 400 }
    );
  }

  console.log("🔔 Processing event:", event.type);
  console.log("🔔 Event ID:", event.id);

  try {
    let processed = false;

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("💳 Processing checkout session completed");
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        processed = true;
        break;
      }

      case "customer.subscription.created": {
        console.log("📅 Processing subscription created");
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        processed = true;
        break;
      }

      case "customer.subscription.updated": {
        console.log("🔄 Processing subscription updated");
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        processed = true;
        break;
      }

      case "customer.subscription.deleted": {
        console.log("❌ Processing subscription deleted");
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        processed = true;
        break;
      }

      case "invoice.payment_succeeded": {
        console.log("💰 Processing invoice payment succeeded");
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        processed = true;
        break;
      }

      case "invoice.payment_failed": {
        console.log("💸 Processing invoice payment failed");
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        processed = true;
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        // Don't throw an error for unhandled events - just acknowledge them
        processed = false;
    }

    console.log(`✅ Webhook ${processed ? "processed" : "acknowledged"} successfully`);
    return NextResponse.json({
      received: true,
      processed,
      eventType: event.type,
      eventId: event.id,
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace");

    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
        eventType: event.type,
        eventId: event.id,
      },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("📋 Checkout session details:", {
    id: session.id,
    customer: session.customer,
    customer_email: session.customer_email,
    customer_details: session.customer_details,
    mode: session.mode,
    payment_status: session.payment_status,
    metadata: session.metadata,
  });

  // Try multiple ways to get the customer email
  let customerEmail = session.customer_email;

  // If no customer_email, try customer_details.email
  if (!customerEmail && session.customer_details?.email) {
    customerEmail = session.customer_details.email;
    console.log("✅ Found customer email in customer_details:", customerEmail);
  }

  // If still no email and we have a customer ID, fetch from Stripe
  if (!customerEmail && session.customer) {
    try {
      console.log("📞 Fetching customer details from Stripe...");
      const customer = await stripe.customers.retrieve(session.customer as string);

      if ("deleted" in customer) {
        console.log("❌ Customer was deleted");
        return;
      }

      customerEmail = customer.email;
      if (customerEmail) {
        console.log("✅ Found customer email from Stripe customer object:", customerEmail);
      }
    } catch (error) {
      console.error("❌ Error fetching customer details:", error);
    }
  }

  // If we have metadata with userId, we can also use that as fallback
  if (!customerEmail && session.metadata?.userId) {
    console.log("🔍 No email found, but have userId in metadata:", session.metadata.userId);
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.metadata.userId },
      });

      if (user) {
        customerEmail = user.email;
        console.log("✅ Found customer email from userId metadata:", customerEmail);
      }
    } catch (error) {
      console.error("❌ Error finding user by metadata userId:", error);
    }
  }

  if (!customerEmail) {
    console.error("❌ Could not determine customer email from any source");
    console.log("📋 Available data:", {
      customer_email: session.customer_email,
      customer_details_email: session.customer_details?.email,
      customer_id: session.customer,
      metadata: session.metadata,
    });
    return; // Don't throw error, just skip processing
  }

  // Process the checkout with the found email
  await processCheckoutForEmail(session, customerEmail);
}

// Extracted the main processing logic
async function processCheckoutForEmail(session: Stripe.Checkout.Session, customerEmail: string) {
  console.log("🔄 Processing checkout for email:", customerEmail);

  try {
    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!existingUser) {
      console.error("❌ User not found with email:", customerEmail);

      // List existing users for debugging (remove in production)
      const userCount = await prisma.user.count();
      console.log("📊 Total users in database:", userCount);

      if (userCount < 10) {
        const allUsers = await prisma.user.findMany({
          select: { id: true, email: true, isPremium: true },
          take: 10,
        });
        console.log("📋 Sample users:", allUsers);
      }

      throw new Error(`User not found with email: ${customerEmail}`);
    }

    console.log("👤 Found existing user:", {
      id: existingUser.id,
      email: existingUser.email,
      isPremium: existingUser.isPremium,
    });

    // Update user to premium
    const updatedUser = await prisma.user.update({
      where: { email: customerEmail },
      data: {
        isPremium: true,
        stripeCustomerId: session.customer as string,
      },
    });

    console.log(`✅ User ${customerEmail} upgraded to premium`);
  } catch (error) {
    console.error("❌ Database error in processCheckoutForEmail:", error);
    throw error;
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("📅 Subscription details:", {
    id: subscription.id,
    customer: subscription.customer,
    status: subscription.status,
    current_period_end: subscription.current_period_end,
  });

  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if ("deleted" in customer) {
      throw new Error("Customer was deleted");
    }

    if (!customer.email) {
      throw new Error("Customer has no email");
    }

    console.log("📧 Customer email:", customer.email);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (!existingUser) {
      console.error("❌ User not found with email:", customer.email);
      throw new Error(`User not found with email: ${customer.email}`);
    }

    // Validate the current_period_end timestamp using utility function
    const subscriptionPeriodEnd = safeTimestampToDate(subscription.current_period_end);

    const updatedUser = await prisma.user.update({
      where: { email: customer.email },
      data: {
        isPremium: true,
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        ...(subscriptionPeriodEnd && { subscriptionPeriodEnd }),
      },
    });

    console.log(`✅ Subscription created for ${customer.email}`);
  } catch (error) {
    console.error("❌ Error in handleSubscriptionCreated:", error);
    throw error;
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("🔄 Subscription update details:", {
    id: subscription.id,
    status: subscription.status,
    current_period_end: subscription.current_period_end,
  });

  try {
    // First try to find user by subscription ID
    let user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    // If not found by subscription ID, try to find by customer ID
    if (!user) {
      console.log("🔍 User not found by subscription ID, trying customer ID...");

      try {
        const customer = await stripe.customers.retrieve(subscription.customer as string);

        if ("deleted" in customer || !customer.email) {
          console.log("❌ Customer deleted or no email");
          return; // Skip this webhook gracefully
        }

        user = await prisma.user.findUnique({
          where: { email: customer.email },
        });

        if (user) {
          console.log("✅ Found user by customer email, updating subscription ID");
          // Update user with the subscription ID for future webhooks
          user = await prisma.user.update({
            where: { id: user.id },
            data: { stripeSubscriptionId: subscription.id },
          });
        }
      } catch (customerError) {
        console.error("❌ Error fetching customer:", customerError);
      }
    }

    if (!user) {
      console.error("❌ User not found for subscription:", subscription.id);
      console.log("ℹ️ Skipping this webhook - user may have been created after subscription");
      return; // Don't throw error, just skip
    }

    // Validate the current_period_end timestamp using utility function
    const subscriptionPeriodEnd = safeTimestampToDate(subscription.current_period_end);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium: subscription.status === "active",
        subscriptionStatus: subscription.status,
        ...(subscriptionPeriodEnd && { subscriptionPeriodEnd }),
      },
    });

    console.log(`✅ Subscription updated for user ${user.email}: ${subscription.status}`);
  } catch (error) {
    console.error("❌ Error in handleSubscriptionUpdated:", error);
    throw error;
  }
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("❌ Subscription deletion details:", {
    id: subscription.id,
    status: subscription.status,
  });

  try {
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!user) {
      console.error("❌ User not found for subscription:", subscription.id);
      throw new Error(`User not found for subscription: ${subscription.id}`);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium: false,
        subscriptionStatus: "canceled",
        stripeSubscriptionId: null,
      },
    });

    console.log(`✅ Subscription canceled for user ${user.email}`);
  } catch (error) {
    console.error("❌ Error in handleSubscriptionDeleted:", error);
    throw error;
  }
}

// Handle successful payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("💰 Invoice payment details:", {
    id: invoice.id,
    customer: invoice.customer,
    customer_email: invoice.customer_email,
    subscription: invoice.subscription,
    amount_paid: invoice.amount_paid,
    status: invoice.status,
  });

  try {
    let customerEmail = invoice.customer_email;

    // If no customer_email on invoice, fetch from customer object
    if (!customerEmail && invoice.customer) {
      console.log("📞 Fetching customer details from Stripe...");
      const customer = await stripe.customers.retrieve(invoice.customer as string);

      if ("deleted" in customer) {
        console.log("ℹ️ Customer was deleted, skipping");
        return;
      }

      customerEmail = customer.email;
    }

    if (!customerEmail) {
      console.log("ℹ️ No customer email found, skipping");
      return;
    }

    console.log("📧 Processing payment for email:", customerEmail);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!user) {
      console.error("❌ User not found with email:", customerEmail);
      throw new Error(`User not found with email: ${customerEmail}`);
    }

    console.log("👤 Found user:", {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
    });

    // Update user to premium if not already
    if (!user.isPremium) {
      await prisma.user.update({
        where: { email: customerEmail },
        data: {
          isPremium: true,
          stripeCustomerId: invoice.customer as string,
        },
      });
      console.log(`✅ User ${customerEmail} marked as premium`);
    } else {
      console.log(`ℹ️ User ${customerEmail} already premium`);
    }
  } catch (error) {
    console.error("❌ Error in handleInvoicePaymentSucceeded:", error);
    throw error;
  }
}

// Handle failed payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("💸 Invoice payment failed:", {
    id: invoice.id,
    customer: invoice.customer,
    amount_due: invoice.amount_due,
  });

  // Just log for now - implement grace period logic as needed
  console.log("ℹ️ Payment failed - implement grace period logic if needed");
}
