import { headers } from "next/headers";
import { getContentDocumentById, listContentDocuments } from "@/lib/content-service";

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
  project: ProjectRecord;
  experience: ExperienceRecord;
  education: EducationRecord;
  skill: SkillRecord;
  achievement: AchievementRecord;
  cpProfile: CPProfileRecord;
  hackathon: HackathonRecord;
};

export type CollectionId = keyof CollectionMap;

type ApiPayload<T> = {
  success?: boolean;
  data?: T;
};

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

function normalizeCollectionItem<K extends CollectionId>(collection: K, item: unknown): CollectionMap[K] {
  const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

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

function normalizeCollectionItems<K extends CollectionId>(collection: K, items: unknown[]) {
  return items.map((item) => normalizeCollectionItem(collection, item));
}

function getFallbackBaseUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.VERCEL_URL;

  if (!value) {
    return null;
  }

  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

async function resolveBaseUrl() {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

    if (host) {
      const protocol =
        requestHeaders.get("x-forwarded-proto") ??
        (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

      return `${protocol}://${host}`;
    }
  } catch {
    // Request headers only exist in request-scoped server contexts.
  }

  const fallback = getFallbackBaseUrl();

  if (fallback) {
    return fallback;
  }

  throw new Error("Unable to resolve the application base URL for content requests.");
}

async function fetchContent<T>(path: string) {
  const baseUrl = await resolveBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ApiPayload<T>;
}

export async function getData<K extends CollectionId>(collection: K): Promise<CollectionMap[K][]> {
  try {
    const payload = await fetchContent<CollectionMap[K][]>(`/api/content/${collection}`);

    if (!payload?.success || !Array.isArray(payload.data)) {
      return normalizeCollectionItems(collection, await listContentDocuments(collection));
    }

    return normalizeCollectionItems(collection, payload.data);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unable to resolve the application base URL")) {
      return normalizeCollectionItems(collection, await listContentDocuments(collection));
    }

    console.error(`Failed to fetch ${collection} content`, error);
    return [];
  }
}

export async function getItem<K extends CollectionId>(collection: K, id: string): Promise<CollectionMap[K] | null> {
  try {
    const payload = await fetchContent<CollectionMap[K]>(`/api/content/${collection}/${id}`);

    if (payload?.success && payload.data) {
      return normalizeCollectionItem(collection, payload.data);
    }

    const item = await getContentDocumentById(collection, id);
    return item ? normalizeCollectionItem(collection, item) : null;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unable to resolve the application base URL")) {
      const item = await getContentDocumentById(collection, id);
      return item ? normalizeCollectionItem(collection, item) : null;
    }

    console.error(`Failed to fetch ${collection} item`, error);
    return null;
  }
}
