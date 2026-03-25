import dbConnect from "@/lib/mongodb";
import { defaultLandingPage, defaultSiteSettings } from "@/lib/site-content";
import Achievement from "@/models/Achievement";
import CPProfile from "@/models/CPProfile";
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Hackathon from "@/models/Hackathon";
import LandingPage from "@/models/LandingPage";
import Project from "@/models/Project";
import SiteSettings from "@/models/SiteSettings";
import Skill from "@/models/Skill";
import { encodeSkillMap } from "@/lib/skill-map";

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

type SeedSkillDocument = {
  category: string;
  items: string[];
  proficiency: Record<string, number>;
  focusSignals: Record<string, string>;
  order: number;
};

const DUMMY_RESUME_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const IMAGE_LIBRARY = {
  workspace:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
  dashboard:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  coding:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
  laptop:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  meeting:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  team:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  certificate:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  stage:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
} as const;

const seededSiteSettings = {
  ...defaultSiteSettings,
  name: "Raghavendra Linga",
  role: "Full-Stack Software Engineer",
  location: "Bengaluru, India",
  availability:
    "Open to internships, full-time product engineering roles, and serious technical collaborations.",
  profileBadge: "Product-grade engineering systems",
  footerBlurb:
    "Software engineer focused on clean systems, fast iteration, and product-minded execution.",
  primaryResumeLabel: "View resume",
  primaryResumeViewHref: DUMMY_RESUME_URL,
  primaryResumeDownloadHref: DUMMY_RESUME_URL,
  alternateResumeLinks: [
    { label: "ATS resume", href: DUMMY_RESUME_URL },
    { label: "One-page resume", href: DUMMY_RESUME_URL },
  ],
  pageIntro: {
    about: {
      eyebrow: "About",
      title: "Background, mindset, and current focus.",
      description:
        "A concise view of how I work, what I study, and the environments where I do my best work.",
    },
    projects: {
      eyebrow: "Projects",
      title: "Case studies with implementation depth.",
      description:
        "Selected work focused on architecture, product decisions, and the systems behind the final interface.",
    },
    experience: {
      eyebrow: "Experience",
      title: "Ownership, execution, and practical impact.",
      description:
        "A view into the teams, responsibilities, and technical outcomes I have worked on.",
    },
    skills: {
      eyebrow: "Skills",
      title: "Current stack and working confidence.",
      description:
        "A curated view of the tools I rely on most and the areas where I can contribute quickly.",
    },
    achievements: {
      eyebrow: "Achievements",
      title: "Competitive and product-facing signals.",
      description:
        "Highlights that add context around consistency, learning speed, and execution under pressure.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Direct routes for serious conversations.",
      description:
        "Resume, social links, and the fastest ways to reach me for product or engineering roles.",
    },
  },
};

const seededLandingPage = {
  ...defaultLandingPage,
  heroEyebrow: "Software engineer portfolio",
  heroTitle: "Building serious software with clear systems, clean UX, and strong execution.",
  heroSubtitle:
    "I design and ship full-stack products that turn ambiguous ideas into stable, useful, production-ready experiences.",
  heroSummary:
    "This seed dataset is here to help you evaluate the portfolio structure, motion, and content system before replacing it with your real information.",
  primaryCtaLabel: "Explore projects",
  primaryCtaHref: "/projects",
  secondaryCtaLabel: "Open contact",
  secondaryCtaHref: "/contact",
  highlightCards: [
    {
      title: "Execution",
      description: "I turn vague product requests into concrete, shippable systems with clear scope and structure.",
    },
    {
      title: "Engineering style",
      description: "I care about maintainability, speed of iteration, and interfaces that feel deliberate instead of noisy.",
    },
    {
      title: "Focus",
      description: "Full-stack product work across frontend systems, APIs, data modeling, and developer-facing tooling.",
    },
  ],
  projectsEyebrow: "Selected work",
  projectsTitle: "Projects that show technical range and product judgment.",
  projectsDescription:
    "A focused set of projects chosen to highlight system design, implementation quality, and execution decisions.",
  achievementsEyebrow: "Signals",
  achievementsTitle: "Outcomes beyond the codebase.",
  achievementsDescription:
    "A compact layer of achievements, hackathons, and competitive programming signals that add context to the portfolio.",
  exploreEyebrow: "Explore",
  exploreTitle: "Choose the evaluation path that matters to you.",
  exploreDescription:
    "Move directly into case studies, experience, technical depth, or contact without digging through filler.",
  contactEyebrow: "Next step",
  contactTitle: "Resume, direct links, and contact stay one click away.",
  contactDescription:
    "The portfolio is structured so important context is easy to review and easy to update from the CMS later.",
};

const seededProjects = [
  {
    title: "Portfolio CMS and Content Platform",
    description:
      "Problem: Portfolio content was split between hardcoded components and ad hoc configuration, which made updates slow and inconsistent.\n\nApproach: I introduced singleton settings for site-wide content, rebuilt the homepage around curated content slices, and aligned the admin flow with the new structure so edits no longer require hunting through the codebase.\n\nOutcome: Homepage copy, resume links, featured sections, and profile data now come from a clear source of truth while preserving the existing Next.js and MongoDB architecture.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Mongoose", "Framer Motion", "Cloudinary"],
    featured: true,
    startDate: "Jan 2026",
    endDate: "Mar 2026",
    order: 0,
    images: [IMAGE_LIBRARY.workspace, IMAGE_LIBRARY.dashboard],
    links: [
      { name: "Live demo", url: "https://example.com/portfolio-cms" },
      { name: "Repository", url: "https://github.com/example/portfolio-cms" },
    ],
  },
  {
    title: "Realtime Ops Dashboard",
    description:
      "Problem: Teams needed a single operational view for service health, queue pressure, and deployment status without relying on scattered tools.\n\nApproach: Built a dashboard with live metric cards, event streams, and role-aware views backed by lightweight API aggregation.\n\nOutcome: Reduced the time required to inspect incidents and gave product and engineering teams a shared operational surface.",
    techStack: ["React", "Next.js", "Node.js", "Redis", "PostgreSQL", "Tailwind CSS"],
    featured: true,
    startDate: "Sep 2025",
    endDate: "Dec 2025",
    order: 1,
    images: [IMAGE_LIBRARY.dashboard, IMAGE_LIBRARY.laptop],
    links: [
      { name: "Live demo", url: "https://example.com/ops-dashboard" },
      { name: "Repository", url: "https://github.com/example/ops-dashboard" },
    ],
  },
  {
    title: "AI Support Triage Workspace",
    description:
      "Problem: Support teams were losing time manually classifying, routing, and summarizing incoming conversations.\n\nApproach: Designed an AI-assisted triage surface with conversation summaries, urgency detection, queue filters, and human-review checkpoints.\n\nOutcome: Improved response prioritization while keeping the workflow understandable and easy for operators to trust.",
    techStack: ["Next.js", "TypeScript", "OpenAI API", "Prisma", "PostgreSQL", "Vercel"],
    featured: true,
    startDate: "Jun 2025",
    endDate: "Aug 2025",
    order: 2,
    images: [IMAGE_LIBRARY.coding, IMAGE_LIBRARY.workspace],
    links: [
      { name: "Product walkthrough", url: "https://example.com/ai-triage" },
      { name: "Repository", url: "https://github.com/example/ai-triage" },
    ],
  },
  {
    title: "Campus Collaboration Platform",
    description:
      "Problem: Student teams had no clean system to coordinate projects, share updates, and manage hackathon preparation.\n\nApproach: Built a collaboration platform with shared workspaces, task boards, and public project summaries.\n\nOutcome: Helped teams organize project work earlier and reduced friction around ownership and progress visibility.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Socket.IO", "Tailwind CSS"],
    featured: false,
    startDate: "Jan 2025",
    endDate: "Apr 2025",
    order: 3,
    images: [IMAGE_LIBRARY.team, IMAGE_LIBRARY.meeting],
    links: [
      { name: "Live demo", url: "https://example.com/campus-platform" },
      { name: "Repository", url: "https://github.com/example/campus-platform" },
    ],
  },
];

const seededExperience = [
  {
    role: "Software Engineer Intern",
    company: "Product Studio",
    location: "Remote",
    startDate: "May 2025",
    endDate: "Aug 2025",
    current: false,
    description: [
      "Built internal product surfaces in Next.js and TypeScript for team workflows and operational reporting.",
      "Refactored shared UI patterns to improve consistency, maintainability, and speed of iteration across features.",
      "Worked directly with product and engineering stakeholders to turn rough requirements into scoped implementation plans.",
    ],
    technologies: ["Next.js", "TypeScript", "MongoDB", "Node.js", "Tailwind CSS"],
    links: [{ name: "Company site", url: "https://example.com/product-studio" }],
    attachments: [],
    order: 0,
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance / Independent Projects",
    location: "Bengaluru, India",
    startDate: "2024",
    endDate: "",
    current: true,
    description: [
      "Delivered portfolio, dashboard, and content-driven web experiences for technical and product-focused use cases.",
      "Set up content models, admin flows, and deployment-ready application structure for faster future edits.",
      "Improved UI consistency, interaction quality, and information architecture instead of only shipping isolated screens.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Framer Motion", "Cloudinary"],
    links: [{ name: "Project archive", url: "https://example.com/independent-work" }],
    attachments: [],
    order: 1,
  },
];

const seededEducation = [
  {
    institution: "Vel Tech University",
    degree: "B.Tech",
    program: "Computer Science and Engineering",
    status: "Ongoing",
    location: "Chennai, India",
    startDate: "2023",
    endDate: "2027",
    grade: "CGPA 8.9 / 10",
    gradeLabel: "CGPA",
    gradeValue: "8.9 / 10",
    coursework: [
      "Data Structures",
      "Operating Systems",
      "Database Systems",
      "Computer Networks",
      "Software Engineering",
    ],
    highlights: [
      "Built multiple product-grade full-stack projects",
      "Active in hackathons and competitive programming",
    ],
    attachments: [],
    order: 0,
  },
];

const seededSkills: SeedSkillDocument[] = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    proficiency: {
      "Next.js": 92,
      React: 90,
      TypeScript: 88,
      "Tailwind CSS": 86,
      "Framer Motion": 78,
    },
    focusSignals: {
      "Next.js": "Primary framework",
      React: "Daily shipping stack",
      TypeScript: "Type-safe architecture",
    },
    order: 0,
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "MongoDB", "Mongoose", "REST APIs"],
    proficiency: {
      "Node.js": 82,
      Express: 80,
      MongoDB: 84,
      Mongoose: 84,
      "REST APIs": 86,
    },
    focusSignals: {
      MongoDB: "Current data layer",
      "REST APIs": "Strong working comfort",
    },
    order: 1,
  },
  {
    category: "Platform",
    items: ["Git", "Vercel", "Cloudinary", "Postman", "CI/CD"],
    proficiency: {
      Git: 88,
      Vercel: 82,
      Cloudinary: 76,
      Postman: 78,
      "CI/CD": 70,
    },
    focusSignals: {
      Git: "Daily workflow",
      Vercel: "Deployment default",
    },
    order: 2,
  },
  {
    category: "Problem Solving",
    items: ["Data Structures", "Algorithms", "Competitive Programming", "Debugging"],
    proficiency: {
      "Data Structures": 84,
      Algorithms: 82,
      "Competitive Programming": 80,
      Debugging: 88,
    },
    focusSignals: {
      Debugging: "Strong practical skill",
      "Competitive Programming": "Consistency signal",
    },
    order: 3,
  },
];

function prepareSkillSeed(document: SeedSkillDocument) {
  return {
    ...document,
    proficiency: encodeSkillMap<number>(document.proficiency),
    focusSignals: encodeSkillMap<string>(document.focusSignals),
  };
}

const seededAchievements = [
  {
    title: "Finalist in National Product Hackathon",
    organization: "BuildSprint",
    date: "2025",
    description:
      "Built and presented a product workflow prototype under tight time constraints, reaching the finalist round for execution quality and clarity of problem framing.",
    featured: true,
    order: 0,
    images: [IMAGE_LIBRARY.stage],
    links: [{ name: "Event page", url: "https://example.com/buildsprint" }],
  },
  {
    title: "Solved 800+ competitive programming problems",
    organization: "LeetCode / Codeforces",
    date: "2024-2026",
    description:
      "Maintained consistent problem-solving practice across algorithmic challenges, improving speed, pattern recognition, and debugging under time pressure.",
    featured: true,
    order: 1,
    images: [],
    links: [{ name: "Profiles", url: "https://example.com/cp-profiles" }],
  },
  {
    title: "Recognized for portfolio system redesign and CMS integration",
    organization: "Independent project",
    date: "2026",
    description:
      "Redesigned a portfolio into a structured content platform with better editability, cleaner UX, and a more professional system-level presentation.",
    featured: false,
    order: 2,
    images: [IMAGE_LIBRARY.certificate],
    links: [{ name: "Project brief", url: "https://example.com/portfolio-redesign" }],
  },
];

const seededCPProfiles = [
  {
    platform: "LeetCode",
    username: "raghavendra_linga",
    headline: "Consistent practice across data structures and problem solving",
    summary:
      "Used as a regular practice surface for sharpening debugging speed and algorithmic pattern recognition.",
    rating: 1860,
    maxRating: 1925,
    rank: "Top 8%",
    solvedCount: 540,
    streak: 120,
    profileUrl: "https://leetcode.com/",
    badges: [
      { label: "Contest rating", value: "1860" },
      { label: "Solved", value: "540+" },
    ],
    accent: "from-white/25 to-white/5",
    dataSource: "seed",
    order: 0,
    isVisible: true,
    images: [],
  },
  {
    platform: "Codeforces",
    username: "raghavendra1729",
    headline: "Competitive programming for speed and rigor",
    summary:
      "Helpful for building comfort with constrained problem solving, edge cases, and time-sensitive reasoning.",
    rating: 1520,
    maxRating: 1588,
    rank: "Specialist",
    solvedCount: 280,
    streak: 24,
    profileUrl: "https://codeforces.com/",
    badges: [
      { label: "Rank", value: "Specialist" },
      { label: "Max rating", value: "1588" },
    ],
    accent: "from-white/20 to-white/5",
    dataSource: "seed",
    order: 1,
    isVisible: true,
    images: [],
  },
];

const seededHackathons = [
  {
    title: "HackX Product Systems Challenge",
    event: "HackX 2025",
    organizer: "HackX Community",
    result: "Top 10",
    date: "Sep 2025",
    location: "Bengaluru",
    description:
      "Worked on a team product prototype that focused on operational visibility and smoother human-in-the-loop workflows.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "OpenAI API"],
    teamSize: 4,
    featured: true,
    order: 0,
    images: [IMAGE_LIBRARY.team, IMAGE_LIBRARY.stage],
    links: [{ name: "Event", url: "https://example.com/hackx" }],
  },
  {
    title: "Campus Buildathon",
    event: "University Buildathon",
    organizer: "Developer Club",
    result: "Best UX Mention",
    date: "Feb 2025",
    location: "Chennai",
    description:
      "Built a collaboration-focused student product and was recognized for clarity of workflow and interface quality.",
    techStack: ["React", "Node.js", "MongoDB"],
    teamSize: 3,
    featured: false,
    order: 1,
    images: [IMAGE_LIBRARY.meeting],
    links: [{ name: "Recap", url: "https://example.com/buildathon" }],
  },
];

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
    data: seededSiteSettings,
  });

  await seedSingleton(steps, {
    collection: "landingPage",
    label: "Landing Page",
    model: LandingPage,
    query: { singletonKey: "landing-page" },
    data: seededLandingPage,
  });

  await seedCollection(steps, {
    collection: "project",
    label: "Projects",
    model: Project,
    documents: seededProjects,
  });

  await seedCollection(steps, {
    collection: "experience",
    label: "Experience",
    model: Experience,
    documents: seededExperience,
  });

  await seedCollection(steps, {
    collection: "education",
    label: "Education",
    model: Education,
    documents: seededEducation,
  });

  await seedCollection(steps, {
    collection: "skill",
    label: "Skills",
    model: Skill,
    documents: seededSkills.map(prepareSkillSeed),
  });

  await seedCollection(steps, {
    collection: "achievement",
    label: "Achievements",
    model: Achievement,
    documents: seededAchievements,
  });

  await seedCollection(steps, {
    collection: "cpProfile",
    label: "CP Profiles",
    model: CPProfile,
    documents: seededCPProfiles,
  });

  await seedCollection(steps, {
    collection: "hackathon",
    label: "Hackathons",
    model: Hackathon,
    documents: seededHackathons,
  });

  const totals = steps.reduce(
    (accumulator, step) => {
      if (step.action === "created") {
        accumulator.createdCollections += 1;
        accumulator.insertedDocuments += step.inserted;
      } else {
        accumulator.skippedCollections += 1;
      }

      return accumulator;
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
