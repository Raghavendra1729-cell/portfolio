import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import type { LandingPageRecord, ProjectRecord } from "@/lib/data";

function getPrimaryProjectLink(project: ProjectRecord) {
  const directLinks = [
    project.link ? { name: "Live demo", url: project.link } : null,
    project.repo ? { name: "Repository", url: project.repo } : null,
    ...project.links,
  ].filter((link): link is { name: string; url: string } => Boolean(link?.url));

  return directLinks[0] || null;
}

function getLeadSummary(description: string) {
  return (
    description
      .split(/\n+/)
      .map((item) => item.trim())
      .find(Boolean) || "Project details will be added soon."
  );
}

export default function FeaturedProjects({
  landingPage,
  projects,
}: {
  landingPage: LandingPageRecord;
  projects: ProjectRecord[];
}) {
  const leadProject = projects[0];

  if (!leadProject) {
    return null;
  }

  const secondaryProjects = projects.slice(1, 3);

  return (
    <section className="space-y-8">
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
                      {leadProject.links.length +
                        Number(Boolean(leadProject.link)) +
                        Number(Boolean(leadProject.repo))}
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
