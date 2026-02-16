import { NextRequest, NextResponse } from 'next/server';
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

// ------------------------------------------------------------------
// GET: FETCH DATA
// Usage: GET /api/data?collection=project
// ------------------------------------------------------------------
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get('collection');

  const Model = MODELS[collection?.toLowerCase() || ''];

  if (!Model) {
    return NextResponse.json({ success: false, message: 'Invalid or missing collection' }, { status: 400 });
  }

  try {
    // Return all items, sorted by newest first
    const data = await Model.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}