export const ADMIN_COLLECTIONS = [
  { id: "siteSettings", label: "Site Settings" },
  { id: "landingPage", label: "Landing Page" },
  { id: "project", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "cpProfile", label: "CP Profiles" },
  { id: "hackathon", label: "Hackathons" },
  { id: "achievement", label: "Achievements" },
  { id: "skill", label: "Skills" },
] as const;

export const CONTENT_COLLECTIONS = [
  { id: "siteSettings", label: "Site Settings" },
  { id: "landingPage", label: "Landing Page" },
  { id: "achievement", label: "Achievements" },
  { id: "skill", label: "Skills" },
  { id: "project", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "cpProfile", label: "CP Profiles" },
  { id: "hackathon", label: "Hackathons" },
] as const;

export type AdminCollectionId = (typeof ADMIN_COLLECTIONS)[number]["id"];
export type ContentCollectionId = (typeof CONTENT_COLLECTIONS)[number]["id"];

export const REQUIRED_FIELDS: Record<AdminCollectionId, string[]> = {
  siteSettings: ["name", "role"],
  landingPage: ["heroTitle", "heroSubtitle"],
  project: ["title"],
  experience: ["role", "company"],
  education: ["institution", "degree"],
  cpProfile: ["platform"],
  hackathon: ["title"],
  achievement: ["title", "description"],
  skill: ["category", "items"],
};

export const SINGLETON_COLLECTIONS = ["siteSettings", "landingPage"] as const;

type ValidationResult = {
  success: boolean;
  data: Record<string, unknown>;
  fieldErrors: Record<string, string>;
};

type ContentLink = {
  name: string;
  url: string;
};

type ContentBadge = {
  label: string;
  value: string;
};

type ResumeAlternateLink = {
  label: string;
  href: string;
};

type SocialLink = {
  kind: string;
  label: string;
  value: string;
  href: string;
};

type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
};

type HighlightCard = {
  title: string;
  description: string;
};

type FeaturedSection = {
  label: string;
  title: string;
  description: string;
  href: string;
};

function asTrimmedString(value: unknown) {
  if (typeof value === "number") {
    return String(value).trim();
  }

  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  const source = Array.isArray(value) ? value : typeof value === "string" ? value.split("\n") : [];

  return Array.from(
    new Set(
      source
        .map((item) => asTrimmedString(item))
        .filter(Boolean)
    )
  );
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }

  return false;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function isProvided(value: unknown) {
  return !(value === null || value === undefined || asTrimmedString(value) === "");
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
      const url = asTrimmedString(link.url);

      if (!url) {
        return null;
      }

      return {
        name: asTrimmedString(link.name) || "Reference",
        url,
      };
    })
    .filter((item): item is ContentLink => Boolean(item));
}

function asBadges(value: unknown): ContentBadge[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const badge = item as { label?: unknown; value?: unknown };
      const label = asTrimmedString(badge.label);

      if (!label) {
        return null;
      }

      return {
        label,
        value: asTrimmedString(badge.value),
      };
    })
    .filter((item): item is ContentBadge => Boolean(item));
}

function asResumeAlternateLinks(value: unknown): ResumeAlternateLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const link = item as { label?: unknown; href?: unknown };
      const href = asTrimmedString(link.href);

      if (!href) {
        return null;
      }

      return {
        label: asTrimmedString(link.label) || "Alternate resume",
        href,
      };
    })
    .filter((item): item is ResumeAlternateLink => Boolean(item));
}

function asSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const link = item as {
        kind?: unknown;
        label?: unknown;
        value?: unknown;
        href?: unknown;
      };
      const href = asTrimmedString(link.href);

      if (!href) {
        return null;
      }

      return {
        kind: asTrimmedString(link.kind) || "other",
        label: asTrimmedString(link.label) || "Link",
        value: asTrimmedString(link.value),
        href,
      };
    })
    .filter((item): item is SocialLink => Boolean(item));
}

function asPageIntro(value: unknown): PageIntro {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      eyebrow: "",
      title: "",
      description: "",
    };
  }

  const intro = value as Record<string, unknown>;

  return {
    eyebrow: asTrimmedString(intro.eyebrow),
    title: asTrimmedString(intro.title),
    description: asTrimmedString(intro.description),
  };
}

function asHighlightCards(value: unknown): HighlightCard[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const card = item as { title?: unknown; description?: unknown };
      const title = asTrimmedString(card.title);
      const description = asTrimmedString(card.description);

      if (!title || !description) {
        return null;
      }

      return {
        title,
        description,
      };
    })
    .filter((item): item is HighlightCard => Boolean(item));
}

function asFeaturedSections(value: unknown): FeaturedSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const section = item as {
        label?: unknown;
        title?: unknown;
        description?: unknown;
        href?: unknown;
      };
      const href = asTrimmedString(section.href);

      if (!href) {
        return null;
      }

      return {
        label: asTrimmedString(section.label) || "Section",
        title: asTrimmedString(section.title),
        description: asTrimmedString(section.description),
        href,
      };
    })
    .filter((item): item is FeaturedSection => Boolean(item));
}

function asNumberMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, mapValue]) => [asTrimmedString(key), asNumber(mapValue, Number.NaN)] as const)
      .filter(([key, mapValue]) => key && Number.isFinite(mapValue))
  );
}

function asStringMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, mapValue]) => [asTrimmedString(key), asTrimmedString(mapValue)] as const)
      .filter(([key, mapValue]) => key && mapValue)
  );
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidLinkHref(value: string) {
  if (value.startsWith("/")) {
    return true;
  }

  if (value.startsWith("mailto:")) {
    return true;
  }

  return isValidUrl(value);
}

function withProjectLinks(input: Record<string, unknown>) {
  const namedLinks = asLinks(input.links);
  const directLinks = [
    asTrimmedString(input.link)
      ? {
          name: "Live Demo",
          url: asTrimmedString(input.link),
        }
      : null,
    asTrimmedString(input.repo)
      ? {
          name: "Repository",
          url: asTrimmedString(input.repo),
        }
      : null,
  ].filter((item): item is ContentLink => Boolean(item));

  const unique = new Map<string, ContentLink>();

  [...directLinks, ...namedLinks].forEach((item) => {
    if (!unique.has(item.url)) {
      unique.set(item.url, item);
    }
  });

  return Array.from(unique.values());
}

export function isSupportedAdminCollection(collection: string | null | undefined): collection is AdminCollectionId {
  return ADMIN_COLLECTIONS.some((item) => item.id === collection);
}

export function isSupportedContentCollection(collection: string | null | undefined): collection is ContentCollectionId {
  return CONTENT_COLLECTIONS.some((item) => item.id === collection);
}

export function isSingletonCollection(
  collection: string | null | undefined
): collection is (typeof SINGLETON_COLLECTIONS)[number] {
  return SINGLETON_COLLECTIONS.some((item) => item === collection);
}

export function validateContentData(collection: ContentCollectionId, input: Record<string, unknown>): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (collection === "siteSettings") {
    const name = asTrimmedString(input.name);
    const role = asTrimmedString(input.role);
    const location = asTrimmedString(input.location);
    const availability = asTrimmedString(input.availability);
    const profileBadge = asTrimmedString(input.profileBadge);
    const profileImage = asTrimmedString(input.profileImage);
    const profileImageAlt = asTrimmedString(input.profileImageAlt);
    const footerBlurb = asTrimmedString(input.footerBlurb);
    const aboutParagraphs = asStringArray(input.aboutParagraphs);
    const primaryResumeLabel = asTrimmedString(input.primaryResumeLabel) || "Resume";
    const primaryResumeViewHref = asTrimmedString(input.primaryResumeViewHref);
    const primaryResumeDownloadHref = asTrimmedString(input.primaryResumeDownloadHref);
    const alternateResumeLinks = asResumeAlternateLinks(input.alternateResumeLinks);
    const socialLinks = asSocialLinks(input.socialLinks);
    const pageIntro = {
      about: asPageIntro((input.pageIntro as Record<string, unknown> | undefined)?.about),
      projects: asPageIntro((input.pageIntro as Record<string, unknown> | undefined)?.projects),
      experience: asPageIntro((input.pageIntro as Record<string, unknown> | undefined)?.experience),
      skills: asPageIntro((input.pageIntro as Record<string, unknown> | undefined)?.skills),
      achievements: asPageIntro((input.pageIntro as Record<string, unknown> | undefined)?.achievements),
      contact: asPageIntro((input.pageIntro as Record<string, unknown> | undefined)?.contact),
    };

    if (name.length < 2) {
      fieldErrors.name = "Name must be at least 2 characters.";
    } else if (name.length > 60) {
      fieldErrors.name = "Name must be 60 characters or fewer.";
    }

    if (role.length < 2) {
      fieldErrors.role = "Role must be at least 2 characters.";
    } else if (role.length > 80) {
      fieldErrors.role = "Role must be 80 characters or fewer.";
    }

    if (location.length > 80) {
      fieldErrors.location = "Location must be 80 characters or fewer.";
    }

    if (availability.length > 180) {
      fieldErrors.availability = "Availability text must be 180 characters or fewer.";
    }

    if (profileBadge.length > 80) {
      fieldErrors.profileBadge = "Profile badge must be 80 characters or fewer.";
    }

    if (profileImage && !isValidUrl(profileImage)) {
      fieldErrors.profileImage = "Profile image must use a valid http:// or https:// URL.";
    }

    if (profileImageAlt.length > 120) {
      fieldErrors.profileImageAlt = "Profile image alt text must be 120 characters or fewer.";
    }

    if (footerBlurb.length > 240) {
      fieldErrors.footerBlurb = "Footer blurb must be 240 characters or fewer.";
    }

    if (aboutParagraphs.length === 0) {
      fieldErrors.aboutParagraphs = "Add at least one about paragraph.";
    } else if (aboutParagraphs.length > 6) {
      fieldErrors.aboutParagraphs = "Add up to 6 about paragraphs.";
    } else if (aboutParagraphs.some((item) => item.length > 320)) {
      fieldErrors.aboutParagraphs = "Each about paragraph must be 320 characters or fewer.";
    }

    if (primaryResumeLabel.length > 40) {
      fieldErrors.primaryResumeLabel = "Resume label must be 40 characters or fewer.";
    }

    if (primaryResumeViewHref && !isValidUrl(primaryResumeViewHref)) {
      fieldErrors.primaryResumeViewHref = "Primary resume view link must use a valid http:// or https:// URL.";
    }

    if (primaryResumeDownloadHref && !isValidUrl(primaryResumeDownloadHref)) {
      fieldErrors.primaryResumeDownloadHref =
        "Primary resume download link must use a valid http:// or https:// URL.";
    }

    if (alternateResumeLinks.length > 4) {
      fieldErrors.alternateResumeLinks = "Add up to 4 alternate resume links.";
    } else if (alternateResumeLinks.some((item) => item.label.length > 40 || !isValidUrl(item.href))) {
      fieldErrors.alternateResumeLinks =
        "Alternate resume links must have short labels and valid http:// or https:// URLs.";
    }

    if (socialLinks.length === 0) {
      fieldErrors.socialLinks = "Add at least one social or contact link.";
    } else if (socialLinks.length > 8) {
      fieldErrors.socialLinks = "Add up to 8 social links.";
    } else if (
      socialLinks.some(
        (item) =>
          !["email", "github", "linkedin", "website", "other"].includes(item.kind) ||
          item.label.length > 32 ||
          item.value.length > 120 ||
          !isValidLinkHref(item.href)
      )
    ) {
      fieldErrors.socialLinks =
        "Social links must use supported kinds, short labels, and valid /, http://, https://, or mailto: URLs.";
    }

    (Object.entries(pageIntro) as Array<[keyof typeof pageIntro, PageIntro]>).forEach(([key, value]) => {
      if (!value.title) {
        fieldErrors[`pageIntro.${key}.title`] = "Each page intro needs a title.";
      }

      if (value.eyebrow.length > 40) {
        fieldErrors[`pageIntro.${key}.eyebrow`] = "Eyebrows must be 40 characters or fewer.";
      }

      if (value.title.length > 90) {
        fieldErrors[`pageIntro.${key}.title`] = "Titles must be 90 characters or fewer.";
      }

      if (value.description.length > 240) {
        fieldErrors[`pageIntro.${key}.description`] = "Descriptions must be 240 characters or fewer.";
      }
    });

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        singletonKey: "site-settings",
        name,
        role,
        location,
        availability,
        profileBadge,
        profileImage,
        profileImageAlt,
        footerBlurb,
        aboutParagraphs,
        primaryResumeLabel,
        primaryResumeViewHref,
        primaryResumeDownloadHref,
        alternateResumeLinks,
        socialLinks,
        pageIntro,
      },
    };
  }

  if (collection === "landingPage") {
    const heroEyebrow = asTrimmedString(input.heroEyebrow);
    const heroTitle = asTrimmedString(input.heroTitle);
    const heroSubtitle = asTrimmedString(input.heroSubtitle);
    const heroSummary = asTrimmedString(input.heroSummary);
    const primaryCtaLabel = asTrimmedString(input.primaryCtaLabel);
    const primaryCtaHref = asTrimmedString(input.primaryCtaHref);
    const secondaryCtaLabel = asTrimmedString(input.secondaryCtaLabel);
    const secondaryCtaHref = asTrimmedString(input.secondaryCtaHref);
    const highlightCards = asHighlightCards(input.highlightCards);
    const projectsEyebrow = asTrimmedString(input.projectsEyebrow);
    const projectsTitle = asTrimmedString(input.projectsTitle);
    const projectsDescription = asTrimmedString(input.projectsDescription);
    const maxFeaturedProjects = asNumber(input.maxFeaturedProjects, 3);
    const achievementsEyebrow = asTrimmedString(input.achievementsEyebrow);
    const achievementsTitle = asTrimmedString(input.achievementsTitle);
    const achievementsDescription = asTrimmedString(input.achievementsDescription);
    const maxFeaturedAchievements = asNumber(input.maxFeaturedAchievements, 2);
    const showAchievementsSection = asBoolean(input.showAchievementsSection);
    const exploreEyebrow = asTrimmedString(input.exploreEyebrow);
    const exploreTitle = asTrimmedString(input.exploreTitle);
    const exploreDescription = asTrimmedString(input.exploreDescription);
    const featuredSections = asFeaturedSections(input.featuredSections);
    const contactEyebrow = asTrimmedString(input.contactEyebrow);
    const contactTitle = asTrimmedString(input.contactTitle);
    const contactDescription = asTrimmedString(input.contactDescription);

    if (heroEyebrow.length > 40) {
      fieldErrors.heroEyebrow = "Hero eyebrow must be 40 characters or fewer.";
    }

    if (heroTitle.length < 8) {
      fieldErrors.heroTitle = "Hero title must be at least 8 characters.";
    } else if (heroTitle.length > 140) {
      fieldErrors.heroTitle = "Hero title must be 140 characters or fewer.";
    }

    if (heroSubtitle.length < 16) {
      fieldErrors.heroSubtitle = "Hero subtitle must be at least 16 characters.";
    } else if (heroSubtitle.length > 240) {
      fieldErrors.heroSubtitle = "Hero subtitle must be 240 characters or fewer.";
    }

    if (heroSummary.length > 240) {
      fieldErrors.heroSummary = "Hero summary must be 240 characters or fewer.";
    }

    if (primaryCtaLabel.length > 32) {
      fieldErrors.primaryCtaLabel = "Primary CTA label must be 32 characters or fewer.";
    }

    if (primaryCtaHref && !isValidLinkHref(primaryCtaHref)) {
      fieldErrors.primaryCtaHref =
        "Primary CTA link must start with /, http://, https://, or mailto:.";
    }

    if (secondaryCtaLabel.length > 32) {
      fieldErrors.secondaryCtaLabel = "Secondary CTA label must be 32 characters or fewer.";
    }

    if (secondaryCtaHref && !isValidLinkHref(secondaryCtaHref)) {
      fieldErrors.secondaryCtaHref =
        "Secondary CTA link must start with /, http://, https://, or mailto:.";
    }

    if (highlightCards.length < 2) {
      fieldErrors.highlightCards = "Add at least 2 highlight cards.";
    } else if (highlightCards.length > 4) {
      fieldErrors.highlightCards = "Add up to 4 highlight cards.";
    } else if (
      highlightCards.some((item) => item.title.length > 60 || item.description.length > 180)
    ) {
      fieldErrors.highlightCards =
        "Highlight cards need short titles and descriptions under 180 characters.";
    }

    if (projectsEyebrow.length > 40) {
      fieldErrors.projectsEyebrow = "Projects eyebrow must be 40 characters or fewer.";
    }

    if (projectsTitle.length > 100) {
      fieldErrors.projectsTitle = "Projects title must be 100 characters or fewer.";
    }

    if (projectsDescription.length > 220) {
      fieldErrors.projectsDescription = "Projects description must be 220 characters or fewer.";
    }

    if (maxFeaturedProjects < 1 || maxFeaturedProjects > 6) {
      fieldErrors.maxFeaturedProjects = "Show between 1 and 6 featured projects.";
    }

    if (achievementsEyebrow.length > 40) {
      fieldErrors.achievementsEyebrow = "Achievements eyebrow must be 40 characters or fewer.";
    }

    if (achievementsTitle.length > 100) {
      fieldErrors.achievementsTitle = "Achievements title must be 100 characters or fewer.";
    }

    if (achievementsDescription.length > 220) {
      fieldErrors.achievementsDescription =
        "Achievements description must be 220 characters or fewer.";
    }

    if (maxFeaturedAchievements < 0 || maxFeaturedAchievements > 4) {
      fieldErrors.maxFeaturedAchievements = "Show between 0 and 4 featured achievements.";
    }

    if (exploreEyebrow.length > 40) {
      fieldErrors.exploreEyebrow = "Explore eyebrow must be 40 characters or fewer.";
    }

    if (exploreTitle.length > 100) {
      fieldErrors.exploreTitle = "Explore title must be 100 characters or fewer.";
    }

    if (exploreDescription.length > 220) {
      fieldErrors.exploreDescription = "Explore description must be 220 characters or fewer.";
    }

    if (featuredSections.length === 0) {
      fieldErrors.featuredSections = "Add at least one featured section card.";
    } else if (featuredSections.length > 6) {
      fieldErrors.featuredSections = "Add up to 6 featured section cards.";
    } else if (
      featuredSections.some(
        (item) =>
          item.label.length > 28 ||
          item.title.length > 80 ||
          item.description.length > 180 ||
          !isValidLinkHref(item.href)
      )
    ) {
      fieldErrors.featuredSections =
        "Featured section cards need short copy and valid /, http://, https://, or mailto: links.";
    }

    if (contactEyebrow.length > 40) {
      fieldErrors.contactEyebrow = "Contact eyebrow must be 40 characters or fewer.";
    }

    if (contactTitle.length > 100) {
      fieldErrors.contactTitle = "Contact title must be 100 characters or fewer.";
    }

    if (contactDescription.length > 220) {
      fieldErrors.contactDescription = "Contact description must be 220 characters or fewer.";
    }

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        singletonKey: "landing-page",
        heroEyebrow,
        heroTitle,
        heroSubtitle,
        heroSummary,
        primaryCtaLabel,
        primaryCtaHref,
        secondaryCtaLabel,
        secondaryCtaHref,
        highlightCards,
        projectsEyebrow,
        projectsTitle,
        projectsDescription,
        maxFeaturedProjects,
        achievementsEyebrow,
        achievementsTitle,
        achievementsDescription,
        maxFeaturedAchievements,
        showAchievementsSection,
        exploreEyebrow,
        exploreTitle,
        exploreDescription,
        featuredSections,
        contactEyebrow,
        contactTitle,
        contactDescription,
      },
    };
  }

  if (collection === "achievement") {
    const title = asTrimmedString(input.title);
    const organization = asTrimmedString(input.organization);
    const date = asTrimmedString(input.date);
    const description = asTrimmedString(input.description);
    const featured = asBoolean(input.featured);
    const order = asNumber(input.order);
    const images = asStringArray(input.images);
    const links = asLinks(input.links);

    if (title.length < 3) {
      fieldErrors.title = "Title must be at least 3 characters.";
    } else if (title.length > 80) {
      fieldErrors.title = "Title must be 80 characters or fewer.";
    }

    if (!description) {
      fieldErrors.description = "Description is required.";
    } else if (description.length < 20) {
      fieldErrors.description = "Description should be at least 20 characters.";
    } else if (description.length > 500) {
      fieldErrors.description = "Description must be 500 characters or fewer.";
    }

    if (organization.length > 80) {
      fieldErrors.organization = "Organization must be 80 characters or fewer.";
    }

    if (date.length > 40) {
      fieldErrors.date = "Date must be 40 characters or fewer.";
    }

    if (images.length > 6) {
      fieldErrors.images = "Add up to 6 images only.";
    } else if (images.some((image) => !isValidUrl(image))) {
      fieldErrors.images = "Each image must use a valid http:// or https:// URL.";
    }

    if (links.length > 3) {
      fieldErrors.link = "Add up to 3 reference links only.";
    } else if (links.some((link) => !isValidUrl(link.url))) {
      fieldErrors.link = "Reference links must use a valid http:// or https:// URL.";
    }

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        title,
        organization,
        date,
        description,
        featured,
        order,
        images,
        links,
      },
    };
  }

  if (collection === "skill") {
    const category = asTrimmedString(input.category);
    const items = asStringArray(input.items);
    const proficiency = asNumberMap(input.proficiency);
    const focusSignals = asStringMap(input.focusSignals);
    const order = asNumber(input.order);

    if (category.length < 2) {
      fieldErrors.category = "Category must be at least 2 characters.";
    } else if (category.length > 40) {
      fieldErrors.category = "Category must be 40 characters or fewer.";
    }

    if (items.length === 0) {
      fieldErrors.items = "Add at least one skill item.";
    } else if (items.length > 16) {
      fieldErrors.items = "Keep each category to 16 skill items or fewer.";
    } else if (items.some((item) => item.length > 30)) {
      fieldErrors.items = "Each skill item must be 30 characters or fewer.";
    } else if (new Set(items.map((item) => item.toLowerCase())).size !== items.length) {
      fieldErrors.items = "Duplicate skill items are not allowed.";
    }

    if (Object.values(proficiency).some((value) => value < 0 || value > 100)) {
      fieldErrors.proficiency = "Skill proficiency values must be between 0 and 100.";
    }

    const itemKeys = new Set(items.map((item) => item.toLowerCase()));

    if (Object.keys(proficiency).some((key) => !itemKeys.has(key.toLowerCase()))) {
      fieldErrors.proficiency = "Proficiency values must map to an item in this skill category.";
    }

    if (Object.values(focusSignals).some((value) => value.length > 40)) {
      fieldErrors.focusSignals = "Focus signals must be 40 characters or fewer.";
    }

    if (Object.keys(focusSignals).some((key) => !itemKeys.has(key.toLowerCase()))) {
      fieldErrors.focusSignals = "Focus signals must map to an item in this skill category.";
    }

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        category,
        items,
        proficiency,
        focusSignals,
        order,
      },
    };
  }

  if (collection === "project") {
    const title = asTrimmedString(input.title);
    const description = asTrimmedString(input.description);
    const techStack = asStringArray(input.techStack);
    const links = withProjectLinks(input);
    const images = asStringArray(input.images);
    const featured = asBoolean(input.featured);
    const startDate = asTrimmedString(input.startDate);
    const endDate = asTrimmedString(input.endDate);
    const order = asNumber(input.order);

    if (title.length < 3) {
      fieldErrors.title = "Title must be at least 3 characters.";
    } else if (title.length > 100) {
      fieldErrors.title = "Title must be 100 characters or fewer.";
    }

    if (description.length > 1200) {
      fieldErrors.description = "Description must be 1200 characters or fewer.";
    }

    if (techStack.length > 20) {
      fieldErrors.techStack = "Add up to 20 technologies only.";
    } else if (techStack.some((tech) => tech.length > 40)) {
      fieldErrors.techStack = "Each technology must be 40 characters or fewer.";
    }

    if (links.some((link) => !isValidUrl(link.url))) {
      fieldErrors.link = "Project links must use a valid http:// or https:// URL.";
    }

    if (images.some((image) => !isValidUrl(image))) {
      fieldErrors.images = "Project images must use a valid http:// or https:// URL.";
    }

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        title,
        description,
        techStack,
        links,
        images,
        featured,
        startDate,
        endDate,
        order,
      },
    };
  }

  if (collection === "experience") {
    const role = asTrimmedString(input.role);
    const company = asTrimmedString(input.company);
    const location = asTrimmedString(input.location);
    const startDate = asTrimmedString(input.startDate);
    const endDate = asTrimmedString(input.endDate);
    const current = asBoolean(input.current);
    const description = asStringArray(input.description);
    const technologies = asStringArray(input.technologies);
    const logo = asTrimmedString(input.logo);
    const attachments = asStringArray(input.attachments);
    const links = asLinks(input.links);
    const order = asNumber(input.order);

    if (role.length < 2) {
      fieldErrors.role = "Role must be at least 2 characters.";
    } else if (role.length > 80) {
      fieldErrors.role = "Role must be 80 characters or fewer.";
    }

    if (company.length < 2) {
      fieldErrors.company = "Company must be at least 2 characters.";
    } else if (company.length > 80) {
      fieldErrors.company = "Company must be 80 characters or fewer.";
    }

    if (location.length > 80) {
      fieldErrors.location = "Location must be 80 characters or fewer.";
    }

    if (description.some((item) => item.length > 240)) {
      fieldErrors.description = "Each responsibility must be 240 characters or fewer.";
    }

    if (technologies.length > 20) {
      fieldErrors.technologies = "Add up to 20 technologies only.";
    } else if (technologies.some((item) => item.length > 40)) {
      fieldErrors.technologies = "Each technology must be 40 characters or fewer.";
    }

    if (logo && !isValidUrl(logo)) {
      fieldErrors.logo = "Logo must use a valid http:// or https:// URL.";
    }

    if (attachments.some((item) => !isValidUrl(item))) {
      fieldErrors.attachments = "Attachments must use valid http:// or https:// URLs.";
    }

    if (links.some((link) => !isValidUrl(link.url))) {
      fieldErrors.link = "Links must use valid http:// or https:// URLs.";
    }

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        role,
        company,
        location,
        startDate,
        endDate,
        current,
        description,
        technologies,
        logo,
        attachments,
        links,
        order,
      },
    };
  }

  if (collection === "education") {
    const institution = asTrimmedString(input.institution);
    const degree = asTrimmedString(input.degree);
    const program = asTrimmedString(input.program);
    const status = asTrimmedString(input.status);
    const location = asTrimmedString(input.location);
    const startDate = asTrimmedString(input.startDate);
    const endDate = asTrimmedString(input.endDate);
    const grade = asTrimmedString(input.grade);
    const gradeLabel = asTrimmedString(input.gradeLabel);
    const gradeValue = asTrimmedString(input.gradeValue);
    const coursework = asStringArray(input.coursework);
    const highlights = asStringArray(input.highlights);
    const attachments = asStringArray(input.attachments);
    const order = asNumber(input.order);

    if (institution.length < 2) {
      fieldErrors.institution = "Institution must be at least 2 characters.";
    } else if (institution.length > 120) {
      fieldErrors.institution = "Institution must be 120 characters or fewer.";
    }

    if (degree.length < 2) {
      fieldErrors.degree = "Degree must be at least 2 characters.";
    } else if (degree.length > 120) {
      fieldErrors.degree = "Degree must be 120 characters or fewer.";
    }

    if (program.length > 120) {
      fieldErrors.program = "Program must be 120 characters or fewer.";
    }

    if (status.length > 40) {
      fieldErrors.status = "Status must be 40 characters or fewer.";
    }

    if (location.length > 80) {
      fieldErrors.location = "Location must be 80 characters or fewer.";
    }

    if (grade.length > 40) {
      fieldErrors.grade = "Grade must be 40 characters or fewer.";
    }

    if (gradeLabel.length > 40) {
      fieldErrors.gradeLabel = "Grade label must be 40 characters or fewer.";
    }

    if (gradeValue.length > 40) {
      fieldErrors.gradeValue = "Grade value must be 40 characters or fewer.";
    }

    if (coursework.length > 12) {
      fieldErrors.coursework = "Add up to 12 coursework items.";
    } else if (coursework.some((item) => item.length > 80)) {
      fieldErrors.coursework = "Each coursework item must be 80 characters or fewer.";
    }

    if (highlights.length > 8) {
      fieldErrors.highlights = "Add up to 8 highlights.";
    } else if (highlights.some((item) => item.length > 120)) {
      fieldErrors.highlights = "Each highlight must be 120 characters or fewer.";
    }

    if (attachments.some((item) => !isValidUrl(item))) {
      fieldErrors.attachments = "Attachments must use valid http:// or https:// URLs.";
    } else if (attachments.length > 6) {
      fieldErrors.attachments = "Add up to 6 attachment URLs only.";
    }

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        institution,
        degree,
        program,
        status,
        location,
        startDate,
        endDate,
        grade,
        gradeLabel,
        gradeValue,
        coursework,
        highlights,
        attachments,
        order,
      },
    };
  }

  if (collection === "cpProfile") {
    const platform = asTrimmedString(input.platform);
    const username = asTrimmedString(input.username);
    const headline = asTrimmedString(input.headline);
    const summary = asTrimmedString(input.summary);
    const rating = asNumber(input.rating);
    const maxRating = asNumber(input.maxRating);
    const rank = asTrimmedString(input.rank);
    const solvedCount = asNumber(input.solvedCount);
    const streak = asNumber(input.streak);
    const profileUrl = asTrimmedString(input.profileUrl);
    const badges = asBadges(input.badges);
    const accent = asTrimmedString(input.accent);
    const dataSource = asTrimmedString(input.dataSource) || "manual";
    const order = asNumber(input.order);
    const isVisible = !isProvided(input.isVisible) || asBoolean(input.isVisible);
    const images = asStringArray(input.images);

    if (platform.length < 2) {
      fieldErrors.platform = "Platform must be at least 2 characters.";
    } else if (platform.length > 40) {
      fieldErrors.platform = "Platform must be 40 characters or fewer.";
    }

    if (username.length > 60) {
      fieldErrors.username = "Username must be 60 characters or fewer.";
    }

    if (headline.length > 80) {
      fieldErrors.headline = "Headline must be 80 characters or fewer.";
    }

    if (summary.length > 180) {
      fieldErrors.summary = "Summary must be 180 characters or fewer.";
    }

    if (rank.length > 80) {
      fieldErrors.rank = "Rank must be 80 characters or fewer.";
    }

    if (rating < 0 || maxRating < 0 || solvedCount < 0 || streak < 0) {
      fieldErrors.rating = "Numeric CP metrics must be zero or higher.";
    }

    if (profileUrl && !isValidUrl(profileUrl)) {
      fieldErrors.profileUrl = "Profile URL must use a valid http:// or https:// URL.";
    }

    if (images.some((item) => !isValidUrl(item))) {
      fieldErrors.images = "Images must use valid http:// or https:// URLs.";
    } else if (images.length > 6) {
      fieldErrors.images = "Add up to 6 image URLs only.";
    }

    if (badges.length > 6) {
      fieldErrors.badges = "Add up to 6 badges only.";
    }

    if (!["manual", "imported", "live", "seed"].includes(dataSource)) {
      fieldErrors.dataSource = "Data source must be manual, imported, live, or seed.";
    }

    return {
      success: Object.keys(fieldErrors).length === 0,
      fieldErrors,
      data: {
        platform,
        username,
        headline,
        summary,
        rating,
        maxRating,
        rank,
        solvedCount,
        streak,
        profileUrl,
        badges,
        accent,
        dataSource,
        order,
        isVisible,
        images,
      },
    };
  }

  const title = asTrimmedString(input.title);
  const event = asTrimmedString(input.event);
  const organizer = asTrimmedString(input.organizer);
  const result = asTrimmedString(input.result);
  const date = asTrimmedString(input.date);
  const location = asTrimmedString(input.location);
  const description = asTrimmedString(input.description);
  const techStack = asStringArray(input.techStack);
  const teamSize = asNumber(input.teamSize, 1);
  const featured = asBoolean(input.featured);
  const order = asNumber(input.order);
  const images = asStringArray(input.images);
  const links = asLinks(input.links);

  if (title.length < 3) {
    fieldErrors.title = "Title must be at least 3 characters.";
  } else if (title.length > 100) {
    fieldErrors.title = "Title must be 100 characters or fewer.";
  }

  if (event.length > 100) {
    fieldErrors.event = "Event must be 100 characters or fewer.";
  }

  if (organizer.length > 100) {
    fieldErrors.organizer = "Organizer must be 100 characters or fewer.";
  }

  if (result.length > 80) {
    fieldErrors.result = "Result must be 80 characters or fewer.";
  }

  if (date.length > 40) {
    fieldErrors.date = "Date must be 40 characters or fewer.";
  }

  if (location.length > 80) {
    fieldErrors.location = "Location must be 80 characters or fewer.";
  }

  if (description.length > 500) {
    fieldErrors.description = "Description must be 500 characters or fewer.";
  }

  if (teamSize < 1 || teamSize > 20) {
    fieldErrors.teamSize = "Team size must be between 1 and 20.";
  }

  if (images.some((item) => !isValidUrl(item))) {
    fieldErrors.images = "Images must use valid http:// or https:// URLs.";
  } else if (images.length > 6) {
    fieldErrors.images = "Add up to 6 image URLs only.";
  }

  if (links.length > 4) {
    fieldErrors.link = "Add up to 4 reference links only.";
  } else if (links.some((link) => !isValidUrl(link.url))) {
    fieldErrors.link = "Links must use a valid http:// or https:// URL.";
  }

  if (techStack.length > 16) {
    fieldErrors.techStack = "Add up to 16 technologies only.";
  } else if (techStack.some((item) => item.length > 30)) {
    fieldErrors.techStack = "Each technology must be 30 characters or fewer.";
  }

  return {
    success: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    data: {
      title,
      event,
      organizer,
      result,
      date,
      location,
      description,
      techStack,
      teamSize,
      featured,
      order,
      images,
      links,
    },
  };
}
