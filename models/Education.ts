import { Schema, model, models } from "mongoose";

function isValidHttpUrl(value: string) {
  return /^https?:\/\//.test(value);
}

const EducationSchema = new Schema(
  {
    institution: {
      type: String,
      required: [true, "Institution is required."],
      trim: true,
      maxlength: [120, "Institution must be 120 characters or fewer."],
    },
    degree: {
      type: String,
      required: [true, "Degree is required."],
      trim: true,
      maxlength: [120, "Degree must be 120 characters or fewer."],
    },
    program: {
      type: String,
      trim: true,
      maxlength: [120, "Program must be 120 characters or fewer."],
      default: "",
    },
    status: {
      type: String,
      trim: true,
      maxlength: [40, "Status must be 40 characters or fewer."],
      default: "",
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
    grade: {
      type: String,
      trim: true,
      maxlength: [40, "Grade must be 40 characters or fewer."],
      default: "",
    },
    gradeLabel: {
      type: String,
      trim: true,
      maxlength: [40, "Grade label must be 40 characters or fewer."],
      default: "",
    },
    gradeValue: {
      type: String,
      trim: true,
      maxlength: [40, "Grade value must be 40 characters or fewer."],
      default: "",
    },
    coursework: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (value: string[]) => value.length <= 12,
          message: "Add up to 12 coursework items.",
        },
        {
          validator: (value: string[]) => value.every((item) => item.trim().length > 0 && item.trim().length <= 80),
          message: "Each coursework item must be 1-80 characters long.",
        },
      ],
    },
    highlights: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (value: string[]) => value.length <= 8,
          message: "Add up to 8 highlights.",
        },
        {
          validator: (value: string[]) => value.every((item) => item.trim().length > 0 && item.trim().length <= 120),
          message: "Each highlight must be 1-120 characters long.",
        },
      ],
    },
    attachments: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 6 && value.every(isValidHttpUrl),
        message: "Add up to 6 valid attachment URLs.",
      },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Education = models.Education || model("Education", EducationSchema);
export default Education;
