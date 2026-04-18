"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image as ImageIcon,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import FileUpload from "./FileUpload";
import DocumentUpload from "./DocumentUpload";
import {
  REQUIRED_FIELDS,
  type ContentCollectionId,
  validateContentData,
} from "@/lib/content-schema";
import {
  LANDING_HOME_SECTION_LABELS,
  SITE_PAGE_DETAILS,
  SITE_PAGE_KEYS,
} from "@/lib/site-content";
import { cn } from "@/lib/utils";

export type ItemFormSubmitResult = {
  success: boolean;
  errorType?: "auth" | "validation" | "server";
  message?: string;
  fieldErrors?: Record<string, string>;
};

interface ItemFormProps {
  initialData?: Record<string, unknown>;
  collection: ContentCollectionId;
  onSubmit: (data: Record<string, unknown>) => Promise<ItemFormSubmitResult>;
  onCancel: () => void;
}

type LinkField = {
  name: string;
  url: string;
};

type BadgeField = {
  label: string;
  value: string;
};

type ResumeAlternateField = {
  label: string;
  href: string;
};

type SocialLinkField = {
  kind: string;
  label: string;
  value: string;
  href: string;
};

type NavigationItemField = {
  label: string;
  href: string;
  enabled: boolean;
};

type HighlightCardField = {
  title: string;
  description: string;
};

type FeaturedSectionField = {
  label: string;
  title: string;
  description: string;
  href: string;
};

type HeroSignalField = {
  label: string;
  value: string;
};

type HomeSectionField = {
  id: string;
  enabled: boolean;
};

type PageIntroField = {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
};

const EMPTY_PAGE_INTRO: PageIntroField = {
  eyebrow: "",
  title: "",
  description: "",
  path: "",
};

const PAGE_INTRO_SECTIONS = SITE_PAGE_KEYS.map((key) => ({
  key,
  label: SITE_PAGE_DETAILS[key].label,
  path: SITE_PAGE_DETAILS[key].path,
})) as Array<{
  key: (typeof SITE_PAGE_KEYS)[number];
  label: string;
  path: string;
}>;

function getStringValue(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function getBooleanValue(value: unknown) {
  return value === true || value === "true";
}

function getStringArrayValue(value: unknown) {
  if (!Array.isArray(value)) {
    return typeof value === "string" ? value : "";
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseDelimitedStringArray(value: string, delimiter: "newline" | "comma" = "newline") {
  const parts =
    delimiter === "comma"
      ? value
          .split(/[\n,]+/)
          .map((item) => item.trim())
      : value
          .split("\n")
          .map((item) => item.trim());

  return parts.filter(Boolean);
}

function getObjectArrayValue<T extends Record<string, string>>(
  value: unknown,
  keys: Array<keyof T & string>
) {
  if (!Array.isArray(value)) {
    return [] as T[];
  }

  return value.reduce<T[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const record = item as Record<string, unknown>;
    items.push(
      Object.fromEntries(keys.map((key) => [key, getStringValue(record[key]).trim()])) as T
    );
    return items;
  }, []);
}

function getStructuredArrayValue<T extends Record<string, string | boolean>>(
  value: unknown,
  config: {
    stringKeys: Array<keyof T & string>;
    booleanKeys: Array<keyof T & string>;
  }
) {
  if (!Array.isArray(value)) {
    return [] as T[];
  }

  return value.reduce<T[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const record = item as Record<string, unknown>;
    items.push(
      Object.fromEntries([
        ...config.stringKeys.map((key) => [key, getStringValue(record[key]).trim()]),
        ...config.booleanKeys.map((key) => [key, getBooleanValue(record[key])]),
      ]) as T
    );
    return items;
  }, []);
}

function getPageIntroValue(value: unknown): PageIntroField {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...EMPTY_PAGE_INTRO };
  }

  const record = value as Record<string, unknown>;

  return {
    eyebrow: getStringValue(record.eyebrow).trim(),
    title: getStringValue(record.title).trim(),
    description: getStringValue(record.description).trim(),
    path: getStringValue(record.path).trim(),
  };
}

function getPageIntroMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return Object.fromEntries(
      PAGE_INTRO_SECTIONS.map((section) => [
        section.key,
        {
          ...EMPTY_PAGE_INTRO,
          path: section.path,
        },
      ])
    ) as Record<(typeof SITE_PAGE_KEYS)[number], PageIntroField>;
  }

  const record = value as Record<string, unknown>;

  return Object.fromEntries(
    PAGE_INTRO_SECTIONS.map((section) => {
      const intro = getPageIntroValue(record[section.key]);

      return [
        section.key,
        {
          ...EMPTY_PAGE_INTRO,
          ...intro,
          path: intro.path || section.path,
        },
      ];
    })
  ) as Record<(typeof SITE_PAGE_KEYS)[number], PageIntroField>;
}

function getSiteMetadataValue(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      description: "",
      keywords: [],
    };
  }

  const record = value as Record<string, unknown>;

  return {
    description: getStringValue(record.description).trim(),
    keywords: Array.isArray(record.keywords)
      ? record.keywords.filter((item): item is string => typeof item === "string")
      : [],
  };
}

function getNumberMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, typeof item === "number" ? item : Number(item)] as const)
      .filter(([key, item]) => key.trim() && Number.isFinite(item))
  );
}

function getStringMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, getStringValue(item).trim()] as const)
      .filter(([key, item]) => key.trim() && item)
  );
}

function getLinkLines(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const link = item as { name?: unknown; url?: unknown };
      const name = getStringValue(link.name).trim();
      const url = getStringValue(link.url).trim();

      if (!url) {
        return "";
      }

      return name ? `${name} | ${url}` : url;
    })
    .filter(Boolean)
    .join("\n");
}

function getBadgeLines(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const badge = item as { label?: unknown; value?: unknown };
      const label = getStringValue(badge.label).trim();
      const badgeValue = getStringValue(badge.value).trim();

      if (!label) {
        return "";
      }

      return badgeValue ? `${label} | ${badgeValue}` : label;
    })
    .filter(Boolean)
    .join("\n");
}

function reorderItems<T>(items: T[], startIndex: number, endIndex: number) {
  const nextItems = [...items];
  const [moved] = nextItems.splice(startIndex, 1);
  nextItems.splice(endIndex, 0, moved);
  return nextItems;
}

function parseLinkLines(value: unknown): LinkField[] {
  const text = getStringValue(value);

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawName, ...rawUrlParts] = line.split("|").map((part) => part.trim());

      if (rawUrlParts.length === 0) {
        return { name: "Reference", url: rawName };
      }

      const url = rawUrlParts.join(" | ").trim();
      return { name: rawName || "Reference", url };
    })
    .filter((item) => item.url);
}

function parseBadgeLines(value: unknown): BadgeField[] {
  const text = getStringValue(value);

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rawValueParts] = line.split("|").map((part) => part.trim());
      return {
        label,
        value: rawValueParts.join(" | ").trim(),
      };
    })
    .filter((item) => item.label);
}

function syncSkillMaps(itemsValue: unknown, data: Record<string, unknown>) {
  const items = (Array.isArray(itemsValue) ? itemsValue : [])
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  const itemKeyMap = new Map(items.map((item) => [item.toLowerCase(), item]));
  const nextProficiency = Object.entries(getNumberMap(data.proficiency)).reduce<Record<string, number>>((acc, [key, value]) => {
    const canonicalKey = itemKeyMap.get(key.trim().toLowerCase());

    if (canonicalKey) {
      acc[canonicalKey] = value;
    }

    return acc;
  }, {});
  const nextFocusSignals = Object.entries(getStringMap(data.focusSignals)).reduce<Record<string, string>>((acc, [key, value]) => {
    const canonicalKey = itemKeyMap.get(key.trim().toLowerCase());

    if (canonicalKey && value.trim()) {
      acc[canonicalKey] = value.trim();
    }

    return acc;
  }, {});

  items.forEach((item) => {
    if (!(item in nextProficiency)) {
      nextProficiency[item] = 0;
    }
  });

  return {
    ...data,
    items,
    proficiency: nextProficiency,
    focusSignals: nextFocusSignals,
  };
}

function normalizeInitialData(collection: ContentCollectionId, data?: Record<string, unknown>) {
  if (!data) {
    const baseState = {
      order: 0,
      linksText: "",
      images: [],
    };

    if (collection === "siteSettings") {
      return {
        name: "",
        role: "",
        location: "",
        availability: "",
        profileBadge: "",
        profileImage: "",
        profileImageAlt: "",
        footerBlurb: "",
        aboutParagraphs: [],
        primaryResumeLabel: "Resume",
        primaryResumeViewHref: "",
        primaryResumeDownloadHref: "",
        alternateResumeLinks: [],
        socialLinks: [],
        navigationItems: [],
        siteMetadata: {
          description: "",
          keywords: [],
        },
        pageIntro: getPageIntroMap(undefined),
      };
    }

    if (collection === "landingPage") {
      return {
        heroEyebrow: "",
        heroTitle: "",
        heroSubtitle: "",
        heroSummary: "",
        heroIntroLines: [],
        heroSignals: [],
        primaryCtaLabel: "",
        primaryCtaHref: "",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        highlightCards: [],
        projectsEyebrow: "",
        projectsTitle: "",
        projectsDescription: "",
        maxFeaturedProjects: 3,
        achievementsEyebrow: "",
        achievementsTitle: "",
        achievementsDescription: "",
        maxFeaturedAchievements: 2,
        showAchievementsSection: true,
        exploreEyebrow: "",
        exploreTitle: "",
        exploreDescription: "",
        featuredSections: [],
        homeSections: Object.keys(LANDING_HOME_SECTION_LABELS).map((id) => ({
          id,
          enabled: true,
        })),
        contactEyebrow: "",
        contactTitle: "",
        contactDescription: "",
      };
    }

    if (collection === "project") {
      return {
        ...baseState,
        techStack: [],
        featured: false,
      };
    }

    if (collection === "experience") {
      return {
        ...baseState,
        current: false,
        description: [],
        technologies: [],
        attachments: [],
        linksText: "",
      };
    }

    if (collection === "education") {
      return {
        ...baseState,
        status: "Ongoing",
        coursework: [],
        highlights: [],
        attachments: [],
      };
    }

    if (collection === "cpProfile") {
      return {
        ...baseState,
        dataSource: "manual",
        isVisible: true,
        badgesText: "",
        solvedCount: 0,
      };
    }

    if (collection === "hackathon") {
      return {
        ...baseState,
        techStack: [],
        featured: false,
        teamSize: 1,
      };
    }

    if (collection === "achievement") {
      return {
        ...baseState,
        featured: false,
      };
    }

    if (collection === "skill") {
      return {
        ...baseState,
        items: [],
        proficiency: {},
        focusSignals: {},
      };
    }

    return baseState;
  }

    const normalized = {
      ...data,
      linksText: getLinkLines(data.links),
      badgesText: getBadgeLines(data.badges),
      proficiency: getNumberMap(data.proficiency),
      focusSignals: getStringMap(data.focusSignals),
      dataSource: collection === "cpProfile" ? getStringValue(data.dataSource) || "manual" : data.dataSource,
      isVisible: collection === "cpProfile" ? !("isVisible" in data) || getBooleanValue(data.isVisible) : data.isVisible,
      alternateResumeLinks: getObjectArrayValue<ResumeAlternateField>(data.alternateResumeLinks, ["label", "href"]),
      socialLinks: getObjectArrayValue<SocialLinkField>(data.socialLinks, ["kind", "label", "value", "href"]),
      navigationItems: getStructuredArrayValue<NavigationItemField>(data.navigationItems, {
        stringKeys: ["label", "href"],
        booleanKeys: ["enabled"],
      }),
      siteMetadata: getSiteMetadataValue(data.siteMetadata),
      highlightCards: getObjectArrayValue<HighlightCardField>(data.highlightCards, ["title", "description"]),
      heroSignals: getObjectArrayValue<HeroSignalField>(data.heroSignals, ["label", "value"]),
      heroIntroLines: getStringArrayValue(data.heroIntroLines),
      featuredSections: getObjectArrayValue<FeaturedSectionField>(data.featuredSections, [
        "label",
        "title",
        "description",
        "href",
      ]),
      homeSections: getStructuredArrayValue<HomeSectionField>(data.homeSections, {
        stringKeys: ["id"],
        booleanKeys: ["enabled"],
      }),
      pageIntro: getPageIntroMap(data.pageIntro),
    };

  if (collection === "skill") {
    return syncSkillMaps(data.items, normalized);
  }

  return normalized;
}

function normalizeSubmissionData(collection: ContentCollectionId, data: Record<string, unknown>) {
  const nextData = { ...data };

  if ("linksText" in nextData) {
    nextData.links = parseLinkLines(nextData.linksText);
    delete nextData.linksText;
  }

  if ("badgesText" in nextData) {
    nextData.badges = parseBadgeLines(nextData.badgesText);
    delete nextData.badgesText;
  }

  if (collection === "skill") {
    return syncSkillMaps(nextData.items, nextData);
  }

  return nextData;
}

function getCollectionLabel(collection: ContentCollectionId) {
  if (collection === "siteSettings") {
    return "Site Settings";
  }

  if (collection === "landingPage") {
    return "Landing Page";
  }

  if (collection === "cpProfile") {
    return "CP Profile";
  }

  return collection.charAt(0).toUpperCase() + collection.slice(1);
}

function getPreferredTitle(collection: ContentCollectionId, data: Record<string, unknown>) {
  if (collection === "siteSettings") {
    return getStringValue(data.name).trim() || "Site Settings";
  }

  if (collection === "landingPage") {
    return getStringValue(data.heroTitle).trim() || "Landing Page";
  }

  if (collection === "project" || collection === "hackathon" || collection === "achievement") {
    return getStringValue(data.title).trim();
  }

  if (collection === "experience") {
    return getStringValue(data.role).trim();
  }

  if (collection === "education") {
    return getStringValue(data.institution).trim();
  }

  if (collection === "skill") {
    return getStringValue(data.category).trim();
  }

  return getStringValue(data.platform).trim();
}

function getPreferredSubtitle(collection: ContentCollectionId, data: Record<string, unknown>) {
  if (collection === "siteSettings") {
    return getStringValue(data.role).trim() || "Shared portfolio identity and profile settings.";
  }

  if (collection === "landingPage") {
    return getStringValue(data.heroSubtitle).trim() || "Landing page structure and hero content.";
  }

  if (collection === "project") {
    return getStringValue(data.description).trim();
  }

  if (collection === "experience") {
    return getStringValue(data.company).trim();
  }

  if (collection === "education") {
    return [getStringValue(data.degree).trim(), getStringValue(data.program).trim()].filter(Boolean).join(" • ");
  }

  if (collection === "skill") {
    const items = getStringArrayValue(data.items);
    return items.length ? `${items.length} skill item${items.length > 1 ? "s" : ""} tracked.` : "";
  }

  if (collection === "achievement") {
    return [getStringValue(data.organization).trim(), getStringValue(data.date).trim()].filter(Boolean).join(" • ");
  }

  if (collection === "hackathon") {
    return [getStringValue(data.event).trim(), getStringValue(data.result).trim()].filter(Boolean).join(" • ");
  }

  return [getStringValue(data.username).trim(), getStringValue(data.rank).trim()].filter(Boolean).join(" • ");
}

type SummaryStat = {
  label: string;
  value: string;
};

type SummaryData = {
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  stats: SummaryStat[];
  notes: string[];
};

const COLLECTION_TIPS: Record<ContentCollectionId, string[]> = {
  siteSettings: [
    "Treat this as the single source of truth for identity, navigation, SEO metadata, and shared page copy.",
    "Use the profile image uploader here instead of hardcoding homepage assets.",
    "Keep page intros concise and paths accurate so headers and metadata stay aligned.",
  ],
  landingPage: [
    "This document controls hero messaging, homepage section order, and curated navigation cards.",
    "Featured project and achievement counts work best when the corresponding content items are flagged as featured.",
    "Use restrained copy here so the homepage feels intentional instead of crowded.",
  ],
  project: [
    "Use the display order to control which projects rise first.",
    "Put the most useful link first so it becomes the primary CTA.",
    "Gallery order controls which image leads on the public card.",
  ],
  experience: [
    "Keep responsibility lines concise and outcome-oriented.",
    "Use the current-role switch instead of typing Present manually.",
    "Attachments work well for certificates, offer letters, or reference PDFs.",
  ],
  education: [
    "Use Grade Summary for the public one-line display.",
    "Highlights are best for scholarships, rankings, or leadership notes.",
    "Coursework should stay short and scannable.",
  ],
  cpProfile: [
    "The headline appears as the primary status line on the telemetry card.",
    "Badges are good for contest ranks, rating milestones, or streak notes.",
    "Hide inactive profiles with the visibility switch instead of deleting them.",
  ],
  hackathon: [
    "Use Result for winner, finalist, shortlisted, or similar outcomes.",
    "Keep the tech stack focused on what materially shaped the build.",
    "Feature strong event results so they can be prioritized later.",
  ],
  achievement: [
    "Keep the title outcome-focused and the description short.",
    "Add only the strongest supporting links to avoid noisy cards.",
    "Use images for certificates, screenshots, or event photos.",
  ],
  skill: [
    "Add items first, then score proficiency and current focus per item.",
    "Display order controls how skill categories are arranged on the home page.",
    "Use focus signals to show what you are actively using right now.",
    "Keep categories broad enough to group related tools cleanly.",
  ],
};

function getSummaryData(collection: ContentCollectionId, formData: Record<string, unknown>, skillItems: string[]): SummaryData {
  const images = getStringArrayValue(formData.images);
  const links = parseLinkLines(formData.linksText);
  const title = getPreferredTitle(collection, formData) || `Untitled ${getCollectionLabel(collection).toLowerCase()}`;
  const subtitle = getPreferredSubtitle(collection, formData) || "Live summary updates as you edit this record.";
  const badges: string[] = [];
  const stats: SummaryStat[] = [];
  const notes: string[] = [];

  if (collection === "siteSettings") {
    const socialLinks = getObjectArrayValue<SocialLinkField>(formData.socialLinks, [
      "kind",
      "label",
      "value",
      "href",
    ]);
    const alternateResumeLinks = getObjectArrayValue<ResumeAlternateField>(
      formData.alternateResumeLinks,
      ["label", "href"]
    );
    const navigationItems = getStructuredArrayValue<NavigationItemField>(formData.navigationItems, {
      stringKeys: ["label", "href"],
      booleanKeys: ["enabled"],
    });
    const siteMetadata = getSiteMetadataValue(formData.siteMetadata);
    const pageIntro = getPageIntroMap(formData.pageIntro);

    if (getStringValue(formData.location).trim()) {
      badges.push(getStringValue(formData.location).trim());
    }

    if (getStringValue(formData.availability).trim()) {
      badges.push("Availability set");
    }

    stats.push(
      { label: "Nav", value: String(navigationItems.length) },
      { label: "Keywords", value: String(siteMetadata.keywords.length) },
      { label: "Pages", value: String(Object.values(pageIntro).filter((item) => item.title).length) }
    );
    badges.push(`${socialLinks.length} social links`);
    badges.push(
      `${alternateResumeLinks.length + (getStringValue(formData.primaryResumeViewHref).trim() ? 1 : 0)} resume actions`
    );
    notes.push(...getStringArrayValue(formData.aboutParagraphs).slice(0, 2));
  }

  if (collection === "landingPage") {
    const highlightCards = getObjectArrayValue<HighlightCardField>(formData.highlightCards, [
      "title",
      "description",
    ]);
    const heroSignals = getObjectArrayValue<HeroSignalField>(formData.heroSignals, ["label", "value"]);
    const homeSections = getStructuredArrayValue<HomeSectionField>(formData.homeSections, {
      stringKeys: ["id"],
      booleanKeys: ["enabled"],
    });
    const featuredSections = getObjectArrayValue<FeaturedSectionField>(formData.featuredSections, [
      "label",
      "title",
      "description",
      "href",
    ]);

    if (getStringValue(formData.primaryCtaLabel).trim()) {
      badges.push(`Primary CTA: ${getStringValue(formData.primaryCtaLabel).trim()}`);
    }

    if (getStringValue(formData.secondaryCtaLabel).trim()) {
      badges.push(`Secondary CTA: ${getStringValue(formData.secondaryCtaLabel).trim()}`);
    }

    stats.push(
      { label: "Signals", value: String(heroSignals.length) },
      { label: "Sections", value: String(homeSections.length) },
      { label: "Explore", value: String(featuredSections.length) }
    );
    badges.push(`${highlightCards.length} highlight cards`);
    badges.push(`${getStringArrayValue(formData.heroIntroLines).length} intro lines`);
    notes.push(...highlightCards.slice(0, 2).map((item) => item.title));
  }

  if (collection === "project") {
    const techStack = getStringArrayValue(formData.techStack);
    const featured = getBooleanValue(formData.featured);
    const startDate = getStringValue(formData.startDate).trim();
    const endDate = getStringValue(formData.endDate).trim();

    if (featured) {
      badges.push("Featured");
    }

    if (startDate || endDate) {
      badges.push([startDate, endDate].filter(Boolean).join(" - "));
    }

    stats.push(
      { label: "Tech", value: String(techStack.length) },
      { label: "Links", value: String(links.length) },
      { label: "Images", value: String(images.length) }
    );
    notes.push(...techStack.slice(0, 3));
  }

  if (collection === "experience") {
    const technologies = getStringArrayValue(formData.technologies);
    const current = getBooleanValue(formData.current);
    const bullets = getStringArrayValue(formData.description);

    if (current) {
      badges.push("Current role");
    }

    const location = getStringValue(formData.location).trim();
    if (location) {
      badges.push(location);
    }

    stats.push(
      { label: "Bullets", value: String(bullets.length) },
      { label: "Tech", value: String(technologies.length) },
      { label: "Attachments", value: String(getStringArrayValue(formData.attachments).length) }
    );
    notes.push(...bullets.slice(0, 2));
  }

  if (collection === "education") {
    const status = getStringValue(formData.status).trim();
    const grade = getStringValue(formData.grade).trim();
    const highlights = getStringArrayValue(formData.highlights);

    if (status) {
      badges.push(status);
    }

    if (grade) {
      badges.push(grade);
    }

    stats.push(
      { label: "Highlights", value: String(highlights.length) },
      { label: "Coursework", value: String(getStringArrayValue(formData.coursework).length) },
      { label: "Files", value: String(getStringArrayValue(formData.attachments).length) }
    );
    notes.push(...highlights.slice(0, 2));
  }

  if (collection === "cpProfile") {
    const solvedCount = getStringValue(formData.solvedCount).trim() || "0";
    const rating = getStringValue(formData.rating).trim();
    const visible = !("isVisible" in formData) || getBooleanValue(formData.isVisible);

    badges.push(visible ? "Visible" : "Hidden");

    if (getStringValue(formData.dataSource).trim()) {
      badges.push(getStringValue(formData.dataSource).trim());
    }

    stats.push(
      { label: "Solved", value: solvedCount },
      { label: "Rating", value: rating || "0" },
      { label: "Badges", value: String(parseBadgeLines(formData.badgesText).length) }
    );
    notes.push(getStringValue(formData.headline).trim() || "Add a headline to make the profile card read clearly.");
  }

  if (collection === "hackathon") {
    const techStack = getStringArrayValue(formData.techStack);
    const result = getStringValue(formData.result).trim();
    const teamSize = getStringValue(formData.teamSize).trim() || "1";

    if (result) {
      badges.push(result);
    }

    if (getBooleanValue(formData.featured)) {
      badges.push("Featured");
    }

    stats.push(
      { label: "Tech", value: String(techStack.length) },
      { label: "Team", value: teamSize },
      { label: "Images", value: String(images.length) }
    );
    notes.push(getStringValue(formData.description).trim() || "Add a short description to explain the event outcome.");
  }

  if (collection === "achievement") {
    const organization = getStringValue(formData.organization).trim();
    const date = getStringValue(formData.date).trim();

    if (getBooleanValue(formData.featured)) {
      badges.push("Featured");
    }

    if (organization) {
      badges.push(organization);
    }

    if (date) {
      badges.push(date);
    }

    stats.push(
      { label: "Links", value: String(links.length) },
      { label: "Images", value: String(images.length) },
      { label: "Order", value: getStringValue(formData.order).trim() || "0" }
    );
    notes.push(getStringValue(formData.description).trim() || "Add a short description so the highlight reads cleanly.");
  }

  if (collection === "skill") {
    const proficiency = getNumberMap(formData.proficiency);
    const focusSignals = getStringMap(formData.focusSignals);
    const average =
      skillItems.length > 0
        ? Math.round(skillItems.reduce((sum, item) => sum + (proficiency[item] || 0), 0) / skillItems.length)
        : 0;

    stats.push(
      { label: "Items", value: String(skillItems.length) },
      { label: "Avg", value: `${average}%` },
      { label: "Focus", value: String(Object.keys(focusSignals).length) }
    );
    notes.push(
      ...skillItems
        .slice()
        .sort((left, right) => (proficiency[right] || 0) - (proficiency[left] || 0))
        .slice(0, 3)
        .map((item) => `${item} ${proficiency[item] || 0}%`)
    );
  }

  return {
    title,
    subtitle,
    description:
      collection === "skill"
        ? "This summary reflects the current category shape and confidence scores."
        : "This summary reflects the content currently staged in the form.",
    badges,
    stats,
    notes: notes.filter(Boolean),
  };
}

function getSectionIntro(collection: ContentCollectionId) {
  if (collection === "siteSettings") {
    return {
      title: "Portfolio settings",
      description: "Manage identity, profile media, resume links, social links, and shared page copy from one source of truth.",
    };
  }

  if (collection === "landingPage") {
    return {
      title: "Landing page settings",
      description: "Control homepage hero content, curated sections, featured counts, and the overall first impression.",
    };
  }

  if (collection === "project") {
    return {
      title: "Project entry",
      description: "Describe the work, then add the stack, links, and gallery assets in the order you want them surfaced.",
    };
  }

  if (collection === "experience") {
    return {
      title: "Experience entry",
      description: "Capture role basics first, then responsibilities, technologies, and any supporting material.",
    };
  }

  if (collection === "education") {
    return {
      title: "Education entry",
      description: "Use this form for institution details, progress, grades, coursework, and highlights.",
    };
  }

  if (collection === "cpProfile") {
    return {
      title: "Competitive profile",
      description: "Define the profile summary, stats, visibility, and optional media in one place.",
    };
  }

  if (collection === "hackathon") {
    return {
      title: "Hackathon entry",
      description: "Record the event, result, build summary, stack, and supporting links or images.",
    };
  }

  if (collection === "achievement") {
    return {
      title: "Achievement entry",
      description: "Keep achievements concise, outcome-focused, and easy to verify with links or media when helpful.",
    };
  }

  return {
    title: "Skill category",
    description: "Add tools in the category, then score proficiency and current focus per item.",
  };
}

export default function ItemForm({ initialData, collection, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(normalizeInitialData(collection, initialData));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ItemFormSubmitResult["errorType"]>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const skillItems = useMemo(() => {
    return getStringArrayValue(formData.items);
  }, [formData.items]);

  const summary = useMemo(() => {
    return getSummaryData(collection, formData, Array.isArray(skillItems) ? skillItems : []);
  }, [collection, formData, skillItems]);

  const sectionIntro = useMemo(() => getSectionIntro(collection), [collection]);

  const updateField = (name: string, value: unknown) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      return collection === "skill" && name === "items" ? syncSkillMaps(value, nextData) : nextData;
    });

    setFieldErrors((prev) => {
      const shouldClearSkillMapErrors = collection === "skill" && name === "items";

      if (!prev[name] && !shouldClearSkillMapErrors) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];

      if (shouldClearSkillMapErrors) {
        delete nextErrors.proficiency;
        delete nextErrors.focusSignals;
      }

      return nextErrors;
    });
    setFormError(null);
    setErrorType(undefined);
  };

  const updatePageIntroField = (
    section: keyof ReturnType<typeof getPageIntroMap>,
    field: keyof PageIntroField,
    value: string
  ) => {
    const current = getPageIntroMap(formData.pageIntro);

    updateField("pageIntro", {
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    });

    setFieldErrors((prev) => {
      const key = `pageIntro.${section}.${field}`;

      if (!prev[key]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const updateSiteMetadataField = (
    field: keyof ReturnType<typeof getSiteMetadataValue>,
    value: string | string[]
  ) => {
    const current = getSiteMetadataValue(formData.siteMetadata);

    updateField("siteMetadata", {
      ...current,
      [field]: value,
    });

    setFieldErrors((prev) => {
      const key = `siteMetadata.${field}`;

      if (!prev[key]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const updateStructuredListField = <T extends Record<string, string | boolean>>(
    name: string,
    nextItems: T[]
  ) => {
    updateField(name, nextItems);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      updateField(target.name, target.checked);
      return;
    }

    updateField(target.name, target.value);
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: string,
    delimiter: "newline" | "comma" = "newline"
  ) => {
    const array = parseDelimitedStringArray(e.target.value, delimiter);

    updateField(field, array);
  };

  const handleSiteMetadataKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const keywords = parseDelimitedStringArray(e.target.value, "comma");

    updateSiteMetadataField("keywords", keywords);
  };

  const handleImageUpload = (url: string, field: string) => {
    updateField(field, url);
  };

  const handleResumeUpload = (url: string) => {
    updateField("primaryResumeViewHref", url);
    updateField("primaryResumeDownloadHref", url);
  };

  const handleMultipleImageUpload = (url: string, field: string) => {
    const currentImages = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];

    if (!url) {
      return;
    }

    updateField(field, [...currentImages, url]);
  };

  const handleRemoveImage = (index: number, field: string) => {
    const currentImages = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];
    updateField(
      field,
      currentImages.filter((_: string, imageIndex: number) => imageIndex !== index)
    );
    toast.info("Gallery image removed", {
      description: "The image was removed from the current record.",
    });
  };

  const handleReorderImage = (fromIndex: number, toIndex: number, field: string) => {
    const currentImages = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];
    updateField(field, reorderItems(currentImages, fromIndex, toIndex));
  };

  const handleSkillNumberChange = (item: string, value: string) => {
    const current = getNumberMap(formData.proficiency);
    updateField("proficiency", {
      ...current,
      [item]: Number.isFinite(Number(value)) ? Number(value) : 0,
    });
  };

  const handleSkillSignalChange = (item: string, value: string) => {
    const current = getStringMap(formData.focusSignals);
    const nextSignals = { ...current };

    if (value.trim()) {
      nextSignals[item] = value;
    } else {
      delete nextSignals[item];
    }

    updateField("focusSignals", nextSignals);
  };

  const validateForm = () => {
    const normalizedData = normalizeSubmissionData(collection, formData);
    const validation = validateContentData(collection, normalizedData);
    setFieldErrors(validation.fieldErrors);
    return validation.success ? validation.data : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = validateForm();

    if (!validatedData) {
      setErrorType("validation");
      setFormError("Please correct the highlighted fields before saving.");
      toast.error("Validation failed", {
        description: "Please correct the highlighted fields before saving.",
      });
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setErrorType(undefined);

    const result = await onSubmit(validatedData);

    if (!result.success) {
      setFieldErrors(result.fieldErrors || {});
      setErrorType(result.errorType);
      const nextMessage =
        result.message ||
        (result.errorType === "auth"
          ? "Your admin session has expired. Please sign in again."
          : result.errorType === "validation"
            ? "Please correct the highlighted fields before trying again."
            : "We could not save this item. Please try again.");
      setFormError(nextMessage);
      toast.error("Save failed", {
        description: nextMessage,
      });
      setIsSubmitting(false);
      return;
    }

    toast.success(initialData ? "Entry updated" : "Entry created", {
      description: `Your ${getCollectionLabel(collection)} record was saved successfully.`,
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-up rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 border-b pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
            {initialData ? "Editing" : "New entry"}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-foreground">
            {initialData ? "Edit" : "Add"} <span className="text-primary">{getCollectionLabel(collection)}</span>
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            {sectionIntro.description}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {formError && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium capitalize">{errorType || "Submission"} issue</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-8">
          {collection === "siteSettings" && (
            <>
              <FormSection title="Identity" description="Centralize the public identity, location, availability, and footer copy used across the portfolio.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Name" name="name" value={formData.name} onChange={handleChange} required error={fieldErrors.name} placeholder="Raghavendra" />
                  <InputGroup label="Role" name="role" value={formData.role} onChange={handleChange} required error={fieldErrors.role} placeholder="Software Engineer" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Location" name="location" value={formData.location} onChange={handleChange} error={fieldErrors.location} placeholder="India" />
                  <InputGroup label="Availability" name="availability" value={formData.availability} onChange={handleChange} error={fieldErrors.availability} placeholder="Open to internships and full-time roles." />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Profile Badge" name="profileBadge" value={formData.profileBadge} onChange={handleChange} error={fieldErrors.profileBadge} placeholder="Engineering + product execution" />
                  <InputGroup label="Footer Blurb" name="footerBlurb" value={formData.footerBlurb} onChange={handleChange} error={fieldErrors.footerBlurb} placeholder="Short footer summary." />
                </div>
              </FormSection>

              <FormSection title="Profile media" description="Manage the main portrait used by the homepage hero and profile presentation.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr]">
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
                    <label className="mb-4 block text-sm font-medium text-foreground">Profile Image</label>
                    <FileUpload
                      label="Upload Profile Image"
                      initialUrl={typeof formData.profileImage === "string" ? formData.profileImage : undefined}
                      onUpload={(url) => handleImageUpload(url, "profileImage")}
                    />
                    {fieldErrors.profileImage ? <p className="mt-2 text-sm text-destructive">{fieldErrors.profileImage}</p> : null}
                  </div>
                  <InputGroup label="Image Alt Text" name="profileImageAlt" value={formData.profileImageAlt} onChange={handleChange} error={fieldErrors.profileImageAlt} placeholder="Portrait of Raghavendra" />
                </div>
              </FormSection>

              <FormSection title="Resume links" description="Set the primary view/download actions and any alternate resume destinations.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Primary Label" name="primaryResumeLabel" value={formData.primaryResumeLabel} onChange={handleChange} error={fieldErrors.primaryResumeLabel} placeholder="Resume" />
                  <InputGroup label="View Link" name="primaryResumeViewHref" type="url" value={formData.primaryResumeViewHref} onChange={handleChange} error={fieldErrors.primaryResumeViewHref} placeholder="https://..." />
                  <InputGroup label="Download Link" name="primaryResumeDownloadHref" type="url" value={formData.primaryResumeDownloadHref} onChange={handleChange} error={fieldErrors.primaryResumeDownloadHref} placeholder="https://..." />
                </div>
                <DocumentUpload
                  label="Upload Resume"
                  initialUrl={getStringValue(formData.primaryResumeViewHref) || getStringValue(formData.primaryResumeDownloadHref) || undefined}
                  onUpload={handleResumeUpload}
                />
                <StructuredArrayGroup
                  label="Alternate Resume Links"
                  description="Optional backup or alternate-format resume links."
                  items={getObjectArrayValue<ResumeAlternateField>(formData.alternateResumeLinks, ["label", "href"])}
                  onChange={(items) => updateStructuredListField("alternateResumeLinks", items)}
                  addLabel="Add alternate link"
                  error={fieldErrors.alternateResumeLinks}
                  fields={[
                    { key: "label", label: "Label", placeholder: "Drive mirror" },
                    { key: "href", label: "URL", placeholder: "https://...", type: "url" },
                  ]}
                />
              </FormSection>

              <FormSection title="Contact links" description="These links power the footer, contact page, and social navigation surfaces.">
                <StructuredArrayGroup
                  label="Social Links"
                  description="Add email, LinkedIn, GitHub, website, or any other key contact path."
                  items={getObjectArrayValue<SocialLinkField>(formData.socialLinks, ["kind", "label", "value", "href"])}
                  onChange={(items) => updateStructuredListField("socialLinks", items)}
                  addLabel="Add social link"
                  error={fieldErrors.socialLinks}
                  fields={[
                    {
                      key: "kind",
                      label: "Kind",
                      placeholder: "email / github / linkedin / website / other",
                    },
                    { key: "label", label: "Label", placeholder: "GitHub" },
                    { key: "value", label: "Display Value", placeholder: "raghavendra1729-cell" },
                    { key: "href", label: "URL", placeholder: "https://...", type: "url" },
                  ]}
                />
              </FormSection>

              <FormSection title="Navigation & metadata" description="Manage the public navbar order and the shared SEO metadata directly from the admin panel.">
                <StructuredArrayGroup
                  label="Navigation Items"
                  description="Use internal paths, toggle visibility, and reorder items to match the navbar and footer."
                  items={getStructuredArrayValue<NavigationItemField>(formData.navigationItems, {
                    stringKeys: ["label", "href"],
                    booleanKeys: ["enabled"],
                  })}
                  onChange={(items) => updateStructuredListField("navigationItems", items)}
                  addLabel="Add nav item"
                  error={fieldErrors.navigationItems}
                  fields={[
                    { key: "label", label: "Label", placeholder: "Projects" },
                    { key: "href", label: "Path", placeholder: "/projects" },
                    {
                      key: "enabled",
                      label: "Enabled",
                      type: "checkbox",
                      description: "Disable an item without removing its placement.",
                    },
                  ]}
                />
                <TextAreaGroup
                  label="Site Description"
                  name="siteMetadata-description"
                  value={getSiteMetadataValue(formData.siteMetadata).description}
                  onChange={(event) => updateSiteMetadataField("description", event.target.value)}
                  rows={3}
                  error={fieldErrors["siteMetadata.description"]}
                  placeholder="Portfolio description used for SEO and social previews."
                />
                <ArrayInputGroup
                  label="Metadata Keywords"
                  name="siteMetadata-keywords"
                  value={getSiteMetadataValue(formData.siteMetadata).keywords}
                  onChange={handleSiteMetadataKeywordsChange}
                  placeholder="Full-stack developer, Next.js portfolio, TypeScript engineer"
                  error={fieldErrors["siteMetadata.keywords"]}
                  delimiter="comma"
                />
              </FormSection>

              <FormSection title="About content" description="Keep the primary about copy here so the public about page stays editable without touching code.">
                <ArrayInputGroup
                  label="About Paragraphs"
                  name="aboutParagraphs"
                  value={getStringArrayValue(formData.aboutParagraphs)}
                  onChange={(e) => handleArrayChange(e, "aboutParagraphs")}
                  placeholder="Paragraph one&#10;Paragraph two"
                  error={fieldErrors.aboutParagraphs}
                />
              </FormSection>

              <FormSection title="Page intros" description="These fields control the intro copy on the main public routes.">
                <div className="grid gap-4">
                  {PAGE_INTRO_SECTIONS.map(({ key, label }) => (
                    <PageIntroEditor
                      key={key}
                      label={label}
                      value={getPageIntroMap(formData.pageIntro)[key]}
                      onChange={(field, value) => updatePageIntroField(key, field, value)}
                      errors={{
                        eyebrow: fieldErrors[`pageIntro.${key}.eyebrow`],
                        title: fieldErrors[`pageIntro.${key}.title`],
                        description: fieldErrors[`pageIntro.${key}.description`],
                        path: fieldErrors[`pageIntro.${key}.path`],
                      }}
                    />
                  ))}
                </div>
              </FormSection>
            </>
          )}

          {collection === "landingPage" && (
            <>
              <FormSection title="Hero" description="Set the homepage hero copy, supporting summary, and the primary internal CTAs.">
                <div className="grid grid-cols-1 gap-6">
                  <InputGroup label="Eyebrow" name="heroEyebrow" value={formData.heroEyebrow} onChange={handleChange} error={fieldErrors.heroEyebrow} placeholder="Software engineer portfolio" />
                  <TextAreaGroup label="Hero Title" name="heroTitle" value={formData.heroTitle} onChange={handleChange} rows={3} required error={fieldErrors.heroTitle} placeholder="Building product-grade software with clarity, speed, and technical range." />
                  <TextAreaGroup label="Hero Subtitle" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows={3} required error={fieldErrors.heroSubtitle} placeholder="Short, sharp value statement." />
                  <TextAreaGroup label="Hero Summary" name="heroSummary" value={formData.heroSummary} onChange={handleChange} rows={3} error={fieldErrors.heroSummary} placeholder="Optional supporting summary under the hero." />
                  <ArrayInputGroup
                    label="Hero Intro Lines"
                    name="heroIntroLines"
                    value={getStringArrayValue(formData.heroIntroLines)}
                    onChange={(e) => handleArrayChange(e, "heroIntroLines")}
                    placeholder="Full-stack systems with clean architecture&#10;Premium interfaces with restrained motion"
                    error={fieldErrors.heroIntroLines}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-6">
                    <InputGroup label="Primary CTA Label" name="primaryCtaLabel" value={formData.primaryCtaLabel} onChange={handleChange} error={fieldErrors.primaryCtaLabel} placeholder="View projects" />
                    <InputGroup label="Primary CTA Link" name="primaryCtaHref" value={formData.primaryCtaHref} onChange={handleChange} error={fieldErrors.primaryCtaHref} placeholder="/projects" />
                  </div>
                  <div className="grid gap-6">
                    <InputGroup label="Secondary CTA Label" name="secondaryCtaLabel" value={formData.secondaryCtaLabel} onChange={handleChange} error={fieldErrors.secondaryCtaLabel} placeholder="Contact me" />
                    <InputGroup label="Secondary CTA Link" name="secondaryCtaHref" value={formData.secondaryCtaHref} onChange={handleChange} error={fieldErrors.secondaryCtaHref} placeholder="/contact" />
                  </div>
                </div>
                <StructuredArrayGroup
                  label="Hero Signals"
                  description="These compact signal blocks sit under the hero CTA row."
                  items={getObjectArrayValue<HeroSignalField>(formData.heroSignals, ["label", "value"])}
                  onChange={(items) => updateStructuredListField("heroSignals", items)}
                  addLabel="Add hero signal"
                  error={fieldErrors.heroSignals}
                  fields={[
                    { key: "label", label: "Label", placeholder: "Focus" },
                    { key: "value", label: "Value", placeholder: "Product-grade web apps" },
                  ]}
                />
              </FormSection>

              <FormSection title="Signal cards" description="These are the compact highlight cards directly under the hero.">
                <StructuredArrayGroup
                  label="Highlight Cards"
                  description="Use short titles and clean descriptions."
                  items={getObjectArrayValue<HighlightCardField>(formData.highlightCards, ["title", "description"])}
                  onChange={(items) => updateStructuredListField("highlightCards", items)}
                  addLabel="Add highlight card"
                  error={fieldErrors.highlightCards}
                  fields={[
                    { key: "title", label: "Title", placeholder: "Execution" },
                    {
                      key: "description",
                      label: "Description",
                      placeholder: "Short supporting statement.",
                      type: "textarea",
                    },
                  ]}
                />
              </FormSection>

              <FormSection title="Featured projects" description="Control the copy and project count for the homepage project showcase.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Eyebrow" name="projectsEyebrow" value={formData.projectsEyebrow} onChange={handleChange} error={fieldErrors.projectsEyebrow} placeholder="Featured work" />
                  <InputGroup label="Title" name="projectsTitle" value={formData.projectsTitle} onChange={handleChange} error={fieldErrors.projectsTitle} placeholder="Selected projects with strong signal." />
                  <InputGroup label="Max Items" name="maxFeaturedProjects" type="number" value={formData.maxFeaturedProjects} onChange={handleChange} error={fieldErrors.maxFeaturedProjects} placeholder="3" />
                </div>
                <TextAreaGroup label="Description" name="projectsDescription" value={formData.projectsDescription} onChange={handleChange} rows={3} error={fieldErrors.projectsDescription} placeholder="Short intro for the featured projects section." />
              </FormSection>

              <FormSection title="Featured achievements" description="Optionally surface a restrained achievements section on the homepage.">
                <CheckboxGroup
                  label="Show achievements section"
                  name="showAchievementsSection"
                  checked={getBooleanValue(formData.showAchievementsSection)}
                  onChange={handleChange}
                  description="Hide this if you want the homepage to stay tighter."
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Eyebrow" name="achievementsEyebrow" value={formData.achievementsEyebrow} onChange={handleChange} error={fieldErrors.achievementsEyebrow} placeholder="Highlights" />
                  <InputGroup label="Title" name="achievementsTitle" value={formData.achievementsTitle} onChange={handleChange} error={fieldErrors.achievementsTitle} placeholder="Proof through outcomes." />
                  <InputGroup label="Max Items" name="maxFeaturedAchievements" type="number" value={formData.maxFeaturedAchievements} onChange={handleChange} error={fieldErrors.maxFeaturedAchievements} placeholder="2" />
                </div>
                <TextAreaGroup label="Description" name="achievementsDescription" value={formData.achievementsDescription} onChange={handleChange} rows={3} error={fieldErrors.achievementsDescription} placeholder="Short intro for highlighted achievements." />
              </FormSection>

              <FormSection title="Explore section" description="Curate the homepage navigation cards that route visitors into deeper sections.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Eyebrow" name="exploreEyebrow" value={formData.exploreEyebrow} onChange={handleChange} error={fieldErrors.exploreEyebrow} placeholder="Explore" />
                  <InputGroup label="Title" name="exploreTitle" value={formData.exploreTitle} onChange={handleChange} error={fieldErrors.exploreTitle} placeholder="Go deeper where it matters to you." />
                </div>
                <TextAreaGroup label="Description" name="exploreDescription" value={formData.exploreDescription} onChange={handleChange} rows={3} error={fieldErrors.exploreDescription} placeholder="Short explore section introduction." />
                <StructuredArrayGroup
                  label="Featured Section Cards"
                  description="These cards should feel curated, not exhaustive."
                  items={getObjectArrayValue<FeaturedSectionField>(formData.featuredSections, ["label", "title", "description", "href"])}
                  onChange={(items) => updateStructuredListField("featuredSections", items)}
                  addLabel="Add section card"
                  error={fieldErrors.featuredSections}
                  fields={[
                    { key: "label", label: "Label", placeholder: "Projects" },
                    { key: "title", label: "Title", placeholder: "Case studies and shipped work" },
                    {
                      key: "description",
                      label: "Description",
                      placeholder: "Short explanation for this route.",
                      type: "textarea",
                    },
                    { key: "href", label: "Link", placeholder: "/projects" },
                  ]}
                />
              </FormSection>

              <FormSection title="Home section order" description="Toggle homepage sections on or off and move them into the order you want rendered.">
                <StructuredArrayGroup
                  label="Home Sections"
                  description="The list order controls render order on the homepage."
                  items={getStructuredArrayValue<HomeSectionField>(formData.homeSections, {
                    stringKeys: ["id"],
                    booleanKeys: ["enabled"],
                  })}
                  onChange={(items) => updateStructuredListField("homeSections", items)}
                  addLabel="Add section"
                  error={fieldErrors.homeSections}
                  fields={[
                    {
                      key: "id",
                      label: "Section ID",
                      placeholder: Object.entries(LANDING_HOME_SECTION_LABELS)
                        .map(([id, label]) => `${id} (${label})`)
                        .join(", "),
                    },
                    {
                      key: "enabled",
                      label: "Enabled",
                      type: "checkbox",
                      description: "Hide a section without removing its place in the order.",
                    },
                  ]}
                />
              </FormSection>

              <FormSection title="Closing CTA" description="Set the final low-noise CTA block at the bottom of the landing page.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Eyebrow" name="contactEyebrow" value={formData.contactEyebrow} onChange={handleChange} error={fieldErrors.contactEyebrow} placeholder="Next step" />
                  <InputGroup label="Title" name="contactTitle" value={formData.contactTitle} onChange={handleChange} error={fieldErrors.contactTitle} placeholder="Resume, links, and direct contact stay one click away." />
                </div>
                <TextAreaGroup label="Description" name="contactDescription" value={formData.contactDescription} onChange={handleChange} rows={3} error={fieldErrors.contactDescription} placeholder="Closing supporting copy." />
              </FormSection>
            </>
          )}

          {collection === "project" && (
            <>
              <FormSection title="Core details" description="Name the project, explain what it does, and list the main technologies involved.">
                <div className="grid grid-cols-1 gap-6">
                  <InputGroup label="Project Title" name="title" value={formData.title} onChange={handleChange} required error={fieldErrors.title} placeholder="Realtime analytics dashboard" />
                  <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} error={fieldErrors.description} placeholder="What it solves, how it works, and why it matters." />
                  <ArrayInputGroup
                    label="Tech Stack"
                    name="techStack"
                    value={getStringArrayValue(formData.techStack)}
                    onChange={(e) => handleArrayChange(e, "techStack", "comma")}
                    placeholder="Next.js, TypeScript, PostgreSQL"
                    error={fieldErrors.techStack}
                    delimiter="comma"
                  />
                </div>
              </FormSection>

              <FormSection title="Placement & links" description="Control how this project is ordered and which links become visible on the public site.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Jan 2024" error={fieldErrors.startDate} />
                  <InputGroup label="End Date" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="May 2024" error={fieldErrors.endDate} />
                  <InputGroup label="Display Order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>
                <CheckboxGroup
                  label="Featured project"
                  name="featured"
                  checked={getBooleanValue(formData.featured)}
                  onChange={handleChange}
                  description="Featured projects are prioritized on the home page."
                />
                <LinkLinesGroup
                  label="Project Links"
                  name="linksText"
                  value={formData.linksText}
                  onChange={handleChange}
                  placeholder="Live Demo | https://example.com&#10;Repository | https://github.com/..."
                  error={fieldErrors.link}
                />
              </FormSection>

              <FormSection title="Gallery" description="Upload the visual assets in the order you want them previewed.">
                <GalleryGroup
                  label="Project Images"
                  field="images"
                  formData={formData}
                  draggedImageIndex={draggedImageIndex}
                  setDraggedImageIndex={setDraggedImageIndex}
                  onReorder={handleReorderImage}
                  onRemove={handleRemoveImage}
                  onUpload={handleMultipleImageUpload}
                  error={fieldErrors.images}
                />
              </FormSection>
            </>
          )}

          {collection === "experience" && (
            <>
              <FormSection title="Role details" description="Start with the role, employer, timeline, and whether the position is current.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Role / Title" name="role" value={formData.role} onChange={handleChange} required error={fieldErrors.role} placeholder="Software Engineer Intern" />
                  <InputGroup label="Company Name" name="company" value={formData.company} onChange={handleChange} required error={fieldErrors.company} placeholder="Company or team name" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Location" name="location" value={formData.location} onChange={handleChange} error={fieldErrors.location} placeholder="Remote / Bengaluru" />
                  <InputGroup label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Jan 2024" error={fieldErrors.startDate} />
                  <InputGroup label="End Date" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="Present" error={fieldErrors.endDate} />
                </div>
                <CheckboxGroup
                  label="Current role"
                  name="current"
                  checked={getBooleanValue(formData.current)}
                  onChange={handleChange}
                  description="Use this when the role is ongoing."
                />
              </FormSection>

              <FormSection title="Responsibilities & stack" description="Add concise outcome-focused points and the main technologies used in the role.">
                <ArrayInputGroup
                  label="Key Responsibilities"
                  name="description"
                  value={getStringArrayValue(formData.description)}
                  onChange={(e) => handleArrayChange(e, "description")}
                  placeholder="Built internal dashboard&#10;Reduced API latency by 30%"
                  error={fieldErrors.description}
                />
                <ArrayInputGroup
                  label="Technologies Used"
                  name="technologies"
                  value={getStringArrayValue(formData.technologies)}
                  onChange={(e) => handleArrayChange(e, "technologies", "comma")}
                  placeholder="React, Node.js, Redis"
                  error={fieldErrors.technologies}
                  delimiter="comma"
                />
              </FormSection>

              <FormSection title="References & brand assets" description="Optional supporting material for validation, files, and logo treatment.">
                <LinkLinesGroup
                  label="Reference Links"
                  name="linksText"
                  value={formData.linksText}
                  onChange={handleChange}
                  placeholder="Company | https://company.com&#10;Offer Letter | https://example.com/file.pdf"
                  error={fieldErrors.link}
                />
                <ArrayInputGroup
                  label="Attachments"
                  name="attachments"
                  value={getStringArrayValue(formData.attachments)}
                  onChange={(e) => handleArrayChange(e, "attachments", "comma")}
                  placeholder="https://example.com/certificate.pdf, https://example.com/offer-letter.pdf"
                  error={fieldErrors.attachments}
                  delimiter="comma"
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
                    <label className="mb-4 block text-sm font-medium text-foreground">Company Logo</label>
                    <FileUpload
                      label="Upload Logo"
                      initialUrl={typeof formData.logo === "string" ? formData.logo : undefined}
                      onUpload={(url) => handleImageUpload(url, "logo")}
                    />
                    {fieldErrors.logo ? <p className="mt-2 text-sm text-destructive">{fieldErrors.logo}</p> : null}
                  </div>
                  <InputGroup label="Display Order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>
              </FormSection>
            </>
          )}

          {collection === "education" && (
            <>
              <FormSection title="Academic details" description="Capture the institution, program, current status, and overall academic context.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Institution" name="institution" value={formData.institution} onChange={handleChange} required error={fieldErrors.institution} placeholder="University or school name" />
                  <InputGroup label="Degree / Certification" name="degree" value={formData.degree} onChange={handleChange} required error={fieldErrors.degree} placeholder="B.Tech in Computer Science" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Program" name="program" value={formData.program} onChange={handleChange} error={fieldErrors.program} placeholder="Honors / specialization" />
                  <InputGroup label="Status" name="status" value={formData.status} onChange={handleChange} placeholder="Ongoing" error={fieldErrors.status} />
                  <InputGroup label="Location" name="location" value={formData.location} onChange={handleChange} error={fieldErrors.location} placeholder="City, Country" />
                </div>
              </FormSection>

              <FormSection title="Timeline & grades" description="Use the grade summary for the public display, and the label/value fields for a cleaner formatted grade line.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Aug 2023" error={fieldErrors.startDate} />
                  <InputGroup label="End Date" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="Present" error={fieldErrors.endDate} />
                  <InputGroup label="Display Order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Grade Summary" name="grade" value={formData.grade} onChange={handleChange} placeholder="CGPA 9.1/10" error={fieldErrors.grade} />
                  <InputGroup label="Grade Label" name="gradeLabel" value={formData.gradeLabel} onChange={handleChange} placeholder="CGPA" error={fieldErrors.gradeLabel} />
                  <InputGroup label="Grade Value" name="gradeValue" value={formData.gradeValue} onChange={handleChange} placeholder="9.1 / 10" error={fieldErrors.gradeValue} />
                </div>
              </FormSection>

              <FormSection title="Highlights & files" description="Add the strongest highlights, key coursework, and any optional file URLs.">
                <ArrayInputGroup
                  label="Coursework"
                  name="coursework"
                  value={getStringArrayValue(formData.coursework)}
                  onChange={(e) => handleArrayChange(e, "coursework", "comma")}
                  placeholder="Data Structures, Operating Systems"
                  error={fieldErrors.coursework}
                  delimiter="comma"
                />
                <ArrayInputGroup
                  label="Highlights"
                  name="highlights"
                  value={getStringArrayValue(formData.highlights)}
                  onChange={(e) => handleArrayChange(e, "highlights")}
                  placeholder="Dean's List&#10;Research assistant"
                  error={fieldErrors.highlights}
                />
                <ArrayInputGroup
                  label="Attachments"
                  name="attachments"
                  value={getStringArrayValue(formData.attachments)}
                  onChange={(e) => handleArrayChange(e, "attachments", "comma")}
                  placeholder="https://example.com/transcript.pdf, https://example.com/certificate.pdf"
                  error={fieldErrors.attachments}
                  delimiter="comma"
                />
              </FormSection>
            </>
          )}

          {collection === "cpProfile" && (
            <>
              <FormSection title="Profile identity" description="Set the platform, handle, summary line, and public profile URL first.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Platform" name="platform" value={formData.platform} onChange={handleChange} required error={fieldErrors.platform} placeholder="LeetCode / Codeforces / CodeChef" />
                  <InputGroup label="Username / Handle" name="username" value={formData.username} onChange={handleChange} error={fieldErrors.username} placeholder="your-handle" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Headline" name="headline" value={formData.headline} onChange={handleChange} placeholder="Guardian on LeetCode" error={fieldErrors.headline} />
                  <InputGroup label="Profile URL" name="profileUrl" type="url" value={formData.profileUrl} onChange={handleChange} error={fieldErrors.profileUrl} placeholder="https://leetcode.com/..." />
                </div>
                <TextAreaGroup label="Summary" name="summary" value={formData.summary} onChange={handleChange} error={fieldErrors.summary} placeholder="Short summary of current progress, ranking, or pattern." />
              </FormSection>

              <FormSection title="Performance" description="These values drive the competitive telemetry cards and ranking summaries.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <InputGroup label="Rating" name="rating" type="number" value={formData.rating} onChange={handleChange} error={fieldErrors.rating} placeholder="1842" />
                  <InputGroup label="Max Rating" name="maxRating" type="number" value={formData.maxRating} onChange={handleChange} error={fieldErrors.rating} placeholder="1900" />
                  <InputGroup label="Solved Count" name="solvedCount" type="number" value={formData.solvedCount} onChange={handleChange} error={fieldErrors.rating} placeholder="500" />
                  <InputGroup label="Streak" name="streak" type="number" value={formData.streak} onChange={handleChange} error={fieldErrors.rating} placeholder="45" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Rank / Title" name="rank" value={formData.rank} onChange={handleChange} error={fieldErrors.rank} placeholder="Expert / Knight" />
                  <SelectGroup
                    label="Data Source"
                    name="dataSource"
                    value={formData.dataSource}
                    onChange={handleChange}
                    options={[
                      { label: "Manual", value: "manual" },
                      { label: "Imported", value: "imported" },
                      { label: "Live", value: "live" },
                      { label: "Seed", value: "seed" },
                    ]}
                    error={fieldErrors.dataSource}
                  />
                  <InputGroup label="Display Order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>
              </FormSection>

              <FormSection title="Visibility & presentation" description="Control whether the profile appears publicly and add optional presentation details.">
                <InputGroup
                  label="Accent Utility Classes"
                  name="accent"
                  value={formData.accent}
                  onChange={handleChange}
                  placeholder="from-cyan-300/35 to-sky-500/10"
                  error={fieldErrors.accent}
                />
                <CheckboxGroup
                  label="Visible on public site"
                  name="isVisible"
                  checked={!("isVisible" in formData) || getBooleanValue(formData.isVisible)}
                  onChange={handleChange}
                  description="Hidden profiles stay in the admin panel but will not render publicly."
                />
                <BadgeLinesGroup
                  label="Badges"
                  name="badgesText"
                  value={formData.badgesText}
                  onChange={handleChange}
                  placeholder="Contest Rating | 1842&#10;Badge | 500+ solved"
                  error={fieldErrors.badges}
                />
              </FormSection>

              <FormSection title="Media" description="Optional screenshots, certificates, or other visuals for the profile.">
                <GalleryGroup
                  label="Profile Images"
                  field="images"
                  formData={formData}
                  draggedImageIndex={draggedImageIndex}
                  setDraggedImageIndex={setDraggedImageIndex}
                  onReorder={handleReorderImage}
                  onRemove={handleRemoveImage}
                  onUpload={handleMultipleImageUpload}
                  error={fieldErrors.images}
                />
              </FormSection>
            </>
          )}

          {collection === "hackathon" && (
            <>
              <FormSection title="Event details" description="Define the event basics, outcome, and ordering first.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Title" name="title" value={formData.title} onChange={handleChange} required error={fieldErrors.title} placeholder="Project or team entry name" />
                  <InputGroup label="Event" name="event" value={formData.event} onChange={handleChange} error={fieldErrors.event} placeholder="Hackathon name" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Organizer" name="organizer" value={formData.organizer} onChange={handleChange} error={fieldErrors.organizer} placeholder="Organizer" />
                  <InputGroup label="Result" name="result" value={formData.result} onChange={handleChange} placeholder="Winner / Finalist" error={fieldErrors.result} />
                  <InputGroup label="Date" name="date" value={formData.date} onChange={handleChange} placeholder="Mar 2026" error={fieldErrors.date} />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputGroup label="Location" name="location" value={formData.location} onChange={handleChange} error={fieldErrors.location} placeholder="Hybrid / Bengaluru" />
                  <InputGroup label="Team Size" name="teamSize" type="number" value={formData.teamSize} onChange={handleChange} error={fieldErrors.teamSize} placeholder="1" />
                  <InputGroup label="Display Order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>
                <CheckboxGroup
                  label="Featured hackathon"
                  name="featured"
                  checked={getBooleanValue(formData.featured)}
                  onChange={handleChange}
                  description="Featured hackathons can be prioritized on the public site."
                />
              </FormSection>

              <FormSection title="Build summary" description="Add the short description, stack, and links that help explain the event result.">
                <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} error={fieldErrors.description} placeholder="What was built, what it solved, and what made the result notable." />
                <ArrayInputGroup
                  label="Tech Stack"
                  name="techStack"
                  value={getStringArrayValue(formData.techStack)}
                  onChange={(e) => handleArrayChange(e, "techStack", "comma")}
                  placeholder="Next.js, OpenAI API, Redis"
                  error={fieldErrors.techStack}
                  delimiter="comma"
                />
                <LinkLinesGroup
                  label="Links"
                  name="linksText"
                  value={formData.linksText}
                  onChange={handleChange}
                  placeholder="Devpost | https://devpost.com/...&#10;Demo | https://example.com"
                  error={fieldErrors.link}
                />
              </FormSection>

              <FormSection title="Media" description="Event visuals, certificates, or screenshots for the public card.">
                <GalleryGroup
                  label="Hackathon Images"
                  field="images"
                  formData={formData}
                  draggedImageIndex={draggedImageIndex}
                  setDraggedImageIndex={setDraggedImageIndex}
                  onReorder={handleReorderImage}
                  onRemove={handleRemoveImage}
                  onUpload={handleMultipleImageUpload}
                  error={fieldErrors.images}
                />
              </FormSection>
            </>
          )}

          {collection === "achievement" && (
            <>
              <FormSection title="Highlight details" description="Use a clear outcome-focused title, then add the issuer and date if relevant.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Award Title" name="title" value={formData.title} onChange={handleChange} required error={fieldErrors.title} placeholder="Winner, top rank, or notable outcome" />
                  <InputGroup label="Organization" name="organization" value={formData.organization} onChange={handleChange} error={fieldErrors.organization} placeholder="Issuer or host organization" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputGroup label="Date Received" name="date" value={formData.date} onChange={handleChange} error={fieldErrors.date} placeholder="Apr 2025" />
                  <InputGroup label="Display Order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>
                <CheckboxGroup
                  label="Feature on landing page"
                  name="featured"
                  checked={getBooleanValue(formData.featured)}
                  onChange={handleChange}
                  description="Featured achievements are eligible for the homepage highlights section."
                />
                <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} required error={fieldErrors.description} placeholder="One concise paragraph explaining the result and why it matters." />
              </FormSection>

              <FormSection title="Supporting material" description="Add only the most useful links and images for context.">
                <LinkLinesGroup
                  label="Reference Links"
                  name="linksText"
                  value={formData.linksText}
                  onChange={handleChange}
                  placeholder="Certificate | https://example.com/certificate"
                  error={fieldErrors.link}
                />
                <GalleryGroup
                  label="Certificates / Images"
                  field="images"
                  formData={formData}
                  draggedImageIndex={draggedImageIndex}
                  setDraggedImageIndex={setDraggedImageIndex}
                  onReorder={handleReorderImage}
                  onRemove={handleRemoveImage}
                  onUpload={handleMultipleImageUpload}
                  error={fieldErrors.images}
                />
              </FormSection>
            </>
          )}

          {collection === "skill" && (
            <>
              <FormSection title="Category setup" description="Create the category and add comma-separated skill items to unlock the proficiency editor.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
                  <InputGroup
                    label="Category Name"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Languages, Frameworks, AI, Infra"
                    required
                    error={fieldErrors.category}
                  />
                  <InputGroup label="Display Order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>
                <ArrayInputGroup
                  label="Skill Items"
                  name="items"
                  value={skillItems}
                  onChange={(e) => handleArrayChange(e, "items", "comma")}
                  placeholder="TypeScript, Next.js, PostgreSQL"
                  required
                  error={fieldErrors.items}
                  delimiter="comma"
                />
              </FormSection>

              <FormSection title="Skill levels" description="Use the slider and numeric input together to reflect current proficiency and active focus.">
                <SkillMapEditor
                  items={skillItems}
                  proficiency={getNumberMap(formData.proficiency)}
                  focusSignals={getStringMap(formData.focusSignals)}
                  onProficiencyChange={handleSkillNumberChange}
                  onSignalChange={handleSkillSignalChange}
                  proficiencyError={fieldErrors.proficiency}
                  focusSignalsError={fieldErrors.focusSignals}
                />
              </FormSection>
            </>
          )}

          <div className="flex gap-4 border-t pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
              {isSubmitting ? "Saving..." : "Save Details"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg bg-secondary px-6 py-3 font-medium text-secondary-foreground transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <FormSummaryCard
            collection={collection}
            title={summary.title}
            subtitle={summary.subtitle}
            description={summary.description}
            badges={summary.badges}
            stats={summary.stats}
            notes={summary.notes}
          />
          <FormSidebarCard
            title="Required fields"
            description="These fields must be valid before the record can be saved."
            items={REQUIRED_FIELDS[collection].map((field) => field.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()))}
          />
          <FormSidebarCard
            title="Editing tips"
            description="A few collection-specific cues to keep the public content clean."
            items={COLLECTION_TIPS[collection]}
          />
        </div>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-muted/15 p-5 sm:p-6">
      <div className="mb-5">
        <h4 className="text-lg font-semibold text-foreground">{title}</h4>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function FormSummaryCard({
  collection,
  title,
  subtitle,
  description,
  badges,
  stats,
  notes,
}: {
  collection: ContentCollectionId;
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  stats: SummaryStat[];
  notes: string[];
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
        {getCollectionLabel(collection)} preview
      </p>
      <h4 className="mt-3 text-xl font-semibold text-foreground">{title}</h4>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{subtitle}</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>

      {badges.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-primary/15 bg-background px-3 py-1 text-xs font-medium text-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      ) : null}

      {stats.length > 0 ? (
        <div className="mt-5 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border/60 bg-background p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {notes.length > 0 ? (
        <div className="mt-5 rounded-xl border border-border/60 bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Quick read
          </p>
          <div className="mt-3 space-y-2 text-sm leading-7 text-foreground">
            {notes.map((note) => (
              <p key={note} className="rounded-lg bg-muted/50 px-3 py-2">
                {note}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FormSidebarCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground/80">{title}</h4>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-sm text-foreground">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PageIntroEditor({
  label,
  value,
  onChange,
  errors,
}: {
  label: string;
  value: PageIntroField;
  onChange: (field: keyof PageIntroField, value: string) => void;
  errors?: Partial<Record<keyof PageIntroField, string | undefined>>;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h5 className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground/80">{label}</h5>
      <div className="mt-4 grid gap-4">
        <InputGroup
          label="Eyebrow"
          name={`${label}-eyebrow`}
          value={value.eyebrow}
          onChange={(event) => onChange("eyebrow", event.target.value)}
          error={errors?.eyebrow}
          placeholder={label}
        />
        <InputGroup
          label="Title"
          name={`${label}-title`}
          value={value.title}
          onChange={(event) => onChange("title", event.target.value)}
          error={errors?.title}
          placeholder={`${label}.`}
        />
        <TextAreaGroup
          label="Description"
          name={`${label}-description`}
          value={value.description}
          onChange={(event) => onChange("description", event.target.value)}
          rows={3}
          error={errors?.description}
          placeholder={`Short intro for the ${label.toLowerCase()} page.`}
        />
        <InputGroup
          label="Path"
          name={`${label}-path`}
          value={value.path}
          onChange={(event) => onChange("path", event.target.value)}
          error={errors?.path}
          placeholder={`/${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

type StructuredArrayField = {
  key: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "url" | "textarea" | "checkbox";
};

function StructuredArrayGroup<T extends Record<string, string | boolean>>({
  label,
  description,
  items,
  onChange,
  fields,
  addLabel,
  error,
}: {
  label: string;
  description?: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: StructuredArrayField[];
  addLabel: string;
  error?: string;
}) {
  const createItem = () =>
    Object.fromEntries(
      fields.map((field) => [field.key, field.type === "checkbox" ? false : ""])
    ) as T;

  const updateItem = (index: number, key: string, value: string | boolean) => {
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? ({ ...item, [key]: value } as T) : item
    );
    onChange(nextItems);
  };

  const addItem = () => {
    onChange([...items, createItem()]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    onChange(reorderItems(items, index, nextIndex));
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/15 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">{label}</label>
          {description ? <p className="mt-1 text-sm leading-7 text-muted-foreground">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
        >
          {addLabel}
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-background/60 px-4 py-5 text-sm text-muted-foreground">
            No items added yet.
          </div>
        ) : (
          items.map((item, index) => (
            <div key={`${label}-${index}`} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{label} {index + 1}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/15"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                {fields.map((field) =>
                  field.type === "textarea" ? (
                    <TextAreaGroup
                      key={field.key}
                      label={field.label}
                      name={`${label}-${field.key}-${index}`}
                      value={getStringValue(item[field.key])}
                      onChange={(event) => updateItem(index, field.key, event.target.value)}
                      rows={3}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "checkbox" ? (
                    <CheckboxGroup
                      key={field.key}
                      label={field.label}
                      name={`${label}-${field.key}-${index}`}
                      checked={Boolean(item[field.key])}
                      onChange={(event) => updateItem(index, field.key, event.target.checked)}
                      description={field.description}
                    />
                  ) : (
                    <InputGroup
                      key={field.key}
                      label={field.label}
                      name={`${label}-${field.key}-${index}`}
                      value={getStringValue(item[field.key])}
                      onChange={(event) => updateItem(index, field.key, event.target.value)}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                    />
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function GalleryGroup({
  label,
  field,
  formData,
  draggedImageIndex,
  setDraggedImageIndex,
  onReorder,
  onRemove,
  onUpload,
  error,
}: {
  label: string;
  field: string;
  formData: Record<string, unknown>;
  draggedImageIndex: number | null;
  setDraggedImageIndex: (index: number | null) => void;
  onReorder: (fromIndex: number, toIndex: number, field: string) => void;
  onRemove: (index: number, field: string) => void;
  onUpload: (url: string, field: string) => void;
  error?: string;
}) {
  const items = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];

  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
      <label className="mb-4 flex items-center justify-between gap-3 text-sm font-medium text-foreground">
        <span className="inline-flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> {label}
        </span>
        <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {items.length} image{items.length === 1 ? "" : "s"}
        </span>
      </label>

      <SortableGallery
        field={field}
        items={items}
        draggedIndex={draggedImageIndex}
        onDragStart={setDraggedImageIndex}
        onDrop={(fromIndex, toIndex) => {
          onReorder(fromIndex, toIndex, field);
          setDraggedImageIndex(null);
          toast.success("Gallery reordered", {
            description: "The image order has been updated.",
          });
        }}
        onDragEnd={() => setDraggedImageIndex(null)}
        onRemove={(index) => onRemove(index, field)}
        itemLabel={label}
      />

      <FileUpload label="Add Image" onUpload={(url) => onUpload(url, field)} />
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function SkillMapEditor({
  items,
  proficiency,
  focusSignals,
  onProficiencyChange,
  onSignalChange,
  proficiencyError,
  focusSignalsError,
}: {
  items: string[] | string;
  proficiency: Record<string, number>;
  focusSignals: Record<string, string>;
  onProficiencyChange: (item: string, value: string) => void;
  onSignalChange: (item: string, value: string) => void;
  proficiencyError?: string;
  focusSignalsError?: string;
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
        Add skill items first. Proficiency and focus inputs appear automatically for each item.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border/60 bg-muted/20 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Skill Levels</p>
          <p className="mt-1 text-xs text-muted-foreground">Set a 0-100 proficiency score and an optional focus signal for each skill.</p>
        </div>
        <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          Average{" "}
          {Math.round(
            items.reduce((sum, item) => sum + (proficiency[item] ?? 0), 0) / Math.max(items.length, 1)
          )}
          %
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const value = proficiency[item] ?? 0;

          return (
            <div key={item} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Current skill emphasis for this item.</p>
                </div>
                <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {value}%
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_84px] md:items-center">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={value}
                  onChange={(e) => onProficiencyChange(item, e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                />
                <InputGroup
                  label="Proficiency"
                  name={`proficiency-${item}`}
                  type="number"
                  value={value}
                  onChange={(e) => onProficiencyChange(item, e.target.value)}
                />
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
              </div>

              <div className="mt-4">
                <InputGroup
                  label="Focus Signal"
                  name={`focus-${item}`}
                  value={focusSignals[item] || ""}
                  onChange={(e) => onSignalChange(item, e.target.value)}
                  placeholder="Most used recently"
                />
              </div>
            </div>
          );
        })}
      </div>

      {proficiencyError ? <p className="text-sm text-destructive">{proficiencyError}</p> : null}
      {focusSignalsError ? <p className="text-sm text-destructive">{focusSignalsError}</p> : null}
    </div>
  );
}

function SortableGallery({
  field,
  items,
  draggedIndex,
  onDragStart,
  onDrop,
  onDragEnd,
  onRemove,
  itemLabel,
}: {
  field: string;
  items: string[];
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDrop: (fromIndex: number, toIndex: number) => void;
  onDragEnd: () => void;
  onRemove: (index: number) => void;
  itemLabel: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((url, index) => (
        <div
          key={`${field}-${url}-${index}`}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggedIndex === null || draggedIndex === index) {
              return;
            }
            onDrop(draggedIndex, index);
          }}
          onDragEnd={onDragEnd}
          className={cn(
            "group relative aspect-video overflow-hidden rounded-md border bg-muted",
            draggedIndex === index && "opacity-60 ring-2 ring-primary/40"
          )}
        >
          <Image
            src={url}
            alt={`${itemLabel} ${index + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="rounded-md object-cover"
          />
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white">
            <GripVertical className="h-3 w-3" /> Drag
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-1 top-1 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 shadow-sm transition group-hover:opacity-100 hover:scale-105"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

interface InputGroupProps {
  label: string;
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function InputGroup({ label, name, value, onChange, type = "text", placeholder, required, error }: InputGroupProps) {
  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-background p-3.5 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
        required={required}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface SelectGroupProps {
  label: string;
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ label: string; value: string }>;
  error?: string;
}

function SelectGroup({ label, name, value, onChange, options, error }: SelectGroupProps) {
  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        {label}
      </label>
      <select
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-background p-3.5 text-sm shadow-sm outline-none transition-all hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}

function CheckboxGroup({ label, name, checked, onChange, description }: CheckboxGroupProps) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary/20"
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-6 text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  );
}

interface TextAreaGroupProps {
  label: string;
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function TextAreaGroup({ label, name, value, onChange, rows = 4, placeholder, required, error }: TextAreaGroupProps) {
  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <textarea
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full resize-y rounded-xl border bg-background p-3.5 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface ArrayInputGroupProps {
  label: string;
  name: string;
  value: string[] | string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  delimiter?: "newline" | "comma";
}

function ArrayInputGroup({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  delimiter = "newline",
}: ArrayInputGroupProps) {
  const items = Array.isArray(value)
    ? value
    : parseDelimitedStringArray(getStringValue(value), delimiter);
  const delimiterLabel = delimiter === "comma" ? "Comma separated" : "One item per line";
  const renderedValue = Array.isArray(value)
    ? delimiter === "comma"
      ? value.join(", ")
      : value.join("\n")
    : getStringValue(value);

  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        <span className="flex items-center gap-2">
          {label} {required && <span className="text-destructive">*</span>}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">
            {items.length}
          </span>
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">{delimiterLabel}</span>
      </label>
      <textarea
        name={name}
        value={renderedValue}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-background p-3.5 font-mono text-sm leading-relaxed shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface LinkLinesGroupProps {
  label: string;
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
}

function LinkLinesGroup({ label, name, value, onChange, placeholder, error }: LinkLinesGroupProps) {
  const linkCount = parseLinkLines(value).length;

  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        <span className="flex items-center gap-2">
          {label}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">
            {linkCount}
          </span>
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">Label | URL</span>
      </label>
      <textarea
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full resize-y rounded-xl border bg-background p-3.5 font-mono text-sm leading-relaxed shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function BadgeLinesGroup({ label, name, value, onChange, placeholder, error }: LinkLinesGroupProps) {
  const badgeCount = parseBadgeLines(value).length;

  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        <span className="flex items-center gap-2">
          {label}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">
            {badgeCount}
          </span>
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">Label | Value</span>
      </label>
      <textarea
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full resize-y rounded-xl border bg-background p-3.5 font-mono text-sm leading-relaxed shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
