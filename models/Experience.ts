import { Schema, model, models } from 'mongoose';

export interface ExperienceHighlight {
  title: string;
  details: string[];
}

export interface ExperienceLink {
  name: string;
  url: string;
}

const ExperienceHighlightSchema = new Schema<ExperienceHighlight>(
  {
    title: { type: String, required: true },
    details: { type: [String], default: [] },
  },
  { _id: false }
);

const ExperienceLinkSchema = new Schema<ExperienceLink>(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    current: { type: Boolean, default: false },

    description: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    leadership: { type: [ExperienceHighlightSchema], default: [] },
    mentorship: { type: [ExperienceHighlightSchema], default: [] },

    // Logos / Certificates / Offer Letters
    logo: String,
    attachments: { type: [String], default: [] },

    links: { type: [ExperienceLinkSchema], default: [] },
    link: String,
  },
  { timestamps: true }
);

const Experience = models.Experience || model('Experience', ExperienceSchema);
export default Experience;
