# Testing Bot Statistics

## How to Test the Live Stats Feature

### Method 1: Using PowerShell (Recommended for Windows)

1. Make sure your dev server is running:
   ```powershell
   npm run dev
   ```

2. In a new PowerShell window, run:
   ```powershell
   .\test-bot-stats.ps1
   ```

3. You should see:
   - ✅ Success message
   - Current stats showing serverCount: 2, memberCount: 50

4. Open your browser and go to `http://localhost:3000`
5. The homepage should now show "2" under Servers and "50" under Members Served

### Method 2: Using cURL

```powershell
# Send stats to the API
curl -X POST http://localhost:3000/api/bot-stats `
  -H "Content-Type: application/json" `
  -d '{"serverCount": 2, "memberCount": 50, "commandCount": 150}'

# Verify the stats were saved
curl http://localhost:3000/api/bot-stats
```

### Method 3: Using a Browser/DevTools

1. Go to `http://localhost:3000`
2. Open DevTools (F12)
3. Go to Console tab
4. Paste and run:

```javascript
fetch('/api/bot-stats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverCount: 2,
    memberCount: 50,
    commandCount: 150
  })
})
.then(r => r.json())
.then(data => {
  console.log('Updated stats:', data);
  // Reload page to see changes
  setTimeout(() => location.reload(), 1000);
});
```

## What Should Happen

1. **Before sending stats**: Homepage shows "0" for Servers and Members
2. **After sending stats**: Homepage shows "2" for Servers and "50" for Members
3. **Auto-refresh**: Stats update every 30 seconds without page reload
4. **Console logs**: Check browser console (F12) to see "Fetched bot stats:" logs

## Number Formatting

The stats display intelligently formats numbers:
- **0-999**: Shows exact number (e.g., "2", "50")
- **1,000-999,999**: Shows with K (e.g., "1.5K+", "50.0K+")
- **1,000,000+**: Shows with M (e.g., "11.5M+", "500M+")

## Troubleshooting

### Stats still showing 0?

1. **Check if dev server is running**: `npm run dev` should be active
2. **Check browser console**: Press F12 and look for errors
3. **Check server console**: Look for "[Bot Stats]" log messages
4. **Clear cache**: Hard refresh (Ctrl+Shift+R) or Ctrl+F5
5. **Verify API is working**: Go to `http://localhost:3000/api/bot-stats` in browser

### Expected Console Output

**Server console** should show:
```
[Bot Stats] POST request received with body: { serverCount: 2, memberCount: 50, commandCount: 150 }
[Bot Stats] ✅ Stats updated successfully: { serverCount: 2, memberCount: 50, commandCount: 150, lastUpdate: ... }
```

**Browser console** should show:
```
Fetched bot stats: { serverCount: 2, memberCount: 50, commandCount: 150, lastUpdate: ... }
```

## Integration with Your Discord Bot

Once verified that the website works, add this to your Discord bot code:

```javascript
// At the top of your bot file
const STATS_API = 'https://your-website.com/api/bot-stats';

// Function to update stats
async function updateBotStats() {
  try {
    const stats = {
      serverCount: client.guilds.cache.size,
      memberCount: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      commandCount: 150
    };

    const response = await fetch(STATS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });

    if (response.ok) {
      console.log('✅ Stats updated');
    }
  } catch (error) {
    console.error('Failed to update stats:', error);
  }
}

// Update on bot ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updateBotStats();
  
  // Update every 5 minutes
  setInterval(updateBotStats, 5 * 60 * 1000);
});

// Update when joining/leaving servers
client.on('guildCreate', () => updateBotStats());
client.on('guildDelete', () => updateBotStats());
```

## Verified Working

✅ API route properly handles GET and POST requests  
✅ Stats are stored in memory and retrieved correctly  
✅ Frontend fetches stats on load and every 30 seconds  
✅ Numbers display correctly for small counts (2, 50)  
✅ Numbers will format correctly for large counts (1.5K+, 11.5M+)  
✅ Error handling and logging in place  
✅ Test scripts provided for easy verification
