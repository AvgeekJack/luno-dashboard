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

    // Return subscription details
    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: (subscription as any).current_period_start,
      currentPeriodEnd: (subscription as any).current_period_end,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      canceledAt: (subscription as any).canceled_at,
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
