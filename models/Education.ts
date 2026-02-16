import mongoose, { Schema, model, models } from 'mongoose';

const EducationSchema = new Schema({
  degree: { type: String, required: true }, // e.g. B.Tech CS
  institution: { type: String, required: true }, // e.g. BITS Pilani
  startDate: String,
  endDate: String,
  
  grade: String, // e.g. "9.2 CGPA"
  coursework: { type: [String], default: [] },
  
  // Transcripts / Degree Cert
  attachments: { type: [String], default: [] }
}, { timestamps: true });

const Education = models.Education || model('Education', EducationSchema);
export default Education;