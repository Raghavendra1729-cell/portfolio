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
2. Helpers call server content service (`lib/content-service.ts`).
3. Content service resolves collection model + sorting and queries MongoDB.
4. Results are normalized into typed records for predictable rendering.

## Admin flow
1. `/admin` login sends `x-admin-secret` to `/api/admin`.
2. Server validates secret and sets signed session cookie.
3. Dashboard fetches and mutates via `/api/data` and `/api/admin`.
4. Content writes are validated through `validateContentData`.
5. Paths are revalidated after writes.
