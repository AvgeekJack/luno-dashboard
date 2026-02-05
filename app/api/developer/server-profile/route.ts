import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

const DEVELOPER_USER_ID = '922940896322940929';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const guildId = searchParams.get('guildId');

    if (!guildId) {
      return NextResponse.json({ error: 'Guild ID is required' }, { status: 400 });
    }

    // Fetch Discord guild info
    let guildInfo: any = {};
    try {
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      });

      if (response.ok) {
        const guild = await response.json();
        guildInfo = {
          name: guild.name,
          icon: guild.icon
            ? `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=128`
            : null,
          memberCount: guild.approximate_member_count || guild.member_count,
          ownerId: guild.owner_id,
        };
      }
    } catch (error) {
      console.error('Error fetching Discord guild:', error);
    }

    // Fetch MongoDB settings
    await dbConnect();
    const settings = await ServerSettings.findOne({ guildId }).lean();

    return NextResponse.json({
      guildId,
      ...guildInfo,
      prefix: settings?.prefix || '!',
      isPremium: settings?.premium || false,
      hasSettings: !!settings,
    });
  } catch (error) {
    console.error('Error fetching server profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch server profile' },
      { status: 500 }
    );
  }
}
