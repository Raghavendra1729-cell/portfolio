export type SocialLinkKind = "email" | "github" | "linkedin" | "website" | "other";

export type SocialLink = {
  kind: SocialLinkKind;
  label: string;
  value: string;
  href: string;
};

export type ResumeAlternateLink = {
  label: string;
  href: string;
};

export type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
};

export type SiteSettingsRecord = {
  _id: string;
  singletonKey: "site-settings";
  name: string;
  role: string;
  location: string;
  availability: string;
  profileBadge: string;
  profileImage: string;
  profileImageAlt: string;
  footerBlurb: string;
  aboutParagraphs: string[];
  primaryResumeLabel: string;
  primaryResumeViewHref: string;
  primaryResumeDownloadHref: string;
  alternateResumeLinks: ResumeAlternateLink[];
  socialLinks: SocialLink[];
  pageIntro: {
    about: PageIntro;
    projects: PageIntro;
    experience: PageIntro;
    skills: PageIntro;
    achievements: PageIntro;
    contact: PageIntro;
  };
};

export type LandingHighlight = {
  title: string;
  description: string;
};

export type LandingFeaturedSection = {
  label: string;
  title: string;
  description: string;
  href: string;
};

export type LandingPageRecord = {
  _id: string;
  singletonKey: "landing-page";
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSummary: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  highlightCards: LandingHighlight[];
  projectsEyebrow: string;
  projectsTitle: string;
  projectsDescription: string;
  maxFeaturedProjects: number;
  achievementsEyebrow: string;
  achievementsTitle: string;
  achievementsDescription: string;
  maxFeaturedAchievements: number;
  showAchievementsSection: boolean;
  exploreEyebrow: string;
  exploreTitle: string;
  exploreDescription: string;
  featuredSections: LandingFeaturedSection[];
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
};

export const defaultSiteSettings: Omit<SiteSettingsRecord, "_id"> = {
  singletonKey: "site-settings",
  name: "Raghavendra",
  role: "Software Engineer",
  location: "India",
  availability: "Open to software engineering internships, collaborations, and full-time roles.",
  profileBadge: "Engineering + product execution",
  profileImage: "",
  profileImageAlt: "Raghavendra portrait",
  footerBlurb:
    "Software engineer and student focused on adaptable problem solving, fast learning, and clear execution.",
  aboutParagraphs: [
    "I am a software engineer and student who adapts quickly, learns unfamiliar tools fast, and turns ideas into working software.",
    "I care about clarity, strong execution, and building products that are useful, maintainable, and easy to reason about.",
  ],
  primaryResumeLabel: "Resume",
  primaryResumeViewHref: "",
  primaryResumeDownloadHref: "",
  alternateResumeLinks: [],
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
      value: "raghavendra1729-cell",
      href: "https://github.com/raghavendra1729-cell",
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
      title: "About me.",
      description: "Background, education summary, and engineering approach.",
    },
    projects: {
      eyebrow: "Projects",
      title: "Projects.",
      description: "Selected work with context, stack choices, and outcomes.",
    },
    experience: {
      eyebrow: "Experience",
      title: "Experience.",
      description: "Work history, responsibilities, and technical impact.",
    },
    skills: {
      eyebrow: "Skills",
      title: "Skills.",
      description: "Skill categories with proficiency and focus signals.",
    },
    achievements: {
      eyebrow: "Achievements",
      title: "Achievements.",
      description: "Achievements, competitive profiles, and hackathons.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Contact.",
      description: "Direct contact methods for opportunities and collaboration.",
    },
  },
};

export const defaultLandingPage: Omit<LandingPageRecord, "_id"> = {
  singletonKey: "landing-page",
  heroEyebrow: "Software engineer portfolio",
  heroTitle: "Building product-grade software with clarity, speed, and technical range.",
  heroSubtitle:
    "I design and ship full-stack software that turns ambiguous product problems into stable, practical outcomes.",
  heroSummary:
    "This portfolio is structured for fast evaluation: featured work, focused experience, and direct paths to projects, resume, and contact.",
  primaryCtaLabel: "View projects",
  primaryCtaHref: "/projects",
  secondaryCtaLabel: "Contact me",
  secondaryCtaHref: "/contact",
  highlightCards: [
    {
      title: "Execution",
      description: "I scope ambiguous problems quickly and turn them into reliable shipped software.",
    },
    {
      title: "Engineering style",
      description: "Clear architecture, maintainable systems, and communication that keeps teams aligned.",
    },
    {
      title: "Focus",
      description: "Full-stack product development, adaptable technical depth, and practical delivery.",
    },
  ],
  projectsEyebrow: "Featured work",
  projectsTitle: "Selected projects with strong signal.",
  projectsDescription: "A compact look at the work that best represents my engineering range.",
  maxFeaturedProjects: 3,
  achievementsEyebrow: "Highlights",
  achievementsTitle: "Proof through competitive and project outcomes.",
  achievementsDescription: "Selected achievements and milestones that add context beyond the resume.",
  maxFeaturedAchievements: 2,
  showAchievementsSection: true,
  exploreEyebrow: "Explore",
  exploreTitle: "Go deeper where it matters to you.",
  exploreDescription: "Use the sections below to move directly into the area you want to evaluate.",
  featuredSections: [
    {
      label: "Projects",
      title: "Case studies and shipped work",
      description: "Review the implementation choices, links, stack, and delivery context.",
      href: "/projects",
    },
    {
      label: "Experience",
      title: "Roles, ownership, and impact",
      description: "See how I have contributed across internships, teams, and real product work.",
      href: "/experience",
    },
    {
      label: "Skills",
      title: "Current technical depth",
      description: "Scan categories, confidence levels, and what I am actively using right now.",
      href: "/skills",
    },
    {
      label: "Contact",
      title: "Resume and direct reach-out",
      description: "Open the resume, use the fastest contact path, or start a conversation.",
      href: "/contact",
    },
  ],
  contactEyebrow: "Next step",
  contactTitle: "Resume, links, and direct contact stay one click away.",
  contactDescription:
    "Everything important is centralized so it is easy to review and easy for me to update later.",
};

export const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Achievements", href: "/achievements" },
  { label: "Contact", href: "/contact" },
] as const;
