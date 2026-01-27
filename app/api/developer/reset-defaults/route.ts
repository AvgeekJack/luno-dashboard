import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';
import SiteSettings from '@/lib/models/SiteSettings';
import BannedUser from '@/lib/models/BannedUser';

const DEVELOPER_USER_ID = '922940896322940929';

async function verifyDeveloperAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
    return false;
  }
  return true;
}

// POST - Reset a collection to default values or set specific defaults
export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    const { collection, action, guildId, defaults } = await req.json();

    await connectDB();

    if (collection === 'ServerSettings') {
      if (action === 'resetAll') {
        // Delete all server settings
        const result = await ServerSettings.deleteMany({});
        return NextResponse.json({
          message: `All server settings deleted (${result.deletedCount} servers)`,
          deletedCount: result.deletedCount,
        });
      } else if (action === 'resetOne' && guildId) {
        // Delete specific server settings
        const result = await ServerSettings.deleteOne({ guildId });
        if (result.deletedCount > 0) {
          return NextResponse.json({
            message: `Server settings reset for ${guildId}`,
          });
        } else {
          return NextResponse.json(
            { error: 'Server not found' },
            { status: 404 }
          );
        }
      } else if (action === 'setDefaults' && guildId && defaults) {
        // Update or create server with custom defaults
        const updatedServer = await ServerSettings.findOneAndUpdate(
          { guildId },
          { $set: defaults },
          { new: true, upsert: true }
        );
        return NextResponse.json({
          message: `Defaults applied to server ${guildId}`,
          settings: updatedServer,
        });
      }
    } else if (collection === 'SiteSettings') {
      if (action === 'resetAll') {
        // Reset all site settings to defaults
        const defaultSettings = [
          { settingKey: 'premiumPurchaseEnabled', settingValue: true },
          { settingKey: 'maintenanceMode', settingValue: false },
          { settingKey: 'newUserSignupsEnabled', settingValue: true },
          { settingKey: 'botCommandsEnabled', settingValue: true },
          { settingKey: 'maxServersPerUser', settingValue: 100 },
        ];

        await SiteSettings.deleteMany({});
        await SiteSettings.insertMany(defaultSettings);

        return NextResponse.json({
          message: 'All site settings reset to defaults',
          settings: defaultSettings,
        });
      } else if (action === 'resetOne' && defaults?.settingKey) {
        // Reset specific setting
        const result = await SiteSettings.deleteOne({ settingKey: defaults.settingKey });
        return NextResponse.json({
          message: `Setting ${defaults.settingKey} reset`,
          deleted: result.deletedCount > 0,
        });
      }
    } else if (collection === 'BannedUsers') {
      if (action === 'resetAll') {
        // Unban all users
        const result = await BannedUser.deleteMany({});
        return NextResponse.json({
          message: `All users unbanned (${result.deletedCount} users)`,
          unbannedCount: result.deletedCount,
        });
      }
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Reset defaults error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
