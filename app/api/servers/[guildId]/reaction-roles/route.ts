import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('luno_bot');
    
    const serverSettings = await db.collection('server_settings').findOne({
      guildId: params.guildId,
    });

    const settings = serverSettings?.configuration?.reactionRoles || {
      enabled: false,
      panels: [],
      roleLimit: 5,
      requiredRole: null,
      blacklistedRoles: [],
      allowRoleStacking: true,
      autoDeleteReactions: false,
      dmOnRoleAdd: false,
      dmOnRoleRemove: false,
      dmMessageAdd: 'You have been given the {role} role!',
      dmMessageRemove: 'The {role} role has been removed from you.',
      rolePersistence: true,
      reactionCooldown: 0,
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching reaction roles settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();

    const client = await clientPromise;
    const db = client.db('luno_bot');
    
    await db.collection('server_settings').updateOne(
      { guildId: params.guildId },
      {
        $set: {
          'configuration.reactionRoles': settings,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving reaction roles settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
