import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';
import { checkServerAccess } from '@/lib/serverAccess';
import { getServerDefaults } from '@/lib/serverDefaults';

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
      // Get default settings
      const defaults = await getServerDefaults();
      
      // Create new settings with defaults applied
      settings = await ServerSettings.create({ 
        guildId,
        prefix: defaults.prefix,
        premium: defaults.premium,
        modules: {
          moderation: { enabled: defaults.modules.moderation.enabled },
          roleManagement: { enabled: defaults.modules.roleManagement.enabled },
          memberManagement: { enabled: defaults.modules.memberManagement.enabled },
          announcements: { enabled: defaults.modules.announcements.enabled },
          fun: { enabled: defaults.modules.fun.enabled },
          utilities: { enabled: defaults.modules.utilities.enabled },
          notifications: { enabled: defaults.modules.notifications.enabled },
        }
      });
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
