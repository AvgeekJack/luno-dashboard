import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ guildId: string; module: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId, module } = await params;
    await connectDB();

    const settings = await ServerSettings.findOne({ guildId });
    const moduleKey = module.replace(/-/g, '');
    const enabled = settings?.modules?.[moduleKey] ?? true;

    return NextResponse.json({ enabled });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 });
  }
}

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
    await connectDB();

    // Convert kebab-case to camelCase for schema (e.g., 'role-management' -> 'roleManagement')
    const moduleKey = module.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: { [`modules.${moduleKey}`]: enabled } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}
