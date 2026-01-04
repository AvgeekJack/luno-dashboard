import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    let settings = await ServerSettings.findOne({ guildId });
    if (!settings) {
      settings = await ServerSettings.create({ guildId });
    }

    return NextResponse.json({
      antiRaid: settings.configuration?.antiraid || {
        enabled: false,
        protectionLevel: 'medium',
        accountAge: 600000,
        joinRateLimit: 5,
        joinRateWindow: 60000,
        verificationLevel: 1,
        autoKickNewAccounts: true,
        kickOnRateExceeded: true,
        enabledBy: null,
        enabledAt: null,
        lastUpdatedBy: null,
        lastUpdatedAt: null,
      },
    });
  } catch (error) {
    console.error('Error fetching anti-raid settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    await connectDB();

    // Build the update object with all anti-raid settings
    const updateFields: any = {};
    
    // Update each field individually to ensure proper MongoDB update
    if (body.enabled !== undefined) {
      updateFields['configuration.antiraid.enabled'] = body.enabled;
      
      // Track who enabled/disabled it and when
      if (body.enabled && session.user?.id) {
        updateFields['configuration.antiraid.enabledBy'] = session.user.id;
        updateFields['configuration.antiraid.enabledAt'] = new Date();
      }
    }
    
    if (body.protectionLevel !== undefined) {
      updateFields['configuration.antiraid.protectionLevel'] = body.protectionLevel;
    }
    
    if (body.accountAge !== undefined) {
      updateFields['configuration.antiraid.accountAge'] = body.accountAge;
    }
    
    if (body.joinRateLimit !== undefined) {
      updateFields['configuration.antiraid.joinRateLimit'] = body.joinRateLimit;
    }
    
    if (body.joinRateWindow !== undefined) {
      updateFields['configuration.antiraid.joinRateWindow'] = body.joinRateWindow;
    }
    
    if (body.verificationLevel !== undefined) {
      updateFields['configuration.antiraid.verificationLevel'] = body.verificationLevel;
    }
    
    if (body.autoKickNewAccounts !== undefined) {
      updateFields['configuration.antiraid.autoKickNewAccounts'] = body.autoKickNewAccounts;
    }
    
    if (body.kickOnRateExceeded !== undefined) {
      updateFields['configuration.antiraid.kickOnRateExceeded'] = body.kickOnRateExceeded;
    }

    // Always update lastUpdated fields
    if (session.user?.id) {
      updateFields['configuration.antiraid.lastUpdatedBy'] = session.user.id;
    }
    updateFields['configuration.antiraid.lastUpdatedAt'] = new Date();

    // Update the settings
    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      antiRaid: settings.configuration?.antiraid || {},
    });
  } catch (error) {
    console.error('Error updating anti-raid settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
