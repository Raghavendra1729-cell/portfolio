import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import profilePhoto from "@/resources/linkedin profile.png";
import PageShell from "@/components/layout/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { siteConfig } from "@/lib/site-config";

const highlights = [
  {
    title: "How I work",
    description:
      "I like taking unclear problems, structuring them properly, and turning them into working software.",
  },
  {
    title: "What I value",
    description:
      "I care about clarity, adaptability, and steady execution more than being tied to one specific stack.",
  },
  {
    title: "What to explore here",
    description:
      "Use the pages above to see my projects, experience, skills, achievements, and contact details.",
  },
] as const;

const quickFacts = [
  {
    label: "Role",
    value: "Software Engineer / Student",
  },
  {
    label: "Approach",
    value: "Adapt fast, solve clearly, ship practical solutions",
  },
  {
    label: "Availability",
    value: siteConfig.availability,
  },
] as const;

const exploreLinks = [
  {
    title: "About",
    description: "A short introduction and education summary.",
    href: "/about",
  },
  {
    title: "Projects",
    description: "Selected work and what I have built.",
    href: "/projects",
  },
  {
    title: "Skills",
    description: "Technologies, tools, and current proficiency levels.",
    href: "/skills",
  },
  {
    title: "Contact",
    description: "Simple ways to reach me.",
    href: "/contact",
  },
] as const;

export default function Home() {
  return (
    <PageShell className="pt-6">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <Image
              src={profilePhoto}
              alt={`${siteConfig.name} portrait`}
              priority
              sizes="(max-width: 1024px) 100vw, 22rem"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="max-w-3xl">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-cyan-200/80">
              Welcome
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              Hi, I&apos;m {siteConfig.name}.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              I&apos;m a software engineer and student who enjoys solving problems, learning fast,
              and building software that is clear, practical, and useful.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              I&apos;m comfortable working across different technologies, and I focus more on
              understanding the problem well than on sticking to one tool or framework.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              This homepage is a brief introduction. If you want to know more about me, use the
              pages in the navigation bar.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <MagneticButton asChild className="border-cyan-300/18 bg-cyan-300 px-5 py-3 text-slate-950">
                <Link href="/about">
                  About me
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <MagneticButton asChild className="border-white/12 bg-white/6 px-5 py-3 text-white">
                <Link href="/contact">
                  Contact
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

        <section className="space-y-4">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-cyan-200/80">
              Explore
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              Start with the section you need.
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
