import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';
import { getServerDefaults } from '@/lib/serverDefaults';

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { guildId } = await params;

  await dbConnect();

  let settings = await ServerSettings.findOne({ guildId });

  if (!settings) {
    // Fetch custom defaults from site settings
    const defaults = await getServerDefaults();
    
    // Create new server with custom defaults
    settings = new ServerSettings({ 
      guildId,
      prefix: defaults.prefix,
      premium: defaults.premium,
      modules: defaults.modules,
    });
    await settings.save();
    
    console.log(`[ServerSettings] New server ${guildId} created with custom defaults:`, {
      prefix: defaults.prefix,
      premium: defaults.premium,
      modules: Object.keys(defaults.modules).map(key => ({
        [key]: defaults.modules[key as keyof typeof defaults.modules].enabled
      }))
    });
  }

  return NextResponse.json(settings);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { guildId } = await params;
  const body = await req.json();

  // Strip out forbidden fields that should not be saved
  const { moderation, welcome, goodbye, roles, ...allowedFields } = body;

  await dbConnect();

  const settings = await ServerSettings.findOneAndUpdate(
    { guildId },
    allowedFields,
    { new: true, upsert: true }
  );

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { guildId } = await params;
  const body = await req.json();

  await dbConnect();

  const settings = await ServerSettings.findOneAndUpdate(
    { guildId },
    body,
    { new: true, upsert: true }
  );

  return NextResponse.json(settings);
}