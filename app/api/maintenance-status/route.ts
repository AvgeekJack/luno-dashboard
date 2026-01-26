import { NextResponse } from 'next/server';
import { isMaintenanceMode } from '@/lib/siteSettings';

export async function GET() {
  try {
    const maintenanceMode = await isMaintenanceMode();
    
    return NextResponse.json({
      maintenanceMode,
    });
  } catch (error) {
    console.error('Maintenance status error:', error);
    return NextResponse.json(
      { maintenanceMode: false },
      { status: 200 }
    );
  }
}
