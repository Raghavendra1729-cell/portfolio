import { Schema, model, models } from "mongoose";
import { decodeSkillMapKey } from "@/lib/skill-map";

function getMapEntries<T>(value: Map<string, T> | Record<string, T> | undefined) {
  if (!value) {
    return [] as Array<[string, T]>;
  }

  return value instanceof Map ? Array.from(value.entries()) : Object.entries(value);
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

const SkillSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required."],
      unique: true,
      trim: true,
      minlength: [2, "Category must be at least 2 characters."],
      maxlength: [40, "Category must be 40 characters or fewer."],
    },
    items: {
      type: [String],
      required: [true, "Add at least one skill item."],
      default: [],
      validate: [
        {
          validator: (value: string[]) => value.length > 0 && value.length <= 16,
          message: "Keep each category to 1-16 skill items.",
        },
        {
          validator: (value: string[]) => value.every((item) => item.trim().length > 0 && item.trim().length <= 30),
          message: "Each skill item must be 1-30 characters long.",
        },
        {
          validator: (value: string[]) => new Set(value.map((item) => item.trim().toLowerCase())).size === value.length,
          message: "Duplicate skill items are not allowed.",
        },
      ],
    },
    proficiency: {
      type: Map,
      of: Number,
      default: {},
      validate: [
        {
          validator: (value: Map<string, number> | Record<string, number>) => {
            const entries = value instanceof Map ? Array.from(value.values()) : Object.values(value || {});
            return entries.every((item) => Number.isFinite(item) && item >= 0 && item <= 100);
          },
          message: "Skill proficiency values must be between 0 and 100.",
        },
        {
          validator: function (
            this: { items?: string[] },
            value: Map<string, number> | Record<string, number>
          ) {
            const itemKeys = new Set((this.items || []).map(normalizeKey));
            return getMapEntries(value).every(([key]) =>
              itemKeys.has(normalizeKey(decodeSkillMapKey(key)))
            );
          },
          message: "Proficiency values must map to existing skill items.",
        },
      ],
    },
    focusSignals: {
      type: Map,
      of: String,
      default: {},
      validate: [
        {
          validator: (value: Map<string, string> | Record<string, string>) => {
            const entries = value instanceof Map ? Array.from(value.values()) : Object.values(value || {});
            return entries.every((item) => item.trim().length <= 40);
          },
          message: "Focus signals must be 40 characters or fewer.",
        },
        {
          validator: function (
            this: { items?: string[] },
            value: Map<string, string> | Record<string, string>
          ) {
            const itemKeys = new Set((this.items || []).map(normalizeKey));
            return getMapEntries(value).every(([key]) =>
              itemKeys.has(normalizeKey(decodeSkillMapKey(key)))
            );
          },
          message: "Focus signals must map to existing skill items.",
        },
      ],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Skill = models.Skill || model("Skill", SkillSchema);

export default Skill;
