import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Skill from "@/models/Skill";
import Achievement from "@/models/Achievement";

type QueryableModel = {
  find: (query: Record<string, never>) => {
    sort: (sort: Record<string, 1 | -1>) => Promise<unknown[]>;
  };
};

const MODELS: Record<string, QueryableModel> = {
  project: Project,
  experience: Experience,
  education: Education,
  skill: Skill,
  achievement: Achievement,
};

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection");
  const Model = MODELS[collection?.toLowerCase() || ""];

  if (!Model) {
    return NextResponse.json({ success: false, message: "Invalid or missing collection" }, { status: 400 });
  }

  try {
    const data = await Model.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch data.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
