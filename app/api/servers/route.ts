import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    console.log('[/api/servers] Starting request');
    
    const session = await getServerSession(authOptions);
    console.log('[/api/servers] Session check:', { 
      hasSession: !!session, 
      hasAccessToken: !!session?.accessToken,
      hasUser: !!session?.user 
    });

    if (!session || !session.accessToken) {
      console.error('[/api/servers] No session or access token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[/api/servers] Fetching user guilds from Discord');
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[/api/servers] Discord API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json({ 
        error: 'Failed to fetch guilds from Discord',
        details: response.status === 401 ? 'Token expired or invalid' : 'Discord API error'
      }, { status: response.status === 401 ? 401 : 500 });
    }

    const guilds = await response.json();
    console.log('[/api/servers] Received guilds:', guilds?.length || 0);

    if (!Array.isArray(guilds)) {
      console.error('[/api/servers] Guilds is not an array:', typeof guilds);
      return NextResponse.json({ error: 'Invalid guilds data from Discord' }, { status: 500 });
    }

    // Fetch guilds the bot is in
    const botGuildIds = new Set<string>();
    const botToken = process.env.DISCORD_BOT_TOKEN;
    
    if (botToken) {
      try {
        console.log('[/api/servers] Fetching bot guilds');
        const botRes = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: { Authorization: `Bot ${botToken}` },
        });
        
        if (botRes.ok) {
          const botGuilds = await botRes.json();
          if (Array.isArray(botGuilds)) {
            botGuilds.forEach((g: any) => {
              if (g?.id) botGuildIds.add(g.id);
            });
            console.log('[/api/servers] Bot is in', botGuildIds.size, 'guilds');
          }
        } else {
          console.warn('[/api/servers] Failed to fetch bot guilds:', botRes.status);
        }
      } catch (err) {
        console.warn('[/api/servers] Error fetching bot guilds:', err);
      }
    } else {
      console.warn('[/api/servers] No bot token configured');
    }

    // Filter guilds where user has manage permissions
    const managedGuilds = guilds.filter((guild: any) => {
      if (!guild || typeof guild.permissions === 'undefined') return false;
      
      try {
        const permissions = BigInt(guild.permissions);
        const MANAGE_GUILD = BigInt(0x20);
        const ADMINISTRATOR = BigInt(0x8);
        return guild.owner === true || 
               (permissions & MANAGE_GUILD) === MANAGE_GUILD || 
               (permissions & ADMINISTRATOR) === ADMINISTRATOR;
      } catch (err) {
        console.warn('[/api/servers] Error parsing permissions for guild:', guild.id, err);
        return false;
      }
    });

    console.log('[/api/servers] User manages', managedGuilds.length, 'guilds');

    const guildsWithMembership = managedGuilds.map((guild: any) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions,
      inBot: botGuildIds.size > 0 ? botGuildIds.has(guild.id) : undefined,
    }));

    console.log('[/api/servers] Returning', guildsWithMembership.length, 'guilds');
    return NextResponse.json(guildsWithMembership);
    
  } catch (error: any) {
    console.error('[/api/servers] Unhandled error:', {
      message: error?.message,
      stack: error?.stack,
      error
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}