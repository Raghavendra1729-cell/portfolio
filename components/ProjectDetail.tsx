"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Braces,
  ExternalLink,
  Github,
  GitBranch,
  Layers3,
  Network,
  TriangleAlert,
} from "lucide-react";
import type {
  ArchitectureDiagram,
  KeyChallenge,
  ProjectLink,
  TechStackCategory,
  TechnicalSection,
} from "@/models/Project";

interface ProjectDetail {
  title: string;
  description?: string;
  techStack?: string[];
  techStackBreakdown?: TechStackCategory[];
  architectureDiagrams?: ArchitectureDiagram[];
  keyChallenges?: KeyChallenge[];
  technicalSections?: TechnicalSection[];
  systemDesign?: string;
  link?: string;
  repo?: string;
  links?: ProjectLink[];
  images?: string[];
}

interface ProjectDetailProps {
  project: ProjectDetail;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const sectionTitleClass =
  "mb-4 flex items-center gap-2 text-lg font-semibold text-white";

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm">
      <h2 className={sectionTitleClass}>
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function renderSection(section: TechnicalSection) {
  if (section.type === "code" && section.code) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>{section.title}</span>
          <span>{section.language ?? "snippet"}</span>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-200">
          <code>{section.code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {section.type ?? "overview"}
        </span>
        <h3 className="text-base font-semibold text-white">{section.title}</h3>
      </div>
      {section.content && (
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
          {section.content}
        </p>
      )}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ProjectDetailClient({ project }: ProjectDetailProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-6xl px-6 pb-24 pt-32"
    >
      <motion.div variants={item}>
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
      </motion.div>

      <motion.header variants={item} className="mb-10">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="max-w-3xl whitespace-pre-wrap text-base leading-8 text-slate-300 md:text-lg">
                {project.description}
              </p>
            )}
          </div>

          <div className="grid min-w-[220px] gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300 md:max-w-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Tech groups</span>
              <span>{project.techStackBreakdown?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Architecture views</span>
              <span>{project.architectureDiagrams?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Challenges solved</span>
              <span>{project.keyChallenges?.length ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500"
            >
              Live Demo <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-medium text-white transition hover:bg-white/10"
            >
              <Github className="h-4 w-4" /> Source Code
            </a>
          )}
          {project.links?.map((l) => (
            <a
              key={`${l.name}-${l.url}`}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-medium text-white transition hover:bg-white/10"
            >
              {l.name} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </motion.header>

      {project.images?.length ? (
        <motion.div variants={item} className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/8 bg-slate-950/40">
            <Image
              src={project.images[0]}
              alt={`${project.title} primary screenshot`}
              fill
              sizes="(min-width: 1280px) 800px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {project.images.slice(1).map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="relative min-h-[220px] overflow-hidden rounded-3xl border border-white/8 bg-slate-950/40"
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${index + 2}`}
                  fill
                  sizes="(min-width: 1024px) 320px, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <motion.div variants={item} className="space-y-6">
          {(project.systemDesign || project.technicalSections?.length) && (
            <SectionCard title="System Design & Technical Writeup" icon={<Network className="h-4 w-4" />}>
              {project.systemDesign && (
                <p className="mb-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {project.systemDesign}
                </p>
              )}
              <div className="space-y-4">
                {project.technicalSections?.map((section) => (
                  <div key={`${section.title}-${section.type ?? 'section'}`}>
                    {renderSection(section)}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {project.architectureDiagrams?.length ? (
            <SectionCard title="Architecture Diagrams" icon={<GitBranch className="h-4 w-4" />}>
              <div className="grid gap-4 md:grid-cols-2">
                {project.architectureDiagrams.map((diagram) => (
                  <article
                    key={`${diagram.title}-${diagram.imageUrl ?? diagram.caption ?? 'diagram'}`}
                    className="overflow-hidden rounded-2xl border border-white/8 bg-slate-950/40"
                  >
                    {diagram.imageUrl ? (
                      <div className="relative h-52 w-full">
                        <Image
                          src={diagram.imageUrl}
                          alt={diagram.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-52 items-center justify-center border-b border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_60%)] text-sm text-slate-500">
                        Diagram placeholder
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-white">{diagram.title}</h3>
                      {diagram.description && (
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {diagram.description}
                        </p>
                      )}
                      {diagram.caption && (
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {diagram.caption}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>
          ) : null}
        </motion.div>

        <motion.aside variants={item} className="space-y-6">
          {project.techStackBreakdown?.length ? (
            <SectionCard title="Tech Stack Breakdown" icon={<Layers3 className="h-4 w-4" />}>
              <div className="space-y-4">
                {project.techStackBreakdown.map((group) => (
                  <div
                    key={group.category}
                    className="rounded-2xl border border-white/8 bg-slate-950/35 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {group.category}
                      </h3>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                        {group.items.length} items
                      </span>
                    </div>
                    {group.summary && (
                      <p className="mb-3 text-sm leading-7 text-slate-300">
                        {group.summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {project.keyChallenges?.length ? (
            <SectionCard title="Key Challenges" icon={<TriangleAlert className="h-4 w-4" />}>
              <div className="space-y-4">
                {project.keyChallenges.map((challenge) => (
                  <article
                    key={challenge.title}
                    className="rounded-2xl border border-white/8 bg-slate-950/35 p-4"
                  >
                    <h3 className="text-base font-semibold text-white">
                      {challenge.title}
                    </h3>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-slate-300">
                      <p>
                        <span className="font-medium text-slate-100">Problem:</span>{" "}
                        {challenge.problem}
                      </p>
                      {challenge.solution && (
                        <p>
                          <span className="font-medium text-slate-100">Solution:</span>{" "}
                          {challenge.solution}
                        </p>
                      )}
                      {challenge.outcome && (
                        <p>
                          <span className="font-medium text-slate-100">Outcome:</span>{" "}
                          {challenge.outcome}
                        </p>
                      )}
                    </div>
                    {challenge.bullets && challenge.bullets.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm text-slate-300">
                        {challenge.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <Braces className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </SectionCard>
          ) : null}
        </motion.aside>
      </div>
    </motion.div>
  );
}
