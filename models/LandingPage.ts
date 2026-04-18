import { Schema, model, models } from "mongoose";

function isValidHref(value: string) {
  return value.startsWith("/") || /^https?:\/\//.test(value) || value.startsWith("mailto:");
}

const HighlightCardSchema = new Schema(
  {
    title: { type: String, trim: true, required: true, maxlength: 60 },
    description: { type: String, trim: true, required: true, maxlength: 180 },
  },
  { _id: false }
);

const HeroSignalSchema = new Schema(
  {
    label: { type: String, trim: true, required: true, maxlength: 28 },
    value: { type: String, trim: true, required: true, maxlength: 80 },
  },
  { _id: false }
);

const FeaturedSectionSchema = new Schema(
  {
    label: { type: String, trim: true, required: true, maxlength: 28 },
    title: { type: String, trim: true, required: true, maxlength: 80 },
    description: { type: String, trim: true, required: true, maxlength: 180 },
    href: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: isValidHref,
        message: "Featured section links must start with /, http://, https://, or mailto:.",
      },
    },
  },
  { _id: false }
);

const HomeSectionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      enum: ["highlights", "projects", "achievements", "explore", "contact"],
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const LandingPageSchema = new Schema(
  {
    singletonKey: {
      type: String,
      unique: true,
      default: "landing-page",
    },
    heroEyebrow: {
      type: String,
      trim: true,
      maxlength: [40, "Hero eyebrow must be 40 characters or fewer."],
      default: "",
    },
    heroTitle: {
      type: String,
      trim: true,
      required: [true, "Hero title is required."],
      maxlength: [140, "Hero title must be 140 characters or fewer."],
    },
    heroSubtitle: {
      type: String,
      trim: true,
      required: [true, "Hero subtitle is required."],
      maxlength: [240, "Hero subtitle must be 240 characters or fewer."],
    },
    heroSummary: {
      type: String,
      trim: true,
      maxlength: [240, "Hero summary must be 240 characters or fewer."],
      default: "",
    },
    heroIntroLines: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (value: string[]) => value.length <= 4,
          message: "Add up to 4 hero intro lines.",
        },
        {
          validator: (value: string[]) =>
            value.every((item) => item.trim().length > 0 && item.trim().length <= 90),
          message: "Each hero intro line must be 1-90 characters long.",
        },
      ],
    },
    heroSignals: {
      type: [HeroSignalSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 4,
        message: "Add up to 4 hero signal items.",
      },
    },
    primaryCtaLabel: {
      type: String,
      trim: true,
      maxlength: [32, "Primary CTA label must be 32 characters or fewer."],
      default: "",
    },
    primaryCtaHref: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) => !value || isValidHref(value),
        message: "Primary CTA link must start with /, http://, https://, or mailto:.",
      },
    },
    secondaryCtaLabel: {
      type: String,
      trim: true,
      maxlength: [32, "Secondary CTA label must be 32 characters or fewer."],
      default: "",
    },
    secondaryCtaHref: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) => !value || isValidHref(value),
        message: "Secondary CTA link must start with /, http://, https://, or mailto:.",
      },
    },
    highlightCards: {
      type: [HighlightCardSchema],
      default: [],
      validate: [
        {
          validator: (value: unknown[]) => value.length <= 4,
          message: "Add up to 4 highlight cards.",
        },
        {
          validator: (value: unknown[]) => value.length >= 2,
          message: "Add at least 2 highlight cards.",
        },
      ],
    },
    projectsEyebrow: {
      type: String,
      trim: true,
      maxlength: [40, "Projects eyebrow must be 40 characters or fewer."],
      default: "",
    },
    projectsTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Projects title must be 100 characters or fewer."],
      default: "",
    },
    projectsDescription: {
      type: String,
      trim: true,
      maxlength: [220, "Projects description must be 220 characters or fewer."],
      default: "",
    },
    maxFeaturedProjects: {
      type: Number,
      default: 3,
      min: [1, "Show at least 1 featured project."],
      max: [6, "Show up to 6 featured projects."],
    },
    achievementsEyebrow: {
      type: String,
      trim: true,
      maxlength: [40, "Achievements eyebrow must be 40 characters or fewer."],
      default: "",
    },
    achievementsTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Achievements title must be 100 characters or fewer."],
      default: "",
    },
    achievementsDescription: {
      type: String,
      trim: true,
      maxlength: [220, "Achievements description must be 220 characters or fewer."],
      default: "",
    },
    maxFeaturedAchievements: {
      type: Number,
      default: 2,
      min: [0, "Featured achievements count cannot be negative."],
      max: [4, "Show up to 4 featured achievements."],
    },
    showAchievementsSection: {
      type: Boolean,
      default: true,
    },
    exploreEyebrow: {
      type: String,
      trim: true,
      maxlength: [40, "Explore eyebrow must be 40 characters or fewer."],
      default: "",
    },
    exploreTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Explore title must be 100 characters or fewer."],
      default: "",
    },
    exploreDescription: {
      type: String,
      trim: true,
      maxlength: [220, "Explore description must be 220 characters or fewer."],
      default: "",
    },
    featuredSections: {
      type: [FeaturedSectionSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 6,
        message: "Add up to 6 featured navigation sections.",
      },
    },
    homeSections: {
      type: [HomeSectionSchema],
      default: () => [
        { id: "highlights", enabled: true },
        { id: "projects", enabled: true },
        { id: "achievements", enabled: true },
        { id: "explore", enabled: true },
        { id: "contact", enabled: true },
      ],
      validate: [
        {
          validator: (value: unknown[]) => value.length > 0 && value.length <= 5,
          message: "Add between 1 and 5 home sections.",
        },
        {
          validator: (value: Array<{ id?: string }>) => {
            const ids = value.map((item) => item?.id).filter(Boolean);
            return new Set(ids).size === ids.length;
          },
          message: "Home sections must use unique section IDs.",
        },
      ],
    },
    contactEyebrow: {
      type: String,
      trim: true,
      maxlength: [40, "Contact eyebrow must be 40 characters or fewer."],
      default: "",
    },
    contactTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Contact title must be 100 characters or fewer."],
      default: "",
    },
    contactDescription: {
      type: String,
      trim: true,
      maxlength: [220, "Contact description must be 220 characters or fewer."],
      default: "",
    },
  },
  { timestamps: true }
);

const LandingPage = models.LandingPage || model("LandingPage", LandingPageSchema);

export default LandingPage;
