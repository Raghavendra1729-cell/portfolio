import { Schema, model, models } from 'mongoose';

const RatingPointSchema = new Schema(
  {
    label: { type: String, trim: true },
    date: Date,
    rating: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ProblemCountsSchema = new Schema(
  {
    total: { type: Number, default: 0, min: 0 },
    easy: { type: Number, default: 0, min: 0 },
    medium: { type: Number, default: 0, min: 0 },
    hard: { type: Number, default: 0, min: 0 },
    contest: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const TopicBreakdownSchema = new Schema(
  {
    topic: { type: String, required: true, trim: true },
    count: { type: Number, default: 0, min: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const LanguageStatSchema = new Schema(
  {
    language: { type: String, required: true, trim: true },
    problemsSolved: { type: Number, default: 0, min: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const CPProfileSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true },
    username: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0 },
    maxRating: { type: Number, default: 0, min: 0 },
    rank: { type: String, trim: true },
    solvedCount: { type: Number, default: 0, min: 0 },
    profileUrl: { type: String, trim: true },
    ratingHistory: { type: [RatingPointSchema], default: [] },
    problemCounts: { type: ProblemCountsSchema, default: () => ({}) },
    topicBreakdown: { type: [TopicBreakdownSchema], default: [] },
    languageStats: { type: [LanguageStatSchema], default: [] },
    dataSource: {
      type: String,
      enum: ['seed', 'manual', 'cached', 'live'],
      default: 'manual',
    },
    lastSyncedAt: Date,
    fallbackEnabled: { type: Boolean, default: false },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

const CPProfile = models.CPProfile || model('CPProfile', CPProfileSchema);
export default CPProfile;
