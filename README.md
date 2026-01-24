# Luno Bot Dashboard

A full-stack web dashboard for managing Discord bot settings, similar to Dyno.

## Features

// Trigger redeploy: minor edit

- Discord OAuth2 login to verify server management permissions
- Server-specific dashboard for each managed server
- Edit bot settings: prefix, moderation, welcome messages
- Settings saved to MongoDB database
- Basic UI with server list and settings forms

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Authentication:** NextAuth.js with Discord OAuth2
- **Database:** MongoDB with Mongoose
- **Deployment:** Ready for Vercel or custom domain

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Discord Application (for OAuth2)

### 1. Clone and Install

```bash
npm install
```

### 2. Set up Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord` (and your production URL)
5. Copy Client ID and Client Secret

### 3. Environment Variables

Create `.env.local` in the root directory:

```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/luno-dashboard
```

For production, update `NEXTAUTH_URL` to your domain.

### 4. Set up MongoDB

- For local: Install MongoDB and start it
- For cloud: Use MongoDB Atlas and update `MONGODB_URI`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Usage

1. Click "Login with Discord" to authenticate
2. View your managed servers
3. Click on a server to edit its settings
4. Settings are automatically saved to the database

## Bot Integration

The bot can connect to the same MongoDB database to read settings in real-time.

Example (in your bot code):

```javascript
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  guildId: String,
  prefix: String,
  // ... other fields
});

const ServerSettings = mongoose.model('ServerSettings', settingsSchema);

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Get settings for a guild
const settings = await ServerSettings.findOne({ guildId: guild.id });
```

## Deployment

### Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Custom Domain

- Update `NEXTAUTH_URL` to your domain
- Add the domain to Discord OAuth2 redirect URIs
- Deploy to your hosting provider

## Database Schema

### ServerSettings

```javascript
{
  guildId: String (unique),
  prefix: String (default: '!'),
  moderation: {
    enabled: Boolean (default: true),
    logChannel: String (nullable)
  },
  welcome: {
    enabled: Boolean (default: false),
    message: String (default: 'Welcome {user} to {server}!'),
    channel: String (nullable)
  }
}
```

## Contributing

Feel free to contribute improvements or additional features.

## License

MIT


On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean