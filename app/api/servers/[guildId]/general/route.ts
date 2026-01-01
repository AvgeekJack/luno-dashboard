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
      prefix: settings.prefix,
      moderationEnabled: settings.moderation?.enabled ?? true,
    });
  } catch (error) {
    console.error('Error fetching general settings:', error);
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
    const prefix = (body.prefix || '!').toString().trim();
    const moderationEnabled = Boolean(body.moderationEnabled);

    if (!prefix || prefix.length > 5) {
      return NextResponse.json(
        { error: 'Prefix must be 1-5 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await ServerSettings.findOneAndUpdate(
      { guildId },
      {
        $set: {
          prefix,
          'moderation.enabled': moderationEnabled,
        },
      },
      { new: true, upsert: true }
    );

    await logAction({
      guildId,
      userId: session.user?.id as string | undefined,
      userName: session.user?.name as string | undefined,
      action: `Updated general settings: prefix="${updated.prefix}"`,
    });

    return NextResponse.json({
      prefix: updated.prefix,
      moderationEnabled: updated.moderation?.enabled ?? true,
    });
  } catch (error) {
    console.error('Error updating general settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
