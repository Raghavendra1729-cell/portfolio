import dbConnect from "@/lib/mongodb";
import { encodeSkillMap } from "@/lib/skill-map";
import { SITE_PAGE_DETAILS, SITE_PAGE_KEYS } from "@/lib/site-content";
import { landingPageDefaults, siteSettingsDefaults } from "@/content/site";
import {
  heroIntroLines,
  heroSignals,
  homeSections,
  navigationItems,
  siteMetadata,
} from "@/content/structure";
import {
  defaultAchievements,
  defaultCpProfiles,
  defaultEducation,
  defaultExperience,
  defaultHackathons,
  defaultProjects,
  defaultSkills,
} from "@/content/collections";
import Achievement from "@/models/Achievement";
import CPProfile from "@/models/CPProfile";
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Hackathon from "@/models/Hackathon";
import LandingPage from "@/models/LandingPage";
import Project from "@/models/Project";
import SiteSettings from "@/models/SiteSettings";
import Skill from "@/models/Skill";

const initialSiteSettings = {
  ...siteSettingsDefaults,
  navigationItems: navigationItems.map((item) => ({ ...item })),
  siteMetadata: {
    description: siteMetadata.description,
    keywords: [...siteMetadata.keywords],
  },
  pageIntro: Object.fromEntries(
    SITE_PAGE_KEYS.map((key) => [
      key,
      {
        ...siteSettingsDefaults.pageIntro[key],
        path: SITE_PAGE_DETAILS[key].path,
      },
    ])
  ),
};

const initialLandingPage = {
  ...landingPageDefaults,
  heroIntroLines: [...heroIntroLines],
  heroSignals: heroSignals.map((item) => ({ ...item })),
  homeSections: homeSections.map((item) => ({ ...item })),
};

type SeedAction = "created" | "skipped";

export type SeedStep = {
  collection: string;
  label: string;
  action: SeedAction;
  inserted: number;
  reason?: string;
};

export type SeedResult = {
  success: true;
  steps: SeedStep[];
  totals: {
    createdCollections: number;
    skippedCollections: number;
    insertedDocuments: number;
  };
};

type CountableModel = {
  countDocuments: (query?: Record<string, unknown>) => PromiseLike<number>;
};

type SingletonSeedModel = CountableModel & {
  create: (doc: Record<string, unknown>) => PromiseLike<unknown>;
};

type CollectionSeedModel = CountableModel & {
  insertMany: (docs: Record<string, unknown>[]) => PromiseLike<unknown>;
};

function prepareSkillSeed(document: (typeof defaultSkills)[number]) {
  return {
    ...document,
    proficiency: encodeSkillMap<number>(document.proficiency),
    focusSignals: encodeSkillMap<string>(document.focusSignals),
  };
}

async function seedSingleton(
  steps: SeedStep[],
  config: {
    collection: string;
    label: string;
    model: SingletonSeedModel;
    query: Record<string, unknown>;
    data: Record<string, unknown>;
  }
) {
  const existingCount = await config.model.countDocuments(config.query);

  if (existingCount > 0) {
    steps.push({
      collection: config.collection,
      label: config.label,
      action: "skipped",
      inserted: 0,
      reason: "Collection already has a singleton document.",
    });
    return;
  }

  await config.model.create(config.data);

  steps.push({
    collection: config.collection,
    label: config.label,
    action: "created",
    inserted: 1,
  });
}

async function seedCollection(
  steps: SeedStep[],
  config: {
    collection: string;
    label: string;
    model: CollectionSeedModel;
    documents: Record<string, unknown>[];
  }
) {
  const existingCount = await config.model.countDocuments();

  if (existingCount > 0) {
    steps.push({
      collection: config.collection,
      label: config.label,
      action: "skipped",
      inserted: 0,
      reason: "Collection already contains documents.",
    });
    return;
  }

  if (config.documents.length === 0) {
    steps.push({
      collection: config.collection,
      label: config.label,
      action: "skipped",
      inserted: 0,
      reason: "No seed documents were configured.",
    });
    return;
  }

  await config.model.insertMany(config.documents);

  steps.push({
    collection: config.collection,
    label: config.label,
    action: "created",
    inserted: config.documents.length,
  });
}

export async function runPortfolioSeed(): Promise<SeedResult> {
  await dbConnect();

  const steps: SeedStep[] = [];

  await seedSingleton(steps, {
    collection: "siteSettings",
    label: "Site Settings",
    model: SiteSettings,
    query: { singletonKey: "site-settings" },
    data: initialSiteSettings,
  });

  await seedSingleton(steps, {
    collection: "landingPage",
    label: "Landing Page",
    model: LandingPage,
    query: { singletonKey: "landing-page" },
    data: initialLandingPage,
  });

  await seedCollection(steps, {
    collection: "project",
    label: "Projects",
    model: Project,
    documents: defaultProjects.map((item) => ({ ...item })),
  });

  await seedCollection(steps, {
    collection: "experience",
    label: "Experience",
    model: Experience,
    documents: defaultExperience.map((item) => ({ ...item })),
  });

  await seedCollection(steps, {
    collection: "education",
    label: "Education",
    model: Education,
    documents: defaultEducation.map((item) => ({ ...item })),
  });

  await seedCollection(steps, {
    collection: "skill",
    label: "Skills",
    model: Skill,
    documents: defaultSkills.map(prepareSkillSeed),
  });

  await seedCollection(steps, {
    collection: "achievement",
    label: "Achievements",
    model: Achievement,
    documents: defaultAchievements.map((item) => ({ ...item })),
  });

  await seedCollection(steps, {
    collection: "cpProfile",
    label: "CP Profiles",
    model: CPProfile,
    documents: defaultCpProfiles.map((item) => ({ ...item })),
  });

  await seedCollection(steps, {
    collection: "hackathon",
    label: "Hackathons",
    model: Hackathon,
    documents: defaultHackathons.map((item) => ({ ...item })),
  });

  const totals = steps.reduce(
    (acc, step) => {
      if (step.action === "created") {
        acc.createdCollections += 1;
        acc.insertedDocuments += step.inserted;
      } else {
        acc.skippedCollections += 1;
      }

      return acc;
    },
    {
      createdCollections: 0,
      skippedCollections: 0,
      insertedDocuments: 0,
    }
  );

  return {
    success: true,
    steps,
    totals,
  };
}
