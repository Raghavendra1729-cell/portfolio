import { cache } from "react";
import {
  getContentDocumentById,
  getSingletonContentDocument,
  listContentDocuments,
  listFeaturedContentDocuments,
} from "@/lib/content-service";
import {
  LANDING_HOME_SECTION_IDS,
  SITE_PAGE_KEYS,
  fallbackLandingPage,
  fallbackSiteSettings,
  type LandingFeaturedSection,
  type LandingHeroSignal,
  type LandingHomeSection,
  type LandingPageRecord,
  type NavigationItem,
  type PageIntro,
  type ResumeAlternateLink,
  type SiteMetadataConfig,
  type SiteSettingsRecord,
  type SocialLink,
} from "@/lib/site-content";

export type {
  LandingFeaturedSection,
  LandingHeroSignal,
  LandingHomeSection,
  LandingPageRecord,
  NavigationItem,
  PageIntro,
  ResumeAlternateLink,
  SiteMetadataConfig,
  SiteSettingsRecord,
  SocialLink,
} from "@/lib/site-content";

export type ContentLink = {
  name: string;
  url: string;
};

type BaseRecord = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectRecord = BaseRecord & {
  title: string;
  description: string;
  techStack: string[];
  links: ContentLink[];
  images: string[];
  featured: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
  link?: string;
  repo?: string;
};

export type ExperienceRecord = BaseRecord & {
  role: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description: string[];
  technologies: string[];
  logo?: string;
  attachments: string[];
  links: ContentLink[];
  order?: number;
};

export type EducationRecord = BaseRecord & {
  institution: string;
  degree: string;
  program?: string;
  status?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  gradeLabel?: string;
  gradeValue?: string;
  coursework: string[];
  highlights: string[];
  attachments: string[];
  order?: number;
};

export type SkillRecord = BaseRecord & {
  category: string;
  items: string[];
  proficiency?: Record<string, number>;
  focusSignals?: Record<string, string>;
  order?: number;
};

export type AchievementRecord = BaseRecord & {
  title: string;
  organization?: string;
  date?: string;
  description: string;
  featured: boolean;
  order?: number;
  images: string[];
  links: ContentLink[];
};

export type CPBadgeRecord = {
  label: string;
  value?: string;
};

export type CPProfileRecord = BaseRecord & {
  platform: string;
  username?: string;
  headline?: string;
  summary?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  solvedCount: number;
  streak?: number;
  profileUrl?: string;
  badges: CPBadgeRecord[];
  accent?: string;
  dataSource?: string;
  lastSyncedAt?: string;
  order?: number;
  isVisible?: boolean;
  images: string[];
};

export type HackathonRecord = BaseRecord & {
  title: string;
  event?: string;
  organizer?: string;
  result?: string;
  date?: string;
  location?: string;
  description?: string;
  techStack: string[];
  teamSize?: number;
  featured?: boolean;
  order?: number;
  images: string[];
  links: ContentLink[];
};

export type CollectionMap = {
  siteSettings: SiteSettingsRecord;
  landingPage: LandingPageRecord;
  project: ProjectRecord;
  experience: ExperienceRecord;
  education: EducationRecord;
  skill: SkillRecord;
  achievement: AchievementRecord;
  cpProfile: CPProfileRecord;
  hackathon: HackathonRecord;
};

export type CollectionId = keyof CollectionMap;

type FeaturedCollectionId = "project" | "achievement";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asBoolean(value: unknown) {
  return value === true;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asLinks(value: unknown): ContentLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const link = item as { name?: unknown; url?: unknown };
      const name = asString(link.name).trim();
      const url = asString(link.url).trim();

      if (!url) {
        return null;
      }

      return {
        name: name || "Reference",
        url,
      };
    })
    .filter((item): item is ContentLink => Boolean(item));
}

function asBadges(value: unknown): CPBadgeRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<CPBadgeRecord[]>((badges, item) => {
    if (!item || typeof item !== "object") {
      return badges;
    }

    const badge = item as { label?: unknown; value?: unknown };
    const label = asString(badge.label).trim();

    if (!label) {
      return badges;
    }

    badges.push({
      label,
      value: asString(badge.value).trim(),
    });

    return badges;
  }, []);
}

function asResumeLinks(value: unknown): ResumeAlternateLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<ResumeAlternateLink[]>((links, item) => {
    if (!item || typeof item !== "object") {
      return links;
    }

    const link = item as { label?: unknown; href?: unknown };
    const href = asString(link.href).trim();

    if (!href) {
      return links;
    }

    links.push({
      label: asString(link.label).trim() || "Resume",
      href,
    });

    return links;
  }, []);
}

function asSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<SocialLink[]>((links, item) => {
    if (!item || typeof item !== "object") {
      return links;
    }

    const link = item as { kind?: unknown; label?: unknown; value?: unknown; href?: unknown };
    const href = asString(link.href).trim();

    if (!href) {
      return links;
    }

    links.push({
      kind: (asString(link.kind).trim() || "other") as SocialLink["kind"],
      label: asString(link.label).trim() || "Link",
      value: asString(link.value).trim(),
      href,
    });

    return links;
  }, []);
}

function asNavigationItems(value: unknown): NavigationItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<NavigationItem[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const navigationItem = item as {
      label?: unknown;
      href?: unknown;
      enabled?: unknown;
    };
    const href = asString(navigationItem.href).trim();

    if (!href) {
      return items;
    }

    items.push({
      label: asString(navigationItem.label).trim() || "Link",
      href,
      enabled:
        !Object.prototype.hasOwnProperty.call(navigationItem, "enabled") ||
        navigationItem.enabled === true,
    });

    return items;
  }, []);
}

function asSiteMetadata(value: unknown): SiteMetadataConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      description: fallbackSiteSettings.siteMetadata.description,
      keywords: fallbackSiteSettings.siteMetadata.keywords,
    };
  }

  const metadata = value as Record<string, unknown>;

  return {
    description: asString(metadata.description).trim() || fallbackSiteSettings.siteMetadata.description,
    keywords: Array.isArray(metadata.keywords)
      ? asStringArray(metadata.keywords)
      : fallbackSiteSettings.siteMetadata.keywords,
  };
}

function asPageIntro(value: unknown): PageIntro {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    eyebrow: asString(record.eyebrow),
    title: asString(record.title),
    description: asString(record.description),
    path: asString(record.path),
  };
}

function asLandingHighlights(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingPageRecord["highlightCards"]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const card = item as { title?: unknown; description?: unknown };
    const title = asString(card.title).trim();
    const description = asString(card.description).trim();

    if (!title || !description) {
      return items;
    }

    items.push({ title, description });
    return items;
  }, []);
}

function asFeaturedSections(value: unknown): LandingFeaturedSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingFeaturedSection[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const section = item as {
      label?: unknown;
      title?: unknown;
      description?: unknown;
      href?: unknown;
    };
    const href = asString(section.href).trim();

    if (!href) {
      return items;
    }

    items.push({
      label: asString(section.label).trim() || "Section",
      title: asString(section.title).trim(),
      description: asString(section.description).trim(),
      href,
    });

    return items;
  }, []);
}

function asHeroSignals(value: unknown): LandingHeroSignal[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingHeroSignal[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const signal = item as { label?: unknown; value?: unknown };
    const signalValue = asString(signal.value).trim();

    if (!signalValue) {
      return items;
    }

    items.push({
      label: asString(signal.label).trim() || "Signal",
      value: signalValue,
    });

    return items;
  }, []);
}

function asHomeSections(value: unknown): LandingHomeSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingHomeSection[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const section = item as { id?: unknown; enabled?: unknown };
    const id = asString(section.id).trim();

    if (!LANDING_HOME_SECTION_IDS.includes(id as (typeof LANDING_HOME_SECTION_IDS)[number])) {
      return items;
    }

    items.push({
      id: id as LandingHomeSection["id"],
      enabled:
        !Object.prototype.hasOwnProperty.call(section, "enabled") || section.enabled === true,
    });

    return items;
  }, []);
}

function asNumberMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => typeof item === "number" && Number.isFinite(item))
      .map(([key, item]) => [key, item])
  );
}

function asStringMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => typeof item === "string" && item.trim())
      .map(([key, item]) => [key, item])
  );
}

export function normalizeCollectionItem<K extends CollectionId>(collection: K, item: unknown): CollectionMap[K] {
  const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  if (collection === "siteSettings") {
    const pageIntroRecord =
      record.pageIntro && typeof record.pageIntro === "object"
        ? (record.pageIntro as Record<string, unknown>)
        : {};
    const navigationItems = Array.isArray(record.navigationItems)
      ? asNavigationItems(record.navigationItems)
      : fallbackSiteSettings.navigationItems;

    const pageIntro = Object.fromEntries(
      SITE_PAGE_KEYS.map((key) => {
        const nextIntro = asPageIntro(pageIntroRecord[key]);

        return [
          key,
          {
            ...fallbackSiteSettings.pageIntro[key],
            ...nextIntro,
            path: nextIntro.path || fallbackSiteSettings.pageIntro[key].path,
          },
        ];
      })
    ) as SiteSettingsRecord["pageIntro"];

    return {
      _id: asString(record._id),
      singletonKey: "site-settings",
      name: asString(record.name) || fallbackSiteSettings.name,
      role: asString(record.role) || fallbackSiteSettings.role,
      location: asString(record.location) || fallbackSiteSettings.location,
      availability: asString(record.availability) || fallbackSiteSettings.availability,
      profileBadge: asString(record.profileBadge) || fallbackSiteSettings.profileBadge,
      profileImage: asString(record.profileImage),
      profileImageAlt: asString(record.profileImageAlt) || fallbackSiteSettings.profileImageAlt,
      footerBlurb: asString(record.footerBlurb) || fallbackSiteSettings.footerBlurb,
      aboutParagraphs: Array.isArray(record.aboutParagraphs)
        ? asStringArray(record.aboutParagraphs)
        : fallbackSiteSettings.aboutParagraphs,
      primaryResumeLabel:
        asString(record.primaryResumeLabel) || fallbackSiteSettings.primaryResumeLabel,
      primaryResumeViewHref: asString(record.primaryResumeViewHref),
      primaryResumeDownloadHref: asString(record.primaryResumeDownloadHref),
      alternateResumeLinks: Array.isArray(record.alternateResumeLinks)
        ? asResumeLinks(record.alternateResumeLinks)
        : fallbackSiteSettings.alternateResumeLinks,
      socialLinks: Array.isArray(record.socialLinks)
        ? asSocialLinks(record.socialLinks)
        : fallbackSiteSettings.socialLinks,
      navigationItems: navigationItems.length > 0 ? navigationItems : fallbackSiteSettings.navigationItems,
      siteMetadata: asSiteMetadata(record.siteMetadata),
      pageIntro,
    } as CollectionMap[K];
  }

  if (collection === "landingPage") {
    const homeSections = Array.isArray(record.homeSections)
      ? asHomeSections(record.homeSections)
      : fallbackLandingPage.homeSections;

    return {
      _id: asString(record._id),
      singletonKey: "landing-page",
      heroEyebrow: asString(record.heroEyebrow) || fallbackLandingPage.heroEyebrow,
      heroTitle: asString(record.heroTitle) || fallbackLandingPage.heroTitle,
      heroSubtitle: asString(record.heroSubtitle) || fallbackLandingPage.heroSubtitle,
      heroSummary: asString(record.heroSummary) || fallbackLandingPage.heroSummary,
      heroIntroLines: Array.isArray(record.heroIntroLines)
        ? asStringArray(record.heroIntroLines)
        : fallbackLandingPage.heroIntroLines,
      heroSignals: Array.isArray(record.heroSignals)
        ? asHeroSignals(record.heroSignals)
        : fallbackLandingPage.heroSignals,
      primaryCtaLabel: asString(record.primaryCtaLabel) || fallbackLandingPage.primaryCtaLabel,
      primaryCtaHref: asString(record.primaryCtaHref) || fallbackLandingPage.primaryCtaHref,
      secondaryCtaLabel:
        asString(record.secondaryCtaLabel) || fallbackLandingPage.secondaryCtaLabel,
      secondaryCtaHref: asString(record.secondaryCtaHref) || fallbackLandingPage.secondaryCtaHref,
      highlightCards: Array.isArray(record.highlightCards)
        ? asLandingHighlights(record.highlightCards)
        : fallbackLandingPage.highlightCards,
      projectsEyebrow: asString(record.projectsEyebrow) || fallbackLandingPage.projectsEyebrow,
      projectsTitle: asString(record.projectsTitle) || fallbackLandingPage.projectsTitle,
      projectsDescription:
        asString(record.projectsDescription) || fallbackLandingPage.projectsDescription,
      maxFeaturedProjects: asNumber(record.maxFeaturedProjects) ?? fallbackLandingPage.maxFeaturedProjects,
      achievementsEyebrow:
        asString(record.achievementsEyebrow) || fallbackLandingPage.achievementsEyebrow,
      achievementsTitle:
        asString(record.achievementsTitle) || fallbackLandingPage.achievementsTitle,
      achievementsDescription:
        asString(record.achievementsDescription) || fallbackLandingPage.achievementsDescription,
      maxFeaturedAchievements:
        asNumber(record.maxFeaturedAchievements) ?? fallbackLandingPage.maxFeaturedAchievements,
      showAchievementsSection:
        typeof record.showAchievementsSection === "boolean"
          ? record.showAchievementsSection
          : fallbackLandingPage.showAchievementsSection,
      exploreEyebrow: asString(record.exploreEyebrow) || fallbackLandingPage.exploreEyebrow,
      exploreTitle: asString(record.exploreTitle) || fallbackLandingPage.exploreTitle,
      exploreDescription:
        asString(record.exploreDescription) || fallbackLandingPage.exploreDescription,
      featuredSections: Array.isArray(record.featuredSections)
        ? asFeaturedSections(record.featuredSections)
        : fallbackLandingPage.featuredSections,
      homeSections: homeSections.length > 0 ? homeSections : fallbackLandingPage.homeSections,
      contactEyebrow: asString(record.contactEyebrow) || fallbackLandingPage.contactEyebrow,
      contactTitle: asString(record.contactTitle) || fallbackLandingPage.contactTitle,
      contactDescription:
        asString(record.contactDescription) || fallbackLandingPage.contactDescription,
    } as CollectionMap[K];
  }

  if (collection === "project") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      title: asString(record.title),
      description: asString(record.description),
      techStack: asStringArray(record.techStack),
      links: asLinks(record.links),
      images: asStringArray(record.images),
      featured: asBoolean(record.featured),
      order: asNumber(record.order),
      startDate: asString(record.startDate) || undefined,
      endDate: asString(record.endDate) || undefined,
      link: asString(record.link) || undefined,
      repo: asString(record.repo) || undefined,
    } as CollectionMap[K];
  }

  if (collection === "experience") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      role: asString(record.role),
      company: asString(record.company),
      location: asString(record.location) || undefined,
      startDate: asString(record.startDate) || undefined,
      endDate: asString(record.endDate) || undefined,
      current: asBoolean(record.current),
      description: asStringArray(record.description),
      technologies: asStringArray(record.technologies),
      logo: asString(record.logo) || undefined,
      attachments: asStringArray(record.attachments),
      links: asLinks(record.links),
      order: asNumber(record.order),
    } as CollectionMap[K];
  }

  if (collection === "education") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      institution: asString(record.institution),
      degree: asString(record.degree),
      program: asString(record.program) || undefined,
      status: asString(record.status) || undefined,
      location: asString(record.location) || undefined,
      startDate: asString(record.startDate) || undefined,
      endDate: asString(record.endDate) || undefined,
      grade: asString(record.grade) || undefined,
      gradeLabel: asString(record.gradeLabel) || undefined,
      gradeValue: asString(record.gradeValue) || undefined,
      coursework: asStringArray(record.coursework),
      highlights: asStringArray(record.highlights),
      attachments: asStringArray(record.attachments),
      order: asNumber(record.order),
    } as CollectionMap[K];
  }

  if (collection === "skill") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      category: asString(record.category),
      items: asStringArray(record.items),
      proficiency: asNumberMap(record.proficiency),
      focusSignals: asStringMap(record.focusSignals),
      order: asNumber(record.order),
    } as CollectionMap[K];
  }

  if (collection === "achievement") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      title: asString(record.title),
      organization: asString(record.organization) || undefined,
      date: asString(record.date) || undefined,
      description: asString(record.description),
      featured: asBoolean(record.featured),
      order: asNumber(record.order),
      images: asStringArray(record.images),
      links: asLinks(record.links),
    } as CollectionMap[K];
  }

  if (collection === "cpProfile") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      platform: asString(record.platform),
      username: asString(record.username) || undefined,
      headline: asString(record.headline) || undefined,
      summary: asString(record.summary) || undefined,
      rating: asNumber(record.rating),
      maxRating: asNumber(record.maxRating),
      rank: asString(record.rank) || undefined,
      solvedCount: asNumber(record.solvedCount) || 0,
      streak: asNumber(record.streak),
      profileUrl: asString(record.profileUrl) || undefined,
      badges: asBadges(record.badges),
      accent: asString(record.accent) || undefined,
      dataSource: asString(record.dataSource) || undefined,
      lastSyncedAt: asString(record.lastSyncedAt) || undefined,
      order: asNumber(record.order),
      isVisible: typeof record.isVisible === "boolean" ? record.isVisible : undefined,
      images: asStringArray(record.images),
    } as CollectionMap[K];
  }

  return {
    _id: asString(record._id),
    createdAt: asString(record.createdAt) || undefined,
    updatedAt: asString(record.updatedAt) || undefined,
    title: asString(record.title),
    event: asString(record.event) || undefined,
    organizer: asString(record.organizer) || undefined,
    result: asString(record.result) || undefined,
    date: asString(record.date) || undefined,
    location: asString(record.location) || undefined,
    description: asString(record.description) || undefined,
    techStack: asStringArray(record.techStack),
    teamSize: asNumber(record.teamSize),
    featured: asBoolean(record.featured),
    order: asNumber(record.order),
    images: asStringArray(record.images),
    links: asLinks(record.links),
  } as CollectionMap[K];
}

export function normalizeCollectionItems<K extends CollectionId>(collection: K, items: unknown[]) {
  return items.map((item) => normalizeCollectionItem(collection, item));
}

const getCollectionDataCached = cache(async (collection: CollectionId) => {
  try {
    return normalizeCollectionItems(collection, await listContentDocuments(collection));
  } catch (error) {
    console.error(`Failed to fetch ${collection} content`, error);
    return [];
  }
});

const getFeaturedCollectionDataCached = cache(async (collection: FeaturedCollectionId, limit: number) => {
  try {
    return normalizeCollectionItems(
      collection,
      await listFeaturedContentDocuments(collection, limit)
    );
  } catch (error) {
    console.error(`Failed to fetch featured ${collection} content`, error);
    return [];
  }
});

const getCollectionItemCached = cache(async (collection: CollectionId, id: string) => {
  try {
    const item = await getContentDocumentById(collection, id);
    return item ? normalizeCollectionItem(collection, item) : null;
  } catch (error) {
    console.error(`Failed to fetch ${collection} item`, error);
    return null;
  }
});

export async function getData<K extends CollectionId>(collection: K): Promise<CollectionMap[K][]> {
  return (await getCollectionDataCached(collection)) as CollectionMap[K][];
}

export async function getFeaturedData<K extends FeaturedCollectionId>(
  collection: K,
  limit: number
): Promise<CollectionMap[K][]> {
  if (limit <= 0) {
    return [];
  }

  return (await getFeaturedCollectionDataCached(collection, limit)) as CollectionMap[K][];
}

export async function getItem<K extends CollectionId>(collection: K, id: string): Promise<CollectionMap[K] | null> {
  return (await getCollectionItemCached(collection, id)) as CollectionMap[K] | null;
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsRecord> => {
  try {
    const item = await getSingletonContentDocument("siteSettings");
    return normalizeCollectionItem("siteSettings", item);
  } catch (error) {
    console.error("Failed to fetch site settings", error);
    return normalizeCollectionItem("siteSettings", null);
  }
});

export const getLandingPage = cache(async (): Promise<LandingPageRecord> => {
  try {
    const item = await getSingletonContentDocument("landingPage");
    return normalizeCollectionItem("landingPage", item);
  } catch (error) {
    console.error("Failed to fetch landing page settings", error);
    return normalizeCollectionItem("landingPage", null);
  }
});
