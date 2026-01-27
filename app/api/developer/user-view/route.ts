import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const DEVELOPER_USER_ID = '922940896322940929';

async function verifyDeveloperAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
    return false;
  }
  return true;
}

// GET - Fetch user's Discord account info and their servers
export async function GET(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user's Discord info using Discord API
    const DISCORD_API_URL = 'https://discord.com/api/v10';
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }

    // Fetch user info
    const userResponse = await fetch(`${DISCORD_API_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch user from Discord' },
        { status: userResponse.status }
      );
    }

    const user = await userResponse.json();

    // Fetch bot's guilds to see which servers the bot is in
    const botGuildsResponse = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!botGuildsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch bot guilds' },
        { status: 500 }
      );
    }

    const botGuilds = await botGuildsResponse.json();
    const botGuildIds = botGuilds.map((g: any) => g.id);

    // For each guild the bot is in, check if the user is a member with MANAGE_GUILD permission
    const userGuilds = [];
    
    for (const guildId of botGuildIds) {
      try {
        // Fetch guild member info
        const memberResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/members/${userId}`, {
          headers: {
            'Authorization': `Bot ${BOT_TOKEN}`,
          },
        });

        if (memberResponse.ok) {
          const member = await memberResponse.json();
          
          // Fetch guild info
          const guildResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}`, {
            headers: {
              'Authorization': `Bot ${BOT_TOKEN}`,
            },
          });

          if (guildResponse.ok) {
            const guild = await guildResponse.json();
            
            // Check if user has MANAGE_GUILD permission (0x20 = 32)
            const MANAGE_GUILD = 0x20;
            const isOwner = guild.owner_id === userId;
            
            // Calculate permissions (this is simplified - in reality Discord has complex permission calculation)
            let hasManageGuild = isOwner;
            
            if (!hasManageGuild && member.roles && member.roles.length > 0) {
              // Fetch guild roles
              const rolesResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/roles`, {
                headers: {
                  'Authorization': `Bot ${BOT_TOKEN}`,
                },
              });
              
              if (rolesResponse.ok) {
                const roles = await rolesResponse.json();
                for (const roleId of member.roles) {
                  const role = roles.find((r: any) => r.id === roleId);
                  if (role && (role.permissions & MANAGE_GUILD) === MANAGE_GUILD) {
                    hasManageGuild = true;
                    break;
                  }
                }
              }
            }

            if (hasManageGuild) {
              userGuilds.push({
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                owner: isOwner,
                permissions: member.permissions || '0',
              });
            }
          }
        }
      } catch (error) {
        // Skip guilds that error out
        console.error(`Error checking guild ${guildId} for user ${userId}:`, error);
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        bot: user.bot || false,
        globalName: user.global_name || null,
      },
      guilds: userGuilds,
      guildsCount: userGuilds.length,
    });
  } catch (error) {
    console.error('User view error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
