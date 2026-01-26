import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import BannedUser from '@/lib/models/BannedUser';

const DEVELOPER_USER_ID = '922940896322940929';

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
    const { userId, banned, reason } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (typeof banned !== 'boolean') {
      return NextResponse.json(
        { error: 'Ban status (true/false) is required' },
        { status: 400 }
      );
    }

    // Validate user ID format (Discord snowflake)
    if (!/^\d{17,19}$/.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid User ID format' },
        { status: 400 }
      );
    }

    // Prevent banning the developer
    if (userId === DEVELOPER_USER_ID) {
      return NextResponse.json(
        { error: 'Cannot ban the developer account' },
        { status: 403 }
      );
    }

    // Connect to database
    await dbConnect();

    let bannedUser = await BannedUser.findOne({ userId });

    if (banned) {
      // Ban the user
      if (!bannedUser) {
        bannedUser = new BannedUser({
          userId,
          banned: true,
          reason: reason || 'No reason provided',
          bannedBy: session.user.id,
        });
      } else {
        bannedUser.banned = true;
        bannedUser.reason = reason || bannedUser.reason;
        bannedUser.bannedBy = session.user.id;
        bannedUser.updatedAt = new Date();
      }
      
      await bannedUser.save();
      
      console.log(`[User Ban] Banned user: ${userId}, Reason: ${bannedUser.reason}`);
      
      return NextResponse.json({
        success: true,
        message: `User ${userId} has been banned`,
        userId,
        reason: bannedUser.reason,
      });
    } else {
      // Unban the user
      if (bannedUser) {
        bannedUser.banned = false;
        bannedUser.updatedAt = new Date();
        await bannedUser.save();
      }
      
      console.log(`[User Ban] Unbanned user: ${userId}`);
      
      return NextResponse.json({
        success: true,
        message: `User ${userId} has been unbanned`,
        userId,
      });
    }

  } catch (error: any) {
    console.error('[User Ban] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update ban status',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if a user is banned
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const bannedUser = await BannedUser.findOne({ userId, banned: true });
    
    return NextResponse.json({
      banned: !!bannedUser,
      reason: bannedUser?.reason || null,
      bannedAt: bannedUser?.bannedAt || null,
    });

  } catch (error: any) {
    console.error('[User Ban Check] Error:', error);
    return NextResponse.json(
      { banned: false },
      { status: 200 }
    );
  }
}
