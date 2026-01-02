// ============================================
// ADD THIS CODE TO YOUR DISCORD BOT
// ============================================

// This code sends a heartbeat to your dashboard every 30 seconds
// to indicate the bot is online and running

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://your-dashboard-url.vercel.app';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Function to send heartbeat to dashboard
async function sendHeartbeat() {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BOT_TOKEN}`
      },
      body: JSON.stringify({
        status: 'online',
        timestamp: Date.now()
      })
    });

    if (response.ok) {
      console.log('[Heartbeat] Successfully sent to dashboard');
    } else {
      console.error('[Heartbeat] Failed to send:', response.status);
    }
  } catch (error) {
    console.error('[Heartbeat] Error:', error.message);
  }
}

// Start heartbeat when bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Send initial heartbeat
  sendHeartbeat();
  
  // Send heartbeat every 30 seconds
  setInterval(sendHeartbeat, 30000);
});

// ============================================
// ALTERNATIVE: If you use discord.js v14+
// ============================================

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // ... your other intents
  ]
});

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://your-dashboard-url.vercel.app';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

async function sendHeartbeat() {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BOT_TOKEN}`
      },
      body: JSON.stringify({
        status: 'online',
        timestamp: Date.now()
      })
    });

    if (!response.ok) {
      console.error('[Heartbeat] Failed:', response.status);
    }
  } catch (error) {
    console.error('[Heartbeat] Error:', error.message);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  
  // Send heartbeat every 30 seconds
  sendHeartbeat();
  setInterval(sendHeartbeat, 30000);
});

client.login(BOT_TOKEN);
