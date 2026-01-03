import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    let settings = await ServerSettings.findOne({ guildId });
    if (!settings) {
      settings = await ServerSettings.create({ guildId });
    }

    return NextResponse.json({
      prefix: settings.prefix,
      botNickname: settings.configuration?.botNickname || '',
      timezone: settings.configuration?.timezone || 'UTC',
      configuration: {
        botNickname: settings.configuration?.botNickname || '',
        timezone: settings.configuration?.timezone || 'UTC',
        automod: settings.configuration?.automod || {},
        logging: settings.configuration?.logging || {},
      },
    });
  } catch (error) {
    console.error('Error fetching general settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    await connectDB();

    // Handle different update scenarios
    const updateFields: any = {};

    // Handle prefix update
    if (body.prefix !== undefined) {
      const prefix = body.prefix.toString().trim();
      if (!prefix || prefix.length > 5) {
        return NextResponse.json(
          { error: 'Prefix must be 1-5 characters' },
          { status: 400 }
        );
      }
      updateFields.prefix = prefix;
    }

    // Handle bot nickname update
    if (body.botNickname !== undefined) {
      updateFields['configuration.botNickname'] = body.botNickname.toString().trim();
    }

    // Handle timezone update
    if (body.timezone !== undefined) {
      updateFields['configuration.timezone'] = body.timezone.toString().trim();
    }

    // Handle full automod configuration update
    if (body['configuration.automod'] !== undefined) {
      // Update each automod field individually
      const automodSettings = body['configuration.automod'];
      Object.keys(automodSettings).forEach(key => {
        updateFields[`configuration.automod.${key}`] = automodSettings[key];
      });
    }

    // Handle full logging configuration update
    if (body['configuration.logging'] !== undefined) {
      // Update each logging field individually
      const loggingSettings = body['configuration.logging'];
      Object.keys(loggingSettings).forEach(key => {
        updateFields[`configuration.logging.${key}`] = loggingSettings[key];
      });
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updated = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      prefix: updated.prefix,
      botNickname: updated.configuration?.botNickname || '',
      timezone: updated.configuration?.timezone || 'UTC',
      configuration: {
        botNickname: updated.configuration?.botNickname || '',
        timezone: updated.configuration?.timezone || 'UTC',
        automod: updated.configuration?.automod || {},
        logging: updated.configuration?.logging || {},
      },
    });
  } catch (error) {
    console.error('Error updating general settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
