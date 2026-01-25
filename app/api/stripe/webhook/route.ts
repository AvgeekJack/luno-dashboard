import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Webhook secret for signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable body parsing for raw body access (required for Stripe signature verification)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Get the raw body as a buffer
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('[Webhook] Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      const error = err as Error;
      console.error('[Webhook] Signature verification failed:', error.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${error.message}` },
        { status: 400 }
      );
    }

    console.log(`[Webhook] Received event: ${event.type}`);

    // Connect to MongoDB
    await dbConnect();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get serverId from metadata
        const serverId = session.metadata?.serverId;
        
        if (!serverId) {
          console.error('[Webhook] Missing serverId in session metadata');
          return NextResponse.json(
            { error: 'Missing serverId in metadata' },
            { status: 400 }
          );
        }

        // Get subscription details
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        console.log(`[Webhook] Activating premium for server: ${serverId}`);
        console.log(`[Webhook] Subscription ID: ${subscriptionId}`);
        console.log(`[Webhook] Customer ID: ${customerId}`);

        // Update or create server settings with premium activated
        const result = await ServerSettings.findOneAndUpdate(
          { guildId: serverId },
          {
            $set: {
              premium: true,
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
            },
          },
          { 
            upsert: true, 
            new: true,
            runValidators: false // Skip validators on upsert for performance
          }
        );

        console.log(`[Webhook] Premium activated for server: ${serverId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        console.log(`[Webhook] Subscription deleted: ${subscriptionId}`);

        // Find and update the server with this subscription
        const result = await ServerSettings.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          {
            $set: {
              premium: false,
              stripeSubscriptionId: null,
            },
          },
          { new: true }
        );

        if (result) {
          console.log(`[Webhook] Premium deactivated for server: ${result.guildId}`);
        } else {
          console.warn(`[Webhook] No server found with subscription: ${subscriptionId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string | undefined;

        if (!subscriptionId) {
          console.warn('[Webhook] No subscription ID found in invoice');
          break;
        }

        console.log(`[Webhook] Payment failed for subscription: ${subscriptionId}`);

        // Find and update the server with this subscription
        const result = await ServerSettings.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          {
            $set: {
              premium: false,
            },
          },
          { new: true }
        );

        if (result) {
          console.log(`[Webhook] Premium deactivated due to payment failure for server: ${result.guildId}`);
        } else {
          console.warn(`[Webhook] No server found with subscription: ${subscriptionId}`);
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
