import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import process from 'node:process';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in /api/servers:', session ? 'exists' : 'null', session?.accessToken ? 'has token' : 'no token');

    if (!session || !session.accessToken) {
      console.log('Unauthorized: No session or access token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching guilds from Discord API...');
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch user guilds:', response.status, response.statusText, errorText);
      return NextResponse.json({ error: 'Failed to fetch guilds', details: errorText }, { status: 500 });
    }

    const guilds = await response.json();
    console.log('Received guilds from Discord:', guilds.length, 'guilds');

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
            console.log('Bot is in', botGuilds.length, 'guilds');
            for (const g of botGuilds) {
              if (g.id) botGuildIds.add(g.id);
            }
          }
        } else {
          console.log('Failed to fetch bot guilds:', botRes.status);
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

    console.log('User has manage permissions in', managedGuilds.length, 'guilds');

    const guildsWithMembership = managedGuilds.map((guild: any) => ({
      ...guild,
      inBot: botGuildIds.size > 0 ? botGuildIds.has(guild.id) : undefined,
    }));

    console.log('Returning', guildsWithMembership.length, 'guilds to frontend');
    return NextResponse.json(guildsWithMembership);
  } catch (error) {
    console.error('Error in /api/servers:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}