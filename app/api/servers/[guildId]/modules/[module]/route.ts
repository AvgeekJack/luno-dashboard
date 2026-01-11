import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

// Map new command names to existing MongoDB field names
const COMMAND_ALIASES: Record<string, string> = {
  'giveawaycreate': 'creategiveaway',
};

// Reverse mapping for GET responses
const REVERSE_ALIASES: Record<string, string> = {
  'creategiveaway': 'giveawaycreate',
};

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
    let commands = moduleData?.commands ?? {};

    // Remap command keys for frontend (e.g., creategiveaway -> giveawaycreate)
    const remappedCommands: Record<string, any> = {};
    for (const [key, value] of Object.entries(commands)) {
      const newKey = REVERSE_ALIASES[key] || key;
      remappedCommands[newKey] = value;
    }

    // For custom commands module, return the custom commands list
    if (moduleKey === 'customCommands') {
      return NextResponse.json({ 
        enabled, 
        commands: remappedCommands,
        command: moduleData?.command ?? {
          trigger: '',
          title: '',
          description: '',
          color: '#f97316',
          footer: '',
          thumbnailUrl: '',
          imageUrl: '',
          fields: [],
        }
      });
    }

    // For notifications module, return welcome and leave message configs
    if (moduleKey === 'notifications') {
      return NextResponse.json({
        enabled,
        welcomeMessage: moduleData?.welcomeMessage ?? {
          enabled: false,
          channel: '',
          title: 'Welcome to {server}!',
          description: 'Hey {user}, welcome to **{server}**! You are member #{memberCount}.',
          color: '#f97316',
          footer: 'Enjoy your stay!'
        },
        leaveMessage: moduleData?.leaveMessage ?? {
          enabled: false,
          channel: '',
          title: 'Member Left',
          description: '{user} has left the server. We now have {memberCount} members.',
          color: '#f97316',
          footer: 'Goodbye!'
        }
      });
    }

    return NextResponse.json({ enabled, commands: remappedCommands });
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

    // Handle custom commands module specific data
    if (moduleKey === 'customCommands' && body.command) {
      const commandData = body.command;
      if (commandData.trigger !== undefined) {
        updates[`modules.${moduleKey}.command.trigger`] = commandData.trigger;
      }
      if (commandData.title !== undefined) {
        updates[`modules.${moduleKey}.command.title`] = commandData.title;
      }
      if (commandData.description !== undefined) {
        updates[`modules.${moduleKey}.command.description`] = commandData.description;
      }
      if (commandData.color !== undefined) {
        updates[`modules.${moduleKey}.command.color`] = commandData.color;
      }
      if (commandData.footer !== undefined) {
        updates[`modules.${moduleKey}.command.footer`] = commandData.footer;
      }
      if (commandData.thumbnailUrl !== undefined) {
        updates[`modules.${moduleKey}.command.thumbnailUrl`] = commandData.thumbnailUrl;
      }
      if (commandData.imageUrl !== undefined) {
        updates[`modules.${moduleKey}.command.imageUrl`] = commandData.imageUrl;
      }
      if (Array.isArray(commandData.fields)) {
        updates[`modules.${moduleKey}.command.fields`] = commandData.fields;
      }
    }

    // Handle notifications module specific data
    if (moduleKey === 'notifications') {
      if (body.welcomeMessage) {
        if (body.welcomeMessage.enabled !== undefined) {
          updates[`modules.${moduleKey}.welcomeMessage.enabled`] = body.welcomeMessage.enabled;
        }
        if (body.welcomeMessage.channel !== undefined) {
          updates[`modules.${moduleKey}.welcomeMessage.channel`] = body.welcomeMessage.channel;
        }
        if (body.welcomeMessage.title !== undefined) {
          updates[`modules.${moduleKey}.welcomeMessage.title`] = body.welcomeMessage.title;
        }
        if (body.welcomeMessage.description !== undefined) {
          updates[`modules.${moduleKey}.welcomeMessage.description`] = body.welcomeMessage.description;
        }
        if (body.welcomeMessage.color !== undefined) {
          updates[`modules.${moduleKey}.welcomeMessage.color`] = body.welcomeMessage.color;
        }
        if (body.welcomeMessage.footer !== undefined) {
          updates[`modules.${moduleKey}.welcomeMessage.footer`] = body.welcomeMessage.footer;
        }
      }
      if (body.leaveMessage) {
        if (body.leaveMessage.enabled !== undefined) {
          updates[`modules.${moduleKey}.leaveMessage.enabled`] = body.leaveMessage.enabled;
        }
        if (body.leaveMessage.channel !== undefined) {
          updates[`modules.${moduleKey}.leaveMessage.channel`] = body.leaveMessage.channel;
        }
        if (body.leaveMessage.title !== undefined) {
          updates[`modules.${moduleKey}.leaveMessage.title`] = body.leaveMessage.title;
        }
        if (body.leaveMessage.description !== undefined) {
          updates[`modules.${moduleKey}.leaveMessage.description`] = body.leaveMessage.description;
        }
        if (body.leaveMessage.color !== undefined) {
          updates[`modules.${moduleKey}.leaveMessage.color`] = body.leaveMessage.color;
        }
        if (body.leaveMessage.footer !== undefined) {
          updates[`modules.${moduleKey}.leaveMessage.footer`] = body.leaveMessage.footer;
        }
      }
    }

    // Update commands if provided
    if (body.commands && typeof body.commands === 'object') {
      Object.keys(body.commands).forEach(commandName => {
        // Map command names back to MongoDB field names
        const actualCommandName = COMMAND_ALIASES[commandName] || commandName;
        const commandData = body.commands[commandName];
        if (typeof commandData === 'object') {
          // Update individual command properties
          if (typeof commandData.enabled === 'boolean') {
            updates[`modules.${moduleKey}.commands.${actualCommandName}.enabled`] = commandData.enabled;
          }
          if (Array.isArray(commandData.allowedChannels)) {
            updates[`modules.${moduleKey}.commands.${actualCommandName}.allowedChannels`] = commandData.allowedChannels;
          }
          if (Array.isArray(commandData.ignoredChannels)) {
            updates[`modules.${moduleKey}.commands.${actualCommandName}.ignoredChannels`] = commandData.ignoredChannels;
          }
          if (Array.isArray(commandData.allowedRoles)) {
            updates[`modules.${moduleKey}.commands.${actualCommandName}.allowedRoles`] = commandData.allowedRoles;
          }
          if (Array.isArray(commandData.ignoredRoles)) {
            updates[`modules.${moduleKey}.commands.${actualCommandName}.ignoredRoles`] = commandData.ignoredRoles;
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
    let commands = moduleData?.commands ?? {};

    // Remap command keys for frontend response
    const remappedCommands: Record<string, any> = {};
    for (const [key, value] of Object.entries(commands)) {
      const newKey = REVERSE_ALIASES[key] || key;
      remappedCommands[newKey] = value;
    }

    // Return appropriate data based on module type
    if (moduleKey === 'customCommands') {
      return NextResponse.json({ 
        success: true, 
        enabled, 
        commands: remappedCommands,
        command: moduleData?.command ?? {
          trigger: '',
          title: '',
          description: '',
          color: '#f97316',
          footer: '',
          thumbnailUrl: '',
          imageUrl: '',
          fields: [],
        }
      });
    }

    if (moduleKey === 'notifications') {
      return NextResponse.json({
        success: true,
        enabled,
        welcomeMessage: moduleData?.welcomeMessage ?? {
          enabled: false,
          channel: '',
          title: 'Welcome to {server}!',
          description: 'Hey {user}, welcome to **{server}**! You are member #{memberCount}.',
          color: '#f97316',
          footer: 'Enjoy your stay!'
        },
        leaveMessage: moduleData?.leaveMessage ?? {
          enabled: false,
          channel: '',
          title: 'Member Left',
          description: '{user} has left the server. We now have {memberCount} members.',
          color: '#f97316',
          footer: 'Goodbye!'
        }
      });
    }

    return NextResponse.json({ success: true, enabled, commands: remappedCommands });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}
