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

    // Fetch all default settings in parallel
    const [
      defaultPrefix,
      defaultPremium,
      defaultSettings,
      defaultModeration,
      defaultRoleManagement,
      defaultMemberManagement,
      defaultAnnouncements,
      defaultWelcomeMessages,
      defaultFun,
      defaultUtilities,
      defaultNotifications,
    ] = await Promise.all([
      SiteSettings.findOne({ settingKey: 'defaultServerPrefix' }),
      SiteSettings.findOne({ settingKey: 'defaultServerPremium' }),
      SiteSettings.findOne({ settingKey: 'defaultServerSettings' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleModeration' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleRoleManagement' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleMemberManagement' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleAnnouncements' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleWelcomeMessages' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleFun' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleUtilities' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleNotifications' }),
    ]);

    // Parse the default settings or use defaults
    const parsedSettings = defaultSettings?.settingValue ? 
      (typeof defaultSettings.settingValue === 'string' ? JSON.parse(defaultSettings.settingValue) : defaultSettings.settingValue) : 
      {};

    // Return in the same format as server settings
    return NextResponse.json({
      guildId: 'defaults', // Special ID for defaults
      prefix: defaultPrefix?.settingValue ?? '!',
      premium: defaultPremium?.settingValue ?? false,
      configuration: parsedSettings.configuration || {
        botNickname: '',
        timezone: 'UTC',
        updatesChannel: '',
        automod: { enabled: false },
        logging: { enabled: false },
        antiraid: { enabled: false },
        reactionRoles: { enabled: false },
        verification: { enabled: false }
      },
      modules: {
        moderation: { enabled: defaultModeration?.settingValue ?? true },
        roleManagement: { enabled: defaultRoleManagement?.settingValue ?? false },
        memberManagement: { enabled: defaultMemberManagement?.settingValue ?? false },
        announcements: { enabled: defaultAnnouncements?.settingValue ?? false },
        welcomeMessages: { enabled: defaultWelcomeMessages?.settingValue ?? false },
        fun: { enabled: defaultFun?.settingValue ?? false },
        utilities: { enabled: defaultUtilities?.settingValue ?? false },
        notifications: { enabled: defaultNotifications?.settingValue ?? false },
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
    console.log('[Defaults API] Received update request:', JSON.stringify(body, null, 2));

    // Update default prefix
    if (body.prefix !== undefined) {
      console.log('[Defaults API] Updating prefix to:', body.prefix);
      await SiteSettings.findOneAndUpdate(
        { settingKey: 'defaultServerPrefix' },
        { settingValue: body.prefix },
        { upsert: true, new: true }
      );
    }

    // Update default premium status
    if (body.premium !== undefined) {
      console.log('[Defaults API] Updating premium to:', body.premium);
      await SiteSettings.findOneAndUpdate(
        { settingKey: 'defaultServerPremium' },
        { settingValue: body.premium },
        { upsert: true, new: true }
      );
    }

    // Update default configuration settings
    if (body.configuration !== undefined) {
      const existingSettings = await SiteSettings.findOne({ settingKey: 'defaultServerSettings' });
      const currentSettings = existingSettings?.settingValue ? 
        (typeof existingSettings.settingValue === 'string' ? JSON.parse(existingSettings.settingValue) : existingSettings.settingValue) : 
        {};

      const updatedSettings = {
        configuration: body.configuration,
        modules: currentSettings.modules || {}
      };

      await SiteSettings.findOneAndUpdate(
        { settingKey: 'defaultServerSettings' },
        { settingValue: JSON.stringify(updatedSettings) },
        { upsert: true, new: true }
      );
    }

    // Update individual module defaults
    if (body.modules !== undefined) {
      console.log('[Defaults API] Updating modules:', body.modules);
      const moduleUpdates = [];
      
      if (body.modules.moderation !== undefined) {
        console.log('[Defaults API] Setting moderation to:', body.modules.moderation.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleModeration' },
            { settingValue: body.modules.moderation.enabled },
            { upsert: true, new: true }
          )
        );
      }
      
      if (body.modules.roleManagement !== undefined) {
        console.log('[Defaults API] Setting roleManagement to:', body.modules.roleManagement.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleRoleManagement' },
            { settingValue: body.modules.roleManagement.enabled },
            { upsert: true, new: true }
          )
        );
      }
      
      if (body.modules.memberManagement !== undefined) {
        console.log('[Defaults API] Setting memberManagement to:', body.modules.memberManagement.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleMemberManagement' },
            { settingValue: body.modules.memberManagement.enabled },
            { upsert: true, new: true }
          )
        );
      }
      
      if (body.modules.announcements !== undefined) {
        console.log('[Defaults API] Setting announcements to:', body.modules.announcements.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleAnnouncements' },
            { settingValue: body.modules.announcements.enabled },
            { upsert: true, new: true }
          )
        );
      }
      
      if (body.modules.welcomeMessages !== undefined) {
        console.log('[Defaults API] Setting welcomeMessages to:', body.modules.welcomeMessages.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleWelcomeMessages' },
            { settingValue: body.modules.welcomeMessages.enabled },
            { upsert: true, new: true }
          )
        );
      }
      
      if (body.modules.fun !== undefined) {
        console.log('[Defaults API] Setting fun to:', body.modules.fun.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleFun' },
            { settingValue: body.modules.fun.enabled },
            { upsert: true, new: true }
          )
        );
      }
      
      if (body.modules.utilities !== undefined) {
        console.log('[Defaults API] Setting utilities to:', body.modules.utilities.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleUtilities' },
            { settingValue: body.modules.utilities.enabled },
            { upsert: true, new: true }
          )
        );
      }
      
      if (body.modules.notifications !== undefined) {
        console.log('[Defaults API] Setting notifications to:', body.modules.notifications.enabled);
        moduleUpdates.push(
          SiteSettings.findOneAndUpdate(
            { settingKey: 'defaultModuleNotifications' },
            { settingValue: body.modules.notifications.enabled },
            { upsert: true, new: true }
          )
        );
      }

      await Promise.all(moduleUpdates);
      console.log('[Defaults API] All module updates completed');
    }

    // Return updated settings
    const [
      defaultPrefix,
      defaultPremium,
      defaultSettings,
      defaultModeration,
      defaultRoleManagement,
      defaultMemberManagement,
      defaultAnnouncements,
      defaultWelcomeMessages,
      defaultFun,
      defaultUtilities,
      defaultNotifications,
    ] = await Promise.all([
      SiteSettings.findOne({ settingKey: 'defaultServerPrefix' }),
      SiteSettings.findOne({ settingKey: 'defaultServerPremium' }),
      SiteSettings.findOne({ settingKey: 'defaultServerSettings' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleModeration' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleRoleManagement' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleMemberManagement' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleAnnouncements' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleWelcomeMessages' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleFun' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleUtilities' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleNotifications' }),
    ]);

    const parsedSettings = defaultSettings?.settingValue ? 
      (typeof defaultSettings.settingValue === 'string' ? JSON.parse(defaultSettings.settingValue) : defaultSettings.settingValue) : 
      {};

    const response = {
      guildId: 'defaults',
      prefix: defaultPrefix?.settingValue ?? '!',
      premium: defaultPremium?.settingValue ?? false,
      configuration: parsedSettings.configuration || {},
      modules: {
        moderation: { enabled: defaultModeration?.settingValue ?? true },
        roleManagement: { enabled: defaultRoleManagement?.settingValue ?? false },
        memberManagement: { enabled: defaultMemberManagement?.settingValue ?? false },
        announcements: { enabled: defaultAnnouncements?.settingValue ?? false },
        welcomeMessages: { enabled: defaultWelcomeMessages?.settingValue ?? false },
        fun: { enabled: defaultFun?.settingValue ?? false },
        utilities: { enabled: defaultUtilities?.settingValue ?? false },
        notifications: { enabled: defaultNotifications?.settingValue ?? false },
      }
    };

    console.log('[Defaults API] Returning response:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('[Defaults Settings API] Error updating:', error);
    return NextResponse.json(
      { error: 'Failed to update defaults' },
      { status: 500 }
    );
  }
}
