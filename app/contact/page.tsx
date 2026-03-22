import { Github, Linkedin, Mail } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

const contactMethods = [
  {
    label: "Email",
    value: siteConfig.emailLabel,
    href: siteConfig.emailHref,
    icon: Mail,
    description: "Best for interview coordination and direct opportunities.",
  },
  {
    label: "LinkedIn",
    value: "Professional profile",
    href: siteConfig.linkedinHref,
    icon: Linkedin,
    description: "Good for recruiter outreach and career conversations.",
  },
  {
    label: "GitHub",
    value: "Code and projects",
    href: siteConfig.githubHref,
    icon: Github,
    description: "Useful if you want to review implementation style and repos.",
  },
] as const;

export default function ContactPage() {
  return (
    <main className="relative px-6 pb-24 pt-32">
      <div className="mx-auto max-w-5xl space-y-12">
        <RevealSection className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
            Contact
          </span>
          <h1 className="mt-5 text-4xl font-bold text-white md:text-5xl">
            Let&apos;s connect
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            I&apos;m open to backend engineering roles, strong product teams, and
            conversations about building reliable systems.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {contactMethods.map(({ label, value, href, icon: Icon, description }) => (
            <RevealSection key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group block h-full rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-white">{label}</h2>
                <p className="mt-2 text-sm font-medium text-cyan-300">{value}</p>
                <p className="mt-4 text-sm leading-7 text-slate-400">{description}</p>
              </a>
            </RevealSection>
          ))}
        </div>
      </div>
    </main>
  );
}
