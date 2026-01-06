import { NextResponse } from 'next/server';

// In-memory storage for bot statistics
let botStats = {
  serverCount: 0,
  memberCount: 0,
  commandCount: 150, // This is static as it's based on bot features
  lastUpdate: 0
};

export async function GET() {
  try {
    console.log('[Bot Stats] GET request - Current stats:', botStats);
    return NextResponse.json({ 
      serverCount: botStats.serverCount,
      memberCount: botStats.memberCount,
      commandCount: botStats.commandCount,
      lastUpdate: botStats.lastUpdate || null
    });
  } catch (error) {
    console.error('[Bot Stats] GET error:', error);
    return NextResponse.json({ 
      serverCount: 0,
      memberCount: 0,
      commandCount: 150,
      lastUpdate: null
    }, { status: 200 });
  }
}

// POST endpoint to update stats from the bot
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[Bot Stats] POST request received with body:', body);
    
    if (body.serverCount !== undefined) {
      botStats.serverCount = Number(body.serverCount);
    }
    if (body.memberCount !== undefined) {
      botStats.memberCount = Number(body.memberCount);
    }
    if (body.commandCount !== undefined) {
      botStats.commandCount = Number(body.commandCount);
    }
    
    botStats.lastUpdate = Date.now();
    
    console.log('[Bot Stats] ✅ Stats updated successfully:', botStats);
    
    return NextResponse.json({ 
      success: true,
      stats: botStats
    });
  } catch (error: any) {
    console.error('[Bot Stats] POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to update stats',
      message: error.message
    }, { status: 500 });
  }
}
