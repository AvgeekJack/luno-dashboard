import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ guildId: string; module: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId, module } = await params;
    const { enabled } = await req.json();

    const client = await clientPromise;
    const db = client.db('discord-bot');
    
    // Update the module enabled state
    await db.collection('server-settings').updateOne(
      { guildId },
      { 
        $set: { 
          [`modules.${module}.enabled`]: enabled,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}
