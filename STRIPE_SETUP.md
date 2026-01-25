# Stripe Integration Setup Guide

This guide explains how to set up Stripe subscriptions for Luno premium features.

## Environment Variables

Add these to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID=price_your_price_id_here
```

## Getting Your Stripe Keys

### 1. Stripe Secret Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
3. Add it to `.env.local` as `STRIPE_SECRET_KEY`

### 2. Stripe Price ID
1. Go to [Products](https://dashboard.stripe.com/test/products)
2. Create or select your subscription product
3. Copy the **Price ID** (starts with `price_`)
4. Add it to `.env.local` as `STRIPE_PRICE_ID`

### 3. Stripe Webhook Secret
1. Go to [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## How It Works

### 1. User Clicks "Subscribe Now"
- Frontend calls `/api/stripe/create-checkout` with the server ID
- Server creates a Stripe Checkout Session with `serverId` in metadata
- User is redirected to Stripe's hosted checkout page

### 2. User Completes Payment
- Stripe processes payment
- Stripe sends `checkout.session.completed` webhook to `/api/stripe/webhook`
- Webhook handler sets `premium: true` in MongoDB
- Stores `stripeCustomerId` and `stripeSubscriptionId`

### 3. Subscription Cancelled or Payment Fails
- Stripe sends webhook (`customer.subscription.deleted` or `invoice.payment_failed`)
- Webhook handler sets `premium: false` in MongoDB

## Testing Webhooks Locally

### Using Stripe CLI

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret and use it as `STRIPE_WEBHOOK_SECRET`
5. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Using ngrok (Alternative)

1. Install [ngrok](https://ngrok.com/)
2. Start your Next.js app: `npm run dev`
3. Expose it: `ngrok http 3000`
4. Add the ngrok URL to Stripe webhook settings: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`

## Production Deployment

1. Update `.env.production` or your hosting platform environment variables with live keys
2. Update Stripe webhook URL to your production domain
3. Use live mode keys (start with `sk_live_` and `price_` for live products)

## Security Features

✅ **Webhook Signature Verification** - All webhooks are verified using `STRIPE_WEBHOOK_SECRET`  
✅ **Authentication Required** - Users must be logged in to create checkout sessions  
✅ **Server-Side Only** - All Stripe operations happen server-side, keys never exposed  
✅ **Metadata Validation** - Server ID is validated before processing webhooks

## Troubleshooting

### Build Error: "Neither apiKey nor config.authenticator provided"
This is normal during build - API routes with Stripe only run at runtime. You can:
- Ignore it (it won't affect production)
- Or add temporary placeholder values during build

### Webhook Not Receiving Events
1. Check webhook URL is correct in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` matches the webhook's signing secret
3. Check server logs for signature verification errors
4. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Premium Not Activating
1. Check MongoDB connection is working
2. Verify `serverId` is being passed correctly in checkout metadata
3. Check server logs for webhook processing errors
4. Ensure the correct `guildId` field is used (matches your MongoDB schema)

## Files Modified

- `app/api/stripe/webhook/route.ts` - Webhook handler
- `app/api/stripe/create-checkout/route.ts` - Checkout session creator
- `app/servers/[guildId]/premium/page.tsx` - Premium page with subscribe button
- `lib/models/ServerSettings.ts` - Added Stripe fields (stripeCustomerId, stripeSubscriptionId)

## MongoDB Schema Changes

Added to ServerSettings model:
```typescript
stripeCustomerId: { type: String, default: null }
stripeSubscriptionId: { type: String, default: null }
```
