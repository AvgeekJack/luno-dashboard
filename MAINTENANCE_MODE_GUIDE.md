# Maintenance Mode Feature

## Overview
The maintenance mode feature allows the developer to lock all server-specific pages across the site, displaying a maintenance screen while work is being performed. The developer can bypass this with PIN authentication and view live debug stats.

## Security
- **Two-Factor Authentication**:
  1. User ID must match `922940896322940929`
  2. Must enter correct PIN stored in `.env.local` as `DEVELOPER_PIN`

## Features

### For Regular Users
When maintenance mode is enabled:
- All `/servers/[guildId]/*` pages show a maintenance screen
- Displays "Maintenance in Progress" message
- Animated progress indicator
- Option to return to home page

### For Developers
When authenticated as developer (ID: `922940896322940929`):
- **PIN Bypass**: Enter PIN to bypass maintenance mode
- **Live Debug Stats** (updates every 2 seconds):
  - Online/Offline status
  - Screen resolution
  - Memory usage (Chrome only)
  - Connection type (4G, WiFi, etc.)
  - Page load time
  - Timestamp
  - Full user agent details

## How to Use

### Enable Maintenance Mode
1. Navigate to `/developer`
2. Enter your PIN
3. Toggle "Maintenance Mode" to enabled
4. All server pages will now show maintenance screen

### Bypass as Developer
1. When you visit a server page, you'll see the maintenance screen
2. Click "Show Bypass" (developer mode section)
3. Enter your PIN
4. Click "Bypass Maintenance"
5. You can now access all pages while others see maintenance

### Disable Maintenance Mode
1. Go back to `/developer`
2. Toggle "Maintenance Mode" to disabled
3. All users can now access server pages normally

## Protected Pages
All pages under `/servers/[guildId]/` are protected:
- Main server dashboard
- Commands configuration
- Module settings (Moderation, Role Management, etc.)
- Configuration pages (Anti-Raid, Automod, Logging, etc.)
- Premium pages
- General settings
- Setup wizard
- Logs viewer

## Technical Implementation

### Files Created/Modified
- `lib/siteSettings.ts` - Helper functions to check site settings
- `lib/hooks/useMaintenanceCheck.ts` - React hook for maintenance checking
- `lib/models/SiteSettings.ts` - MongoDB model for site-wide settings
- `components/MaintenanceScreen.tsx` - Maintenance UI with developer bypass
- `components/ServerPageWrapper.tsx` - Wrapper component for protected pages
- `app/api/maintenance-status/route.ts` - API to check maintenance status
- `app/api/developer/verify/route.ts` - PIN verification API
- `app/api/developer/settings/route.ts` - Settings management API
- `app/servers/[guildId]/page.tsx` - Modified to check maintenance
- `app/servers/[guildId]/commands/page.tsx` - Protected with maintenance check
- `app/servers/[guildId]/premium/page.tsx` - Wrapped with ServerPageWrapper

### Session Storage
The bypass state is stored in `sessionStorage` with key `maintenanceBypass`:
- Set to `'true'` when developer bypasses
- Cleared on browser close/tab close
- Checked on every server page load

### Database
Maintenance status is stored in MongoDB:
```javascript
{
  settingKey: 'maintenanceMode',
  settingValue: true/false,
  description: 'Enable maintenance mode (restricts access)',
  updatedAt: Date,
  updatedBy: 'userId'
}
```

## Environment Variables
Add to `.env.local`:
```env
DEVELOPER_PIN=your_secure_pin_here
```

**Important**: Choose a strong PIN and never commit it to version control!

## Future Enhancements
- [ ] Scheduled maintenance windows
- [ ] Maintenance notification banner before enabling
- [ ] Custom maintenance messages
- [ ] Partial maintenance (specific pages only)
- [ ] Maintenance history log
- [ ] Email notification when maintenance enabled

## Testing
1. **Test Maintenance Mode**:
   - Enable maintenance in developer panel
   - Visit any server page without bypass
   - Verify maintenance screen shows

2. **Test Developer Bypass**:
   - As developer, enter PIN on maintenance screen
   - Verify you can access pages
   - Check debug stats are updating

3. **Test Regular User Experience**:
   - Use a different browser/incognito
   - Verify maintenance screen shows
   - Verify cannot access server pages

## Notes
- Maintenance mode only affects server-specific pages
- Home page, terms, privacy, etc. remain accessible
- Developer panel (`/developer`) is always accessible to developer
- Bypass is per-session (cleared on browser close)
