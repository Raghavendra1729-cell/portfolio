# Portfolio Redesign Changelog

## What changed

- Rebuilt the public portfolio UI around a darker neobrutalist and cyber-minimal visual system.
- Reworked the hero into a stronger profile-photo-led introduction with restrained cursor-reactive motion.
- Tightened the navbar, footer, page headers, loading states, and error states so the site feels more intentional and consistent.
- Redesigned the home, about, experience, projects, skills, achievements, contact, and project detail views with better hierarchy and cleaner section structure.
- Improved project presentation so featured work, screenshots, stack, links, and case-study content read more clearly.

## Content architecture

- Added a new `content/` layer so singleton content, structure config, metadata, and local fallback records are centralized.
- Moved local default site settings and landing content into [content/site.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/site.ts).
- Added centralized navigation, section toggles, page metadata, hero support content, and profile image path config in [content/structure.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/structure.ts).
- Added fallback records for projects, experience, education, skills, achievements, competitive profiles, and hackathons in [content/collections.ts](/Users/lingaraghavendra/Desktop/Portfolio/portfolio/content/collections.ts).
- Updated the data and seed layers so local content can power the site cleanly when DB content is unavailable.

## Technical cleanup

- Unified motion tokens and shared surface styling.
- Preserved the existing route and data architecture instead of replacing it with a new stack.
- Kept lint and production build passing after the refactor.
