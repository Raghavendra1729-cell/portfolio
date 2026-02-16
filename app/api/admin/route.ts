import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

// Import ALL your models
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Skill from '@/models/Skill';
import Achievement from '@/models/Achievement';
import CPProfile from '@/models/CPProfile';

// Map "slugs" to actual Database Models
const MODELS: Record<string, any> = {
  project: Project,
  experience: Experience,
  education: Education,
  skill: Skill,
  achievement: Achievement,
  cpprofile: CPProfile,
};

// HELPER: Security Check
function isAuthorized(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}

// HELPER: Get Model from String
function getModel(collection: string | null) {
  if (!collection || !MODELS[collection.toLowerCase()]) return null;
  return MODELS[collection.toLowerCase()];
}

// ------------------------------------------------------------------
// 1. POST: CREATE NEW ITEM
// Usage: POST /api/admin
// Body: { "collection": "project", "data": { "title": "New App" } }
// ------------------------------------------------------------------
export async function POST(req: NextRequest) {
  await dbConnect();
  if (!isAuthorized(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { collection, data } = body;

    const Model = getModel(collection);
    if (!Model) return NextResponse.json({ message: 'Invalid collection' }, { status: 400 });

    const newItem = await Model.create(data);
    
    // Refresh the website cache so changes show up immediately
    revalidatePath('/', 'layout'); 
    
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ------------------------------------------------------------------
// 2. PUT: UPDATE EXISTING ITEM
// Usage: PUT /api/admin
// Body: { "collection": "project", "id": "65d...", "data": { "title": "Updated" } }
// ------------------------------------------------------------------
export async function PUT(req: NextRequest) {
  await dbConnect();
  if (!isAuthorized(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { collection, id, data } = body;

    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    const Model = getModel(collection);
    if (!Model) return NextResponse.json({ message: 'Invalid collection' }, { status: 400 });

    const updatedItem = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: false });
    
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ------------------------------------------------------------------
// 3. DELETE: REMOVE ITEM
// Usage: DELETE /api/admin?collection=project&id=65d...
// ------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  await dbConnect();
  if (!isAuthorized(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get('collection');
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

  const Model = getModel(collection);
  if (!Model) return NextResponse.json({ message: 'Invalid collection' }, { status: 400 });

  try {
    await Model.findByIdAndDelete(id);
    
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}