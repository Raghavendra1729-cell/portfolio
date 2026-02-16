import mongoose, { Schema, model, models } from 'mongoose';

const ExperienceSchema = new Schema({
  role: { type: String, required: true }, // e.g. SDE Intern
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  current: { type: Boolean, default: false }, // "I currently work here"
  
  description: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
  
  // Logos / Certificates / Offer Letters
  logo: String,
  attachments: { type: [String], default: [] },
  
  links: [{ name: String, url: String }]
}, { timestamps: true });

const Experience = models.Experience || model('Experience', ExperienceSchema);
export default Experience;