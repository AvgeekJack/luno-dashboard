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

    if (!serverSettings || !serverSettings.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No customer found' },
        { status: 404 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: serverSettings.stripeCustomerId,
      limit: 10,
    });

    // Return invoice details with explicit number conversion
    const billingHistory = invoices.data.map((invoice: any) => ({
      id: invoice.id,
      amount: invoice.amount_paid || 0,
      currency: invoice.currency || 'usd',
      status: invoice.status,
      created: Number(invoice.created),
      invoicePdf: invoice.invoice_pdf,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      periodStart: Number(invoice.period_start),
      periodEnd: Number(invoice.period_end),
    }));

    return NextResponse.json({ invoices: billingHistory });

  } catch (error) {
    console.error('[Billing] Error fetching billing history:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch billing history',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
