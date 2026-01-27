import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';
import { checkServerAccess } from '@/lib/serverAccess';

const MODULE_LIST = [
  'moderation', 'roleManagement',
  'memberManagement', 'announcements',
  'fun', 'utilities',
  'notifications',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has access to this server
  const hasAccess = await checkServerAccess(session.user.id, guildId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden - You do not have access to this server' }, { status: 403 });
  }

  try {
    await connectDB();

    let settings = await ServerSettings.findOne({ guildId });
    if (!settings) {
      settings = await ServerSettings.create({ guildId });
    }

    const modules: Record<string, boolean> = {};
    MODULE_LIST.forEach(m => {
      modules[m] = (settings.modules as any)?.[m]?.enabled ?? false;
    });

    return NextResponse.json({ modules });
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

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has access to this server
  const hasAccess = await checkServerAccess(session.user.id, guildId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden - You do not have access to this server' }, { status: 403 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const updates: Record<string, any> = {};

    MODULE_LIST.forEach(m => {
      if (typeof body[m] === 'boolean') {
        updates[`modules.${m}.enabled`] = body[m];
      }
    });

    const updated = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updates },
      { new: true, upsert: true }
    );

    const modules: Record<string, boolean> = {};
    MODULE_LIST.forEach(m => {
      modules[m] = (updated.modules as any)?.[m]?.enabled ?? false;
    });

    return NextResponse.json({ modules });
  } catch (error) {
    console.error('Error updating modules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

