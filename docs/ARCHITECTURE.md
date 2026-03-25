# Architecture

## Stack
- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- MongoDB + Mongoose
- Cloudinary (media uploads)

## Directory map
- `app/`: routes, layouts, API handlers.
- `components/`: reusable UI and admin components.
- `lib/`: config, auth, data normalization/service utilities.
- `models/`: Mongoose schemas by content type.
- `resources/`: local media assets.

## Data flow
1. Public pages call `lib/data.ts` helpers (`getData`, `getItem`).
2. Shared singleton settings are fetched through `getSiteSettings` and `getLandingPage`.
3. Helpers call the server content service (`lib/content-service.ts`).
4. Content service resolves collection model + sorting and queries MongoDB.
5. Results are normalized into typed records for predictable rendering.

## Content model split
- Repeatable collections:
  projects, experience, education, skills, achievements, CP profiles, hackathons
- Singleton settings:
  `Site Settings`, `Landing Page`

This keeps homepage/profile/global copy centralized without creating a second hardcoded config layer.

## Admin flow
1. `/admin` login sends `x-admin-secret` to `/api/admin`.
2. Server validates secret and sets signed session cookie.
3. Dashboard fetches and mutates via `/api/data` and `/api/admin`.
4. Repeatable collections use CRUD; singleton settings use upsert behavior.
5. Content writes are validated through `validateContentData`.
6. Paths are revalidated after writes.
