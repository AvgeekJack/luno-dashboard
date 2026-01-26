import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true,
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String, // Discord user ID
  },
});

SiteSettingsSchema.index({ settingKey: 1 });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
