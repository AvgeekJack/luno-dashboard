import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('luno_bot');
    
    const serverSettings = await db.collection('server_settings').findOne({
      guildId: params.guildId,
    });

    const settings = serverSettings?.configuration?.memberVerification || {
      enabled: false,
      method: 'button',
      channelId: '',
      verifiedRoleId: '',
      unverifiedRoleId: '',
      customMessage: 'Click the button below to verify yourself and gain access to the server!',
      rulesText: '',
      requireAccountAge: false,
      accountAgeMinimum: 7,
      requireServerAgreement: false,
      multipleSteps: false,
      stepCount: 2,
      welcomeDmEnabled: false,
      welcomeDmMessage: 'Welcome to {server}! You are now verified and have full access.',
      additionalRoles: [],
      redirectChannel: '',
      autoCleanupEnabled: false,
      cleanupDelay: 60,
      antiAltEnabled: false,
      kickUnverifiedEnabled: false,
      kickUnverifiedAfter: 600,
      bypassRoles: [],
      verificationCooldown: 0,
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching member verification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

    const { settings } = await request.json();

    const client = await clientPromise;
    const db = client.db('luno_bot');
    
    await db.collection('server_settings').updateOne(
      { guildId: params.guildId },
      {
        $set: {
          'configuration.memberVerification': settings,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving member verification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
