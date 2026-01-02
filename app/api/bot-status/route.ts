import { NextResponse } from 'next/server';

// In-memory storage for bot heartbeat
let lastHeartbeat: number = 0;

export async function GET() {
  try {
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeat;
    
    // Consider bot online if heartbeat was within last 60 seconds
    const isOnline = timeSinceLastHeartbeat < 60000;
    
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

// Endpoint for bot to POST heartbeat
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    console.log('[Bot Status] POST request received');
    console.log('[Bot Status] Auth header:', authHeader ? 'Present' : 'Missing');
    
    // Verify the request is from your bot
    const expectedAuth = `Bearer ${process.env.DISCORD_BOT_TOKEN}`;
    
    if (!authHeader) {
      console.error('[Bot Status] No authorization header provided');
      return NextResponse.json({ error: 'Unauthorized - No auth header' }, { status: 401 });
    }
    
    if (authHeader !== expectedAuth) {
      console.error('[Bot Status] Invalid authorization token');
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }
    
    lastHeartbeat = Date.now();
    console.log('[Bot Status] Heartbeat updated successfully:', new Date(lastHeartbeat).toISOString());
    
    return NextResponse.json({ 
      success: true,
      timestamp: lastHeartbeat,
      message: 'Heartbeat received'
    });
  } catch (error: any) {
    console.error('[Bot Status] Error processing heartbeat:', error);
    return NextResponse.json({ 
      error: 'Failed to update heartbeat',
      details: error.message 
    }, { status: 500 });
  }
}
