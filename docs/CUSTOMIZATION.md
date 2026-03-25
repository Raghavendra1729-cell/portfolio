# Customization Guide

## Homepage copy
- Admin path: `Landing Page`
- Update:
  `heroEyebrow`, `heroTitle`, `heroSubtitle`, `heroSummary`
- Update CTA labels and routes:
  `primaryCtaLabel`, `primaryCtaHref`, `secondaryCtaLabel`, `secondaryCtaHref`

## Resume links
- Admin path: `Site Settings`
- Primary resume actions:
  `primaryResumeLabel`, `primaryResumeViewHref`, `primaryResumeDownloadHref`
- Optional backup links:
  `alternateResumeLinks`

## Profile image
- Admin path: `Site Settings`
- Upload through the `Profile Image` uploader.
- Set accessible alt text with `profileImageAlt`.
- The homepage hero uses this image automatically.

## Homepage featured content
- Featured projects:
  edit individual `Projects` and enable `featured`
- Featured achievements:
  edit individual `Achievements` and enable `featured`
- Homepage item counts:
  edit `maxFeaturedProjects` and `maxFeaturedAchievements` in `Landing Page`

## Shared page intros
- Admin path: `Site Settings`
- Edit the `Page intros` section for:
  `About`, `Projects`, `Experience`, `Skills`, `Achievements`, `Contact`

## Social and contact links
- Admin path: `Site Settings`
- Use `Social Links` for email, LinkedIn, GitHub, website, and other channels.
- These links feed both the footer and the contact page.

## Content architecture summary
- `Site Settings`:
  shared identity and profile source of truth
- `Landing Page`:
  homepage structure and messaging source of truth
- Repeatable collections:
  domain-specific content records

## Environment variables
See [SETUP.md](./SETUP.md). At minimum this app depends on:
- `MONGODB_URI`
- `ADMIN_SECRET`
- Cloudinary upload variables used by `/api/upload`
- `NEXT_PUBLIC_SITE_URL` for canonical metadata
