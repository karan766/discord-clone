# Build Instructions

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Run development server:
```bash
npm run dev
```

## Production Build

The build process will automatically:
1. Generate the Prisma client (`prisma generate`)
2. Build the Next.js application (`next build`)

```bash
npm run build
```

## Deployment (Render, Vercel, etc.)

### Environment Variables Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `UPLOADTHING_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

### Build Command:
```bash
npm run build
```

### Start Command:
```bash
npm start
```

### Important Notes:
- The `postinstall` script will automatically run `prisma generate` after `npm install`
- The `lib/generated` folder is gitignored and will be created during build
- Ensure your deployment platform has access to the DATABASE_URL for Prisma to generate the client

## Troubleshooting

### "Module not found: Can't resolve '@/lib/generated/prisma/client'"

This error occurs when the Prisma client hasn't been generated. Solutions:

1. **Local Development:**
   ```bash
   npx prisma generate
   ```

2. **Deployment:**
   - Ensure `postinstall` script runs: `npm install` should trigger it
   - Verify DATABASE_URL is set in environment variables
   - Check build logs to confirm `prisma generate` executed successfully

3. **Manual Fix:**
   ```bash
   npm install
   npx prisma generate
   npm run build
   ```
