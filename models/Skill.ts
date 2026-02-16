import mongoose, { Schema, model, models } from 'mongoose';

const SkillSchema = new Schema({
  // e.g. "Frontend", "Backend", "DevOps"
  category: { 
    type: String, 
    required: true,
    unique: true // Prevents having two "Frontend" sections
  }, 
  
  // e.g. ["React", "Next.js", "Tailwind CSS", "TypeScript"]
  items: { 
    type: [String], 
    required: true 
  }
}, { timestamps: true });

// Prevent recompilation of model in development
const Skill = models.Skill || model('Skill', SkillSchema);

export default Skill;