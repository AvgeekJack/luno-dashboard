import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string; command: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId, command } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const updatePath = `commands.${command}`;
    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      {
        $set: {
          [`${updatePath}.enabled`]: body.enabled,
          [`${updatePath}.allowedChannels`]: body.allowedChannels || [],
          [`${updatePath}.ignoredChannels`]: body.ignoredChannels || [],
          [`${updatePath}.allowedRoles`]: body.allowedRoles || [],
          [`${updatePath}.ignoredRoles`]: body.ignoredRoles || [],
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating command settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
