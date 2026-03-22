import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Skill from "@/models/Skill";
import Achievement from "@/models/Achievement";

type LeanModel = {
  find: (query: Record<string, never>) => {
    sort: (sort: Record<string, 1 | -1>) => {
      lean: () => Promise<unknown[]>;
    };
  };
};

const MODELS: Record<string, LeanModel> = {
  project: Project,
  experience: Experience,
  education: Education,
  skill: Skill,
  achievement: Achievement,
};

export async function getData(collection: string) {
  await dbConnect();

  const Model = MODELS[collection.toLowerCase()];
  if (!Model) return [];

  const data = await Model.find({}).sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(data));
}
