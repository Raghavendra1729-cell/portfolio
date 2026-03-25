import { landingPageDefaults, siteSettingsDefaults } from "@/content/site";
import { navigationItems } from "@/content/structure";

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

export const defaultSiteSettings = siteSettingsDefaults as Omit<SiteSettingsRecord, "_id">;

export const defaultLandingPage = landingPageDefaults as Omit<LandingPageRecord, "_id">;

export const publicNavItems = navigationItems
  .filter((item) => item.enabled)
  .map(({ label, href }) => ({ label, href }));
