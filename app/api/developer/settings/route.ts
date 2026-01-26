import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import SiteSettings from '@/lib/models/SiteSettings';

const DEVELOPER_USER_ID = '922940896322940929';

// Verify developer access
async function verifyDeveloperAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || session.user.id !== DEVELOPER_USER_ID) {
    return false;
  }
  
  return true;
}

// GET - Fetch all site settings
export async function GET(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    await connectDB();

    const settings = await SiteSettings.find({}).sort({ settingKey: 1 });

    // Initialize default settings if they don't exist
    const defaultSettings = [
      { 
        settingKey: 'premiumPurchaseEnabled', 
        settingValue: true, 
        description: 'Allow users to purchase premium subscriptions' 
      },
      { 
        settingKey: 'maintenanceMode', 
        settingValue: false, 
        description: 'Enable maintenance mode (restricts access)' 
      },
      { 
        settingKey: 'newUserSignupsEnabled', 
        settingValue: true, 
        description: 'Allow new user registrations' 
      },
      { 
        settingKey: 'botCommandsEnabled', 
        settingValue: true, 
        description: 'Enable bot command execution' 
      },
      { 
        settingKey: 'maxServersPerUser', 
        settingValue: 100, 
        description: 'Maximum servers a user can manage' 
      },
    ];

    // Create default settings if they don't exist
    for (const defaultSetting of defaultSettings) {
      const exists = settings.find(s => s.settingKey === defaultSetting.settingKey);
      if (!exists) {
        await SiteSettings.create(defaultSetting);
      }
    }

    // Fetch updated settings
    const allSettings = await SiteSettings.find({}).sort({ settingKey: 1 });

    return NextResponse.json({
      settings: allSettings,
    });
  } catch (error) {
    console.error('Developer settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a site setting
export async function PUT(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    const session = await getServerSession(authOptions);
    const { settingKey, settingValue } = await req.json();

    if (!settingKey) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedSetting = await SiteSettings.findOneAndUpdate(
      { settingKey },
      { 
        settingValue, 
        updatedAt: new Date(),
        updatedBy: session?.user?.id 
      },
      { new: true, upsert: true }
    );

    console.log(`[DEVELOPER] Setting updated: ${settingKey} = ${settingValue} by ${session?.user?.id}`);

    return NextResponse.json({
      success: true,
      setting: updatedSetting,
    });
  } catch (error) {
    console.error('Developer settings PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new site setting
export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    const session = await getServerSession(authOptions);
    const { settingKey, settingValue, description } = await req.json();

    if (!settingKey) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const newSetting = await SiteSettings.create({
      settingKey,
      settingValue,
      description,
      updatedBy: session?.user?.id,
    });

    console.log(`[DEVELOPER] New setting created: ${settingKey} = ${settingValue} by ${session?.user?.id}`);

    return NextResponse.json({
      success: true,
      setting: newSetting,
    });
  } catch (error) {
    console.error('Developer settings POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a site setting
export async function DELETE(req: NextRequest) {
  try {
    const isAuthorized = await verifyDeveloperAccess();
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Developer access only' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const settingKey = searchParams.get('settingKey');

    if (!settingKey) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      );
    }

    await connectDB();

    await SiteSettings.findOneAndDelete({ settingKey });

    console.log(`[DEVELOPER] Setting deleted: ${settingKey}`);

    return NextResponse.json({
      success: true,
      message: `Setting ${settingKey} deleted`,
    });
  } catch (error) {
    console.error('Developer settings DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
