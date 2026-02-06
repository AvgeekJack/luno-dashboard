import { NextRequest, NextResponse } from 'next/server';
import { encode } from 'next-auth/jwt';

const DEVELOPER_PIN = process.env.DEVELOPER_PIN;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, pin } = body;

    // Validate required fields
    if (!userId || !pin) {
      return NextResponse.json(
        { error: 'User ID and PIN are required' },
        { status: 400 }
      );
    }

    // Verify developer PIN
    if (pin !== DEVELOPER_PIN) {
      return NextResponse.json(
        { error: 'Invalid developer PIN' },
        { status: 401 }
      );
    }

    // Verify user exists and has authorized with Discord
    try {
      const userResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      });

      if (!userResponse.ok) {
        return NextResponse.json(
          { error: 'User ID not found or has not authorized with Luno' },
          { status: 404 }
        );
      }

      const userData = await userResponse.json();

      // Create a JWT session token manually
      const token = await encode({
        token: {
          userId: userId,
          userName: userData.username,
          sub: userId,
          masterLoginVerified: true, // Flag to indicate this session came through master login
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        },
        secret: process.env.NEXTAUTH_SECRET!,
        maxAge: 30 * 24 * 60 * 60,
      });

      // Set the session cookie
      const response = NextResponse.json({ success: true, username: userData.username });
      
      const cookieName = process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token';

      response.cookies.set(cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return response;
    } catch (error) {
      console.error('Discord API error:', error);
      return NextResponse.json(
        { error: 'Failed to verify user with Discord' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Master login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
