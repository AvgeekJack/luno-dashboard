import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';
import { logAction } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    let settings = await ServerSettings.findOne({ guildId });
    if (!settings) {
      settings = await ServerSettings.create({ guildId });
    }

    return NextResponse.json({
      moderation: {
        enabled: settings.moderation?.enabled ?? true,
        warnEnabled: settings.commands?.warn?.enabled ?? true,
        kickEnabled: settings.commands?.kick?.enabled ?? true,
        banEnabled: settings.commands?.ban?.enabled ?? true,
      },
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const updates: Record<string, any> = {};

    if (typeof body.moderationEnabled === 'boolean') {
      updates['moderation.enabled'] = body.moderationEnabled;
    }
    if (typeof body.warnEnabled === 'boolean') {
      updates['commands.warn.enabled'] = body.warnEnabled;
    }
    if (typeof body.kickEnabled === 'boolean') {
      updates['commands.kick.enabled'] = body.kickEnabled;
    }
    if (typeof body.banEnabled === 'boolean') {
      updates['commands.ban.enabled'] = body.banEnabled;
    }

    const updated = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updates },
      { new: true, upsert: true }
    );

    await logAction({
      guildId,
      userId: session.user?.id as string | undefined,
      userName: session.user?.name as string | undefined,
      action: 'Updated moderation module settings',
    });

    return NextResponse.json({
      moderation: {
        enabled: updated.moderation?.enabled ?? true,
        warnEnabled: updated.commands?.warn?.enabled ?? true,
        kickEnabled: updated.commands?.kick?.enabled ?? true,
        banEnabled: updated.commands?.ban?.enabled ?? true,
      },
    });
  } catch (error) {
    console.error('Error updating modules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
