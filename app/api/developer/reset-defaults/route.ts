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

// GET - Fetch current default server configuration
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

    // Fetch all default settings
    const defaultPrefix = await SiteSettings.findOne({ settingKey: 'defaultServerPrefix' });
    const defaultPremium = await SiteSettings.findOne({ settingKey: 'defaultServerPremium' });
    const defaultModeration = await SiteSettings.findOne({ settingKey: 'defaultModuleModeration' });
    const defaultRoleManagement = await SiteSettings.findOne({ settingKey: 'defaultModuleRoleManagement' });
    const defaultMemberManagement = await SiteSettings.findOne({ settingKey: 'defaultModuleMemberManagement' });
    const defaultAnnouncements = await SiteSettings.findOne({ settingKey: 'defaultModuleAnnouncements' });
    const defaultFun = await SiteSettings.findOne({ settingKey: 'defaultModuleFun' });
    const defaultUtilities = await SiteSettings.findOne({ settingKey: 'defaultModuleUtilities' });
    const defaultNotifications = await SiteSettings.findOne({ settingKey: 'defaultModuleNotifications' });

    return NextResponse.json({
      defaults: {
        prefix: defaultPrefix?.settingValue ?? '!',
        premium: defaultPremium?.settingValue ?? false,
        modules: {
          moderation: { enabled: defaultModeration?.settingValue ?? true },
          roleManagement: { enabled: defaultRoleManagement?.settingValue ?? false },
          memberManagement: { enabled: defaultMemberManagement?.settingValue ?? false },
          announcements: { enabled: defaultAnnouncements?.settingValue ?? false },
          fun: { enabled: defaultFun?.settingValue ?? false },
          utilities: { enabled: defaultUtilities?.settingValue ?? false },
          notifications: { enabled: defaultNotifications?.settingValue ?? false },
        }
      }
    });
  } catch (error) {
    console.error('Get defaults error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update default server configuration
export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    const { defaults } = await req.json();

    await connectDB();

    // Update each default setting
    if (defaults.prefix !== undefined) {
      await SiteSettings.findOneAndUpdate(
        { settingKey: 'defaultServerPrefix' },
        { settingKey: 'defaultServerPrefix', settingValue: defaults.prefix, description: 'Default command prefix for new servers' },
        { upsert: true }
      );
    }

    if (defaults.premium !== undefined) {
      await SiteSettings.findOneAndUpdate(
        { settingKey: 'defaultServerPremium' },
        { settingKey: 'defaultServerPremium', settingValue: defaults.premium, description: 'Default premium status for new servers' },
        { upsert: true }
      );
    }

    if (defaults.modules) {
      const moduleUpdates = [
        { key: 'defaultModuleModeration', value: defaults.modules.moderation?.enabled, desc: 'Default state for Moderation module' },
        { key: 'defaultModuleRoleManagement', value: defaults.modules.roleManagement?.enabled, desc: 'Default state for Role Management module' },
        { key: 'defaultModuleMemberManagement', value: defaults.modules.memberManagement?.enabled, desc: 'Default state for Member Management module' },
        { key: 'defaultModuleAnnouncements', value: defaults.modules.announcements?.enabled, desc: 'Default state for Announcements module' },
        { key: 'defaultModuleFun', value: defaults.modules.fun?.enabled, desc: 'Default state for Fun module' },
        { key: 'defaultModuleUtilities', value: defaults.modules.utilities?.enabled, desc: 'Default state for Utilities module' },
        { key: 'defaultModuleNotifications', value: defaults.modules.notifications?.enabled, desc: 'Default state for Notifications module' },
      ];

      for (const update of moduleUpdates) {
        if (update.value !== undefined) {
          await SiteSettings.findOneAndUpdate(
            { settingKey: update.key },
            { settingKey: update.key, settingValue: update.value, description: update.desc },
            { upsert: true }
          );
        }
      }
    }

    return NextResponse.json({
      message: 'Default server configuration updated successfully',
      defaults,
    });
  } catch (error) {
    console.error('Update defaults error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
