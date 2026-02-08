import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function POST(
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

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(
      serverSettings.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    const sub = subscription as any;

    return NextResponse.json({
      success: true,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      currentPeriodEnd: sub.current_period_end,
    });

  } catch (error) {
    console.error('[Subscription] Error canceling subscription:', error);
    return NextResponse.json(
      { 
        error: 'Failed to cancel subscription',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
