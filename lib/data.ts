import { revalidateTag, unstable_cache } from 'next/cache';
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
const PORTFOLIO_DATA_TAG = 'portfolio-data';

export function getCollectionTag(collection: CollectionName) {
  return `${PORTFOLIO_DATA_TAG}-${collection}`;
}

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
  achievement: unstable_cache(() => loadCollection('achievement'), [PORTFOLIO_DATA_TAG, 'achievement'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: [PORTFOLIO_DATA_TAG, getCollectionTag('achievement')],
  }),
  cpprofile: unstable_cache(() => loadCollection('cpprofile'), [PORTFOLIO_DATA_TAG, 'cpprofile'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: [PORTFOLIO_DATA_TAG, getCollectionTag('cpprofile')],
  }),
  education: unstable_cache(() => loadCollection('education'), [PORTFOLIO_DATA_TAG, 'education'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: [PORTFOLIO_DATA_TAG, getCollectionTag('education')],
  }),
  experience: unstable_cache(() => loadCollection('experience'), [PORTFOLIO_DATA_TAG, 'experience'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: [PORTFOLIO_DATA_TAG, getCollectionTag('experience')],
  }),
  project: unstable_cache(() => loadCollection('project'), [PORTFOLIO_DATA_TAG, 'project'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: [PORTFOLIO_DATA_TAG, getCollectionTag('project')],
  }),
  skill: unstable_cache(() => loadCollection('skill'), [PORTFOLIO_DATA_TAG, 'skill'], {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: [PORTFOLIO_DATA_TAG, getCollectionTag('skill')],
  }),
};

export { DATA_REVALIDATE_SECONDS, PORTFOLIO_DATA_TAG, collectionSchema };

export function revalidateCollectionData(collection: string) {
  const normalizedCollection = normalizeCollection(collection);

  delete fallbackCache.payloads[normalizedCollection];
  revalidateTag(getCollectionTag(normalizedCollection), 'max');

  return normalizedCollection;
}

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
