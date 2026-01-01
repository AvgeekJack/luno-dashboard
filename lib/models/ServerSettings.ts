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
  commands: {
    warn: { 
      enabled: { type: Boolean, default: true },
      allowedChannels: { type: [String], default: [] },
      ignoredChannels: { type: [String], default: [] },
      allowedRoles: { type: [String], default: [] },
      ignoredRoles: { type: [String], default: [] },
    },
    kick: { 
      enabled: { type: Boolean, default: true },
      allowedChannels: { type: [String], default: [] },
      ignoredChannels: { type: [String], default: [] },
      allowedRoles: { type: [String], default: [] },
      ignoredRoles: { type: [String], default: [] },
    },
    ban: { 
      enabled: { type: Boolean, default: true },
      allowedChannels: { type: [String], default: [] },
      ignoredChannels: { type: [String], default: [] },
      allowedRoles: { type: [String], default: [] },
      ignoredRoles: { type: [String], default: [] },
    },
    userinfo: { 
      enabled: { type: Boolean, default: true },
      allowedChannels: { type: [String], default: [] },
      ignoredChannels: { type: [String], default: [] },
      allowedRoles: { type: [String], default: [] },
      ignoredRoles: { type: [String], default: [] },
    },
    eightball: { 
      enabled: { type: Boolean, default: true },
      allowedChannels: { type: [String], default: [] },
      ignoredChannels: { type: [String], default: [] },
      allowedRoles: { type: [String], default: [] },
      ignoredRoles: { type: [String], default: [] },
    },
    ping: { 
      enabled: { type: Boolean, default: true },
      allowedChannels: { type: [String], default: [] },
      ignoredChannels: { type: [String], default: [] },
      allowedRoles: { type: [String], default: [] },
      ignoredRoles: { type: [String], default: [] },
    },
  },
}, {
  timestamps: true,
});

export default mongoose.models.ServerSettings || mongoose.model('ServerSettings', ServerSettingsSchema);