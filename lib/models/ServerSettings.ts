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
});

export default mongoose.models.ServerSettings || mongoose.model('ServerSettings', ServerSettingsSchema);