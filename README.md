# Raghavendra Portfolio

A premium dark, content-driven portfolio built with Next.js App Router, TypeScript, MongoDB, Cloudinary uploads, Framer Motion, and a protected admin CMS.

This repository powers:
- A public portfolio website with home, about, projects, experience, skills, achievements, and contact routes.
- A protected admin dashboard for editing both collection content and singleton settings.
- API routes for content retrieval, admin CRUD/upserts, uploads, and CP profile/stat sync.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` using [docs/SETUP.md](docs/SETUP.md).

3. Start development:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run build
```

## Content architecture

The CMS now has two kinds of content:

- Repeatable collections:
  `Projects`, `Experience`, `Education`, `Skills`, `Achievements`, `CP Profiles`, `Hackathons`
- Singleton settings documents:
  `Site Settings` and `Landing Page`

Use them like this:

- `Site Settings`: identity, profile image, about copy, resume links, social links, footer text, page intro copy.
- `Landing Page`: hero title/subtitle/summary, CTA labels + links, homepage highlight cards, featured section copy, curated route cards, homepage section counts.
- `Projects` and `Achievements`: use the `featured` toggle to control homepage showcases.

## Editing workflow

1. Open `/admin`.
2. Sign in with `ADMIN_SECRET`.
3. Update `Site Settings` for profile/resume/social/shared copy.
4. Update `Landing Page` for homepage structure and hero content.
5. Update `Projects` and `Achievements` collections for featured work/highlights.

## Documentation

- [Project overview](docs/OVERVIEW.md)
- [Setup and environment variables](docs/SETUP.md)
- [Content editing guide](docs/CONTENT_EDITING.md)
- [Customization guide](docs/CUSTOMIZATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Features](docs/FEATURES.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Design principles](docs/DESIGN_PRINCIPLES.md)
