export const defaultProfileImage = "/profile/raghavendra-portrait.png";

export const navigationItems = [
  { label: "Home", href: "/", enabled: true },
  { label: "About", href: "/about", enabled: true },
  { label: "Projects", href: "/projects", enabled: true },
  { label: "Experience", href: "/experience", enabled: true },
  { label: "Skills", href: "/skills", enabled: true },
  { label: "Achievements", href: "/achievements", enabled: true },
  { label: "Contact", href: "/contact", enabled: true },
] as const;

export const siteMetadata = {
  name: "Raghavendra Linga",
  role: "Full-Stack Software Engineer",
  description:
    "Portfolio of Raghavendra Linga, a computer science student and full-stack software engineer focused on clean systems, restrained interfaces, and strong execution.",
  keywords: [
    "Raghavendra Linga",
    "software engineer portfolio",
    "full-stack developer",
    "Next.js portfolio",
    "computer science student",
    "TypeScript engineer",
  ],
};

export const pageMetadata = {
  home: {
    title: "Home",
    description:
      "A developer-grade portfolio focused on clear systems, sharp interfaces, and product-minded engineering.",
    path: "/",
  },
  about: {
    title: "About",
    description: "Background, education, and the engineering mindset behind the work.",
    path: "/about",
  },
  projects: {
    title: "Projects",
    description: "Selected projects with stronger hierarchy, context, and case-study presentation.",
    path: "/projects",
  },
  experience: {
    title: "Experience",
    description: "Roles, responsibilities, and practical technical impact across real work.",
    path: "/experience",
  },
  skills: {
    title: "Skills",
    description: "Current technical depth, active focus areas, and working confidence across the stack.",
    path: "/skills",
  },
  achievements: {
    title: "Achievements",
    description: "Achievements, competitive profiles, and hackathon work that support the story of the build.",
    path: "/achievements",
  },
  contact: {
    title: "Contact",
    description: "Resume access and direct contact paths for serious conversations and opportunities.",
    path: "/contact",
  },
} as const;

export const heroIntroLines = [
  "Full-stack systems with clean architecture",
  "Premium interfaces with restrained motion",
  "Practical engineering focused on shipping",
] as const;

export const heroSignals = [
  { label: "Focus", value: "Product-grade web apps" },
  { label: "Stack", value: "Next.js / TypeScript / MongoDB" },
  { label: "Mode", value: "Design · Build · Iterate" },
] as const;

export const homeSections = [
  { id: "highlights", enabled: true },
  { id: "projects", enabled: true },
  { id: "achievements", enabled: true },
  { id: "explore", enabled: true },
  { id: "contact", enabled: true },
] as const;

export const pageSectionVisibility = {
  about: {
    profileSummary: true,
    education: true,
    resume: true,
  },
  achievements: {
    competitiveProfiles: true,
    achievements: true,
    hackathons: true,
  },
  contact: {
    directLinks: true,
    availability: true,
    resume: true,
  },
} as const;
