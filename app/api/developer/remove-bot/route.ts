import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const DEVELOPER_USER_ID = '922940896322940929';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Verify user is developer
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.id !== DEVELOPER_USER_ID) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { guildId } = body;

    if (!guildId || typeof guildId !== 'string') {
      return NextResponse.json(
        { error: 'Guild ID is required' },
        { status: 400 }
      );
    }

    // Validate guild ID format (should be a snowflake ID)
    if (!/^\d{17,19}$/.test(guildId)) {
      return NextResponse.json(
        { error: 'Invalid Guild ID format' },
        { status: 400 }
      );
    }

    if (!BOT_TOKEN) {
      console.error('[Remove Bot] BOT_TOKEN not configured');
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }

    // Make the bot leave the guild using Discord API
    console.log(`[Remove Bot] Attempting to remove bot from guild: ${guildId}`);
    console.log(`[Remove Bot] Bot token starts with: ${BOT_TOKEN.substring(0, 20)}...`);
    console.log(`[Remove Bot] Using endpoint: https://discord.com/api/v10/users/@me/guilds/${guildId}`);
    
    const discordResponse = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${guildId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bot ${BOT_TOKEN}`,
        },
      }
    );

    if (!discordResponse.ok) {
      let errorDetails;
      try {
        errorDetails = await discordResponse.json();
      } catch {
        errorDetails = await discordResponse.text();
      }
      console.error('[Remove Bot] Discord API error:', discordResponse.status, JSON.stringify(errorDetails, null, 2));
      
      if (discordResponse.status === 404) {
        return NextResponse.json(
          { error: 'Bot is not in that server or Guild ID not found', details: errorDetails },
          { status: 404 }
        );
      }
      
      if (discordResponse.status === 401 || discordResponse.status === 403) {
        return NextResponse.json(
          { error: 'Bot authentication failed - check bot token', details: errorDetails },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          error: `Failed to remove bot: ${discordResponse.status}`,
          details: errorDetails,
          guildId: guildId
        },
        { status: discordResponse.status }
      );
    }

    console.log(`[Remove Bot] ✅ Successfully removed bot from guild: ${guildId}`);
    
    return NextResponse.json({
      success: true,
      message: `Bot successfully removed from server ${guildId}`,
      guildId,
    });

  } catch (error: any) {
    console.error('[Remove Bot] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to remove bot from server',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
