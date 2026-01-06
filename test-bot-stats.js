// Test script to update bot statistics
// Run this with: node test-bot-stats.js

const API_URL = 'http://localhost:3000/api/bot-stats'; // Change to your production URL when deployed

async function updateStats() {
  try {
    const stats = {
      serverCount: 2,       // Your current server count
      memberCount: 50,      // Approximate total members across servers
      commandCount: 150     // Total number of commands your bot has
    };

    console.log('Sending stats to API:', stats);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Success! Response:', data);
    
    // Now fetch the stats to verify
    console.log('\nFetching stats to verify...');
    const getResponse = await fetch(API_URL);
    const currentStats = await getResponse.json();
    console.log('Current stats on server:', currentStats);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateStats();
