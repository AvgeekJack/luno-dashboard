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
      verification: settings.configuration?.verification || {
        enabled: false,
        verificationMethod: 'button',
        verificationChannel: null,
        messageTitle: 'Server Verification',
        messageDescription: 'Click the button below to verify and gain access to the server!',
        messageColor: '#5865F2',
        verifiedRole: null,
        unverifiedRole: null,
        rulesText: 'By verifying, you agree to follow our server rules.',
        accountAgeRequirement: 0,
        requireServerAgreement: true,
        multipleSteps: false,
        welcomeDM: false,
        welcomeDMMessage: 'Welcome to the server! You have been verified.',
        additionalRoles: [],
        redirectChannel: null,
        removeVerificationMessages: true,
        logChannel: null,
        antiAltProtection: false,
        kickUnverifiedAfter: 0,
        verificationBypassRoles: [],
        verificationCooldown: 0,
        trackVerificationMetrics: true,
        logFailedAttempts: true,
      },
    });
  } catch (error) {
    console.error('Error fetching verification settings:', error);
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

    const updateFields: any = {};
    
    if (body.enabled !== undefined) {
      updateFields['configuration.verification.enabled'] = body.enabled;
    }
    
    if (body.verificationMethod !== undefined) {
      updateFields['configuration.verification.verificationMethod'] = body.verificationMethod;
    }
    
    if (body.verificationChannel !== undefined) {
      updateFields['configuration.verification.verificationChannel'] = body.verificationChannel;
    }
    
    if (body.messageTitle !== undefined) {
      updateFields['configuration.verification.messageTitle'] = body.messageTitle;
    }
    
    if (body.messageDescription !== undefined) {
      updateFields['configuration.verification.messageDescription'] = body.messageDescription;
    }
    
    if (body.messageColor !== undefined) {
      updateFields['configuration.verification.messageColor'] = body.messageColor;
    }
    
    if (body.verifiedRole !== undefined) {
      updateFields['configuration.verification.verifiedRole'] = body.verifiedRole;
    }
    
    if (body.unverifiedRole !== undefined) {
      updateFields['configuration.verification.unverifiedRole'] = body.unverifiedRole;
    }
    
    if (body.rulesText !== undefined) {
      updateFields['configuration.verification.rulesText'] = body.rulesText;
    }
    
    if (body.accountAgeRequirement !== undefined) {
      updateFields['configuration.verification.accountAgeRequirement'] = body.accountAgeRequirement;
    }
    
    if (body.requireServerAgreement !== undefined) {
      updateFields['configuration.verification.requireServerAgreement'] = body.requireServerAgreement;
    }
    
    if (body.multipleSteps !== undefined) {
      updateFields['configuration.verification.multipleSteps'] = body.multipleSteps;
    }
    
    if (body.welcomeDM !== undefined) {
      updateFields['configuration.verification.welcomeDM'] = body.welcomeDM;
    }
    
    if (body.welcomeDMMessage !== undefined) {
      updateFields['configuration.verification.welcomeDMMessage'] = body.welcomeDMMessage;
    }
    
    if (body.additionalRoles !== undefined) {
      updateFields['configuration.verification.additionalRoles'] = body.additionalRoles;
    }
    
    if (body.redirectChannel !== undefined) {
      updateFields['configuration.verification.redirectChannel'] = body.redirectChannel;
    }
    
    if (body.removeVerificationMessages !== undefined) {
      updateFields['configuration.verification.removeVerificationMessages'] = body.removeVerificationMessages;
    }
    
    if (body.logChannel !== undefined) {
      updateFields['configuration.verification.logChannel'] = body.logChannel;
    }
    
    if (body.antiAltProtection !== undefined) {
      updateFields['configuration.verification.antiAltProtection'] = body.antiAltProtection;
    }
    
    if (body.kickUnverifiedAfter !== undefined) {
      updateFields['configuration.verification.kickUnverifiedAfter'] = body.kickUnverifiedAfter;
    }
    
    if (body.verificationBypassRoles !== undefined) {
      updateFields['configuration.verification.verificationBypassRoles'] = body.verificationBypassRoles;
    }
    
    if (body.verificationCooldown !== undefined) {
      updateFields['configuration.verification.verificationCooldown'] = body.verificationCooldown;
    }
    
    if (body.trackVerificationMetrics !== undefined) {
      updateFields['configuration.verification.trackVerificationMetrics'] = body.trackVerificationMetrics;
    }
    
    if (body.logFailedAttempts !== undefined) {
      updateFields['configuration.verification.logFailedAttempts'] = body.logFailedAttempts;
    }

    const settings = await ServerSettings.findOneAndUpdate(
      { guildId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      verification: settings.configuration?.verification || {},
    });
  } catch (error) {
    console.error('Error updating verification settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
