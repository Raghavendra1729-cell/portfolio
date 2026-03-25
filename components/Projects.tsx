"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Workflow } from "lucide-react";
import { type ProjectRecord } from "@/lib/data";
import { SECTION_TRANSITION } from "@/lib/motion";
import TiltCard from "@/components/ui/TiltCard";

function getProjectWindow(project: ProjectRecord) {
  const dates = [project.startDate, project.endDate].filter(Boolean);

  if (dates.length > 0) {
    return dates.join(" - ");
  }

  return project.featured ? "Featured" : "";
}

function getPrimaryLink(project: ProjectRecord) {
  const directLinks = [
    project.link ? { name: "Live Demo", url: project.link } : null,
    project.repo ? { name: "Repository", url: project.repo } : null,
    ...project.links,
  ].filter((link): link is { name: string; url: string } => Boolean(link?.url));

  return directLinks[0] || null;
}

export default function Projects({ data }: { data: ProjectRecord[] }) {
  const reducedMotion = useReducedMotion();

  if (!data.length) {
    return (
      <div className="border-y border-white/6 py-10">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-slate-500">
          Projects
        </p>
        <p className="mt-4 text-lg text-slate-300">No projects are available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {data.map((project, index) => {
        const primaryLink = getPrimaryLink(project);
        const projectWindow = getProjectWindow(project);

        return (
          <motion.div
            key={project._id}
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...SECTION_TRANSITION, delay: index * 0.04 }}
          >
            <TiltCard className="h-full">
              <article className="premium-surface premium-outline group h-full overflow-hidden rounded-[2rem]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
                  <div className="order-2 p-6 sm:p-7 lg:order-1 lg:p-8">
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-white/10" />
                      <span>{projectWindow || "Selected project"}</span>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white">
                          {project.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                          {project.description || "Project details will be added soon."}
                        </p>
                      </div>
                      {project.featured ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/6 pt-5 text-sm text-slate-500">
                      <span>{project.techStack.length} technologies</span>
                      <span>{project.links.length + Number(Boolean(project.link)) + Number(Boolean(project.repo))} links</span>
                      {project.techStack[0] ? <span>{project.techStack.slice(0, 3).join(" • ")}</span> : null}
                    </div>

                    {project.techStack.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-5 text-sm">
                      <Link
                        href={`/projects/${project._id}`}
                        className="inline-flex items-center gap-2 text-white transition hover:text-slate-300"
                      >
                        Open case study
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>

                      {primaryLink ? (
                        <a
                          href={primaryLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-slate-500 transition hover:text-white"
                        >
                          {primaryLink.name}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="order-1 relative min-h-[18rem] border-b border-white/8 bg-black/35 lg:order-2 lg:border-b-0 lg:border-l">
                    {project.images[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={`${project.title} preview`}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,rgba(8,10,16,0.72),rgba(3,4,7,0.96))]">
                        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-5 text-slate-200">
                          <Workflow className="h-8 w-8" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}
