import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json({ online: false, error: 'Bot token not configured' }, { status: 500 });
    }

    // Get bot user info from Discord API
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (response.ok) {
      const botData = await response.json();
      return NextResponse.json({ 
        online: true, 
        username: botData.username,
        id: botData.id 
      });
    } else {
      return NextResponse.json({ online: false }, { status: 200 });
    }
  } catch (error) {
    console.error('Bot status check error:', error);
    return NextResponse.json({ online: false }, { status: 200 });
  }
}
