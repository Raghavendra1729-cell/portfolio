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

export const defaultProjects = [
  {
    _id: "65aa11111111111111111111",
    title: "Portfolio CMS and Content Platform",
    description:
      "Problem: Portfolio content was scattered across components and loosely structured settings, which made updates slow and inconsistent.\n\nApproach: I introduced a clearer content architecture, centralized singleton configuration, and tightened the presentation so important work, links, and profile information stay easy to edit and easy to evaluate.\n\nOutcome: The portfolio became cleaner to maintain, easier to scale, and much stronger as a serious engineering signal.",
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
    _id: "65aa22222222222222222222",
    title: "Realtime Ops Dashboard",
    description:
      "Problem: Teams needed a single operational view for deployments, queue pressure, and service health without bouncing across multiple tools.\n\nApproach: Built a dashboard with live metric surfaces, event streams, and role-aware visibility backed by lightweight API aggregation and deliberate information hierarchy.\n\nOutcome: Incident review became faster, operational context became clearer, and the product felt more usable under pressure.",
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
    _id: "65aa33333333333333333333",
    title: "AI Support Triage Workspace",
    description:
      "Problem: Support teams were spending too much time classifying, routing, and summarizing conversations manually.\n\nApproach: Designed an AI-assisted workspace with queue filters, summarization, urgency signals, and explicit human checkpoints so the system stayed useful and explainable.\n\nOutcome: Response prioritization improved without introducing black-box complexity into the workflow.",
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
    _id: "65aa44444444444444444444",
    title: "Campus Collaboration Platform",
    description:
      "Problem: Student teams lacked a clean system for coordinating projects, sharing progress, and preparing for hackathons.\n\nApproach: Built a collaboration platform with shared workspaces, task views, and public project summaries designed for clarity over feature noise.\n\nOutcome: Teams could organize work earlier, reduce coordination friction, and keep ownership visible across the build cycle.",
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
] as const;

export const defaultExperience = [
  {
    _id: "66bb11111111111111111111",
    role: "Software Engineer Intern",
    company: "Product Studio",
    location: "Remote",
    startDate: "May 2025",
    endDate: "Aug 2025",
    current: false,
    description: [
      "Built internal product surfaces in Next.js and TypeScript for team workflows and operational reporting.",
      "Refactored shared UI patterns to improve consistency, maintainability, and speed of iteration across features.",
      "Worked with product and engineering stakeholders to turn rough requirements into scoped implementation plans.",
    ],
    technologies: ["Next.js", "TypeScript", "MongoDB", "Node.js", "Tailwind CSS"],
    links: [{ name: "Company site", url: "https://example.com/product-studio" }],
    attachments: [],
    order: 0,
  },
  {
    _id: "66bb22222222222222222222",
    role: "Full-Stack Developer",
    company: "Freelance / Independent Projects",
    location: "Bengaluru, India",
    startDate: "2024",
    endDate: "",
    current: true,
    description: [
      "Delivered portfolio, dashboard, and content-driven web experiences for technical and product-facing use cases.",
      "Set up content models, admin flows, and deployment-ready structure so future edits stay faster and cleaner.",
      "Improved information architecture and interaction quality instead of only shipping isolated screens.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Framer Motion", "Cloudinary"],
    links: [{ name: "Project archive", url: "https://example.com/independent-work" }],
    attachments: [],
    order: 1,
  },
] as const;

export const defaultEducation = [
  {
    _id: "67cc11111111111111111111",
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
] as const;

export const defaultSkills = [
  {
    _id: "68dd11111111111111111111",
    category: "Frontend Systems",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    proficiency: {
      "Next.js": 92,
      React: 90,
      TypeScript: 88,
      "Tailwind CSS": 86,
      "Framer Motion": 78,
    },
    focusSignals: {
      "Next.js": "Primary framework for product-grade work",
      React: "Daily shipping stack",
      TypeScript: "Preferred base for maintainable frontend systems",
    },
    order: 0,
  },
  {
    _id: "68dd22222222222222222222",
    category: "Backend and Data",
    items: ["Node.js", "Express", "MongoDB", "Mongoose", "REST APIs"],
    proficiency: {
      "Node.js": 82,
      Express: 80,
      MongoDB: 84,
      Mongoose: 84,
      "REST APIs": 86,
    },
    focusSignals: {
      MongoDB: "Current data layer in personal and portfolio projects",
      "REST APIs": "Comfortable defining and shipping clean service contracts",
    },
    order: 1,
  },
  {
    _id: "68dd33333333333333333333",
    category: "Platform Workflow",
    items: ["Git", "Vercel", "Cloudinary", "Postman", "CI/CD"],
    proficiency: {
      Git: 88,
      Vercel: 82,
      Cloudinary: 76,
      Postman: 78,
      "CI/CD": 70,
    },
    focusSignals: {
      Git: "Daily collaboration and version-control workflow",
      Vercel: "Default deployment surface for frontend-first builds",
    },
    order: 2,
  },
  {
    _id: "68dd44444444444444444444",
    category: "Problem Solving",
    items: ["Data Structures", "Algorithms", "Competitive Programming", "Debugging"],
    proficiency: {
      "Data Structures": 84,
      Algorithms: 82,
      "Competitive Programming": 80,
      Debugging: 88,
    },
    focusSignals: {
      Debugging: "Strong practical skill when systems become messy or ambiguous",
      "Competitive Programming": "Discipline signal for problem-solving consistency",
    },
    order: 3,
  },
] as const;

export const defaultAchievements = [
  {
    _id: "69ee11111111111111111111",
    title: "Finalist in National Product Hackathon",
    organization: "BuildSprint",
    date: "2025",
    description:
      "Built and presented a product workflow prototype under tight constraints, reaching the finalist round for execution quality and clarity of problem framing.",
    featured: true,
    order: 0,
    images: [IMAGE_LIBRARY.stage],
    links: [{ name: "Event page", url: "https://example.com/buildsprint" }],
  },
  {
    _id: "69ee22222222222222222222",
    title: "Solved 800+ competitive programming problems",
    organization: "LeetCode / Codeforces",
    date: "2024-2026",
    description:
      "Maintained consistent algorithmic practice to improve speed, pattern recognition, and debugging under pressure.",
    featured: true,
    order: 1,
    images: [],
    links: [{ name: "Profiles", url: "https://example.com/cp-profiles" }],
  },
  {
    _id: "69ee33333333333333333333",
    title: "Recognized for portfolio system redesign and CMS integration",
    organization: "Independent project",
    date: "2026",
    description:
      "Redesigned a portfolio into a structured content platform with better editability, stronger hierarchy, and a more technically mature presentation.",
    featured: false,
    order: 2,
    images: [IMAGE_LIBRARY.certificate],
    links: [{ name: "Project brief", url: "https://example.com/portfolio-redesign" }],
  },
] as const;

export const defaultCpProfiles = [
  {
    _id: "70ff11111111111111111111",
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
    dataSource: "local-fallback",
    order: 0,
    isVisible: true,
    images: [],
  },
  {
    _id: "70ff22222222222222222222",
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
    dataSource: "local-fallback",
    order: 1,
    isVisible: true,
    images: [],
  },
] as const;

export const defaultHackathons = [
  {
    _id: "71aa11111111111111111111",
    title: "HackX Product Systems Challenge",
    event: "HackX 2025",
    organizer: "HackX Community",
    result: "Top 10",
    date: "Sep 2025",
    location: "Bengaluru",
    description:
      "Built a team product prototype focused on operational visibility and smoother human-in-the-loop workflows.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "OpenAI API"],
    teamSize: 4,
    featured: true,
    order: 0,
    images: [IMAGE_LIBRARY.team, IMAGE_LIBRARY.stage],
    links: [{ name: "Event", url: "https://example.com/hackx" }],
  },
  {
    _id: "71aa22222222222222222222",
    title: "Campus Buildathon",
    event: "University Buildathon",
    organizer: "Developer Club",
    result: "Best UX Mention",
    date: "Feb 2025",
    location: "Chennai",
    description:
      "Built a collaboration-focused student product and received recognition for workflow clarity and interface quality.",
    techStack: ["React", "Node.js", "MongoDB"],
    teamSize: 3,
    featured: false,
    order: 1,
    images: [IMAGE_LIBRARY.meeting],
    links: [{ name: "Recap", url: "https://example.com/buildathon" }],
  },
] as const;
