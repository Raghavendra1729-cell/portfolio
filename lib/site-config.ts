export const siteConfig = {
  name: "Raghavendra",
  role: "Software Engineer",
  headline:
    "Software engineer and student who adapts quickly, learns unfamiliar stacks fast, and works independently to turn ambiguous problems into shipped solutions.",
  emailHref: "mailto:lingaraghawendra@gmail.com",
  emailLabel: "lingaraghawendra@gmail.com",
  githubHref: "https://github.com/raghavendra1729-cell",
  linkedinHref: "https://www.linkedin.com/in/raghavendra-linga/",
  availability: "Open to software engineering internships, collaborations, and full-time roles.",
  location: "India",
};

export const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Achievements", href: "/achievements" },
  { label: "Contact", href: "/contact" },
] as const;

export const socialLinks = [
  {
    href: siteConfig.githubHref,
    label: "GitHub",
  },
  {
    href: siteConfig.linkedinHref,
    label: "LinkedIn",
  },
  {
    href: siteConfig.emailHref,
    label: "Email",
  },
] as const;
