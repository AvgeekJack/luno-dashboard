import AuditLog from './models/AuditLog';

interface LogOptions {
  guildId: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
}

export async function logAction({ guildId, userId, userName, action }: LogOptions) {
  if (!guildId) return;
  await AuditLog.create({
    guildId,
    userId: userId || 'unknown',
    userName: userName || 'Unknown User',
    action,
  });
}
