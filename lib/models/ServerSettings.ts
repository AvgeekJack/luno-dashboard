import mongoose from 'mongoose';

const ServerSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  moderation: {
    enabled: { type: Boolean, default: true },
    logChannel: { type: String, default: null },
  },
  welcome: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: 'Welcome {user} to {server}!' },
    channel: { type: String, default: null },
  },
  goodbye: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: 'Goodbye {user}, thanks for being part of {server}!' },
    channel: { type: String, default: null },
  },
  roles: {
    defaultRoles: { type: [String], default: [] },
    modRoles: { type: [String], default: [] },
  },
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
}, {
  timestamps: true,
});

export default mongoose.models.ServerSettings || mongoose.model('ServerSettings', ServerSettingsSchema);