import { Schema, model, models } from "mongoose";

function isValidHttpUrl(value: string) {
  return /^https?:\/\//.test(value);
}

const HackathonLinkSchema = new Schema(
  {
    name: { type: String, trim: true, maxlength: 40, default: "Reference" },
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

const HackathonSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [3, "Title must be at least 3 characters."],
      maxlength: [100, "Title must be 100 characters or fewer."],
    },
    event: {
      type: String,
      trim: true,
      maxlength: [100, "Event must be 100 characters or fewer."],
      default: "",
    },
    organizer: {
      type: String,
      trim: true,
      maxlength: [100, "Organizer must be 100 characters or fewer."],
      default: "",
    },
    result: {
      type: String,
      trim: true,
      maxlength: [80, "Result must be 80 characters or fewer."],
      default: "",
    },
    date: {
      type: String,
      trim: true,
      maxlength: [40, "Date must be 40 characters or fewer."],
      default: "",
    },
    location: {
      type: String,
      trim: true,
      maxlength: [80, "Location must be 80 characters or fewer."],
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be 500 characters or fewer."],
      default: "",
    },
    techStack: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (value: string[]) => value.length <= 16,
          message: "Add up to 16 technologies.",
        },
        {
          validator: (value: string[]) => value.every((item) => item.trim().length > 0 && item.trim().length <= 30),
          message: "Each technology must be 1-30 characters long.",
        },
      ],
    },
    teamSize: { type: Number, default: 1, min: 1, max: 20 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 6 && value.every(isValidHttpUrl),
        message: "Add up to 6 valid image URLs.",
      },
    },
    links: {
      type: [HackathonLinkSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 4,
        message: "Add up to 4 reference links.",
      },
    },
  },
  { timestamps: true }
);

const Hackathon = models.Hackathon || model("Hackathon", HackathonSchema);

export default Hackathon;
