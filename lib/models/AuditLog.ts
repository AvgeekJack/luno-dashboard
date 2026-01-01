import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  guildId: string;
  userId: string;
  userName: string;
  action: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
