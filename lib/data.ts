import { unstable_cache } from 'next/cache';
import type { Model } from 'mongoose';
import { z } from 'zod';

import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Skill from '@/models/Skill';
import Achievement from '@/models/Achievement';
import CPProfile from '@/models/CPProfile';

const collectionSchema = z.enum([
  'project',
  'experience',
  'education',
  'skill',
  'achievement',
  'cpprofile',
]);

type CollectionName = z.infer<typeof collectionSchema>;
type LeanDocument = Record<string, unknown>;

const DATA_REVALIDATE_SECONDS = 60 * 60;

const MODELS: Record<CollectionName, Model<unknown>> = {
  achievement: Achievement,
  cpprofile: CPProfile,
  education: Education,
  experience: Experience,
  project: Project,
  skill: Skill,
};

interface DataCacheState {
  payloads: Partial<Record<CollectionName, LeanDocument[]>>;
}

declare global {
  var portfolioDataCache: DataCacheState | undefined;
}

const fallbackCache = global.portfolioDataCache ?? (global.portfolioDataCache = { payloads: {} });

function normalizeCollection(collection: string) {
  return collectionSchema.parse(collection.trim().toLowerCase());
}

async function loadCollection(collection: CollectionName) {
  await dbConnect();

  const Model = MODELS[collection];
  const data = await Model.find({}).sort({ createdAt: -1 }).lean().exec();
  const serialized = JSON.parse(JSON.stringify(data)) as LeanDocument[];

  fallbackCache.payloads[collection] = serialized;

  return serialized;
}

const collectionLoaders: Record<CollectionName, () => Promise<LeanDocument[]>> = {
  achievement: unstable_cache(() => loadCollection('achievement'), ['portfolio-data', 'achievement'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ['portfolio-data', 'portfolio-data-achievement'],
  }),
  cpprofile: unstable_cache(() => loadCollection('cpprofile'), ['portfolio-data', 'cpprofile'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ['portfolio-data', 'portfolio-data-cpprofile'],
  }),
  education: unstable_cache(() => loadCollection('education'), ['portfolio-data', 'education'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ['portfolio-data', 'portfolio-data-education'],
  }),
  experience: unstable_cache(() => loadCollection('experience'), ['portfolio-data', 'experience'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ['portfolio-data', 'portfolio-data-experience'],
  }),
  project: unstable_cache(() => loadCollection('project'), ['portfolio-data', 'project'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ['portfolio-data', 'portfolio-data-project'],
  }),
  skill: unstable_cache(() => loadCollection('skill'), ['portfolio-data', 'skill'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ['portfolio-data', 'portfolio-data-skill'],
  }),
};

export { DATA_REVALIDATE_SECONDS, collectionSchema };

export async function getData(collection: string) {
  const normalizedCollection = normalizeCollection(collection);

  try {
    return await collectionLoaders[normalizedCollection]();
  } catch (error) {
    const fallbackData = fallbackCache.payloads[normalizedCollection];

    if (fallbackData) {
      return fallbackData;
    }

    throw error;
  }
}
