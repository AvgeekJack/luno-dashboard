import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import process from 'node:process';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      console.log('Session check failed:', { hasSession: !!session, hasAccessToken: !!session?.accessToken });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user guilds:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: 500 });
    }

    const guilds = await response.json();

    // Ensure guilds is an array
    if (!Array.isArray(guilds)) {
      console.error('Guilds response is not an array:', guilds);
      return NextResponse.json({ error: 'Invalid guilds data' }, { status: 500 });
    }

    // Optionally fetch guilds the bot is in to mark membership
    const botGuildIds = new Set<string>();
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (botToken) {
      try {
        const botRes = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: { Authorization: `Bot ${botToken}` },
        });
        if (botRes.ok) {
          const botGuilds = await botRes.json();
          if (Array.isArray(botGuilds)) {
            for (const g of botGuilds) {
              if (g.id) botGuildIds.add(g.id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch bot guilds', err);
      }
    }

    // Filter guilds where user has manage permissions
    const managedGuilds = guilds.filter((guild: any) => {
      const permissions = BigInt(guild.permissions);
      const manageGuild = BigInt(0x20);
      const administrator = BigInt(0x8);
      return guild.owner || (permissions & manageGuild) || (permissions & administrator);
    });

    const guildsWithMembership = managedGuilds.map((guild: any) => ({
      ...guild,
      inBot: botGuildIds.size > 0 ? botGuildIds.has(guild.id) : undefined,
    }));

    return NextResponse.json(guildsWithMembership);
  } catch (error) {
    console.error('Error in /api/servers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}