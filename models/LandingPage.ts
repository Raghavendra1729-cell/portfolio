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
