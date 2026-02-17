"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  techStack?: string[];
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-1">
              Selected Work
            </p>
            <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
          </div>
          <Link
            href="/projects"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            View All <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {data.map((project) => (
          <motion.div key={project._id} variants={card}>
            <Link
              href={`/projects/${project._id}`}
              className="group block h-full"
            >
              <article className="relative h-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col">
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)]" />

                {/* Image */}
                <div className="relative h-44 w-full bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {project.images?.[0] ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <span className="text-2xl font-bold gradient-text">
                          {project.title[0]}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                <div className="flex-1 p-5 flex flex-col relative">
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.techStack?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}