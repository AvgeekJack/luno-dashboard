# Premium Purchase Toggle Feature

This feature allows developers to disable premium subscriptions site-wide while showing users a "Coming Soon" message.

## Overview

When `premiumPurchaseEnabled` is set to `false` in the site settings:
- Users can still view the premium page and see premium features
- A frosted orange overlay appears over the pricing card on the premium page
- A frosted orange overlay appears over the Premium Status card on the server dashboard
- A "Coming Soon" message is displayed on both overlays
- The subscribe button on the premium page is disabled
- The "Enroll Now" button on the server dashboard is disabled
- Premium users can still manage their existing subscriptions

## Implementation

### API Routes

#### GET /api/site-settings
Public endpoint that returns site-wide settings:
```typescript
{
  "premiumPurchaseEnabled": boolean
}
```

### Database

Settings are stored in the `SiteSettings` MongoDB collection with the key `premiumPurchaseEnabled`.

### Frontend

**Premium Page** (`app/servers/[guildId]/premium/page.tsx`):
- Fetches both server-specific settings and site-wide settings
- When `premiumPurchaseEnabled` is `false`:
  - Frosted orange overlay with `backdrop-blur-sm bg-orange-500/20`
  - White card with rocket emoji (🚀), "Coming Soon" heading, and description
  - Subscribe button disabled via `disabled={checkoutLoading || !premiumPurchaseEnabled}`

**Server Dashboard** (`app/servers/[guildId]/page.tsx`):
- Fetches both maintenance mode and premium purchase enabled status
- When `premiumPurchaseEnabled` is `false` and server is not enrolled:
  - Same frosted orange overlay appears on Premium Status card
  - "Enroll Now" button disabled via `disabled={!premiumPurchaseEnabled}`
  - Premium users still see "Manage" button and can access their subscription

## Usage

### Enable Premium Purchases
1. Go to Developer Page
2. Navigate to Site Settings section
3. Enable "Premium Purchase Enabled" toggle
4. Users can now purchase premium subscriptions

### Disable Premium Purchases
1. Go to Developer Page
2. Navigate to Site Settings section
3. Disable "Premium Purchase Enabled" toggle
4. Users will see "Coming Soon" overlay

## Code Structure

- `/app/api/site-settings/route.ts` - Public endpoint for site settings
- `/lib/siteSettings.ts` - Utility functions for fetching settings
- `/app/servers/[guildId]/premium/page.tsx` - Premium page with overlay on pricing card
- `/app/servers/[guildId]/page.tsx` - Server dashboard with overlay on Premium Status card
- `/lib/models/SiteSettings.ts` - MongoDB schema for site settings

## Visual Design

The "Coming Soon" overlay matches the existing premium feature lock design:
- Frosted glass effect with orange tint
- Centered white card with shadow
- Large emoji icon
- Bold heading in orange
- Descriptive text in slate gray

## Notes

- Existing premium users can still access their subscriptions
- The toggle only affects new purchases
- Setting defaults to `true` if not found in database
- Works independently of maintenance mode
