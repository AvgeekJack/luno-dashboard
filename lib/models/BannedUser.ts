import mongoose from 'mongoose';

const BannedUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  banned: {
    type: Boolean,
    required: true,
    default: true,
  },
  reason: {
    type: String,
    default: 'No reason provided',
  },
  bannedBy: {
    type: String,
    required: true,
  },
  bannedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BannedUser = mongoose.models.BannedUser || mongoose.model('BannedUser', BannedUserSchema);

export default BannedUser;
