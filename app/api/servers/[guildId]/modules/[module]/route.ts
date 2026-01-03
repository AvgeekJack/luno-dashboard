import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ guildId: string; module: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId, module } = await params;
    await connectDB();

    const settings = await ServerSettings.findOne({ guildId });
    // Convert kebab-case to camelCase for schema (e.g., 'role-management' -> 'roleManagement')
    const moduleKey = module.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    
    const moduleData = settings?.modules?.[moduleKey];
    const enabled = moduleData?.enabled ?? true;
    const commands = moduleData?.commands ?? {};

    return NextResponse.json({ enabled, commands });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ guildId: string; module: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId, module } = await params;
    const body = await req.json();
    await connectDB();

    // Convert kebab-case to camelCase for schema (e.g., 'role-management' -> 'roleManagement')
    const moduleKey = module.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    const updates: Record<string, any> = {};

    // Update module enabled state
    if (typeof body.enabled === 'boolean') {
      updates[`modules.${moduleKey}.enabled`] = body.enabled;
    }

    // Update commands if provided
    if (body.commands && typeof body.commands === 'object') {
      Object.keys(body.commands).forEach(commandName => {
        const commandData = body.commands[commandName];
        if (typeof commandData === 'object') {
          // Update individual command properties
          if (typeof commandData.enabled === 'boolean') {
            updates[`modules.${moduleKey}.commands.${commandName}.enabled`] = commandData.enabled;
          }
          if (Array.isArray(commandData.allowedChannels)) {
            updates[`modules.${moduleKey}.commands.${commandName}.allowedChannels`] = commandData.allowedChannels;
          }
          if (Array.isArray(commandData.ignoredChannels)) {
            updates[`modules.${moduleKey}.commands.${commandName}.ignoredChannels`] = commandData.ignoredChannels;
          }
          if (Array.isArray(commandData.allowedRoles)) {
            updates[`modules.${moduleKey}.commands.${commandName}.allowedRoles`] = commandData.allowedRoles;
          }
          if (Array.isArray(commandData.ignoredRoles)) {
            updates[`modules.${moduleKey}.commands.${commandName}.ignoredRoles`] = commandData.ignoredRoles;
          }
        }
      });
    }

    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updates },
      { new: true, upsert: true }
    );

    const moduleData = settings?.modules?.[moduleKey];
    const enabled = moduleData?.enabled ?? true;
    const commands = moduleData?.commands ?? {};

    return NextResponse.json({ success: true, enabled, commands });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}
