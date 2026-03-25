import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import profilePhoto from "@/resources/linkedin profile.png";
import HeroPortrait from "@/components/HeroPortrait";
import { RevealSection } from "@/components/Reveal";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import PageShell from "@/components/layout/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import TiltCard from "@/components/ui/TiltCard";
import {
  getData,
  getLandingPage,
  getSiteSettings,
  type AchievementRecord,
  type ProjectRecord,
} from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  description:
    "Software engineer portfolio focused on product-grade execution, technical range, and clear communication.",
  path: "/",
});

function getPrimaryProjectLink(project: ProjectRecord) {
  const directLinks = [
    project.link ? { name: "Live", url: project.link } : null,
    project.repo ? { name: "Repo", url: project.repo } : null,
    ...project.links,
  ].filter((link): link is { name: string; url: string } => Boolean(link?.url));

  return directLinks[0] || null;
}

function getFeaturedProjects(projects: ProjectRecord[], count: number) {
  const featured = projects.filter((project) => project.featured);
  return (featured.length > 0 ? featured : projects).slice(0, count);
}

function getFeaturedAchievements(achievements: AchievementRecord[], count: number) {
  const featured = achievements.filter((achievement) => achievement.featured);
  return (featured.length > 0 ? featured : achievements).slice(0, count);
}

export default async function Home() {
  const [siteSettings, landingPage, projects, achievements] = await Promise.all([
    getSiteSettings(),
    getLandingPage(),
    getData("project"),
    getData("achievement"),
  ]);

  const featuredProjects = getFeaturedProjects(projects, landingPage.maxFeaturedProjects);
  const leadProject = featuredProjects[0];
  const secondaryProjects = featuredProjects.slice(1, 3);
  const featuredAchievements = landingPage.showAchievementsSection
    ? getFeaturedAchievements(achievements, landingPage.maxFeaturedAchievements)
    : [];

  return (
    <PageShell className="pt-8">
      <section className="mx-auto max-w-6xl">
        <section className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-center">
          <RevealSection className="space-y-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                <span>{landingPage.heroEyebrow}</span>
                <span className="h-px w-8 bg-white/10" />
                <span>{siteSettings.location}</span>
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.08em] text-white sm:text-6xl lg:text-[5.25rem] lg:leading-[0.94]">
                {landingPage.heroTitle}
              </h1>

              <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-[1.15rem]">
                {landingPage.heroSubtitle}
              </p>

              <p className="max-w-2xl text-base leading-8 text-slate-500">
                {landingPage.heroSummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {landingPage.primaryCtaLabel && landingPage.primaryCtaHref ? (
                <MagneticButton
                  asChild
                  className="rounded-2xl border-white/12 bg-white px-5 py-3 text-slate-950 shadow-[0_18px_44px_rgba(255,255,255,0.1)]"
                >
                  <Link href={landingPage.primaryCtaHref}>
                    {landingPage.primaryCtaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </MagneticButton>
              ) : null}

              {landingPage.secondaryCtaLabel && landingPage.secondaryCtaHref ? (
                <MagneticButton
                  asChild
                  className="rounded-2xl border-white/10 bg-white/[0.03] px-5 py-3 text-white"
                >
                  <Link href={landingPage.secondaryCtaHref}>
                    {landingPage.secondaryCtaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </MagneticButton>
              ) : null}
            </div>

            <ResumeActions siteSettings={siteSettings} />

            <div className="flex flex-wrap items-start gap-8 border-t border-white/6 pt-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Role
                </p>
                <p className="mt-2 text-sm text-slate-200">{siteSettings.role}</p>
              </div>
              <div className="max-w-md">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Availability
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{siteSettings.availability}</p>
              </div>
            </div>

            <SocialLinks links={siteSettings.socialLinks} />
          </RevealSection>

          <RevealSection delay={0.08}>
            <HeroPortrait
              src={siteSettings.profileImage || profilePhoto}
              alt={siteSettings.profileImageAlt || `${siteSettings.name} portrait`}
              badge={siteSettings.profileBadge}
              role={siteSettings.role}
              location={siteSettings.location}
              availability={siteSettings.availability}
            />
          </RevealSection>
        </section>

        <RevealSection className="mt-16">
          <div className="grid border-y border-white/6 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="grid divide-y divide-white/6 md:contents">
              {landingPage.highlightCards.map((item, index) => (
                <div key={item.title} className="p-6 sm:p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-5 text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {leadProject ? (
          <section className="mt-24 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
            <RevealSection className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <span>{landingPage.projectsEyebrow}</span>
                  <span className="h-px w-8 bg-white/10" />
                  <span>{landingPage.projectsTitle}</span>
                </div>
                <p className="max-w-2xl text-base leading-8 text-slate-400">
                  {landingPage.projectsDescription}
                </p>
              </div>

              <TiltCard>
                <article className="premium-surface premium-outline overflow-hidden rounded-[2rem]">
                  <div className="relative aspect-[16/10] border-b border-white/8 bg-black/40">
                    {leadProject.images[0] ? (
                      <Image
                        src={leadProject.images[0]}
                        alt={`${leadProject.title} preview`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 premium-grid opacity-35" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.04),rgba(4,6,10,0.68)_100%)]" />
                  </div>

                  <div className="space-y-5 p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">
                          {leadProject.title}
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                          {leadProject.description}
                        </p>
                      </div>
                      {leadProject.featured ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-200">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    {leadProject.techStack.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {leadProject.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-5 border-t border-white/6 pt-5 text-sm">
                      <Link href={`/projects/${leadProject._id}`} className="inline-flex items-center gap-2 text-white transition hover:text-slate-300">
                        Open case study
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      {getPrimaryProjectLink(leadProject) ? (
                        <a
                          href={getPrimaryProjectLink(leadProject)?.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                        >
                          {getPrimaryProjectLink(leadProject)?.name}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </TiltCard>
            </RevealSection>

            <div className="space-y-4">
              {secondaryProjects.map((project, index) => (
                <RevealSection key={project._id} delay={index * 0.05}>
                  <TiltCard intensity={6}>
                    <article className="premium-surface premium-outline rounded-[1.7rem] p-6">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                        {project.techStack.slice(0, 2).join(" • ") || "Project"}
                      </p>
                      <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400">{project.description}</p>
                      <div className="mt-5 flex items-center justify-between text-sm">
                        <Link href={`/projects/${project._id}`} className="inline-flex items-center gap-2 text-white transition hover:text-slate-300">
                          View project
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        {getPrimaryProjectLink(project) ? (
                          <a
                            href={getPrimaryProjectLink(project)?.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 transition hover:text-white"
                          >
                            {getPrimaryProjectLink(project)?.name}
                          </a>
                        ) : null}
                      </div>
                    </article>
                  </TiltCard>
                </RevealSection>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-24 grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <RevealSection className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                <span>{landingPage.contactEyebrow}</span>
                <span className="h-px w-8 bg-white/10" />
                <span>{siteSettings.name}</span>
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                {landingPage.contactTitle}
              </h2>
              <p className="max-w-xl text-base leading-8 text-slate-400">
                {landingPage.contactDescription}
              </p>
            </div>

            <ResumeActions siteSettings={siteSettings} />

            {featuredAchievements.length > 0 ? (
              <div className="divide-y divide-white/6 border-y border-white/6">
                {featuredAchievements.map((achievement) => (
                  <div key={achievement._id} className="py-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      {[achievement.organization, achievement.date].filter(Boolean).join(" • ") || "Highlight"}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{achievement.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{achievement.description}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </RevealSection>

          <RevealSection>
            <div className="divide-y divide-white/6 border-y border-white/6">
              {landingPage.featuredSections.map((item, index) => (
                <Link
                  key={`${item.href}-${item.title}`}
                  href={item.href}
                  className="group flex items-start justify-between gap-6 py-6 transition"
                >
                  <div className="flex gap-5">
                    <span className="w-8 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        {item.label}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white transition group-hover:text-slate-200">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </RevealSection>
        </section>
      </section>
    </PageShell>
  );
}
