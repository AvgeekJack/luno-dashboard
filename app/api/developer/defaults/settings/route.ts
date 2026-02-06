import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import SiteSettings from '@/lib/models/SiteSettings';

const DEVELOPER_USER_ID = '922940896322940929';

async function verifyDeveloperAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
    return false;
  }
  return true;
}

// GET - Fetch current default server configuration (formatted like server settings)
export async function GET(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    await connectDB();

    // Fetch default settings (simulating server settings structure)
    const defaultPrefix = await SiteSettings.findOne({ settingKey: 'defaultServerPrefix' });
    const defaultPremium = await SiteSettings.findOne({ settingKey: 'defaultServerPremium' });

    // Return in the same format as server settings
    return NextResponse.json({
      guildId: 'defaults', // Special ID for defaults
      prefix: defaultPrefix?.settingValue ?? '!',
      premium: defaultPremium?.settingValue ?? false,
      configuration: {
        botNickname: '',
        timezone: 'UTC',
        updatesChannel: '',
        automod: {
          enabled: false
        },
        logging: {
          enabled: false
        },
        antiraid: {
          enabled: false
        }
      }
    });
  } catch (error) {
    console.error('[Defaults Settings API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch defaults' },
      { status: 500 }
    );
  }
}

// PUT - Update default server configuration
export async function PUT(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();

    // Update default prefix
    if (body.prefix !== undefined) {
      await SiteSettings.findOneAndUpdate(
        { settingKey: 'defaultServerPrefix' },
        { settingValue: body.prefix },
        { upsert: true, new: true }
      );
    }

    // Update default premium status
    if (body.premium !== undefined) {
      await SiteSettings.findOneAndUpdate(
        { settingKey: 'defaultServerPremium' },
        { settingValue: body.premium },
        { upsert: true, new: true }
      );
    }

    // Return updated settings
    const defaultPrefix = await SiteSettings.findOne({ settingKey: 'defaultServerPrefix' });
    const defaultPremium = await SiteSettings.findOne({ settingKey: 'defaultServerPremium' });

    return NextResponse.json({
      guildId: 'defaults',
      prefix: defaultPrefix?.settingValue ?? '!',
      premium: defaultPremium?.settingValue ?? false,
      configuration: {
        botNickname: body.configuration?.botNickname ?? '',
        timezone: body.configuration?.timezone ?? 'UTC',
        updatesChannel: body.configuration?.updatesChannel ?? '',
        automod: body.configuration?.automod ?? { enabled: false },
        logging: body.configuration?.logging ?? { enabled: false },
        antiraid: body.configuration?.antiraid ?? { enabled: false }
      }
    });
  } catch (error) {
    console.error('[Defaults Settings API] Error updating:', error);
    return NextResponse.json(
      { error: 'Failed to update defaults' },
      { status: 500 }
    );
  }
}
