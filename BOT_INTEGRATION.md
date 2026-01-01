# Bot Integration Guide

This guide explains how to connect your Discord bot to the Luno Dashboard.

## Architecture Overview

```
Dashboard (Next.js) ──→ MongoDB ←── Discord Bot
```

Both the dashboard and bot share the same MongoDB database. When users change settings in the dashboard, the bot reads those changes from MongoDB.

## Setup Steps

### 1. Environment Variables

Make sure your `.env.local` file has:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luno
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.com/api/oauth2/authorize?client_id=YOUR_ID&permissions=8&scope=bot
```

### 2. Database Schema

The dashboard saves settings to MongoDB in this structure:

```javascript
{
  guildId: "123456789",
  prefix: "!",
  moderation: {
    enabled: true,
    logChannel: "channel_id"
  },
  welcome: {
    enabled: true,
    message: "Welcome {user} to {server}!",
    channel: "channel_id"
  },
  goodbye: {
    enabled: true,
    message: "Goodbye {user}!",
    channel: "channel_id"
  },
  roles: {
    defaultRoles: ["role_id_1", "role_id_2"],
    modRoles: ["mod_role_id"]
  },
  commands: {
    warn: {
      enabled: true,
      allowedChannels: [],
      ignoredChannels: [],
      allowedRoles: [],
      ignoredRoles: []
    },
    // ... other commands
  }
}
```

### 3. Bot Implementation

See `bot-example.js` for a complete working example.

**Key Features:**
- ✓ Reads settings from MongoDB
- ✓ Caches settings (5-minute TTL)
- ✓ Welcome/goodbye messages with placeholders
- ✓ Auto-assign default roles to new members
- ✓ Command enable/disable
- ✓ Channel/role permissions per command
- ✓ Moderation logging
- ✓ Moderator role checks

### 4. Running the Bot

```bash
# In a separate folder for your bot
npm install discord.js mongodb dotenv

# Copy bot-example.js to your bot folder
# Update .env with your credentials

# Run the bot
node bot-example.js
```

### 5. Testing the Integration

1. Start the dashboard: `npm run dev`
2. Start the bot: `node bot-example.js`
3. Login to the dashboard
4. Change settings (e.g., enable welcome messages)
5. Wait up to 5 minutes for cache refresh, or restart the bot
6. Test in Discord (invite new member, use commands, etc.)

## How It Works

### Dashboard Side:
1. User changes settings in the web interface
2. Frontend sends PUT request to `/api/servers/[guildId]/setup`
3. API route saves to MongoDB

### Bot Side:
1. Bot connects to same MongoDB
2. Bot caches settings in memory
3. On events (message, member join, etc.), bot checks settings
4. Bot applies settings (permissions, messages, roles, etc.)

## Advanced: Real-time Updates

For instant updates without waiting for cache:

**Option 1: MongoDB Change Streams**
```javascript
const changeStream = db.collection('serversettings').watch();
changeStream.on('change', (change) => {
  if (change.operationType === 'update') {
    const guildId = change.documentKey.guildId;
    settingsCache.delete(guildId); // Clear cache
  }
});
```

**Option 2: Redis Pub/Sub**
```javascript
// Dashboard publishes changes
redis.publish('settings-update', guildId);

// Bot subscribes and clears cache
redis.subscribe('settings-update', (guildId) => {
  settingsCache.delete(guildId);
});
```

**Option 3: Webhook**
Dashboard can POST to bot's API endpoint when settings change.

## Command Examples

### Warn Command
```
!warn @user Spamming in general
```
- Checks if user has mod role
- Checks channel/role permissions
- Logs to mod channel
- Sends message

### Welcome Message
```
User joins → Bot checks settings → Sends message to welcome channel
```

### Auto-roles
```
User joins → Bot assigns default roles from settings
```

## Troubleshooting

**Bot not seeing settings changes:**
- Cache takes 5 minutes to refresh
- Restart bot for instant reload
- Check MongoDB connection string matches

**Commands not working:**
- Verify command is enabled in dashboard
- Check channel/role permissions
- Ensure bot has proper Discord permissions

**Welcome messages not sending:**
- Check welcome.enabled = true
- Verify channel exists
- Ensure bot can send messages in that channel

## Production Deployment

### Dashboard (Vercel/Railway):
- Set environment variables
- Deploy Next.js app
- Configure MongoDB connection

### Bot (VPS/Cloud):
- Use PM2 or Docker for uptime
- Set up monitoring
- Enable auto-restart on crash

```bash
# Using PM2
pm2 start bot-example.js --name luno-bot
pm2 startup
pm2 save
```

## Security Notes

- Never commit `.env` files
- Use separate bot tokens for dev/prod
- Limit bot permissions to what's needed
- Validate user permissions in both dashboard and bot
- Use MongoDB authentication
- Consider rate limiting on API endpoints

## Support

For issues or questions, check:
- Discord.js documentation: https://discord.js.org
- MongoDB Node.js driver: https://mongodb.github.io/node-mongodb-native
- Next.js API routes: https://nextjs.org/docs/api-routes/introduction
