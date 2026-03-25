# Setup

## Requirements
- Node.js 20+
- npm
- MongoDB instance (local or hosted)
- Cloudinary account (if using admin image uploads)

## Install
```bash
npm install
```

## Environment variables
Create `.env.local` at repository root:

```bash
MONGODB_URI=
ADMIN_SECRET=
ADMIN_JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Variable notes
- `MONGODB_URI`: required for all content reads/writes.
- `ADMIN_SECRET`: required for admin login (header-based verification).
- `ADMIN_JWT_SECRET`: optional override for session token signing; defaults to `ADMIN_SECRET` if omitted.
- `CLOUDINARY_*`: required for `/api/upload` file uploads.
- `NEXT_PUBLIC_SITE_URL`: used for canonical/metadata URL generation.

## Run locally
```bash
npm run dev
```

## Validate production build
```bash
npm run lint
npm run build
npm run start
```
