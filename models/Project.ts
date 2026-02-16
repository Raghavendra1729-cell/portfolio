import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String }, 
  techStack: { type: [String], default: [] },
  
  // Flexible Links (GitHub, Demo, Video)
  links: [{
    name: String,
    url: String
  }],

  // Gallery (Screenshots)
  images: { type: [String], default: [] },
  
  featured: { type: Boolean, default: false },
  startDate: String,
  endDate: String
}, { timestamps: true });

const Project = models.Project || model('Project', ProjectSchema);
export default Project;