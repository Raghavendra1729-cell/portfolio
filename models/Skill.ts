import { Schema, model, models } from "mongoose";

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
  },
  { timestamps: true }
);

const Skill = models.Skill || model("Skill", SkillSchema);

export default Skill;
