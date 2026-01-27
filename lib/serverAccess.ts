const DEVELOPER_USER_ID = '922940896322940929';

interface UserGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

/**
 * Check if a user has MANAGE_GUILD permission in a specific server
 * Developer can bypass this check
 */
export async function checkServerAccess(userId: string, guildId: string): Promise<boolean> {
  // Developer bypass
  if (userId === DEVELOPER_USER_ID) {
    return true;
  }

  try {
    const DISCORD_API_URL = 'https://discord.com/api/v10';
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) {
      console.error('[ServerAccess] Bot token not configured');
      return false;
    }

    // Check if user is a member of the guild with MANAGE_GUILD permission
    const memberResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/members/${userId}`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!memberResponse.ok) {
      console.log(`[ServerAccess] User ${userId} is not a member of guild ${guildId}`);
      return false;
    }

    const member = await memberResponse.json();

    // Fetch guild info to check if user is owner
    const guildResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!guildResponse.ok) {
      console.error('[ServerAccess] Failed to fetch guild info');
      return false;
    }

    const guild = await guildResponse.json();

    // Owner always has access
    if (guild.owner_id === userId) {
      return true;
    }

    // Check MANAGE_GUILD permission (0x20 = 32)
    const MANAGE_GUILD = 0x20;

    // Fetch guild roles
    const rolesResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/roles`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!rolesResponse.ok) {
      console.error('[ServerAccess] Failed to fetch guild roles');
      return false;
    }

    const roles = await rolesResponse.json();

    // Check if any of the user's roles have MANAGE_GUILD permission
    for (const roleId of member.roles) {
      const role = roles.find((r: any) => r.id === roleId);
      if (role && (BigInt(role.permissions) & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD)) {
        return true;
      }
    }

    // Check @everyone role
    const everyoneRole = roles.find((r: any) => r.id === guildId);
    if (everyoneRole && (BigInt(everyoneRole.permissions) & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD)) {
      return true;
    }

    console.log(`[ServerAccess] User ${userId} does not have MANAGE_GUILD permission in guild ${guildId}`);
    return false;
  } catch (error) {
    console.error('[ServerAccess] Error checking server access:', error);
    return false;
  }
}

/**
 * Get all servers the user has access to (with MANAGE_GUILD permission)
 * Used for the servers list page
 */
export async function getUserAccessibleServers(userId: string): Promise<UserGuild[]> {
  try {
    const DISCORD_API_URL = 'https://discord.com/api/v10';
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) {
      console.error('[ServerAccess] Bot token not configured');
      return [];
    }

    // Fetch bot's guilds
    const botGuildsResponse = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!botGuildsResponse.ok) {
      console.error('[ServerAccess] Failed to fetch bot guilds');
      return [];
    }

    const botGuilds = await botGuildsResponse.json();
    const userGuilds: UserGuild[] = [];

    // For developer, return all bot guilds
    if (userId === DEVELOPER_USER_ID) {
      return botGuilds.map((g: any) => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
        owner: false,
        permissions: '0',
      }));
    }

    // For each bot guild, check if user has access
    for (const guild of botGuilds) {
      const hasAccess = await checkServerAccess(userId, guild.id);
      if (hasAccess) {
        userGuilds.push({
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          owner: false,
          permissions: '0',
        });
      }
    }

    return userGuilds;
  } catch (error) {
    console.error('[ServerAccess] Error getting accessible servers:', error);
    return [];
  }
}
