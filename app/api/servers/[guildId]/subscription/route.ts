import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { guildId } = await params;

    // Connect to database
    await dbConnect();

    // Get server settings
    const serverSettings = await ServerSettings.findOne({ guildId });

    if (!serverSettings || !serverSettings.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      serverSettings.stripeSubscriptionId
    );

    // Cast to access properties
    const sub = subscription as any;

    console.log('[Subscription API] Raw Stripe data:', {
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      cancel_at_period_end: sub.cancel_at_period_end,
    });

    // Return subscription details with explicit number conversion
    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: Number(sub.current_period_start),
      currentPeriodEnd: Number(sub.current_period_end),
      cancelAtPeriodEnd: sub.cancel_at_period_end || false,
      canceledAt: sub.canceled_at ? Number(sub.canceled_at) : null,
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      currency: subscription.items.data[0]?.price.currency || 'usd',
      interval: subscription.items.data[0]?.price.recurring?.interval || 'month',
    });

  } catch (error) {
    console.error('[Subscription] Error fetching subscription:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch subscription',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
