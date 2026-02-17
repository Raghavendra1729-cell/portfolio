"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { RevealSection } from "@/components/Reveal";

interface ProjectDetailProps {
  project: any;
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ProjectDetailClient({ project }: ProjectDetailProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-6 pt-32 pb-24"
    >
      <motion.div variants={item}>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>
      </motion.div>

      <motion.header variants={item} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack?.map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              Live Demo <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> Source Code
            </a>
          )}
          {project.links?.map((l: any, i: number) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition flex items-center gap-2"
            >
              {l.name} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </motion.header>

      {/* Images gallery */}
      {project.images?.length > 0 && (
        <motion.div variants={item} className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.images.map((img: string, i: number) => (
              <motion.div
                key={i}
                className="rounded-2xl overflow-hidden border border-white/5"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="w-full h-auto"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.article variants={item} className="prose prose-invert prose-lg max-w-none">
        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
          {project.description}
        </p>
      </motion.article>
    </motion.div>
  );
}
