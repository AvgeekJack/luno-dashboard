import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId } = params;

    // TODO: Fetch member verification settings from database
    const settings = {
      enabled: false,
      method: 'button',
      channelId: null,
      verifiedRoleId: null,
      unverifiedRoleId: null,
      additionalRoles: [],
      bypassRoles: [],
      kickUnverified: false,
      kickTimeout: 600,
      sendDM: true,
      dmMessage: 'Welcome! Please verify yourself in the verification channel.',
      verifyMessage: 'Click the button below to verify yourself as a human.',
      buttonLabel: 'Verify',
      buttonColor: '#22c55e',
      requireAccountAge: false,
      minimumAccountAge: 7,
      requireServerTime: false,
      minimumServerTime: 5,
      logChannel: null,
      captchaProvider: 'hcaptcha',
      captchaDifficulty: 'medium',
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching member verification settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId } = params;
    const body = await request.json();
    const { settings } = body;

    // TODO: Save member verification settings to database
    console.log('Saving member verification settings for guild:', guildId, settings);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving member verification settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
