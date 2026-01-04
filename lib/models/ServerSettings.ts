import mongoose from 'mongoose';

const ServerSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  modules: {
    moderation: {
      enabled: { type: Boolean, default: true },
      commands: {
        ban: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        softban: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        unban: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        kick: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        mute: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        unmute: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        tempmute: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        timeout: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        untimeout: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        warn: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        warnings: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        clearwarnings: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        clear: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        slowmode: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    automod: {
      enabled: { type: Boolean, default: false },
      commands: {
        automodenable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        automoddisable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antilink: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antiinvite: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antispam: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antimention: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antizalgo: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antiswear: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antiflood: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        capsfilter: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        duplicatefilter: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        regexfilter: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        automodlogs: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    antiRaid: {
      enabled: { type: Boolean, default: false },
      commands: {
        antiraidenable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antiraiddisable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        antiraidlevel: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        joinrate: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        verificationenable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        verificationdisable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        lockdown: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        unlockdown: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    logging: {
      enabled: { type: Boolean, default: false },
      commands: {
        modlogenable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        modlogdisable: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        messagelog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        editlog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        deletelog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        joinlog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        leavelog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        voicelog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        rolelog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        nicknamelog: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    roleManagement: {
      enabled: { type: Boolean, default: false },
      commands: {
        rolecreate: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        roledelete: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        rolelist: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        autorolestatus: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    memberManagement: {
      enabled: { type: Boolean, default: false },
      commands: {
        userinfo: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        useravatar: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        userbanner: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        userroles: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        pruneusers: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    announcements: {
      enabled: { type: Boolean, default: false },
      commands: {
        announce: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        creategiveaway: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        giveawaydraw: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        poll: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    tickets: { enabled: { type: Boolean, default: false }, commands: {} },
    notifications: { enabled: { type: Boolean, default: false }, commands: {} },
    customCommands: { enabled: { type: Boolean, default: false }, commands: {} },
    fun: {
      enabled: { type: Boolean, default: false },
      commands: {
        meme: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        '8ball': { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        coinflip: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        dice: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        joke: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        rps: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        rate: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    music: { enabled: { type: Boolean, default: false }, commands: {} },
    serverInfo: { enabled: { type: Boolean, default: false }, commands: {} },
    utilities: {
      enabled: { type: Boolean, default: false },
      commands: {
        serverinfo: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        channelinfo: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        roleinfo: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        emojilist: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        ping: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        invite: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        help: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        support: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        dashboard: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        ignoredchannels: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        ignoredroles: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    settingsConfig: { enabled: { type: Boolean, default: false }, commands: {} },
    security: {
      enabled: { type: Boolean, default: false },
      commands: {
        lock: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        unlock: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    scheduler: {
      enabled: { type: Boolean, default: false },
      commands: {
        schedulemessage: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    analytics: {
      enabled: { type: Boolean, default: false },
      commands: {
        analyticsserver: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
        analyticsgrowth: { enabled: { type: Boolean, default: true }, allowedChannels: { type: [String], default: [] }, ignoredChannels: { type: [String], default: [] }, allowedRoles: { type: [String], default: [] }, ignoredRoles: { type: [String], default: [] } },
      }
    },
    messageSearching: { enabled: { type: Boolean, default: false }, commands: {} },
  },
  configuration: {
    botNickname: { type: String, default: null },
    timezone: { type: String, default: 'UTC' },
    automod: {
      // Master Toggle
      enabled: { type: Boolean, default: false },
      
      // Filter Features (On/Off)
      antiLinkEnabled: { type: Boolean, default: false },
      antiInviteEnabled: { type: Boolean, default: false },
      antiSpamEnabled: { type: Boolean, default: false },
      antiMentionEnabled: { type: Boolean, default: false },
      antiFloodEnabled: { type: Boolean, default: false },
      antiZalgoEnabled: { type: Boolean, default: false },
      antiSwearEnabled: { type: Boolean, default: false },
      capsFilterEnabled: { type: Boolean, default: false },
      
      // Thresholds/Limits
      spamMessageCount: { type: Number, default: 5 },
      spamTimeWindow: { type: Number, default: 5 },
      mentionLimit: { type: Number, default: 5 },
      capsPercentage: { type: Number, default: 70 },
      floodMessageCount: { type: Number, default: 3 },
      floodTimeWindow: { type: Number, default: 2 },
      zalgoLimit: { type: Number, default: 10 },
      
      // Whitelist System
      whitelistedChannels: { type: [String], default: [] },
      whitelistedRoles: { type: [String], default: [] },
      autoWhitelistModerators: { type: Boolean, default: true },
      
      // Action Settings
      deleteMessage: { type: Boolean, default: true },
      sendWarning: { type: Boolean, default: true },
      warningDuration: { type: Number, default: 5 },
      dmUser: { type: Boolean, default: true },
      autoTimeoutEnabled: { type: Boolean, default: false },
      autoTimeoutViolations: { type: Number, default: 3 },
      autoTimeoutWindow: { type: Number, default: 60 },
      autoTimeoutDuration: { type: Number, default: 300 },
      escalatingPunishments: { type: Boolean, default: false },
      
      // Log Channel
      logChannel: { type: String, default: null },
    },
    logging: {
      // Master Toggle
      enabled: { type: Boolean, default: false },
      
      // AutoMod Log Channel (from automod configuration)
      automodLogChannel: { type: String, default: null },
      
      // Anti-Raid Log Channel
      antiRaidChannel: { type: String, default: null },
      
      // Section Channels
      moderationChannel: { type: String, default: null },
      memberChannel: { type: String, default: null },
      messageChannel: { type: String, default: null },
      channelLogsChannel: { type: String, default: null },
      roleLogsChannel: { type: String, default: null },
      voiceChannel: { type: String, default: null },
      serverChannel: { type: String, default: null },
      
      // Moderation Logs (toggles only)
      warnsEnabled: { type: Boolean, default: false },
      kicksEnabled: { type: Boolean, default: false },
      bansEnabled: { type: Boolean, default: false },
      unbansEnabled: { type: Boolean, default: false },
      timeoutsEnabled: { type: Boolean, default: false },
      untimeoutsEnabled: { type: Boolean, default: false },
      softbansEnabled: { type: Boolean, default: false },
      channelLocksEnabled: { type: Boolean, default: false },
      lockdownsEnabled: { type: Boolean, default: false },
      slowmodeEnabled: { type: Boolean, default: false },
      messagePurgeEnabled: { type: Boolean, default: false },
      automodActionsEnabled: { type: Boolean, default: false },
      
      // Member Logs (toggles only)
      memberJoinEnabled: { type: Boolean, default: false },
      memberLeaveEnabled: { type: Boolean, default: false },
      roleUpdatesEnabled: { type: Boolean, default: false },
      nicknameChangesEnabled: { type: Boolean, default: false },
      usernameChangesEnabled: { type: Boolean, default: false },
      
      // Message Logs (toggles only)
      messageDeleteEnabled: { type: Boolean, default: false },
      messageEditEnabled: { type: Boolean, default: false },
      bulkDeleteEnabled: { type: Boolean, default: false },
      messageAttachmentsEnabled: { type: Boolean, default: false },
      
      // Channel Logs (toggles only)
      channelCreateEnabled: { type: Boolean, default: false },
      channelDeleteEnabled: { type: Boolean, default: false },
      channelUpdateEnabled: { type: Boolean, default: false },
      
      // Role Logs (toggles only)
      roleCreateEnabled: { type: Boolean, default: false },
      roleDeleteEnabled: { type: Boolean, default: false },
      roleUpdateEnabled: { type: Boolean, default: false },
      
      // Voice Logs (toggles only)
      voiceJoinEnabled: { type: Boolean, default: false },
      voiceLeaveEnabled: { type: Boolean, default: false },
      voiceMoveEnabled: { type: Boolean, default: false },
      voiceMuteDeafenEnabled: { type: Boolean, default: false },
      voiceStreamingEnabled: { type: Boolean, default: false },
      
      // Server Logs (toggles only)
      serverUpdateEnabled: { type: Boolean, default: false },
      emojiEnabled: { type: Boolean, default: false },
      stickerEnabled: { type: Boolean, default: false },
      webhookEnabled: { type: Boolean, default: false },
      inviteEnabled: { type: Boolean, default: false },
      integrationEnabled: { type: Boolean, default: false },
      
      // Advanced Options
      ignoredChannels: { type: [String], default: [] },
      ignoredRoles: { type: [String], default: [] },
      ignoredUsers: { type: [String], default: [] },
      includeBotActions: { type: Boolean, default: false },
      logMessageContent: { type: Boolean, default: true },
      logEmbedUrls: { type: Boolean, default: true },
      retentionPeriod: { type: Number, default: 30 },
    },
    antiraid: {
      // Master Toggle
      enabled: { type: Boolean, default: false },
      
      // Protection Level Preset
      protectionLevel: { type: String, enum: ['low', 'medium', 'high', 'extreme', 'custom'], default: 'medium' },
      
      // Account Age Settings
      accountAge: { type: Number, default: 600000 }, // 10 minutes in milliseconds
      
      // Join Rate Limiting
      joinRateLimit: { type: Number, default: 5 }, // Maximum joins per window
      joinRateWindow: { type: Number, default: 60000 }, // Time window in milliseconds (1 minute)
      
      // Verification Level (Discord server verification)
      verificationLevel: { type: Number, default: 1, min: 0, max: 4 },
      
      // Action Settings
      autoKickNewAccounts: { type: Boolean, default: true }, // Kick accounts below minimum age
      kickOnRateExceeded: { type: Boolean, default: true }, // Kick when join rate is exceeded
      
      // Tracking/Audit Fields
      enabledBy: { type: String, default: null }, // User ID who enabled it
      enabledAt: { type: Date, default: null }, // When it was enabled
      lastUpdatedBy: { type: String, default: null }, // User ID who last updated
      lastUpdatedAt: { type: Date, default: null }, // When it was last updated
    },
    reactionRoles: {
      enabled: { type: Boolean, default: false },
      panels: [{
        id: { type: String },
        title: { type: String },
        description: { type: String },
        color: { type: String, default: '#FF6B35' },
        channelId: { type: String },
        messageId: { type: String },
        panelType: { type: String, enum: ['single', 'multiple', 'remove-on-unreact'], default: 'multiple' },
        roleEmojiPairs: [{
          emoji: { type: String },
          roleId: { type: String },
        }],
      }],
      roleLimit: { type: Number, default: 5 },
      requiredRole: { type: String, default: null },
      blacklistedRoles: { type: [String], default: [] },
      allowRoleStacking: { type: Boolean, default: true },
      autoDeleteReactions: { type: Boolean, default: false },
      dmOnRoleAdd: { type: Boolean, default: false },
      dmOnRoleRemove: { type: Boolean, default: false },
      dmMessageAdd: { type: String, default: 'You have been given the {role} role!' },
      dmMessageRemove: { type: String, default: 'The {role} role has been removed from you.' },
      rolePersistence: { type: Boolean, default: true },
      reactionCooldown: { type: Number, default: 0 },
    },
    memberVerification: {
      enabled: { type: Boolean, default: false },
      method: { type: String, enum: ['button', 'captcha', 'email'], default: 'button' },
      channelId: { type: String, default: null },
      verifiedRoleId: { type: String, default: null },
      unverifiedRoleId: { type: String, default: null },
      additionalRoles: { type: [String], default: [] },
      bypassRoles: { type: [String], default: [] },
      kickUnverified: { type: Boolean, default: false },
      kickTimeout: { type: Number, default: 600 },
      sendDM: { type: Boolean, default: true },
      dmMessage: { type: String, default: 'Welcome! Please verify yourself in the verification channel.' },
      verifyMessage: { type: String, default: 'Click the button below to verify yourself as a human.' },
      buttonLabel: { type: String, default: 'Verify' },
      buttonColor: { type: String, default: '#22c55e' },
      requireAccountAge: { type: Boolean, default: false },
      minimumAccountAge: { type: Number, default: 7 },
      requireServerTime: { type: Boolean, default: false },
      minimumServerTime: { type: Number, default: 5 },
      logChannel: { type: String, default: null },
      captchaProvider: { type: String, default: 'hcaptcha' },
      captchaDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    },
  },
}, {
  timestamps: true,
});

export default mongoose.models.ServerSettings || mongoose.model('ServerSettings', ServerSettingsSchema);