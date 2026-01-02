import { NextResponse } from 'next/server';

// In-memory storage for bot heartbeat
let lastHeartbeat: number = 0;

export async function GET() {
  try {
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeat;
    
    // Consider bot online if heartbeat was within last 60 seconds
    const isOnline = lastHeartbeat > 0 && timeSinceLastHeartbeat < 60000;
    
    return NextResponse.json({ 
      online: isOnline,
      lastHeartbeat: lastHeartbeat || null,
      timeSinceLastHeartbeat: lastHeartbeat ? timeSinceLastHeartbeat : null
    });
  } catch (error) {
    console.error('Bot status check error:', error);
    return NextResponse.json({ online: false }, { status: 200 });
  }
}

// Simple POST endpoint - no auth required for simplicity
export async function POST(request: Request) {
  try {
    lastHeartbeat = Date.now();
    console.log('[Bot Status] ✅ Heartbeat received at:', new Date(lastHeartbeat).toISOString());
    
    return NextResponse.json({ 
      success: true,
      timestamp: lastHeartbeat
    });
  } catch (error: any) {
    console.error('[Bot Status] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to update heartbeat'
    }, { status: 500 });
  }
}
