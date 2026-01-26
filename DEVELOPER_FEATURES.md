# Developer Maintenance Mode Features

## Overview
Complete developer control system with maintenance mode, bypass capabilities, and advanced debugging tools.

## Features Implemented

### 1. Maintenance Mode System
- **Location**: `/developer` page
- **Access**: PIN-based two-factor authentication (Developer User ID + PIN)
- **Toggle**: Enable/disable maintenance mode for the entire website
- **Behavior**: When enabled, all server pages are locked with a maintenance screen
- **Bypass**: Developers can bypass using PIN verification on each page (no session persistence)

### 2. Debug Info Button 🐛
**Location**: Appears in sidebar on ALL server pages when bypassed

**Styling**:
- Red gradient background (from-red-600 to-red-700)
- Pulsing animation
- "DEV ONLY" badge
- Warning icon

**Information Displayed**:
- System Status (Active/Maintenance)
- Screen Resolution
- Memory Usage
- Network Connection Status
- Page Load Time
- User Agent
- **Auto-updates every 2 seconds**

**Pages with Debug Button**:
- ✅ Main server dashboard (`/servers/[guildId]`)
- ✅ Commands page (`/servers/[guildId]/commands`)
- ✅ General settings (`/servers/[guildId]/general`)
- ✅ Configuration pages:
  - Anti-Raid
  - Automod
  - Logging
  - Reaction Roles
  - Verification
- ✅ All module pages:
  - Moderation
  - Role Management
  - Member Management
  - Announcements
  - Notifications
  - Fun
  - Utilities
- ✅ Other pages:
  - Logs
  - Modules (main)
  - Premium
  - Setup

### 3. Developer Tools Button ⚡
**Location**: Appears below Debug Info button in sidebar when bypassed

**Styling**:
- Purple gradient background (from-purple-600 to-purple-700)
- Lightning bolt icon
- Modern card-based interface

**Features Available**:

#### Clear Cache 🗑️
- Clears application cache
- Orange gradient button
- Shows success/failure message

#### Fetch Bot Stats 📊
- Retrieves live bot statistics
- Blue gradient button
- Displays:
  - Server Count
  - Total Users
  - Commands Used
  - Uptime
  - Memory Usage
  - Bot Status (online/offline)

#### Restart Services 🔄
- Simulates service restart
- Purple gradient button
- Shows restart confirmation

#### Force Database Sync 📅
- Forces database synchronization
- Green gradient button
- Confirms sync completion

### 4. Security Features

**Authentication**:
- Developer User ID: `922940896322940929` (hardcoded)
- PIN: Stored in `DEVELOPER_PIN` environment variable
- Two-factor verification required

**Session Management**:
- **No persistent bypass** - PIN required on each page visit
- Bypass state stored per-component only
- Automatic reset on page navigation

**Visual Indicators**:
- Red border on debug section
- "⚠️ DEVELOPER MODE ACTIVE" warning
- Obvious DEV ONLY badges
- Pulsing animations on critical buttons

## Implementation Details

### Components Created:
1. **DebugInfoPopup** (`components/DebugInfoPopup.tsx`)
   - Modal popup with live stats
   - Auto-updating data every 2s
   - Red-themed design

2. **DeveloperTools** (`components/DeveloperTools.tsx`)
   - Full developer control panel
   - Multiple action buttons
   - Stats visualization
   - Dark gradient theme

3. **MaintenanceScreen** (`components/MaintenanceScreen.tsx`)
   - Maintenance lock screen
   - PIN input for bypass
   - Live debug stats display
   - Developer-only access

### Hook:
- **useMaintenanceCheck** (`lib/hooks/useMaintenanceCheck.ts`)
  - Checks maintenance mode status
  - Manages bypass state per component
  - Provides handleBypass function

### Database:
- **SiteSettings Model** (`lib/models/SiteSettings.ts`)
  - Stores maintenance mode status
  - Tracks who enabled/disabled
  - MongoDB schema with timestamps

### API Routes:
- `/api/developer/verify` - PIN verification
- `/api/developer/settings` - CRUD for site settings
- `/api/maintenance-status` - Check maintenance mode

## Usage Guide

### For Developers:

1. **Enable Maintenance Mode**:
   - Navigate to `/developer`
   - Enter User ID and PIN
   - Toggle "Maintenance Mode" switch
   - Confirm changes

2. **Bypass Maintenance Mode**:
   - Visit any locked server page
   - Enter PIN in maintenance screen
   - Access granted for current page only
   - Repeat for each page

3. **Access Debug Tools**:
   - After bypassing, check sidebar
   - Click "🐛 Debug Info" for live stats
   - Click "⚡ Developer Tools" for advanced controls
   - Use action buttons as needed

4. **Security Best Practices**:
   - Keep PIN confidential
   - Don't share User ID
   - Disable maintenance mode when not testing
   - Monitor debug stats for anomalies

## Environment Variables Required
```
DEVELOPER_PIN=your_secret_pin_here
```

## Files Modified/Created

### New Files:
- `components/DebugInfoPopup.tsx`
- `components/DeveloperTools.tsx`
- `components/MaintenanceScreen.tsx`
- `lib/hooks/useMaintenanceCheck.ts`
- `lib/models/SiteSettings.ts`
- `lib/siteSettings.ts`
- `app/api/developer/verify/route.ts`
- `app/api/developer/settings/route.ts`
- `app/api/maintenance-status/route.ts`
- `app/developer/page.tsx`

### Modified Files:
- All server pages (`app/servers/[guildId]/**/*.tsx`)
  - Added debug button imports
  - Added state management
  - Added sidebar debug buttons
  - Added popup components

## Build Status
✅ All pages compile successfully
✅ No TypeScript errors
✅ All routes functional

## Future Enhancements (Suggestions)
- Add error log viewer
- Implement real-time WebSocket stats
- Add database query inspector
- Create API endpoint tester
- Add performance profiler
- Implement user session viewer
- Add automated health checks
- Create incident history log
