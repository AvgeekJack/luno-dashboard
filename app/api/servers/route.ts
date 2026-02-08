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

    if (!session) {
      console.error('[/api/servers] No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let guilds: any[];

    // If we have an access token (normal Discord OAuth), use it
    if (session.accessToken) {
      console.log('[/api/servers] Fetching user guilds from Discord with OAuth token');
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

      guilds = await response.json();
    } else {
      // Master login scenario - fetch guilds via bot token
      console.log('[/api/servers] Master login detected - fetching guilds via bot token');
      const botToken = process.env.DISCORD_BOT_TOKEN;
      
      if (!botToken) {
        console.error('[/api/servers] No bot token available for master login');
        return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
      }

      // Get all bot guilds
      const botGuildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bot ${botToken}` },
      });

      if (!botGuildsResponse.ok) {
        console.error('[/api/servers] Failed to fetch bot guilds');
        return NextResponse.json({ error: 'Failed to fetch bot guilds' }, { status: 500 });
      }

      const allBotGuilds = await botGuildsResponse.json();
      
      // Filter guilds where the user has MANAGE_GUILD permission
      const userId = session.user?.id;
      if (!userId) {
        console.error('[/api/servers] No user ID in session');
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }

      // Check each guild for user membership and permissions
      guilds = [];
      for (const guild of allBotGuilds) {
        try {
          const memberResponse = await fetch(
            `https://discord.com/api/guilds/${guild.id}/members/${userId}`,
            { headers: { Authorization: `Bot ${botToken}` } }
          );

          if (memberResponse.ok) {
            const member = await memberResponse.json();
            
            // Check if user is owner or has MANAGE_GUILD permission
            const guildResponse = await fetch(
              `https://discord.com/api/guilds/${guild.id}`,
              { headers: { Authorization: `Bot ${botToken}` } }
            );

            if (guildResponse.ok) {
              const guildData = await guildResponse.json();
              const isOwner = guildData.owner_id === userId;
              
              // Check role permissions
              let hasManageGuild = false;
              if (member.roles && member.roles.length > 0 && guildData.roles) {
                for (const roleId of member.roles) {
                  const role = guildData.roles.find((r: any) => r.id === roleId);
                  if (role) {
                    const permissions = BigInt(role.permissions);
                    const MANAGE_GUILD = BigInt(0x20);
                    const ADMINISTRATOR = BigInt(0x8);
                    if ((permissions & MANAGE_GUILD) === MANAGE_GUILD || 
                        (permissions & ADMINISTRATOR) === ADMINISTRATOR) {
                      hasManageGuild = true;
                      break;
                    }
                  }
                }
              }

              if (isOwner || hasManageGuild) {
                // Calculate permissions bitfield
                let permissionsBitfield = BigInt(0);
                if (isOwner) {
                  permissionsBitfield = BigInt('0x8'); // Administrator
                } else if (hasManageGuild) {
                  permissionsBitfield = BigInt('0x20'); // Manage Guild
                }

                guilds.push({
                  id: guild.id,
                  name: guild.name,
                  icon: guild.icon,
                  owner: isOwner,
                  permissions: permissionsBitfield.toString()
                });
              }
            }
          }
        } catch (err) {
          console.warn('[/api/servers] Error checking guild:', guild.id, err);
        }
      }
    }

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

    // Fetch member counts for guilds the bot is in
    const guildMemberCounts = new Map<string, number>();
    if (botToken && botGuildIds.size > 0) {
      try {
        console.log('[/api/servers] Fetching member counts for bot guilds');
        const memberCountPromises = Array.from(botGuildIds).map(async (guildId) => {
          try {
            const guildRes = await fetch(`https://discord.com/api/guilds/${guildId}?with_counts=true`, {
              headers: { Authorization: `Bot ${botToken}` },
            });
            if (guildRes.ok) {
              const guildData = await guildRes.json();
              if (guildData.approximate_member_count) {
                guildMemberCounts.set(guildId, guildData.approximate_member_count);
              }
            }
          } catch (err) {
            console.warn('[/api/servers] Failed to fetch member count for guild:', guildId);
          }
        });
        await Promise.all(memberCountPromises);
        console.log('[/api/servers] Fetched member counts for', guildMemberCounts.size, 'guilds');
      } catch (err) {
        console.warn('[/api/servers] Error fetching member counts:', err);
      }
    }

    const guildsWithMembership = managedGuilds.map((guild: any) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions,
      inBot: botGuildIds.size > 0 ? botGuildIds.has(guild.id) : undefined,
      memberCount: guildMemberCounts.get(guild.id) || null,
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