import mongoose, { Schema, model, models } from 'mongoose';

const AchievementSchema = new Schema({
  title: { type: String, required: true }, // e.g. Hackathon Winner
  organization: String,
  date: String,
  description: String,
  
  // Photos of award / Certificate
  images: { type: [String], default: [] },
  
  links: [{ name: String, url: String }]
}, { timestamps: true });

const Achievement = models.Achievement || model('Achievement', AchievementSchema);
export default Achievement;