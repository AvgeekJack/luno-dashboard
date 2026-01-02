// ============================================
// ADD THIS CODE TO YOUR DISCORD BOT
// ============================================

// Add this near the top of your bot file (after requiring discord.js)

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://luno-dashboard-flax.vercel.app';

// Simple heartbeat function - no authentication needed
async function sendHeartbeat() {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: Date.now()
      })
    });

    if (response.ok) {
      console.log('[Heartbeat] ✅ Sent successfully');
    } else {
      console.error('[Heartbeat] ❌ Failed:', response.status);
    }
  } catch (error) {
    console.error('[Heartbeat] ❌ Error:', error.message);
  }
}

// Add this inside your 'ready' event listener
// Example:
/*
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  
  // Send initial heartbeat immediately
  sendHeartbeat();
  
  // Send heartbeat every 30 seconds
  setInterval(sendHeartbeat, 30000);
  
  console.log('🔄 Heartbeat system started');
});
*/
