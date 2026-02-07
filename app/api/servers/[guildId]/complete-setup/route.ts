import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import ServerSettings from '@/lib/models/ServerSettings';

export async function POST(
  req: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { guildId } = params;
    const body = await req.json();
    const { config, skipSetup } = body;

    await connectDB();

    const updateData: any = {
      setupCompleted: true,
      setupCompletedAt: new Date(),
    };

    // Only apply configuration if not skipping setup
    if (!skipSetup && config) {
      // Update prefix
      if (config.prefix) {
        updateData.prefix = config.prefix;
      }

      // Update modules
      if (config.modules) {
        Object.keys(config.modules).forEach((module) => {
          if (config.modules[module] !== undefined) {
            updateData[`modules.${module}.enabled`] = config.modules[module];
          }
        });
      }

      // Update features (configuration)
      if (config.features) {
        if (config.features.logging !== undefined) {
          updateData['configuration.logging.enabled'] = config.features.logging;
        }
        if (config.features.antiraid !== undefined) {
          updateData['configuration.antiraid.enabled'] = config.features.antiraid;
        }
        if (config.features.automod !== undefined) {
          updateData['configuration.automod.enabled'] = config.features.automod;
        }
      }
    }

    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: skipSetup ? 'Setup marked as completed' : 'Setup completed successfully',
      settings,
    });
  } catch (error) {
    console.error('Complete setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
