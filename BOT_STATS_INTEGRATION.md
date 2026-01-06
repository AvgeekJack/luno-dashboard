# Bot Statistics Integration

This document explains how to send real-time statistics from your Discord bot to the Luno website dashboard.

## API Endpoint

**POST** `/api/bot-stats`

## Request Format

Send a POST request with the following JSON body:

```json
{
  "serverCount": 11500000,
  "memberCount": 520000000,
  "commandCount": 150
}
```

## Example Bot Integration Code

### Using discord.js

```javascript
const axios = require('axios');

// Function to update stats
async function updateBotStats(client) {
  try {
    const stats = {
      serverCount: client.guilds.cache.size,
      memberCount: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      commandCount: 150 // Update this if you add/remove commands
    };

    await axios.post('https://your-website.com/api/bot-stats', stats);
    console.log('✅ Bot stats updated successfully');
  } catch (error) {
    console.error('❌ Failed to update bot stats:', error.message);
  }
}

// Update stats on ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updateBotStats(client);
  
  // Update stats every 5 minutes
  setInterval(() => updateBotStats(client), 5 * 60 * 1000);
});

// Update stats when joining/leaving guilds
client.on('guildCreate', () => updateBotStats(client));
client.on('guildDelete', () => updateBotStats(client));
```

### Using fetch (Node.js 18+)

```javascript
async function updateBotStats(client) {
  try {
    const stats = {
      serverCount: client.guilds.cache.size,
      memberCount: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      commandCount: 150
    };

    const response = await fetch('https://your-website.com/api/bot-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats)
    });

    const data = await response.json();
    console.log('✅ Bot stats updated:', data);
  } catch (error) {
    console.error('❌ Failed to update bot stats:', error);
  }
}
```

## Response Format

Success response:

```json
{
  "success": true,
  "stats": {
    "serverCount": 11500000,
    "memberCount": 520000000,
    "commandCount": 150,
    "lastUpdate": 1704556800000
  }
}
```

## Frontend Display

The statistics are displayed on the homepage and automatically refresh every 30 seconds. The display will show:

- **Servers**: Formatted as "X.XM+" (e.g., "11.5M+")
- **Members Served**: Formatted as "XXXM+" (e.g., "520M+")
- **Commands**: Displayed as-is (e.g., "150+")

## Notes

- The API endpoint does not require authentication for simplicity, but you may want to add authentication in production
- Stats are stored in memory, so they will reset when the server restarts
- Consider adding a database to persist statistics across server restarts
- The frontend fetches stats on page load and every 30 seconds thereafter
