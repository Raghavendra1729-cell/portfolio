export const siteConfig = {
  name: "Raghavendra",
  role: "Software Engineer",
  headline: "Backend-focused engineer building reliable systems and polished product experiences.",
  emailHref: "mailto:your.email@example.com",
  emailLabel: "your.email@example.com",
  githubHref: "https://github.com/raghavendra1729-cell",
  linkedinHref: "https://www.linkedin.com",
};

export const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
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
