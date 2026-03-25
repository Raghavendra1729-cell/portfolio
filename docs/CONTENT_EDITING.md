# Content Editing

## Admin access
1. Open `/admin`.
2. Enter `ADMIN_SECRET`.
3. Use the sidebar to switch between collections and singleton settings documents.

## Where to edit what

### Site Settings
Use `Site Settings` for:
- Name, role, location, availability
- Profile badge and profile image
- Footer blurb
- About page paragraph content
- Resume links:
  primary view link, primary download link, alternate links
- Social/contact links:
  email, LinkedIn, GitHub, website, others
- Page intro copy for:
  `About`, `Projects`, `Experience`, `Skills`, `Achievements`, `Contact`

### Landing Page
Use `Landing Page` for:
- Hero eyebrow, title, subtitle, summary
- Homepage CTA labels and links
- Homepage highlight cards
- Featured projects section copy and item count
- Featured achievements section copy and item count
- Explore section copy and homepage route cards
- Closing CTA copy on the homepage

### Projects
Use `Projects` for:
- Case study content
- Stack, links, screenshots
- Display order
- `featured` toggle for the homepage featured work section

### Achievements
Use `Achievements` for:
- Achievement details, proof links, certificates/images
- Display order
- `featured` toggle for the homepage highlights section

### Other collections
- `Experience`: job history, responsibilities, technologies
- `Education`: academic background and highlights
- `Skills`: grouped skills, proficiency, focus signals
- `CP Profiles`: competitive programming handles and stats
- `Hackathons`: event participation and outcomes

## Upload flow
- Image uploads in admin go through `/api/upload`.
- The server uploads media to Cloudinary and returns a URL.
- That URL is stored in MongoDB and rendered directly on the public site.

## Editing guidance
- Keep hero and section copy concise.
- Prefer one strong sentence over multiple vague ones.
- Use `featured` sparingly so homepage content feels selected.
- Keep resume URLs and primary contact methods current inside `Site Settings`, not in page files.
- Keep project descriptions structured when useful:
  `Problem: ...`
  `Approach: ...`
  `Outcome: ...`
