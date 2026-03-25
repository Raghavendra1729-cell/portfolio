export const siteSettingsDefaults = {
  singletonKey: "site-settings",
  name: "Raghavendra Linga",
  role: "Full-Stack Software Engineer",
  location: "Bengaluru, India",
  availability:
    "Open to internships, product engineering roles, and focused technical collaborations.",
  profileBadge: "CS student / full-stack builder",
  profileImage: "",
  profileImageAlt: "Portrait of Raghavendra Linga",
  footerBlurb:
    "Computer science student building product-grade web systems with clear architecture, restrained interfaces, and fast iteration.",
  aboutParagraphs: [
    "I am a computer science student and full-stack engineer who enjoys turning ambiguous ideas into clear systems, useful products, and interfaces that feel deliberate instead of busy.",
    "My strongest work sits at the intersection of product thinking and engineering execution: structuring data well, keeping codebases maintainable, and making the user-facing layer feel sharp and trustworthy.",
    "I care about shipping with intent. That means readable code, honest tradeoffs, solid performance, and design decisions that support the story of the work rather than distracting from it.",
  ],
  primaryResumeLabel: "View resume",
  primaryResumeViewHref: "",
  primaryResumeDownloadHref: "",
  alternateResumeLinks: [
    { label: "ATS version", href: "" },
    { label: "One-page PDF", href: "" },
  ].filter((link) => link.href),
  socialLinks: [
    {
      kind: "email",
      label: "Email",
      value: "lingaraghawendra@gmail.com",
      href: "mailto:lingaraghawendra@gmail.com",
    },
    {
      kind: "github",
      label: "GitHub",
      value: "Raghavendra1729-cell",
      href: "https://github.com/Raghavendra1729-cell",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      value: "raghavendra-linga",
      href: "https://www.linkedin.com/in/raghavendra-linga/",
    },
  ],
  pageIntro: {
    about: {
      eyebrow: "About",
      title: "Background, mindset, and how I build.",
      description:
        "A tighter editorial view of my education, working style, and what I optimize for when I ship.",
    },
    projects: {
      eyebrow: "Projects",
      title: "Case studies with clearer signal.",
      description:
        "Selected work presented with stronger hierarchy, cleaner context, and better emphasis on what matters.",
    },
    experience: {
      eyebrow: "Experience",
      title: "Execution across roles and real work.",
      description:
        "How I contributed, what I owned, and the technical surfaces where I create the most value.",
    },
    skills: {
      eyebrow: "Skills",
      title: "Current stack, real comfort, active focus.",
      description:
        "A structured view of the tools I rely on most and the kinds of problems I am ready to solve.",
    },
    achievements: {
      eyebrow: "Achievements",
      title: "Signals beyond the resume line items.",
      description:
        "Competitive programming, hackathons, and project outcomes that add context to the work itself.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Direct routes for serious conversations.",
      description:
        "Resume access, social links, and the fastest ways to reach me for product and engineering opportunities.",
    },
  },
};

export const landingPageDefaults = {
  singletonKey: "landing-page",
  heroEyebrow: "Engineer portfolio",
  heroTitle: "I build sharp, reliable software that holds up from system design to final interface.",
  heroSubtitle:
    "Computer science student and full-stack engineer focused on product-grade execution, maintainable architecture, and interfaces that feel precise instead of loud.",
  heroSummary:
    "This portfolio is intentionally structured for quick evaluation: strong work samples, practical experience, and a clean path into the projects, resume, and story behind the build.",
  primaryCtaLabel: "See projects",
  primaryCtaHref: "/projects",
  secondaryCtaLabel: "Start a conversation",
  secondaryCtaHref: "/contact",
  highlightCards: [
    {
      title: "Systems",
      description:
        "I like clean models, stable APIs, and frontends that stay readable as the product grows.",
    },
    {
      title: "Execution",
      description:
        "I scope quickly, reduce noise, and turn rough ideas into shipped software with strong fundamentals.",
    },
    {
      title: "Taste",
      description:
        "I care about hierarchy, motion, and restraint so the work feels intentional rather than templated.",
    },
  ],
  projectsEyebrow: "Featured work",
  projectsTitle: "Projects that show both technical depth and product judgment.",
  projectsDescription:
    "A selected set of builds that best represent how I think about systems, interfaces, and practical delivery.",
  maxFeaturedProjects: 3,
  achievementsEyebrow: "Signals",
  achievementsTitle: "Proof through outcomes, consistency, and range.",
  achievementsDescription:
    "A concise set of highlights that add context around learning speed, discipline, and engineering seriousness.",
  maxFeaturedAchievements: 2,
  showAchievementsSection: true,
  exploreEyebrow: "Explore",
  exploreTitle: "Go deeper where it matters to you.",
  exploreDescription:
    "Move directly into experience, projects, skills, or contact without digging through filler.",
  featuredSections: [
    {
      label: "Projects",
      title: "Case studies and shipped work",
      description:
        "Review the implementation decisions, stack choices, and outcomes behind the strongest projects.",
      href: "/projects",
    },
    {
      label: "Experience",
      title: "Roles, ownership, and impact",
      description:
        "See the environments where I contributed, what I owned, and how I approached delivery.",
      href: "/experience",
    },
    {
      label: "Skills",
      title: "Current technical depth",
      description:
        "Scan the tools I use most, the areas I am strongest in, and what I am actively sharpening.",
      href: "/skills",
    },
    {
      label: "Contact",
      title: "Resume and direct links",
      description:
        "Open the resume, find the fastest contact channel, or continue the conversation directly.",
      href: "/contact",
    },
  ],
  contactEyebrow: "Next move",
  contactTitle: "Resume, links, and contact stay close to the work.",
  contactDescription:
    "Everything important is deliberately easy to review and just as easy for me to update later.",
};
