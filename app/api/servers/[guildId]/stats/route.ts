import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import process from 'node:process';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
  }

  const { guildId } = await params;

  try {
    const guildRes = await fetch(`https://discord.com/api/guilds/${guildId}?with_counts=true`, {
      headers: { Authorization: `Bot ${botToken}` },
      cache: 'no-store',
    });

    if (!guildRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch guild info' }, { status: 502 });
    }

    const guildData = await guildRes.json();

    const [channelsRes, rolesRes] = await Promise.all([
      fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${botToken}` },
        cache: 'no-store',
      }),
      fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${botToken}` },
        cache: 'no-store',
      }),
    ]);

    const channels = channelsRes.ok ? await channelsRes.json() : [];
    const roles = rolesRes.ok ? await rolesRes.json() : [];

    let textChannels = 0;
    let voiceChannels = 0;
    let categories = 0;

    for (const ch of channels) {
      if (ch?.type === 0) textChannels += 1; // text
      if (ch?.type === 2) voiceChannels += 1; // voice
      if (ch?.type === 4) categories += 1; // category
    }

    const response = {
      members: guildData?.approximate_member_count ?? null,
      presences: guildData?.approximate_presence_count ?? null,
      textChannels,
      voiceChannels,
      categories,
      roles: Array.isArray(roles) ? roles.length : null,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('Failed to fetch guild stats', err);
    return NextResponse.json({ error: 'Failed to fetch guild stats' }, { status: 500 });
  }
}
