# MongoDB Defaults Management

This feature allows developers to reset MongoDB collections and set default values for servers, including premium status.

## Overview

The MongoDB Defaults Management section on the developer page provides tools to:
- Reset individual server settings
- Set custom default values for specific servers (including premium)
- Reset entire collections to defaults
- Manage banned users in bulk

## Features

### 1. Server Settings Management

**Reset Specific Server:**
- Enter a Guild ID to reset all settings for that server
- Server will be removed from database and use schema defaults on next access

**Set Custom Defaults:**
- Enter a Guild ID
- Configure custom prefix (default: `!`)
- Enable/disable premium status
- Apply custom defaults to create or update server settings

**Reset All Servers:**
- ⚠️ **DANGEROUS**: Deletes ALL server settings from database
- Requires multiple confirmations
- Shows count of deleted servers

### 2. Site Settings Management

**Reset All Site Settings:**
- Resets all site-wide settings to defaults:
  - `premiumPurchaseEnabled`: true
  - `maintenanceMode`: false
  - `newUserSignupsEnabled`: true
  - `botCommandsEnabled`: true
  - `maxServersPerUser`: 100

### 3. Banned Users Management

**Unban All Users:**
- Clears entire banned users collection
- Shows count of unbanned users
- Useful for bulk pardons or testing

## API Endpoint

### POST /api/developer/reset-defaults

**Authentication:** Developer PIN required

**Request Body:**
```json
{
  "collection": "ServerSettings" | "SiteSettings" | "BannedUsers",
  "action": "resetAll" | "resetOne" | "setDefaults",
  "guildId": "string (optional)",
  "defaults": {
    "prefix": "string",
    "premium": boolean
  }
}
```

**Actions:**

1. **ServerSettings + resetAll**
   - Deletes all server settings
   - Returns deletedCount

2. **ServerSettings + resetOne**
   - Requires `guildId`
   - Deletes specific server settings

3. **ServerSettings + setDefaults**
   - Requires `guildId` and `defaults`
   - Updates or creates server with custom values
   - Useful for granting premium to test servers

4. **SiteSettings + resetAll**
   - Resets all site settings to defaults

5. **BannedUsers + resetAll**
   - Unbans all users
   - Returns unbannedCount

## Use Cases

### Grant Premium to Test Server
1. Select "Server Settings"
2. Enter Guild ID
3. Check "Premium Enabled"
4. Set custom prefix if needed
5. Click "Apply Defaults"

### Reset Development Database
1. Select each collection type
2. Use "Reset All" buttons
3. Confirm each action
4. Database returns to clean state

### Bulk Unban After Testing
1. Select "Banned Users"
2. Click "Unban All Users"
3. All bans cleared instantly

## Safety Features

- Multiple confirmation dialogs for destructive actions
- Clear warning messages with ⚠️ symbols
- Status feedback (success/error messages)
- Color-coded UI (red for danger, green for safe)
- Developer authentication required for all actions

## UI Design

The section uses a cyan color scheme:
- `bg-cyan-900/20` background
- `border-cyan-800` border
- `text-cyan-400` headings
- Collection-specific actions shown conditionally
- Dropdown selector for collection type

## Code Structure

- `/app/api/developer/reset-defaults/route.ts` - API endpoint
- `/app/developer/page.tsx` - Developer UI with MongoDB section
- All three collections supported: ServerSettings, SiteSettings, BannedUsers

## Notes

- Actions are immediate and cannot be undone
- Deleted server settings will be recreated with schema defaults on next access
- Premium status can be toggled without affecting Stripe subscriptions
- All actions are logged to console for debugging
