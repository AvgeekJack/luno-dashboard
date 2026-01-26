import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

const DEVELOPER_USER_ID = '922940896322940929';

export async function POST(request: NextRequest) {
  try {
    // Verify user is developer
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.id !== DEVELOPER_USER_ID) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { guildId, premium } = body;

    if (!guildId || typeof guildId !== 'string') {
      return NextResponse.json(
        { error: 'Guild ID is required' },
        { status: 400 }
      );
    }

    if (typeof premium !== 'boolean') {
      return NextResponse.json(
        { error: 'Premium status (true/false) is required' },
        { status: 400 }
      );
    }

    // Validate guild ID format
    if (!/^\d{17,19}$/.test(guildId)) {
      return NextResponse.json(
        { error: 'Invalid Guild ID format' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find or create server settings
    let serverSettings = await ServerSettings.findOne({ guildId });

    if (!serverSettings) {
      // Create new settings with premium status
      serverSettings = new ServerSettings({
        guildId,
        premium,
        updatedBy: session.user.id,
      });
    } else {
      // Update existing settings
      serverSettings.premium = premium;
      serverSettings.updatedBy = session.user.id;
      serverSettings.updatedAt = new Date();
    }

    await serverSettings.save();

    console.log(`[Premium Management] ${premium ? 'Granted' : 'Removed'} premium for guild: ${guildId}`);

    return NextResponse.json({
      success: true,
      message: `Premium ${premium ? 'granted to' : 'removed from'} server ${guildId}`,
      guildId,
      premium,
    });

  } catch (error: any) {
    console.error('[Premium Management] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update premium status',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
