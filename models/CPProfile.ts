import { Schema, model, models } from "mongoose";

function isValidHttpUrl(value: string) {
  return /^https?:\/\//.test(value);
}

const CPBadgeSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 40 },
    value: { type: String, trim: true, maxlength: 60, default: "" },
  },
  { _id: false }
);

const CPProfileSchema = new Schema(
  {
    platform: {
      type: String,
      required: [true, "Platform is required."],
      trim: true,
      minlength: [2, "Platform must be at least 2 characters."],
      maxlength: [40, "Platform must be 40 characters or fewer."],
    },
    username: {
      type: String,
      trim: true,
      maxlength: [60, "Username must be 60 characters or fewer."],
      default: "",
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [80, "Headline must be 80 characters or fewer."],
      default: "",
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [180, "Summary must be 180 characters or fewer."],
      default: "",
    },
    rating: { type: Number, default: 0, min: 0 },
    maxRating: { type: Number, default: 0, min: 0 },
    rank: {
      type: String,
      trim: true,
      maxlength: [80, "Rank must be 80 characters or fewer."],
      default: "",
    },
    solvedCount: { type: Number, default: 0, min: 0 },
    streak: { type: Number, default: 0, min: 0 },
    profileUrl: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) => !value || isValidHttpUrl(value),
        message: "Profile URL must use a valid http:// or https:// URL.",
      },
    },
    badges: {
      type: [CPBadgeSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 6,
        message: "Add up to 6 badges only.",
      },
    },
    accent: {
      type: String,
      trim: true,
      maxlength: [80, "Accent must be 80 characters or fewer."],
      default: "from-cyan-300/35 to-sky-500/10",
    },
    dataSource: {
      type: String,
      enum: ["manual", "imported", "live", "seed"],
      default: "manual",
    },
    lastSyncedAt: Date,
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 6 && value.every(isValidHttpUrl),
        message: "Add up to 6 valid image URLs.",
      },
    },
  },
  { timestamps: true }
);

const CPProfile = models.CPProfile || model("CPProfile", CPProfileSchema);
export default CPProfile;
