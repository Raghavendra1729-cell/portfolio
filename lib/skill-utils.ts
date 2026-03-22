import { type SkillRecord } from "@/lib/data";

export type SkillProfile = {
  category: string;
  item: string;
  proficiency: number;
  focusSignal: string;
};

export type HeroSkillSignal = {
  label: string;
  detail: string;
  active: number;
  tone: "cyan" | "fuchsia" | "emerald";
};

function clampProficiency(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getItemProficiency(skill: SkillRecord, item: string) {
  return clampProficiency(skill.proficiency?.[item] ?? 0);
}

export function getCategoryAverageProficiency(skill: SkillRecord) {
  if (skill.items.length === 0) {
    return 0;
  }

  const total = skill.items.reduce((sum, item) => sum + getItemProficiency(skill, item), 0);
  return Math.round(total / skill.items.length);
}

export function getSkillProfiles(skills: SkillRecord[]) {
  return skills
    .flatMap((skill) =>
      skill.items.map((item) => ({
        category: skill.category,
        item,
        proficiency: getItemProficiency(skill, item),
        focusSignal: skill.focusSignals?.[item] || "",
      }))
    )
    .sort((left, right) => {
      if (right.proficiency !== left.proficiency) {
        return right.proficiency - left.proficiency;
      }

      return left.item.localeCompare(right.item);
    });
}

export function getTopSkillProfiles(skills: SkillRecord[], count = 3) {
  return getSkillProfiles(skills).slice(0, count);
}

function getSignalDetail(skill: SkillRecord) {
  const profiles = skill.items
    .map((item) => ({
      item,
      proficiency: getItemProficiency(skill, item),
      focusSignal: skill.focusSignals?.[item] || "",
    }))
    .sort((left, right) => right.proficiency - left.proficiency);

  const strongestFocusSignal = profiles.find((profile) => profile.focusSignal.trim())?.focusSignal.trim();

  if (strongestFocusSignal) {
    return strongestFocusSignal;
  }

  const topItems = profiles
    .filter((profile) => profile.item.trim())
    .slice(0, 3)
    .map((profile) => profile.item);

  if (topItems.length > 0) {
    return topItems.join(", ");
  }

  return "Add items and focus signals to shape this strip.";
}

export function getHeroSkillSignals(skills: SkillRecord[], count?: number): HeroSkillSignal[] {
  const tones: HeroSkillSignal["tone"][] = ["cyan", "fuchsia", "emerald"];
  const visibleSkills = skills.filter((skill) => skill.category.trim() && skill.items.length > 0);

  return visibleSkills
    .slice(0, typeof count === "number" ? count : visibleSkills.length)
    .map((skill, index) => ({
      label: skill.category,
      detail: getSignalDetail(skill),
      active: Math.max(0, Math.min(10, Math.round(getCategoryAverageProficiency(skill) / 10))),
      tone: tones[index % tones.length],
    }));
}
