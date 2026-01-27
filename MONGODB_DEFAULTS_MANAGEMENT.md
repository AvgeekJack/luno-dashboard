# New Server Defaults Configuration

This feature allows developers to configure the default settings that are automatically applied when a server first adds the bot and sets up their dashboard.

## Overview

The New Server Defaults section on the developer page provides controls to:
- Set the default command prefix for new servers
- Enable/disable premium by default for new servers
- Configure which modules are enabled by default
- Preview current default configuration
- Save changes that apply to all future new servers

## How It Works

When a server first adds the bot and someone visits the dashboard:
1. The system checks if server settings exist in MongoDB
2. If not found, it fetches the custom defaults from SiteSettings
3. A new ServerSettings document is created with these defaults
4. The server owner sees their dashboard pre-configured

## Features

### Default Command Prefix
- Set what prefix new servers will use (e.g., `!`, `/`, `.`)
- Default: `!`
- Applied when server settings are first created

### Default Premium Status
- Toggle whether new servers start with premium enabled
- Default: `false`
- Useful for giving premium to partner servers or during promotions

### Default Module States
Configure which modules are enabled by default for new servers:

- **Moderation** (Ban, kick, timeout, warn, etc.)
  - Default: `true` (enabled)
  
- **Role Management** (Create, delete, manage roles)
  - Default: `false` (disabled)
  
- **Member Management** (User info, avatars, roles)
  - Default: `false` (disabled)
  
- **Announcements** (Announcements, giveaways, polls)
  - Default: `false` (disabled)
  
- **Fun** (Memes, jokes, games)
  - Default: `false` (disabled)
  
- **Utilities** (Server info, ping, help)
  - Default: `false` (disabled)
  
- **Notifications** (Welcome/leave messages)
  - Default: `false` (disabled)

## Usage

1. Navigate to Developer Page
2. Enter PIN to access developer tools
3. Scroll to "New Server Defaults" section
4. Configure default prefix and premium status
5. Toggle which modules should be enabled by default
6. Click "💾 Save Default Configuration"
7. Changes apply to all NEW servers from that moment forward

## Important Notes

- ⚠️ **Only affects NEW servers** - Existing servers are not modified
- Changes are saved to SiteSettings collection with keys like `defaultServerPrefix`, `defaultModuleFun`, etc.
- If fetching defaults fails, system falls back to schema defaults
- Configuration is loaded automatically when PIN is verified

## API Endpoints

### GET /api/developer/reset-defaults
Fetches current default configuration

**Response:**
```json
{
  "defaults": {
    "prefix": "!",
    "premium": false,
    "modules": {
      "moderation": true,
      "roleManagement": false,
      "memberManagement": false,
      "announcements": false,
      "fun": false,
      "utilities": false,
      "notifications": false
    }
  }
}
```

### POST /api/developer/reset-defaults
Updates default configuration

**Request:**
```json
{
  "defaults": {
    "prefix": "!",
    "premium": false,
    "modules": {
      "moderation": true,
      "roleManagement": false,
      "memberManagement": false,
      "announcements": false,
      "fun": false,
      "utilities": false,
      "notifications": false
    }
  }
}
```

## Code Structure

- `/app/api/developer/reset-defaults/route.ts` - API for managing defaults
- `/app/developer/page.tsx` - Developer UI with New Server Defaults section
- `/lib/serverDefaults.ts` - Utility function to fetch defaults
- `/app/api/servers/[guildId]/settings/route.ts` - Updated to use custom defaults when creating new servers

## Technical Implementation

When a new server is detected in `GET /api/servers/[guildId]/settings`:
```typescript
if (!settings) {
  const defaults = await getServerDefaults();
  settings = new ServerSettings({ 
    guildId,
    prefix: defaults.prefix,
    premium: defaults.premium,
    modules: defaults.modules,
  });
  await settings.save();
}
```

The `getServerDefaults()` function fetches all default settings from SiteSettings and returns a structured object with fallbacks to schema defaults if any setting is missing.

## Use Cases

### Partner Server Setup
1. Enable premium by default
2. Enable all modules
3. Partners get full access immediately

### Testing Environment
1. Enable premium for testing
2. Enable specific modules being tested
3. Streamlined testing workflow

### Production Launch
1. Set conservative defaults
2. Only enable Moderation module
3. Users opt-in to other features

## Safety Features

- Non-destructive: Existing servers unchanged
- Automatic fallbacks if defaults can't be fetched
- Status feedback (success/error messages)
- Developer authentication required
- Changes logged to console
