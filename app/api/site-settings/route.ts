import { NextResponse } from 'next/server';
import { isPremiumPurchaseEnabled } from '@/lib/siteSettings';

// GET - Fetch public site settings
export async function GET() {
  try {
    const premiumPurchaseEnabled = await isPremiumPurchaseEnabled();

    return NextResponse.json({
      premiumPurchaseEnabled,
    });
  } catch (error) {
    console.error('Site settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
