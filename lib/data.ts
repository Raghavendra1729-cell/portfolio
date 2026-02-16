import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Skill from '@/models/Skill';
import Achievement from '@/models/Achievement';
import CPProfile from '@/models/CPProfile';

// Map for easy access
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

  // Fetch data and convert to plain JSON (Next.js needs this)
  const data = await Model.find({}).sort({ createdAt: -1 }).lean();
  
  // Convert _id and dates to strings to avoid serialization warnings
  return data.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt?.toString(),
    updatedAt: item.updatedAt?.toString(),
  }));
}