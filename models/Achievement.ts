import { Schema, model, models } from "mongoose";

const AchievementLinkSchema = new Schema(
  {
    name: { type: String, trim: true, maxlength: 40, default: "Reference" },
    url: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (value: string) => /^https?:\/\//.test(value),
        message: "Links must use a valid http:// or https:// URL.",
      },
    },
  },
  { _id: false }
);

const AchievementSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [3, "Title must be at least 3 characters."],
      maxlength: [80, "Title must be 80 characters or fewer."],
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [80, "Organization must be 80 characters or fewer."],
      default: "",
    },
    date: {
      type: String,
      trim: true,
      maxlength: [40, "Date must be 40 characters or fewer."],
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: [20, "Description should be at least 20 characters."],
      maxlength: [500, "Description must be 500 characters or fewer."],
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 6 && value.every((item) => /^https?:\/\//.test(item)),
        message: "Add up to 6 valid image URLs.",
      },
    },
    links: {
      type: [AchievementLinkSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 3,
        message: "Add up to 3 reference links.",
      },
    },
  },
  { timestamps: true }
);

const Achievement = models.Achievement || model("Achievement", AchievementSchema);
export default Achievement;
