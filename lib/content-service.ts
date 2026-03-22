import dbConnect from "@/lib/mongodb";
import {
  isSupportedContentCollection,
  type ContentCollectionId,
} from "@/lib/content-schema";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Skill from "@/models/Skill";
import Achievement from "@/models/Achievement";
import CPProfile from "@/models/CPProfile";
import Hackathon from "@/models/Hackathon";

type SortDirection = 1 | -1;
type SortConfig = Record<string, SortDirection>;

type QueryableModel = {
  find: (query: Record<string, unknown>) => {
    sort: (sort: SortConfig) => {
      lean: () => Promise<unknown[]>;
    };
  };
  findOne: (query: Record<string, unknown>) => {
    lean: () => Promise<unknown | null>;
  };
};

type CollectionConfig = {
  model: QueryableModel;
  sort: SortConfig;
  publicFilter?: Record<string, unknown>;
};

const COLLECTION_CONFIG: Record<ContentCollectionId, CollectionConfig> = {
  project: { model: Project, sort: { order: 1, featured: -1, createdAt: -1 } },
  experience: { model: Experience, sort: { order: 1, current: -1, createdAt: -1 } },
  education: { model: Education, sort: { order: 1, createdAt: -1 } },
  skill: { model: Skill, sort: { order: 1, createdAt: -1 } },
  achievement: { model: Achievement, sort: { order: 1, createdAt: -1 } },
  cpProfile: {
    model: CPProfile,
    sort: { order: 1, createdAt: -1 },
    publicFilter: { isVisible: { $ne: false } },
  },
  hackathon: { model: Hackathon, sort: { featured: -1, order: 1, createdAt: -1 } },
};

function toPlain<T>(value: T) {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getFilter(config: CollectionConfig, includeHidden = false) {
  if (includeHidden || !config.publicFilter) {
    return {};
  }

  return { ...config.publicFilter };
}

export async function listContentDocuments(
  collection: ContentCollectionId,
  options?: { includeHidden?: boolean }
) {
  await dbConnect();

  const config = COLLECTION_CONFIG[collection];
  const data = await config.model.find(getFilter(config, options?.includeHidden)).sort(config.sort).lean();

  return toPlain(data);
}

export async function getContentDocumentById(
  collection: ContentCollectionId,
  id: string,
  options?: { includeHidden?: boolean }
) {
  await dbConnect();

  const config = COLLECTION_CONFIG[collection];
  const record = await config.model.findOne({ _id: id, ...getFilter(config, options?.includeHidden) }).lean();

  return record ? toPlain(record) : null;
}

export function resolveContentCollection(collection: string | null | undefined) {
  return isSupportedContentCollection(collection) ? collection : null;
}
