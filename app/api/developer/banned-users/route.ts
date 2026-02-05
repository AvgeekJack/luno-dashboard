import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import BannedUser from '@/lib/models/BannedUser';

const DEVELOPER_USER_ID = '922940896322940929';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const bannedUsers = await BannedUser.find({ banned: true })
      .sort({ bannedAt: -1 })
      .lean();

    return NextResponse.json({ bannedUsers });
  } catch (error) {
    console.error('Error fetching banned users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banned users' },
      { status: 500 }
    );
  }
}
