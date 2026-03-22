# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router portfolio app. Put routes, layouts, loading states, error boundaries, and API handlers in `app/` (for example `app/projects/[id]/page.tsx` and `app/api/upload/route.ts`). Keep reusable UI in `components/`, with shared primitives in `components/ui/` and admin-specific pieces in `components/admin/`. Store data helpers, auth, and MongoDB utilities in `lib/`, and keep Mongoose models in `models/`. Place static files in `public/`.

## Build, Test, and Development Commands
Use `npm run dev` to start the local dev server at `http://localhost:3000`. Run `npm run build` to produce a production build and catch compile-time issues. Use `npm run start` to serve the built app locally. Run `npm run lint` before opening a PR; this uses the repo ESLint config and is the main automated quality gate today.

## Coding Style & Naming Conventions
Write TypeScript with strict typing and keep indentation to 2 spaces. Follow the existing style: double quotes, semicolons, and `@/*` import aliases such as `@/components/Navbar`. Use PascalCase for React components and model files like `Navbar.tsx` and `Project.ts`. Route files in `app/` should follow Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).

## Testing Guidelines
There is no dedicated test runner configured yet. For now, validate changes with `npm run lint` and `npm run build`. If you add tests later, keep them close to the feature or in a `tests/` directory and use `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
Keep commits focused and descriptive. Recent history favors short imperative messages and `feat:`-style prefixes when appropriate, for example `feat: add project detail page`. Pull requests should include a brief summary, linked issues when relevant, screenshots or GIFs for UI changes, and notes for any API, schema, or environment-variable updates.

## Configuration & Data Notes
Secrets belong in `.env.local` and must not be committed. Changes that touch `models/`, `lib/mongodb.ts`, or `app/api/*` should be checked carefully against the local database and admin flows.
