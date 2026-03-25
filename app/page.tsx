import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/home/Hero";
import { RevealSection } from "@/components/Reveal";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import PageShell from "@/components/layout/PageShell";
import TiltCard from "@/components/ui/TiltCard";
import { heroIntroLines, heroSignals, homeSections } from "@/content/structure";
import {
  getData,
  getLandingPage,
  getSiteSettings,
  type AchievementRecord,
  type ProjectRecord,
} from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata(pageMetadata.home);

function getPrimaryProjectLink(project: ProjectRecord) {
  const directLinks = [
    project.link ? { name: "Live demo", url: project.link } : null,
    project.repo ? { name: "Repository", url: project.repo } : null,
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

function getLeadSummary(description: string) {
  return (
    description
      .split(/\n+/)
      .map((item) => item.trim())
      .find(Boolean) || "Project details will be added soon."
  );
}

function shouldRenderSection(id: (typeof homeSections)[number]["id"], hasAchievements: boolean) {
  if (id === "achievements") {
    return hasAchievements;
  }

  return true;
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
      <section className="mx-auto max-w-7xl space-y-18">
        <Hero
          siteSettings={siteSettings}
          landingPage={landingPage}
          introLines={heroIntroLines}
          signals={heroSignals}
        />

        {homeSections
          .filter((section) => section.enabled && shouldRenderSection(section.id, featuredAchievements.length > 0))
          .map((section) => {
            if (section.id === "highlights") {
              return (
                <RevealSection key={section.id} id="home-highlights" className="space-y-6">
                  <div className="section-badge">
                    <span>Core signal</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {landingPage.highlightCards.map((item, index) => (
                      <div key={item.title} className="metric-panel surface-cut rounded-[1.5rem] p-6">
                        <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                          {item.title}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </RevealSection>
              );
            }

            if (section.id === "projects" && leadProject) {
              return (
                <section key={section.id} className="space-y-8">
                  <RevealSection className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="section-badge">
                        <span>{landingPage.projectsEyebrow}</span>
                      </div>
                      <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                        {landingPage.projectsTitle}
                      </h2>
                      <p className="mt-4 text-base leading-8 text-slate-400">
                        {landingPage.projectsDescription}
                      </p>
                    </div>
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                    >
                      Browse all projects
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </RevealSection>

                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
                    <RevealSection>
                      <TiltCard>
                        <article className="premium-surface premium-outline surface-cut overflow-hidden">
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
                              <div className="absolute inset-0 premium-grid opacity-30" />
                            )}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.02),rgba(4,6,10,0.7)_100%)]" />
                          </div>

                          <div className="space-y-5 p-6 sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                                  Lead case study
                                </p>
                                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white">
                                  {leadProject.title}
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                                  {getLeadSummary(leadProject.description)}
                                </p>
                              </div>
                              {leadProject.featured ? (
                                <span className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                                  Featured
                                </span>
                              ) : null}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                                <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                                  Stack
                                </p>
                                <p className="mt-2 text-sm text-slate-200">{leadProject.techStack.length} tools</p>
                              </div>
                              <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                                <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                                  Links
                                </p>
                                <p className="mt-2 text-sm text-slate-200">
                                  {leadProject.links.length + Number(Boolean(leadProject.link)) + Number(Boolean(leadProject.repo))}
                                </p>
                              </div>
                              <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                                <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                                  Mode
                                </p>
                                <p className="mt-2 text-sm text-slate-200">
                                  {leadProject.featured ? "Flagship" : "Selected"}
                                </p>
                              </div>
                            </div>

                            {leadProject.techStack.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {leadProject.techStack.slice(0, 6).map((tech) => (
                                  <span
                                    key={tech}
                                    className="surface-cut border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            <div className="flex flex-wrap gap-5 border-t border-white/6 pt-5 text-sm">
                              <Link
                                href={`/projects/${leadProject._id}`}
                                className="inline-flex items-center gap-2 text-white transition hover:text-slate-300"
                              >
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
                            <article className="premium-surface premium-outline surface-cut rounded-[1.6rem] p-6">
                              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                                {project.techStack.slice(0, 2).join(" • ") || "Project"}
                              </p>
                              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                                {project.title}
                              </h3>
                              <p className="mt-3 text-sm leading-7 text-slate-400">
                                {getLeadSummary(project.description)}
                              </p>
                              <div className="mt-5 flex items-center justify-between text-sm">
                                <Link
                                  href={`/projects/${project._id}`}
                                  className="inline-flex items-center gap-2 text-white transition hover:text-slate-300"
                                >
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
                  </div>
                </section>
              );
            }

            if (section.id === "achievements" && featuredAchievements.length > 0) {
              return (
                <section key={section.id} className="space-y-8">
                  <RevealSection className="max-w-3xl">
                    <div className="section-badge">
                      <span>{landingPage.achievementsEyebrow}</span>
                    </div>
                    <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                      {landingPage.achievementsTitle}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-slate-400">
                      {landingPage.achievementsDescription}
                    </p>
                  </RevealSection>

                  <div className="grid gap-4 md:grid-cols-2">
                    {featuredAchievements.map((achievement, index) => (
                      <RevealSection key={achievement._id} delay={index * 0.04}>
                        <article className="premium-surface premium-outline surface-cut h-full p-6">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                              {[achievement.organization, achievement.date].filter(Boolean).join(" • ") || "Highlight"}
                            </p>
                            {achievement.featured ? (
                              <span className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                                Featured
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                            {achievement.title}
                          </h3>
                          <p className="mt-4 text-sm leading-7 text-slate-300">
                            {achievement.description}
                          </p>
                          {achievement.links[0] ? (
                            <a
                              href={achievement.links[0].url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                            >
                              {achievement.links[0].name}
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          ) : null}
                        </article>
                      </RevealSection>
                    ))}
                  </div>
                </section>
              );
            }

            if (section.id === "explore") {
              return (
                <section key={section.id} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <RevealSection className="max-w-xl">
                    <div className="section-badge">
                      <span>{landingPage.exploreEyebrow}</span>
                    </div>
                    <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                      {landingPage.exploreTitle}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-slate-400">
                      {landingPage.exploreDescription}
                    </p>
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
              );
            }

            if (section.id === "contact") {
              return (
                <section key={section.id} className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
                  <RevealSection className="premium-surface premium-outline surface-cut p-6 sm:p-7">
                    <div className="section-badge">
                      <span>{landingPage.contactEyebrow}</span>
                    </div>
                    <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                      {landingPage.contactTitle}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
                      {landingPage.contactDescription}
                    </p>
                    <div className="mt-7">
                      <ResumeActions siteSettings={siteSettings} />
                    </div>
                  </RevealSection>

                  <RevealSection className="space-y-4">
                    <div className="premium-surface premium-outline surface-cut p-6">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                        Contact links
                      </p>
                      <SocialLinks links={siteSettings.socialLinks} variant="pill" className="mt-5" />
                    </div>
                    <div className="metric-panel surface-cut rounded-[1.5rem] p-6">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                        Availability
                      </p>
                      <p className="mt-4 text-lg font-semibold text-white">
                        Open for focused engineering conversations.
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {siteSettings.availability}
                      </p>
                    </div>
                  </RevealSection>
                </section>
              );
            }

            return null;
          })}
      </section>
    </PageShell>
  );
}
