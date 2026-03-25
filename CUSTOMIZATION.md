# Customization Guide

## Main edit surface

Most future edits now live in the `content/` folder:

- Site-wide profile, hero copy defaults, about copy, resume links, social links, and per-page intro defaults: [content/site.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/site.ts)
- Navbar items, home section toggles/order, page section visibility, hero support lines, SEO page metadata, and default profile image path: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
- Projects, experience, education, skills, achievements, competitive profiles, and hackathons local fallback content: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)

The app still preserves the existing Mongo/admin flow. If you already manage content through the database, that data continues to take priority. The `content/` files are now the clean local fallback and the easiest repo-level place to edit content.

## Where to edit content

- Home hero text: [content/site.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/site.ts)
  Fields: `landingPageDefaults.heroEyebrow`, `heroTitle`, `heroSubtitle`, `heroSummary`, `primaryCtaLabel`, `primaryCtaHref`, `secondaryCtaLabel`, `secondaryCtaHref`
- Hero intro lines and hero signal blocks: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
  Fields: `heroIntroLines`, `heroSignals`
- About section text: [content/site.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/site.ts)
  Field: `siteSettingsDefaults.aboutParagraphs`
- Experience entries: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)
  Field: `defaultExperience`
- Project entries: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)
  Field: `defaultProjects`
- Achievements: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)
  Field: `defaultAchievements`
- Skills: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)
  Field: `defaultSkills`
- Education: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)
  Field: `defaultEducation`
- Competitive profiles: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)
  Field: `defaultCpProfiles`
- Hackathons: [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts)
  Field: `defaultHackathons`

## Resume, socials, contact, and profile image

- Primary resume label and links: [content/site.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/site.ts)
  Fields: `siteSettingsDefaults.primaryResumeLabel`, `primaryResumeViewHref`, `primaryResumeDownloadHref`
- Alternate resume links: [content/site.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/site.ts)
  Field: `siteSettingsDefaults.alternateResumeLinks`
- Social and contact links: [content/site.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/site.ts)
  Field: `siteSettingsDefaults.socialLinks`
- Default profile image path: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
  Field: `defaultProfileImage`
- Current local profile image file: [public/profile/raghavendra-portrait.png](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/public/profile/raghavendra-portrait.png)

If you want to swap the portrait quickly, replace the file in `public/profile/` or point `defaultProfileImage` at a different file path.

## Section visibility and ordering

- Navbar order and visibility: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
  Field: `navigationItems`
- Home section order and visibility: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
  Field: `homeSections`
- Page-specific section toggles for `about`, `achievements`, and `contact`: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
  Field: `pageSectionVisibility`

## SEO metadata

- Site-level metadata defaults: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
  Field: `siteMetadata`
- Page-level title/description/path config: [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts)
  Field: `pageMetadata`
- Metadata helper that applies these values: [lib/metadata.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/lib/metadata.ts)

## Design system organization

- Global design tokens, dark theme values, surfaces, borders, motion timings, and shared utility classes: [app/globals.css](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/app/globals.css)
- Shared site metadata and resolved public nav config: [lib/site-config.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/lib/site-config.ts)
- Core motion constants: [lib/motion.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/lib/motion.ts)
- Shared page shell and headers: [components/layout/PageShell.tsx](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/components/layout/PageShell.tsx), [components/layout/PageHeader.tsx](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/components/layout/PageHeader.tsx)
- Hero implementation: [components/home/Hero.tsx](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/components/home/Hero.tsx), [components/HeroPortrait.tsx](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/components/HeroPortrait.tsx)

## Data and seed behavior

- Local fallback content is wired in through [lib/data.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/lib/data.ts)
- Seed content now reuses the centralized content files through [lib/seed.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/lib/seed.ts)

This means:

- If Mongo content exists, the app keeps using it.
- If Mongo content is unavailable, the centralized `content/` files provide the local fallback.
- If you want the seeded DB content to match your local fallback content, update the `content/` files before running the seed flow.
