// ============================================
// ADD THIS CODE TO YOUR DISCORD BOT
// ============================================

// Add this near the top of your bot file (after requiring discord.js)

// Import fetch for Node.js versions < 18 (remove if using Node 18+)
// const fetch = require('node-fetch'); // Uncomment if you get "fetch is not defined" error

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://luno-dashboard-five.vercel.app';

// Function to send heartbeat to dashboard
async function sendHeartbeat() {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DISCORD_BOT_TOKEN}`
      },
      body: JSON.stringify({
        status: 'online',
        timestamp: Date.now()
      })
    });

    if (response.ok) {
      console.log('[Heartbeat] ✅ Successfully sent to dashboard');
    } else {
      const errorText = await response.text();
      console.error('[Heartbeat] ❌ Failed:', response.status, errorText);
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
  
  console.log('🔄 Heartbeat system started - sending status every 30 seconds');
});
*/
