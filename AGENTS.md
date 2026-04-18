# Repository Guidelines

## Project Structure & Module Organization
This project is a Next.js App Router portfolio application. Keep routes, layouts, loading states, error boundaries, and API handlers in `app/` such as `app/projects/[id]/page.tsx` and `app/api/upload/route.ts`. Put reusable UI in `components/`, shared primitives in `components/ui/`, and admin-facing forms or tools in `components/admin/`. Store business logic, metadata helpers, and data access code in `lib/`, and place Mongoose schemas in `models/`. Static assets belong in `public/`; editable content and supporting docs live in `content/`, `docs/`, and `resources/`.

## Build, Test, and Development Commands
Run commands from the repository root.

- `npm run dev` starts the local dev server on `http://localhost:3000`.
- `npm run build` creates a production build and catches type and route issues.
- `npm run start` serves the production build locally.
- `npm run lint` runs ESLint and is the baseline quality gate before a PR.

## Coding Style & Naming Conventions
Write strict TypeScript with 2-space indentation, double quotes, and semicolons. Prefer `@/*` import aliases, for example `@/components/Navbar`. Use PascalCase for React components and model files like `Hero.tsx` and `Project.ts`. Keep route filenames aligned with Next.js conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, and `error.tsx`.

## Testing Guidelines
There is no dedicated test runner configured yet. Validate all changes with `npm run lint` and `npm run build`. If you introduce tests, place them near the feature or under `tests/` and use `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
Keep commits focused and descriptive. Recent history favors short imperative subjects with conventional prefixes such as `feat: redesign portfolio structure` or `feat: add seed functionality`. Pull requests should include a brief summary, linked issues when relevant, screenshots or GIFs for UI changes, and notes for schema, API, or environment-variable updates.

## Security & Configuration Tips
Store secrets in `.env.local` and never commit them. Review changes touching `models/`, `lib/mongodb.ts`, and `app/api/*` carefully, since they affect database behavior and admin flows. When changing content models or seed logic, verify both the public pages and the admin experience before merging.
