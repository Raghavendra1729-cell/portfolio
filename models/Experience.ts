import { Schema, model, models } from "mongoose";

function isValidHttpUrl(value: string) {
  return /^https?:\/\//.test(value);
}

const ExperienceLinkSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [40, "Link labels must be 40 characters or fewer."],
      default: "Reference",
    },
    url: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: isValidHttpUrl,
        message: "Links must use a valid http:// or https:// URL.",
      },
    },
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required."],
      trim: true,
      minlength: [2, "Role must be at least 2 characters."],
      maxlength: [80, "Role must be 80 characters or fewer."],
    },
    company: {
      type: String,
      required: [true, "Company is required."],
      trim: true,
      minlength: [2, "Company must be at least 2 characters."],
      maxlength: [80, "Company must be 80 characters or fewer."],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [80, "Location must be 80 characters or fewer."],
      default: "",
    },
    startDate: {
      type: String,
      trim: true,
      maxlength: [40, "Start date must be 40 characters or fewer."],
      default: "",
    },
    endDate: {
      type: String,
      trim: true,
      maxlength: [40, "End date must be 40 characters or fewer."],
      default: "",
    },
    current: { type: Boolean, default: false },
    description: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.every((item) => item.trim().length > 0 && item.trim().length <= 240),
        message: "Each responsibility must be 1-240 characters long.",
      },
    },
    technologies: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 20 && value.every((item) => item.trim().length > 0 && item.trim().length <= 40),
        message: "Add up to 20 valid technologies.",
      },
    },
    logo: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) => !value || isValidHttpUrl(value),
        message: "Logo must use a valid http:// or https:// URL.",
      },
    },
    attachments: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 6 && value.every(isValidHttpUrl),
        message: "Add up to 6 valid attachment URLs.",
      },
    },
    links: {
      type: [ExperienceLinkSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 4,
        message: "Add up to 4 links.",
      },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Experience = models.Experience || model("Experience", ExperienceSchema);
export default Experience;
