# UploadThing Configuration Guide

## Environment Variables

UploadThing v7+ requires one of these environment variables:

### Option 1: Use UPLOADTHING_SECRET (Recommended for v7+)
```env
UPLOADTHING_SECRET=sk_live_your_secret_key_here
```

### Option 2: Use UPLOADTHING_TOKEN (Legacy, but still supported)
```env
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJ...base64_encoded_json...
```

## Current Configuration

Your `.env` file should have:
```env
UPLOADTHING_TOKEN='your_base64_encoded_token_here'
UPLOADTHING_SECRET=sk_live_your_secret_key_here
```

## Deployment Setup (Render, Vercel, etc.)

### Important: Add Environment Variables to Your Deployment Platform

1. Go to your deployment platform's environment variables settings
2. Add **both** variables (use your actual values from `.env` file):
   - `UPLOADTHING_TOKEN` = `your_base64_encoded_token`
   - `UPLOADTHING_SECRET` = `sk_live_your_secret_key`

3. **Important**: Remove the single quotes when adding to deployment platform
   - ❌ Wrong: `'eyJhcGlLZXkiOi...'`
   - ✅ Correct: `eyJhcGlLZXkiOi...`

4. Redeploy your application

## Troubleshooting

### Error: "Invalid token"

This means the environment variable isn't being read correctly. Check:

1. **Environment variable is set** in your deployment platform
2. **No quotes** around the value in deployment settings
3. **Restart/redeploy** after adding environment variables
4. **Check logs** to see if the variable is being loaded

### Error: "Unauthorized" 

This is from the Clerk authentication in the upload middleware. Make sure:
1. User is logged in
2. Clerk environment variables are set correctly

### Testing Locally

1. Ensure `.env` file has the variables
2. Restart your dev server: `npm run dev`
3. Try uploading a file
4. Check browser console for detailed error messages

## Getting Your UploadThing Credentials

1. Go to https://uploadthing.com/dashboard
2. Select your app (or create one)
3. Go to API Keys section
4. Copy the secret key (starts with `sk_live_` or `sk_test_`)
5. The token is the base64 encoded JSON object shown in the dashboard

## Code Configuration

The route handler automatically uses environment variables:

```typescript
// app/api/uploadthing/route.ts
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // No need to explicitly pass token - it's read from env automatically
});
```

## File Size Limits

Current configuration:
- Server images: 4MB max, 1 file
- Message files: Default limits for images and PDFs

To change limits, edit `app/api/uploadthing/core.ts`:
```typescript
serverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
```
