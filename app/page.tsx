import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import profilePhoto from "@/resources/linkedin profile.png";
import PageShell from "@/components/layout/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { siteConfig } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  description:
    "Software engineer portfolio focused on practical product execution, clear communication, and adaptable technical depth.",
  path: "/",
});

const highlights = [
  {
    title: "Execution",
    description:
      "I scope ambiguous problems, prioritize quickly, and turn them into stable shipped software.",
  },
  {
    title: "Engineering style",
    description:
      "Clear architecture, reliable delivery, and communication that keeps teams aligned.",
  },
  {
    title: "Focus areas",
    description:
      "Full-stack product development, problem solving, and fast ramp-up across unfamiliar stacks.",
  },
] as const;

const quickFacts = [
  {
    label: "Role",
    value: "Software Engineer / Student",
  },
  {
    label: "Location",
    value: siteConfig.location,
  },
  {
    label: "Availability",
    value: siteConfig.availability,
  },
] as const;

const exploreLinks = [
  {
    title: "Projects",
    description: "See selected work with stack, links, and implementation context.",
    href: "/projects",
  },
  {
    title: "Experience",
    description: "Review roles, impact, and technical scope.",
    href: "/experience",
  },
  {
    title: "Skills",
    description: "Scan strengths and current depth by category.",
    href: "/skills",
  },
  {
    title: "Contact",
    description: "Reach out for internships, collaborations, or full-time roles.",
    href: "/contact",
  },
] as const;

export default function Home() {
  return (
    <PageShell className="pt-6">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <Image
              src={profilePhoto}
              alt={`${siteConfig.name} portrait`}
              priority
              sizes="(max-width: 1024px) 100vw, 20rem"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="max-w-3xl">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-cyan-200/80">
              Software engineer portfolio
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              Hi, I&apos;m {siteConfig.name}.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{siteConfig.headline}</p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              This site is designed for fast scanning: strongest projects, practical experience,
              and clear ways to contact me.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <MagneticButton asChild className="border-cyan-300/18 bg-cyan-300 px-5 py-3 text-slate-950">
                <Link href="/projects">
                  View projects
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <MagneticButton asChild className="border-white/12 bg-white/6 px-5 py-3 text-white">
                <Link href="/contact">
                  Contact me
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="command-surface command-outline rounded-[1.8rem] p-6"
            >
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {quickFacts.map((item) => (
            <article
              key={item.label}
              className="command-surface-muted rounded-[1.6rem] border border-white/8 p-5"
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.26em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{item.value}</p>
            </article>
          ))}
        </div>

        <section aria-labelledby="explore-sections" className="space-y-4">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-cyan-200/80">
              Explore
            </p>
            <h2
              id="explore-sections"
              className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl"
            >
              Start with the section you care about.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {exploreLinks.map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <article className="command-surface command-outline h-full rounded-[1.8rem] p-6 transition duration-300 group-hover:border-cyan-300/22 group-hover:bg-white/[0.07]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-cyan-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </PageShell>
  );
}
