import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isPremiumPurchaseEnabled, isMaintenanceMode, setSiteSetting, getSiteSetting } from '@/lib/siteSettings';

const DEVELOPER_USER_ID = '922940896322940929';

// GET - Fetch public site settings
export async function GET() {
  try {
    const premiumPurchaseEnabled = await isPremiumPurchaseEnabled();
    const maintenanceMode = await isMaintenanceMode();
    const maintenanceETA = await getSiteSetting('maintenanceETA', '');
    const premiumManagementEnabled = await getSiteSetting('premiumManagementEnabled', false);
    const botInviteEnabled = await getSiteSetting('botInviteEnabled', true);
    const systemAnnouncementsEnabled = await getSiteSetting('systemAnnouncementsEnabled', false);
    const analyticsEnabled = await getSiteSetting('analyticsEnabled', true);
    const betaFeaturesEnabled = await getSiteSetting('betaFeaturesEnabled', false);

    return NextResponse.json({
      premiumPurchaseEnabled,
      maintenanceMode,
      maintenanceETA,
      premiumManagementEnabled,
      botInviteEnabled,
      systemAnnouncementsEnabled,
      analyticsEnabled,
      betaFeaturesEnabled,
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
      
      // Also update ETA if provided
      if ('maintenanceETA' in body) {
        await setSiteSetting('maintenanceETA', body.maintenanceETA, session.user.id);
      }
      
      console.log(`[Site Settings] Maintenance mode ${body.maintenanceMode ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        maintenanceMode: body.maintenanceMode,
        message: `Maintenance mode ${body.maintenanceMode ? 'enabled' : 'disabled'} successfully`,
      });
    }

    // Handle maintenance ETA update
    if ('maintenanceETA' in body) {
      await setSiteSetting('maintenanceETA', body.maintenanceETA, session.user.id);
      console.log(`[Site Settings] Maintenance ETA updated by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        maintenanceETA: body.maintenanceETA,
        message: 'Maintenance ETA updated successfully',
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

    // Handle premium management toggle update
    if ('premiumManagementEnabled' in body) {
      await setSiteSetting('premiumManagementEnabled', body.premiumManagementEnabled, session.user.id);
      console.log(`[Site Settings] Premium management ${body.premiumManagementEnabled ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        premiumManagementEnabled: body.premiumManagementEnabled,
        message: `Premium management ${body.premiumManagementEnabled ? 'enabled' : 'disabled'} successfully`,
      });
    }

    // Handle bot invite toggle update
    if ('botInviteEnabled' in body) {
      await setSiteSetting('botInviteEnabled', body.botInviteEnabled, session.user.id);
      console.log(`[Site Settings] Bot invite ${body.botInviteEnabled ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        botInviteEnabled: body.botInviteEnabled,
        message: `Bot invite ${body.botInviteEnabled ? 'enabled' : 'disabled'} successfully`,
      });
    }

    // Handle system announcements toggle update
    if ('systemAnnouncementsEnabled' in body) {
      await setSiteSetting('systemAnnouncementsEnabled', body.systemAnnouncementsEnabled, session.user.id);
      console.log(`[Site Settings] System announcements ${body.systemAnnouncementsEnabled ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        systemAnnouncementsEnabled: body.systemAnnouncementsEnabled,
        message: `System announcements ${body.systemAnnouncementsEnabled ? 'enabled' : 'disabled'} successfully`,
      });
    }

    // Handle analytics toggle update
    if ('analyticsEnabled' in body) {
      await setSiteSetting('analyticsEnabled', body.analyticsEnabled, session.user.id);
      console.log(`[Site Settings] Analytics ${body.analyticsEnabled ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        analyticsEnabled: body.analyticsEnabled,
        message: `Analytics ${body.analyticsEnabled ? 'enabled' : 'disabled'} successfully`,
      });
    }

    // Handle beta features toggle update
    if ('betaFeaturesEnabled' in body) {
      await setSiteSetting('betaFeaturesEnabled', body.betaFeaturesEnabled, session.user.id);
      console.log(`[Site Settings] Beta features ${body.betaFeaturesEnabled ? 'enabled' : 'disabled'} by ${session.user.id}`);
      return NextResponse.json({
        success: true,
        betaFeaturesEnabled: body.betaFeaturesEnabled,
        message: `Beta features ${body.betaFeaturesEnabled ? 'enabled' : 'disabled'} successfully`,
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
