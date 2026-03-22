"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { type ContentLink, type ProjectRecord } from "@/lib/data";

type ProjectDetailProps = {
  project: ProjectRecord;
};

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

export default function ProjectDetailClient({ project }: ProjectDetailProps) {
  const reducedMotion = useReducedMotion();
  const projectLinks = normalizeLinks(project);
  const descriptionBlocks = project.description
    ? project.description
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="space-y-8"
    >
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <section className="command-surface command-outline rounded-[2rem] p-6 sm:p-7">
        <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          {project.description || "A project description will be added here."}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
          {[project.startDate, project.endDate].filter(Boolean).length > 0 ? (
            <span>{[project.startDate, project.endDate].filter(Boolean).join(" - ")}</span>
          ) : null}
          {project.featured ? <span>Featured</span> : null}
        </div>

        {projectLinks.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {projectLinks.map((link) => (
              <a
                key={`${link.name}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white"
              >
                {link.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        ) : null}
      </section>

      {project.images.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {project.images.map((image, index) => (
            <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-slate-950/55">
              <Image
                src={image}
                alt={`${project.title} screenshot ${index + 1}`}
                width={1400}
                height={900}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="command-surface command-outline rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-white">Details</h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-slate-300">
            {(descriptionBlocks.length > 0 ? descriptionBlocks : [project.description || "Details coming soon."]).map(
              (block) => (
                <p key={block}>{block}</p>
              )
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="command-surface command-outline rounded-[2rem] p-6">
            <h2 className="text-2xl font-semibold text-white">Tech stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.length > 0 ? (
                project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-sm text-slate-200/85"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">Tech stack not available.</p>
              )}
            </div>
          </div>

          {projectLinks.length > 0 ? (
            <div className="command-surface command-outline rounded-[2rem] p-6">
              <h2 className="text-2xl font-semibold text-white">Links</h2>
              <div className="mt-5 grid gap-3">
                {projectLinks.map((link) => (
                  <a
                    key={`${link.name}-${link.url}-reference`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-slate-950/45 px-4 py-3 text-sm text-slate-300"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </motion.div>
  );
}
