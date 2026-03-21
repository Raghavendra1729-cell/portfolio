"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, ExternalLink, GitBranch, TriangleAlert } from "lucide-react";
import type {
  ArchitectureDiagram,
  KeyChallenge,
  TechStackCategory,
  TechnicalSection,
} from "@/models/Project";

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  techStack?: string[];
  techStackBreakdown?: TechStackCategory[];
  architectureDiagrams?: ArchitectureDiagram[];
  keyChallenges?: KeyChallenge[];
  technicalSections?: TechnicalSection[];
  link?: string;
  images?: string[];
  featured?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Projects({
  data,
  showLink = false,
}: {
  data: ProjectItem[];
  showLink?: boolean;
}) {
  if (!data || data.length === 0) return null;

  return (
    <section className="w-full">
      {showLink && (
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Selected Work
            </p>
            <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            View All <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {data.map((project) => {
          const stackPreview = project.techStackBreakdown?.slice(0, 2) ?? [];
          const technicalSignals = [
            {
              icon: Cpu,
              label: `${project.technicalSections?.length ?? 0} writeups`,
              show: Boolean(project.technicalSections?.length),
            },
            {
              icon: GitBranch,
              label: `${project.architectureDiagrams?.length ?? 0} diagrams`,
              show: Boolean(project.architectureDiagrams?.length),
            },
            {
              icon: TriangleAlert,
              label: `${project.keyChallenges?.length ?? 0} challenges`,
              show: Boolean(project.keyChallenges?.length),
            },
          ].filter((signal) => signal.show);

          return (
            <motion.div key={project._id} variants={card}>
              <Link href={`/projects/${project._id}`} className="group block h-full">
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                    {project.images?.[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                          <span className="gradient-text text-2xl font-bold">
                            {project.title[0]}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  <div className="relative flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {technicalSignals.map(({ icon: Icon, label }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1 rounded-full border border-indigo-500/15 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-200"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </span>
                      ))}
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-indigo-300">
                      {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-3 text-sm text-slate-400">
                      {project.description}
                    </p>

                    {stackPreview.length > 0 && (
                      <div className="mb-4 space-y-2 rounded-xl border border-white/8 bg-slate-950/40 p-3">
                        {stackPreview.map((group) => (
                          <div key={group.category}>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              {group.category}
                            </p>
                            <p className="mt-1 line-clamp-1 text-sm text-slate-300">
                              {group.items.join(" • ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.techStack?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
