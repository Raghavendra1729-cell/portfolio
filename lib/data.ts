import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Skill from '@/models/Skill';
import Achievement from '@/models/Achievement';
import CPProfile from '@/models/CPProfile';

const MODELS: Record<string, any> = {
  project: Project,
  experience: Experience,
  education: Education,
  skill: Skill,
  achievement: Achievement,
  cpprofile: CPProfile,
};

export async function getData(collection: string) {
  await dbConnect();

  const Model = MODELS[collection.toLowerCase()];
  if (!Model) return [];

  const data = await Model.find({}).sort({ createdAt: -1 }).lean();

  // Bullet-proof serialization: JSON round-trip strips all BSON types
  return JSON.parse(JSON.stringify(data));
}