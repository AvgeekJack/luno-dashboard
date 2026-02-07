import SiteSettings from '@/lib/models/SiteSettings';

interface ServerDefaults {
  prefix: string;
  premium: boolean;
  modules: {
    moderation: { enabled: boolean };
    roleManagement: { enabled: boolean };
    memberManagement: { enabled: boolean };
    announcements: { enabled: boolean };
    welcomeMessages: { enabled: boolean };
    fun: { enabled: boolean };
    utilities: { enabled: boolean };
    notifications: { enabled: boolean };
  };
}

export async function getServerDefaults(): Promise<ServerDefaults> {
  try {
    const [
      defaultPrefix,
      defaultPremium,
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
      SiteSettings.findOne({ settingKey: 'defaultModuleModeration' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleRoleManagement' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleMemberManagement' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleAnnouncements' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleWelcomeMessages' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleFun' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleUtilities' }),
      SiteSettings.findOne({ settingKey: 'defaultModuleNotifications' }),
    ]);

    return {
      prefix: defaultPrefix?.settingValue ?? '!',
      premium: defaultPremium?.settingValue ?? false,
      modules: {
        moderation: { enabled: defaultModeration?.settingValue ?? true },
        roleManagement: { enabled: defaultRoleManagement?.settingValue ?? false },
        memberManagement: { enabled: defaultMemberManagement?.settingValue ?? false },
        announcements: { enabled: defaultAnnouncements?.settingValue ?? false },
        welcomeMessages: { enabled: defaultWelcomeMessages?.settingValue ?? false },
        fun: { enabled: defaultFun?.settingValue ?? false },
        utilities: { enabled: defaultUtilities?.settingValue ?? false },
        notifications: { enabled: defaultNotifications?.settingValue ?? false },
      },
    };
  } catch (error) {
    console.error('Failed to fetch server defaults:', error);
    // Return schema defaults if fetching fails
    return {
      prefix: '!',
      premium: false,
      modules: {
        moderation: { enabled: true },
        roleManagement: { enabled: false },
        memberManagement: { enabled: false },
        announcements: { enabled: false },
        welcomeMessages: { enabled: false },
        fun: { enabled: true },
        utilities: { enabled: true },
        notifications: { enabled: false },
      },
    };
  }
}
