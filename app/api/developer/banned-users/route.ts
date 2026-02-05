import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import BannedUser from '@/lib/models/BannedUser';

const DEVELOPER_USER_ID = '922940896322940929';

async function fetchDiscordUser(userId: string) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (response.ok) {
      const user = await response.json();
      return {
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar 
          ? `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`,
      };
    }
  } catch (error) {
    console.error(`Error fetching Discord user ${userId}:`, error);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const bannedUsers = await BannedUser.find({ banned: true })
      .sort({ bannedAt: -1 })
      .lean();

    // Fetch Discord user info for each banned user
    const bannedUsersWithInfo = await Promise.all(
      bannedUsers.map(async (user) => {
        const discordUser = await fetchDiscordUser(user.userId);
        return {
          ...user,
          username: discordUser?.username,
          avatar: discordUser?.avatar,
        };
      })
    );

    return NextResponse.json({ bannedUsers: bannedUsersWithInfo });
  } catch (error) {
    console.error('Error fetching banned users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banned users' },
      { status: 500 }
    );
  }
}
