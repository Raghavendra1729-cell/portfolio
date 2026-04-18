export const DEFAULT_PROFILE_IMAGE = "/profile/raghavendra-portrait.png";

export const SITE_PAGE_KEYS = [
  "about",
  "projects",
  "experience",
  "skills",
  "achievements",
  "contact",
] as const;

export type SitePageKey = (typeof SITE_PAGE_KEYS)[number];

export const SITE_PAGE_DETAILS: Record<SitePageKey, { label: string; path: string }> = {
  about: { label: "About", path: "/about" },
  projects: { label: "Projects", path: "/projects" },
  experience: { label: "Experience", path: "/experience" },
  skills: { label: "Skills", path: "/skills" },
  achievements: { label: "Achievements", path: "/achievements" },
  contact: { label: "Contact", path: "/contact" },
};

export const LANDING_HOME_SECTION_IDS = [
  "highlights",
  "projects",
  "achievements",
  "explore",
  "contact",
] as const;

export type LandingHomeSectionId = (typeof LANDING_HOME_SECTION_IDS)[number];

export const LANDING_HOME_SECTION_LABELS: Record<LandingHomeSectionId, string> = {
  highlights: "Highlights",
  projects: "Projects",
  achievements: "Achievements",
  explore: "Explore",
  contact: "Contact",
};

export type SocialLinkKind = "email" | "github" | "linkedin" | "website" | "other";

export type NavigationItem = {
  label: string;
  href: string;
  enabled: boolean;
};

export type SiteMetadataConfig = {
  description: string;
  keywords: string[];
};

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
  path: string;
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
  navigationItems: NavigationItem[];
  siteMetadata: SiteMetadataConfig;
  pageIntro: Record<SitePageKey, PageIntro>;
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

export type LandingHeroSignal = {
  label: string;
  value: string;
};

export type LandingHomeSection = {
  id: LandingHomeSectionId;
  enabled: boolean;
};

export type LandingPageRecord = {
  _id: string;
  singletonKey: "landing-page";
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSummary: string;
  heroIntroLines: string[];
  heroSignals: LandingHeroSignal[];
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
  homeSections: LandingHomeSection[];
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
};

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Home", href: "/", enabled: true },
  { label: "About", href: "/about", enabled: true },
  { label: "Projects", href: "/projects", enabled: true },
  { label: "Experience", href: "/experience", enabled: true },
  { label: "Skills", href: "/skills", enabled: true },
  { label: "Achievements", href: "/achievements", enabled: true },
  { label: "Contact", href: "/contact", enabled: true },
];

export const DEFAULT_HOME_SECTIONS: LandingHomeSection[] = LANDING_HOME_SECTION_IDS.map((id) => ({
  id,
  enabled: true,
}));

export const fallbackSiteSettings: Omit<SiteSettingsRecord, "_id"> = {
  singletonKey: "site-settings",
  name: "Portfolio",
  role: "Software Engineer",
  location: "",
  availability: "",
  profileBadge: "",
  profileImage: "",
  profileImageAlt: "Portfolio portrait",
  footerBlurb: "",
  aboutParagraphs: [],
  primaryResumeLabel: "Resume",
  primaryResumeViewHref: "",
  primaryResumeDownloadHref: "",
  alternateResumeLinks: [],
  socialLinks: [],
  navigationItems: DEFAULT_NAVIGATION_ITEMS,
  siteMetadata: {
    description:
      "Portfolio of Raghavendra Linga, a computer science student and full-stack software engineer focused on clean systems, restrained interfaces, and strong execution.",
    keywords: [
      "Raghavendra Linga",
      "software engineer portfolio",
      "full-stack developer",
      "Next.js portfolio",
      "computer science student",
      "TypeScript engineer",
    ],
  },
  pageIntro: Object.fromEntries(
    SITE_PAGE_KEYS.map((key) => {
      const config = SITE_PAGE_DETAILS[key];

      return [
        key,
        {
          eyebrow: config.label,
          title: config.label,
          description: "",
          path: config.path,
        },
      ];
    })
  ) as Record<SitePageKey, PageIntro>,
};

export const fallbackLandingPage: Omit<LandingPageRecord, "_id"> = {
  singletonKey: "landing-page",
  heroEyebrow: "",
  heroTitle: "Portfolio",
  heroSubtitle: "",
  heroSummary: "",
  heroIntroLines: [
    "Full-stack systems with clean architecture",
    "Premium interfaces with restrained motion",
    "Practical engineering focused on shipping",
  ],
  heroSignals: [
    { label: "Focus", value: "Product-grade web apps" },
    { label: "Stack", value: "Next.js / TypeScript / MongoDB" },
    { label: "Mode", value: "Design · Build · Iterate" },
  ],
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  highlightCards: [],
  projectsEyebrow: "Projects",
  projectsTitle: "Featured projects",
  projectsDescription: "",
  maxFeaturedProjects: 3,
  achievementsEyebrow: "Achievements",
  achievementsTitle: "Featured achievements",
  achievementsDescription: "",
  maxFeaturedAchievements: 2,
  showAchievementsSection: true,
  exploreEyebrow: "Explore",
  exploreTitle: "Explore more",
  exploreDescription: "",
  featuredSections: [],
  homeSections: DEFAULT_HOME_SECTIONS,
  contactEyebrow: "Contact",
  contactTitle: "Get in touch",
  contactDescription: "",
};
