import mongoose, { Schema, model, models } from 'mongoose';

const CPProfileSchema = new Schema({
  platform: { type: String, required: true }, // LeetCode, Codeforces
  username: String,
  rating: Number,
  maxRating: Number,
  rank: String,      // e.g. "Guardian"
  solvedCount: Number,
  profileUrl: String,
  
  // Graphs / Profile Screenshots
  images: { type: [String], default: [] }
}, { timestamps: true });

const CPProfile = models.CPProfile || model('CPProfile', CPProfileSchema);
export default CPProfile;