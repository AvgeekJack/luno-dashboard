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
    const botToken = request.headers.get('authorization');
    
    // Verify the request is from your bot (using a secret or bot token)
    if (botToken !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    lastHeartbeat = Date.now();
    
    return NextResponse.json({ 
      success: true,
      timestamp: lastHeartbeat
    });
  } catch (error) {
    console.error('Bot heartbeat error:', error);
    return NextResponse.json({ error: 'Failed to update heartbeat' }, { status: 500 });
  }
}
