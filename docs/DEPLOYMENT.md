# Deployment

## Recommended platform
Vercel is the simplest target for this Next.js app.

## Environment setup
Set all variables from `docs/SETUP.md` in deployment settings:
- `MONGODB_URI`
- `ADMIN_SECRET`
- `ADMIN_JWT_SECRET` (recommended)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL` (optional override if you want a custom canonical production URL)

## Build command
```bash
npm run build
```

## Start command
```bash
npm run start
```

## Vercel notes
- The default development script uses webpack because this repository currently hits a Turbopack dev-only panic in the local environment.
- Production builds still use `npm run build` and are safe to deploy.
- Set the Vercel Node.js version to `20.x` to match `package.json`.

## Post-deploy checks
- Open public pages and validate content loading.
- Test `/admin` login and CRUD actions.
- Confirm image upload works if enabled.
- Validate canonical metadata uses production URL.
