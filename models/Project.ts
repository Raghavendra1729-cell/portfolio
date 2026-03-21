import { Schema, model, models } from 'mongoose';

export interface ProjectLink {
  name: string;
  url: string;
}

export interface ArchitectureDiagram {
  title: string;
  description?: string;
  imageUrl?: string;
  caption?: string;
}

export interface TechStackCategory {
  category: string;
  summary?: string;
  items: string[];
}

export interface KeyChallenge {
  title: string;
  problem: string;
  solution?: string;
  outcome?: string;
  bullets?: string[];
}

export interface TechnicalSection {
  title: string;
  type?: 'overview' | 'system-design' | 'implementation' | 'code' | 'bullets';
  content?: string;
  bullets?: string[];
  code?: string;
  language?: string;
}

const ProjectLinkSchema = new Schema<ProjectLink>(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const ArchitectureDiagramSchema = new Schema<ArchitectureDiagram>(
  {
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    caption: String,
  },
  { _id: false }
);

const TechStackCategorySchema = new Schema<TechStackCategory>(
  {
    category: { type: String, required: true },
    summary: String,
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const KeyChallengeSchema = new Schema<KeyChallenge>(
  {
    title: { type: String, required: true },
    problem: { type: String, required: true },
    solution: String,
    outcome: String,
    bullets: { type: [String], default: [] },
  },
  { _id: false }
);

const TechnicalSectionSchema = new Schema<TechnicalSection>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['overview', 'system-design', 'implementation', 'code', 'bullets'],
      default: 'overview',
    },
    content: String,
    bullets: { type: [String], default: [] },
    code: String,
    language: String,
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    techStack: { type: [String], default: [] },

    // Flexible links (GitHub, Demo, Video)
    links: { type: [ProjectLinkSchema], default: [] },
    link: String,
    repo: String,

    // Gallery (Screenshots)
    images: { type: [String], default: [] },

    architectureDiagrams: { type: [ArchitectureDiagramSchema], default: [] },
    techStackBreakdown: { type: [TechStackCategorySchema], default: [] },
    keyChallenges: { type: [KeyChallengeSchema], default: [] },
    technicalSections: { type: [TechnicalSectionSchema], default: [] },
    systemDesign: String,

    featured: { type: Boolean, default: false },
    startDate: String,
    endDate: String,
  },
  { timestamps: true }
);

const Project = models.Project || model('Project', ProjectSchema);
export default Project;
