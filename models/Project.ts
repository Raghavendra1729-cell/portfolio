import { Schema, model, models } from "mongoose";

function isValidHttpUrl(value: string) {
  return /^https?:\/\//.test(value);
}

const ProjectLinkSchema = new Schema(
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
        message: "Project links must use a valid http:// or https:// URL.",
      },
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required."],
      trim: true,
      minlength: [3, "Project title must be at least 3 characters."],
      maxlength: [100, "Project title must be 100 characters or fewer."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1200, "Description must be 1200 characters or fewer."],
      default: "",
    },
    techStack: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (value: string[]) => value.length <= 20,
          message: "Add up to 20 technologies only.",
        },
        {
          validator: (value: string[]) => value.every((item) => item.trim().length > 0 && item.trim().length <= 40),
          message: "Each technology must be 1-40 characters long.",
        },
      ],
    },
    links: {
      type: [ProjectLinkSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 5,
        message: "Add up to 5 project links.",
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 8 && value.every(isValidHttpUrl),
        message: "Add up to 8 valid image URLs.",
      },
    },
    featured: { type: Boolean, default: false },
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
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
