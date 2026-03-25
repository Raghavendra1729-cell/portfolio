const SKILL_MAP_KEY_PREFIX = "skill__";

export function encodeSkillMapKey(value: string) {
  return `${SKILL_MAP_KEY_PREFIX}${Buffer.from(value, "utf8").toString("base64url")}`;
}

export function decodeSkillMapKey(value: string) {
  if (!value.startsWith(SKILL_MAP_KEY_PREFIX)) {
    return value;
  }

  const encoded = value.slice(SKILL_MAP_KEY_PREFIX.length);

  try {
    return Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return value;
  }
}

export function encodeSkillMap<T>(value: Record<string, T> | undefined | null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, T>;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [encodeSkillMapKey(key), item])
  );
}

export function decodeSkillMap<T>(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, T>;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [decodeSkillMapKey(key), item as T])
  );
}
