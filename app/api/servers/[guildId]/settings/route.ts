import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { guildId } = await params;

  await dbConnect();

  let settings = await ServerSettings.findOne({ guildId });

  if (!settings) {
    settings = new ServerSettings({ guildId });
    await settings.save();
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

  await dbConnect();

  const settings = await ServerSettings.findOneAndUpdate(
    { guildId },
    body,
    { new: true, upsert: true }
  );

  return NextResponse.json(settings);
}