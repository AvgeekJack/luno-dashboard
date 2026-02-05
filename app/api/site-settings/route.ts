import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isPremiumPurchaseEnabled, isMaintenanceMode, setSiteSetting } from '@/lib/siteSettings';

const DEVELOPER_USER_ID = '922940896322940929';

// GET - Fetch public site settings
export async function GET() {
  try {
    const premiumPurchaseEnabled = await isPremiumPurchaseEnabled();
    const maintenanceMode = await isMaintenanceMode();

    return NextResponse.json({
      premiumPurchaseEnabled,
      maintenanceMode,
    });
  } catch (error) {
    console.error('Site settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update site settings (developer only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is the developer
    if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Handle maintenance mode update
    if ('maintenanceMode' in body) {
      await setSiteSetting('maintenanceMode', body.maintenanceMode, session.user.id);
      console.log(`[Site Settings] Maintenance mode ${body.maintenanceMode ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        maintenanceMode: body.maintenanceMode,
        message: `Maintenance mode ${body.maintenanceMode ? 'enabled' : 'disabled'} successfully`,
      });
    }

    // Handle premium purchase toggle update
    if ('premiumPurchaseEnabled' in body) {
      await setSiteSetting('premiumPurchaseEnabled', body.premiumPurchaseEnabled, session.user.id);
      console.log(`[Site Settings] Premium purchase ${body.premiumPurchaseEnabled ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        premiumPurchaseEnabled: body.premiumPurchaseEnabled,
        message: `Premium purchase ${body.premiumPurchaseEnabled ? 'enabled' : 'disabled'} successfully`,
      });
    }

    return NextResponse.json(
      { error: 'No valid settings provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Site settings POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
