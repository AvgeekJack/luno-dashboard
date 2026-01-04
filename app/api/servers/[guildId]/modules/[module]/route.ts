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

    // For tickets module, return the full ticket configuration
    if (moduleKey === 'tickets') {
      return NextResponse.json({ 
        enabled, 
        commands,
        tickets: {
          panelChannelId: moduleData?.panelChannelId ?? null,
          categoryId: moduleData?.categoryId ?? null,
          supportRoleIds: moduleData?.supportRoleIds ?? [],
          ticketMessage: moduleData?.ticketMessage ?? {
            title: '🎫 Support Ticket',
            description: 'Click the button below to create a support ticket. Our team will assist you shortly!',
            color: '#f97316',
            footer: 'Ticket System',
            buttonText: 'Create Ticket',
            buttonEmoji: '🎫',
          },
          transcripts: moduleData?.transcripts ?? {
            enabled: false,
            channelId: null,
          },
          maxTicketsPerUser: moduleData?.maxTicketsPerUser ?? 1,
          autoCloseAfterHours: moduleData?.autoCloseAfterHours ?? 24,
        }
      });
    }

    // For custom commands module, return the custom commands list
    if (moduleKey === 'customCommands') {
      return NextResponse.json({ 
        enabled, 
        commands,
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

    // Handle tickets module specific data
    if (moduleKey === 'tickets' && body.tickets) {
      const ticketData = body.tickets;
      if (ticketData.panelChannelId !== undefined) {
        updates[`modules.${moduleKey}.panelChannelId`] = ticketData.panelChannelId;
      }
      if (ticketData.categoryId !== undefined) {
        updates[`modules.${moduleKey}.categoryId`] = ticketData.categoryId;
      }
      if (Array.isArray(ticketData.supportRoleIds)) {
        updates[`modules.${moduleKey}.supportRoleIds`] = ticketData.supportRoleIds;
      }
      if (ticketData.ticketMessage) {
        if (ticketData.ticketMessage.title !== undefined) {
          updates[`modules.${moduleKey}.ticketMessage.title`] = ticketData.ticketMessage.title;
        }
        if (ticketData.ticketMessage.description !== undefined) {
          updates[`modules.${moduleKey}.ticketMessage.description`] = ticketData.ticketMessage.description;
        }
        if (ticketData.ticketMessage.color !== undefined) {
          updates[`modules.${moduleKey}.ticketMessage.color`] = ticketData.ticketMessage.color;
        }
        if (ticketData.ticketMessage.footer !== undefined) {
          updates[`modules.${moduleKey}.ticketMessage.footer`] = ticketData.ticketMessage.footer;
        }
        if (ticketData.ticketMessage.buttonText !== undefined) {
          updates[`modules.${moduleKey}.ticketMessage.buttonText`] = ticketData.ticketMessage.buttonText;
        }
        if (ticketData.ticketMessage.buttonEmoji !== undefined) {
          updates[`modules.${moduleKey}.ticketMessage.buttonEmoji`] = ticketData.ticketMessage.buttonEmoji;
        }
      }
      if (ticketData.transcripts) {
        if (typeof ticketData.transcripts.enabled === 'boolean') {
          updates[`modules.${moduleKey}.transcripts.enabled`] = ticketData.transcripts.enabled;
        }
        if (ticketData.transcripts.channelId !== undefined) {
          updates[`modules.${moduleKey}.transcripts.channelId`] = ticketData.transcripts.channelId;
        }
      }
      if (typeof ticketData.maxTicketsPerUser === 'number') {
        updates[`modules.${moduleKey}.maxTicketsPerUser`] = ticketData.maxTicketsPerUser;
      }
      if (typeof ticketData.autoCloseAfterHours === 'number') {
        updates[`modules.${moduleKey}.autoCloseAfterHours`] = ticketData.autoCloseAfterHours;
      }
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

    // Return appropriate data based on module type
    if (moduleKey === 'tickets') {
      return NextResponse.json({ 
        success: true, 
        enabled, 
        commands,
        tickets: {
          panelChannelId: moduleData?.panelChannelId ?? null,
          categoryId: moduleData?.categoryId ?? null,
          supportRoleIds: moduleData?.supportRoleIds ?? [],
          ticketMessage: moduleData?.ticketMessage ?? {},
          transcripts: moduleData?.transcripts ?? {},
          maxTicketsPerUser: moduleData?.maxTicketsPerUser ?? 1,
          autoCloseAfterHours: moduleData?.autoCloseAfterHours ?? 24,
        }
      });
    }

    if (moduleKey === 'customCommands') {
      return NextResponse.json({ 
        success: true, 
        enabled, 
        commands,
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

    return NextResponse.json({ success: true, enabled, commands });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}
