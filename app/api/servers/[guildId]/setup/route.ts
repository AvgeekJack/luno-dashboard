import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

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

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching setup:', error);
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

    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      {
        $set: {
          'moderation.logChannel': body.modLogChannel,
          'welcome.channel': body.welcomeChannel,
          'welcome.message': body.welcomeMessage,
          'welcome.enabled': !!body.welcomeChannel,
          'goodbye.channel': body.goodbyeChannel,
          'goodbye.message': body.goodbyeMessage,
          'goodbye.enabled': !!body.goodbyeChannel,
          'roles.defaultRoles': body.defaultRoles || [],
          'roles.modRoles': body.modRoles || [],
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating setup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
