import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const { guildId } = await params;

  if (!process.env.DISCORD_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'Bot token not configured' },
      { status: 500 }
    );
  }

  try {
    const headers = {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    };

    // Fetch channels
    const channelsResponse = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      { headers }
    );

    if (!channelsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch channels' },
        { status: channelsResponse.status }
      );
    }

    const allChannels = await channelsResponse.json();
    
    // Filter for text channels only (type 0)
    const channels = allChannels
      .filter((ch: any) => ch.type === 0)
      .map((ch: any) => ({
        id: ch.id,
        name: ch.name,
        type: ch.type,
      }));

    // Fetch roles
    const rolesResponse = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/roles`,
      { headers }
    );

    if (!rolesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch roles' },
        { status: rolesResponse.status }
      );
    }

    const allRoles = await rolesResponse.json();
    
    // Filter out @everyone role and sort by position
    const roles = allRoles
      .filter((r: any) => r.name !== '@everyone')
      .sort((a: any, b: any) => b.position - a.position)
      .map((r: any) => ({
        id: r.id,
        name: r.name,
        color: r.color,
      }));

    return NextResponse.json({ channels, roles });
  } catch (error) {
    console.error('Error fetching channels and roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
