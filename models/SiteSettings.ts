import { Schema, model, models } from "mongoose";

function isValidExternalUrl(value: string) {
  return /^https?:\/\//.test(value);
}

function isValidLink(value: string) {
  return /^(https?:\/\/|mailto:)/.test(value);
}

const PageIntroSchema = new Schema(
  {
    eyebrow: { type: String, trim: true, maxlength: 40, default: "" },
    title: { type: String, trim: true, maxlength: 90, default: "" },
    description: { type: String, trim: true, maxlength: 240, default: "" },
  },
  { _id: false }
);

const ResumeAlternateLinkSchema = new Schema(
  {
    label: { type: String, trim: true, required: true, maxlength: 40 },
    href: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: isValidExternalUrl,
        message: "Resume links must use a valid http:// or https:// URL.",
      },
    },
  },
  { _id: false }
);

const SocialLinkSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["email", "github", "linkedin", "website", "other"],
      default: "other",
    },
    label: { type: String, trim: true, required: true, maxlength: 32 },
    value: { type: String, trim: true, maxlength: 120, default: "" },
    href: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: isValidLink,
        message: "Social links must use a valid http://, https://, or mailto: URL.",
      },
    },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema(
  {
    singletonKey: {
      type: String,
      unique: true,
      default: "site-settings",
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
      maxlength: [60, "Name must be 60 characters or fewer."],
    },
    role: {
      type: String,
      trim: true,
      required: [true, "Role is required."],
      maxlength: [80, "Role must be 80 characters or fewer."],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [80, "Location must be 80 characters or fewer."],
      default: "",
    },
    availability: {
      type: String,
      trim: true,
      maxlength: [180, "Availability must be 180 characters or fewer."],
      default: "",
    },
    profileBadge: {
      type: String,
      trim: true,
      maxlength: [80, "Profile badge must be 80 characters or fewer."],
      default: "",
    },
    profileImage: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) => !value || isValidExternalUrl(value),
        message: "Profile image must use a valid http:// or https:// URL.",
      },
    },
    profileImageAlt: {
      type: String,
      trim: true,
      maxlength: [120, "Profile image alt text must be 120 characters or fewer."],
      default: "",
    },
    footerBlurb: {
      type: String,
      trim: true,
      maxlength: [240, "Footer blurb must be 240 characters or fewer."],
      default: "",
    },
    aboutParagraphs: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (value: string[]) => value.length <= 6,
          message: "Add up to 6 about paragraphs.",
        },
        {
          validator: (value: string[]) =>
            value.every((item) => item.trim().length > 0 && item.trim().length <= 320),
          message: "Each about paragraph must be 1-320 characters long.",
        },
      ],
    },
    primaryResumeLabel: {
      type: String,
      trim: true,
      maxlength: [40, "Resume label must be 40 characters or fewer."],
      default: "Resume",
    },
    primaryResumeViewHref: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) => !value || isValidExternalUrl(value),
        message: "Primary resume view link must use a valid http:// or https:// URL.",
      },
    },
    primaryResumeDownloadHref: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) => !value || isValidExternalUrl(value),
        message: "Primary resume download link must use a valid http:// or https:// URL.",
      },
    },
    alternateResumeLinks: {
      type: [ResumeAlternateLinkSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 4,
        message: "Add up to 4 alternate resume links.",
      },
    },
    socialLinks: {
      type: [SocialLinkSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 8,
        message: "Add up to 8 social links.",
      },
    },
    pageIntro: {
      about: { type: PageIntroSchema, default: () => ({}) },
      projects: { type: PageIntroSchema, default: () => ({}) },
      experience: { type: PageIntroSchema, default: () => ({}) },
      skills: { type: PageIntroSchema, default: () => ({}) },
      achievements: { type: PageIntroSchema, default: () => ({}) },
      contact: { type: PageIntroSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
