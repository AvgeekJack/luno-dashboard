import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[Checkout] Missing STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Stripe secret key' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID) {
      console.error('[Checkout] Missing STRIPE_PRICE_ID');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Stripe price ID' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID_YEARLY) {
      console.error('[Checkout] Missing STRIPE_PRICE_ID_YEARLY');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Stripe yearly price ID' },
        { status: 500 }
      );
    }

    // Initialize Stripe at runtime
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('[Checkout] Unauthorized request');
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get serverId and billingType from request body
    const { serverId, billingType = 'monthly' } = await req.json();

    if (!serverId) {
      console.error('[Checkout] Missing serverId in request');
      return NextResponse.json(
        { error: 'serverId is required' },
        { status: 400 }
      );
    }

    console.log('[Checkout] Creating checkout session for server:', serverId);

    // Get the origin for success/cancel URLs
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Select the appropriate price ID based on billing type
    const priceId = billingType === 'yearly' 
      ? process.env.STRIPE_PRICE_ID_YEARLY!
      : process.env.STRIPE_PRICE_ID!;

    console.log('[Checkout] Using price ID:', priceId, 'for billing type:', billingType);

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/servers/${serverId}/premium?success=true`,
      cancel_url: `${origin}/servers/${serverId}/premium?canceled=true`,
      metadata: {
        serverId: serverId,
        userId: session.user?.id || 'unknown',
        billingType: billingType,
      },
      subscription_data: {
        metadata: {
          serverId: serverId,
          userId: session.user?.id || 'unknown',
          billingType: billingType,
        },
      },
      client_reference_id: serverId,
      ...(session.user?.email && { customer_email: session.user.email }),
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });

  } catch (error) {
    console.error('[Checkout] Error creating checkout session:', error);
    
    // Log detailed Stripe error
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as any;
      console.error('[Checkout] Stripe Error Type:', stripeError.type);
      console.error('[Checkout] Stripe Error Code:', stripeError.code);
      console.error('[Checkout] Stripe Error Message:', stripeError.message);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error && typeof error === 'object' && 'type' in error ? (error as any).message : undefined
      },
      { status: 500 }
    );
  }
}
