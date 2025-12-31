import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: 500 });
  }

  const guilds = await response.json();

  // Filter guilds where user has manage permissions
  const managedGuilds = guilds.filter((guild: any) => {
    const permissions = BigInt(guild.permissions);
    const manageGuild = BigInt(0x20);
    const administrator = BigInt(0x8);
    return guild.owner || (permissions & manageGuild) || (permissions & administrator);
  });

  return NextResponse.json(managedGuilds);
}