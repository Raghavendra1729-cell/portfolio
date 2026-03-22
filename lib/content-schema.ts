export const ADMIN_COLLECTIONS = [
  { id: "achievement", label: "Achievements" },
  { id: "skill", label: "Skills" },
] as const;

export type AdminCollectionId = (typeof ADMIN_COLLECTIONS)[number]["id"];

export const REQUIRED_FIELDS: Record<AdminCollectionId, string[]> = {
  achievement: ["title", "description"],
  skill: ["category", "items"],
};

type ValidationResult = {
  success: boolean;
  data: Record<string, unknown>;
  fieldErrors: Record<string, string>;
};

type ContentLink = {
  name: string;
  url: string;
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

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSupportedAdminCollection(collection: string | null | undefined): collection is AdminCollectionId {
  return ADMIN_COLLECTIONS.some((item) => item.id === collection);
}

export function validateContentData(collection: AdminCollectionId, input: Record<string, unknown>): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (collection === "achievement") {
    const title = asTrimmedString(input.title);
    const organization = asTrimmedString(input.organization);
    const date = asTrimmedString(input.date);
    const description = asTrimmedString(input.description);
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
        images,
        links,
      },
    };
  }

  const category = asTrimmedString(input.category);
  const items = asStringArray(input.items);

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

  return {
    success: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    data: {
      category,
      items,
    },
  };
}
