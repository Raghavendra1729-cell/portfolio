"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Workflow } from "lucide-react";
import { type ProjectRecord } from "@/lib/data";

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
      <div className="command-surface command-outline rounded-[2rem] p-6 text-center sm:p-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-slate-500">
          Projects
        </p>
        <p className="mt-4 text-lg text-slate-300">No projects are available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {data.map((project, index) => {
        const primaryLink = getPrimaryLink(project);
        const projectWindow = getProjectWindow(project);

        return (
          <motion.article
            key={project._id}
            initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.42, delay: index * 0.05 }}
            className="command-surface command-outline overflow-hidden rounded-[2rem]"
          >
            <div className="relative aspect-[16/9] border-b border-white/8 bg-slate-950/55">
              {project.images[0] ? (
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.96))]">
                  <div className="rounded-[1.4rem] border border-cyan-300/18 bg-cyan-300/10 p-5 text-cyan-100">
                    <Workflow className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                    {project.title}
                  </h3>
                  {projectWindow ? (
                    <p className="mt-2 text-sm text-slate-400">{projectWindow}</p>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {project.description || "A project summary will be added here."}
              </p>

              {project.techStack.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-slate-200/85"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/projects/${project._id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/10 px-4 py-2.5 text-sm font-medium text-cyan-50"
                >
                  View project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                {primaryLink ? (
                  <a
                    href={primaryLink.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    {primaryLink.name}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
