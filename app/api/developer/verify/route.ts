import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const DEVELOPER_USER_ID = '922940896322940929';
const DEVELOPER_PIN = process.env.DEVELOPER_PIN;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    // Check if user is the developer
    if (session.user.id !== DEVELOPER_USER_ID) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { pin } = await req.json();

    if (!pin) {
      return NextResponse.json(
        { error: 'PIN required' },
        { status: 400 }
      );
    }

    // Verify PIN
    if (pin !== DEVELOPER_PIN) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 403 }
      );
    }

    // Generate a temporary token (valid for this session)
    const token = Buffer.from(`${session.user.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      userId: session.user.id,
    });
  } catch (error) {
    console.error('Developer verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
