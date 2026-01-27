import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';
import { checkServerAccess } from '@/lib/serverAccess';

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

    return NextResponse.json({
      reactionRoles: settings.configuration?.reactionRoles || {
        enabled: false,
        panels: [],
        roleLimit: 0,
        requiredRole: null,
        blacklistedRoles: [],
        allowRoleStacking: true,
        autoDeleteReactions: false,
        dmOnRoleChange: false,
        dmMessage: 'You have been given the {role} role!',
        rolePersistence: false,
        reactionCooldown: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching reaction roles settings:', error);
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

    const updateFields: any = {};
    
    if (body.enabled !== undefined) {
      updateFields['configuration.reactionRoles.enabled'] = body.enabled;
    }
    
    if (body.panels !== undefined) {
      updateFields['configuration.reactionRoles.panels'] = body.panels;
    }
    
    if (body.roleLimit !== undefined) {
      updateFields['configuration.reactionRoles.roleLimit'] = body.roleLimit;
    }
    
    if (body.requiredRole !== undefined) {
      updateFields['configuration.reactionRoles.requiredRole'] = body.requiredRole;
    }
    
    if (body.blacklistedRoles !== undefined) {
      updateFields['configuration.reactionRoles.blacklistedRoles'] = body.blacklistedRoles;
    }
    
    if (body.allowRoleStacking !== undefined) {
      updateFields['configuration.reactionRoles.allowRoleStacking'] = body.allowRoleStacking;
    }
    
    if (body.autoDeleteReactions !== undefined) {
      updateFields['configuration.reactionRoles.autoDeleteReactions'] = body.autoDeleteReactions;
    }
    
    if (body.dmOnRoleChange !== undefined) {
      updateFields['configuration.reactionRoles.dmOnRoleChange'] = body.dmOnRoleChange;
    }
    
    if (body.dmMessage !== undefined) {
      updateFields['configuration.reactionRoles.dmMessage'] = body.dmMessage;
    }
    
    if (body.rolePersistence !== undefined) {
      updateFields['configuration.reactionRoles.rolePersistence'] = body.rolePersistence;
    }
    
    if (body.reactionCooldown !== undefined) {
      updateFields['configuration.reactionRoles.reactionCooldown'] = body.reactionCooldown;
    }

    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      reactionRoles: settings.configuration?.reactionRoles || {},
    });
  } catch (error) {
    console.error('Error updating reaction roles settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
