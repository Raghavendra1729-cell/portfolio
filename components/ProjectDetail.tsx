"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { type ContentLink, type ProjectRecord } from "@/lib/data";
import { SECTION_TRANSITION } from "@/lib/motion";

type ProjectDetailProps = {
  project: ProjectRecord;
};

type StructuredDetails = {
  problem?: string;
  approach?: string;
  outcome?: string;
  extra: string[];
};

function getProjectWindow(project: ProjectRecord) {
  const dates = [project.startDate, project.endDate].filter(Boolean);

  if (dates.length > 0) {
    return dates.join(" - ");
  }

  return project.featured ? "Featured project" : "Selected project";
}

function getDescriptionBlocks(description: string) {
  return description
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeLinks(project: ProjectRecord) {
  const seen = new Set<string>();
  const links: ContentLink[] = [
    project.link ? { name: "Live Demo", url: project.link } : null,
    project.repo ? { name: "Repository", url: project.repo } : null,
    ...project.links,
  ].filter((link): link is ContentLink => Boolean(link?.url));

  return links.filter((link) => {
    if (seen.has(link.url)) {
      return false;
    }

    seen.add(link.url);
    return true;
  });
}

function parseProjectDescription(description: string): StructuredDetails {
  const blocks = getDescriptionBlocks(description);

  const result: StructuredDetails = { extra: [] };

  blocks.forEach((block) => {
    const lower = block.toLowerCase();

    if (!result.problem && (lower.startsWith("problem:") || lower.startsWith("challenge:"))) {
      result.problem = block.replace(/^[^:]+:\s*/i, "");
      return;
    }

    if (!result.approach && (lower.startsWith("approach:") || lower.startsWith("solution:"))) {
      result.approach = block.replace(/^[^:]+:\s*/i, "");
      return;
    }

    if (!result.outcome && (lower.startsWith("outcome:") || lower.startsWith("impact:"))) {
      result.outcome = block.replace(/^[^:]+:\s*/i, "");
      return;
    }

    result.extra.push(block);
  });

  if (!result.problem && result.extra.length > 0) {
    result.problem = result.extra[0];
    result.extra = result.extra.slice(1);
  }

  return result;
}

export default function ProjectDetailClient({ project }: ProjectDetailProps) {
  const reducedMotion = useReducedMotion();
  const projectLinks = normalizeLinks(project);
  const projectWindow = getProjectWindow(project);
  const descriptionBlocks = getDescriptionBlocks(project.description || "");
  const structured = parseProjectDescription(project.description || "");
  const leadSummary =
    descriptionBlocks[0] ||
    "This project case study will be expanded with implementation details shortly.";
  const showcaseImage = project.images[0];
  const galleryImages = project.images.slice(1);
  const showProblemSection = Boolean(
    structured.problem && structured.problem !== leadSummary
  );
  const hasNarrative =
    showProblemSection ||
    Boolean(structured.approach) ||
    Boolean(structured.outcome) ||
    structured.extra.length > 0;

  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={SECTION_TRANSITION}
      className="space-y-10"
    >
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <section className="grid gap-10 border-b border-white/6 pb-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
            <span>Case study</span>
            <span className="h-px w-10 bg-white/10" />
            <span>{projectWindow}</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.08em] text-white sm:text-5xl lg:text-[4.6rem] lg:leading-[0.95]">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {leadSummary}
          </p>

          {projectLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {projectLinks.map((link, index) => (
                <a
                  key={`${link.name}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    index === 0
                      ? "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-medium text-slate-950"
                      : "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white"
                  }
                >
                  {link.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="divide-y divide-white/6 border-y border-white/6">
          <div className="py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Timeline
            </p>
            <p className="mt-3 text-sm text-slate-200">{projectWindow}</p>
          </div>
          <div className="py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Status
            </p>
            <p className="mt-3 text-sm text-slate-200">
              {project.featured ? "Featured in portfolio" : "Archived case study"}
            </p>
          </div>
          <div className="py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Stack
            </p>
            <p className="mt-3 text-sm text-slate-200">
              {project.techStack.length > 0
                ? `${project.techStack.length} technologies`
                : "Stack not specified"}
            </p>
          </div>
          <div className="py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
              External links
            </p>
            <p className="mt-3 text-sm text-slate-200">
              {projectLinks.length > 0 ? `${projectLinks.length} references` : "No links available"}
            </p>
          </div>
        </div>
      </section>

      {showcaseImage ? (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-black/35">
            <Image
              src={showcaseImage}
              alt={`${project.title} screenshot 1`}
              width={1600}
              height={1000}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/35"
                >
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${index + 2}`}
                    width={1200}
                    height={900}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          {showProblemSection ? (
            <section className="border-t border-white/6 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Problem
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                {structured.problem}
              </p>
            </section>
          ) : null}

          {structured.approach ? (
            <section className="border-t border-white/6 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Approach
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                {structured.approach}
              </p>
            </section>
          ) : null}

          {structured.outcome ? (
            <section className="border-t border-white/6 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Outcome
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                {structured.outcome}
              </p>
            </section>
          ) : null}

          {structured.extra.length > 0 ? (
            <section className="border-t border-white/6 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Additional context
              </p>
              <div className="mt-4 space-y-4 max-w-3xl text-base leading-8 text-slate-300">
                {structured.extra.map((block) => (
                  <p key={block}>{block}</p>
                ))}
              </div>
            </section>
          ) : null}

          {!hasNarrative ? (
            <section className="border-t border-white/6 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Overview
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                {project.description || "Detailed project notes will be added soon."}
              </p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-8">
          <section className="premium-surface premium-outline rounded-[1.8rem] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Tech stack
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.length > 0 ? (
                project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-200/85"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                  <p className="text-sm text-slate-400">Tech stack not available.</p>
              )}
            </div>
          </section>

          {projectLinks.length > 0 ? (
            <section className="premium-surface premium-outline rounded-[1.8rem] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Links
              </p>
              <div className="mt-5 divide-y divide-white/6 border-y border-white/6">
                {projectLinks.map((link) => (
                  <a
                    key={`${link.name}-${link.url}-reference`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between py-4 text-sm text-slate-300"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-500" />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>
    </motion.div>
  );
}
