import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

// Map new command names to existing MongoDB field names 
const COMMAND_ALIASES: Record<string, string> = {
  'giveawaycreate': 'creategiveaway',
};

// GET endpoint to fetch command settings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string; command: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId, command } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const settings = await ServerSettings.findOne({ guildId });
    
    // Map command alias to actual MongoDB field name
    const actualCommand = COMMAND_ALIASES[command] || command;
    
    if (!settings) {
      return NextResponse.json({
        enabled: true,
        allowedChannels: [],
        ignoredChannels: [],
        allowedRoles: [],
        ignoredRoles: [],
      });
    }

    // Search through all modules to find the command
    let commandData = null;
    for (const [moduleName, moduleData] of Object.entries(settings.modules)) {
      if (moduleData && typeof moduleData === 'object' && 'commands' in moduleData) {
        const commands = (moduleData as any).commands;
        if (commands && commands[actualCommand]) {
          commandData = commands[actualCommand];
          break;
        }
      }
    }

    if (!commandData) {
      return NextResponse.json({
        enabled: true,
        allowedChannels: [],
        ignoredChannels: [],
        allowedRoles: [],
        ignoredRoles: [],
      });
    }

    return NextResponse.json({
      enabled: commandData.enabled ?? true,
      allowedChannels: commandData.allowedChannels || [],
      ignoredChannels: commandData.ignoredChannels || [],
      allowedRoles: commandData.allowedRoles || [],
      ignoredRoles: commandData.ignoredRoles || [],
    });
  } catch (error) {
    console.error('Error fetching command settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Map command alias to actual MongoDB field name
    const actualCommand = COMMAND_ALIASES[command] || command;

    // Find which module this command belongs to
    const settings = await ServerSettings.findOne({ guildId });
    let moduleName = null;
    
    if (settings) {
      for (const [module, moduleData] of Object.entries(settings.modules)) {
        if (moduleData && typeof moduleData === 'object' && 'commands' in moduleData) {
          const commands = (moduleData as any).commands;
          if (commands && commands[actualCommand]) {
            moduleName = module;
            break;
          }
        }
      }
    }

    // If we can't find the module, try to find it in the schema defaults
    if (!moduleName) {
      // Common module mappings based on command names
      const moduleMap: Record<string, string> = {
        ban: 'moderation', softban: 'moderation', unban: 'moderation', kick: 'moderation',
        timeout: 'moderation', untimeout: 'moderation',
        warn: 'moderation',
        clear: 'moderation', slowmode: 'moderation',
        lock: 'moderation', unlock: 'moderation',
        lockdown: 'moderation', unlockdown: 'moderation',
        automodenable: 'automod', automoddisable: 'automod',
        antilink: 'automod', antiinvite: 'automod', antispam: 'automod',
        antimention: 'automod', antizalgo: 'automod', antiswear: 'automod',
        antiflood: 'automod', capsfilter: 'automod', duplicatefilter: 'automod',
        regexfilter: 'automod', automodlogs: 'automod',
        rolecreate: 'roleManagement', roledelete: 'roleManagement',
        rolelist: 'roleManagement', autorolestatus: 'roleManagement',
        userinfo: 'memberManagement', useravatar: 'memberManagement',
        userbanner: 'memberManagement', userroles: 'memberManagement',
        pruneusers: 'memberManagement',
        announce: 'announcements', creategiveaway: 'announcements',
        giveawaydraw: 'announcements', poll: 'announcements',
        meme: 'fun', '8ball': 'fun', coinflip: 'fun', dice: 'fun',
        joke: 'fun', rps: 'fun', rate: 'fun',
        serverinfo: 'utilities', channelinfo: 'utilities', roleinfo: 'utilities',
        emojilist: 'utilities', ping: 'utilities', invite: 'utilities',
        help: 'utilities', support: 'utilities', dashboard: 'utilities',
        ignoredchannels: 'utilities', ignoredroles: 'utilities',
        schedulemessage: 'scheduler',
        analyticsserver: 'analytics',
      };
      moduleName = moduleMap[actualCommand];
    }

    if (!moduleName) {
      return NextResponse.json(
        { error: 'Command module not found' },
        { status: 404 }
      );
    }

    const updatePath = `modules.${moduleName}.commands.${actualCommand}`;
    const updatedSettings = await ServerSettings.findOneAndUpdate(
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

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating command settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
