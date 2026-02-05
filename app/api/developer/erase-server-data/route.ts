import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

const DEVELOPER_USER_ID = '922940896322940929';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { guildId } = body;

    if (!guildId || typeof guildId !== 'string') {
      return NextResponse.json({ error: 'Guild ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Delete all server data from MongoDB
    await ServerSettings.deleteOne({ guildId });

    console.log(`[Server Data] All data erased for guild: ${guildId} by ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: `All MongoDB data for server ${guildId} has been erased`,
      guildId,
    });
  } catch (error: any) {
    console.error('[Server Data Erase] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to erase server data',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
