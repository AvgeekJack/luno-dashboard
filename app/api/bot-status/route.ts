import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';

// MongoDB schema for bot status
const BotStatusSchema = new mongoose.Schema({
  botId: { type: String, required: true, default: 'luno-bot' },
  lastHeartbeat: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const BotStatus = mongoose.models.BotStatus || mongoose.model('BotStatus', BotStatusSchema);

export async function GET() {
  try {
    await dbConnect();
    
    const status = await BotStatus.findOne({ botId: 'luno-bot' });
    
    if (!status) {
      console.log('[Bot Status] No heartbeat record found');
      return NextResponse.json({ 
        online: false,
        lastHeartbeat: null,
        timeSinceLastHeartbeat: null
      });
    }
    
    const now = Date.now();
    const timeSinceLastHeartbeat = now - status.lastHeartbeat;
    
    // Bot sends heartbeat every 30 seconds, consider offline after 45 seconds
    const isOnline = timeSinceLastHeartbeat < 45000;
    
    console.log('[Bot Status] GET - Last heartbeat:', new Date(status.lastHeartbeat).toISOString(), 
                'Time since:', timeSinceLastHeartbeat, 'ms', 
                'Online:', isOnline);
    
    return NextResponse.json({ 
      online: isOnline,
      lastHeartbeat: status.lastHeartbeat,
      timeSinceLastHeartbeat: timeSinceLastHeartbeat
    });
  } catch (error) {
    console.error('Bot status check error:', error);
    return NextResponse.json({ online: false }, { status: 200 });
  }
}

// Simple POST endpoint - no auth required for simplicity
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const now = Date.now();
    
    await BotStatus.findOneAndUpdate(
      { botId: 'luno-bot' },
      { 
        lastHeartbeat: now,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('[Bot Status] ✅ Heartbeat saved to MongoDB at:', new Date(now).toISOString());
    
    return NextResponse.json({ 
      success: true,
      timestamp: now
    });
  } catch (error: any) {
    console.error('[Bot Status] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to update heartbeat'
    }, { status: 500 });
  }
}
