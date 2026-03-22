"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarRange,
  Layers3,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import Link from "next/link";
import SectionFrame from "@/components/home/SectionFrame";
import { cn } from "@/lib/utils";

type ProjectRecord = {
  slug: string;
  title: string;
  badge: string;
  subtitle: string;
  period: string;
  description: string;
  detail: string;
  stats: Array<{ label: string; value: string }>;
  techStack: string[];
  highlights: string[];
  primaryLink: string;
  secondaryLink: string;
  accent: string;
};

const projects: ProjectRecord[] = [
  {
    slug: "lost-n-found",
    title: "Lost n Found",
    badge: "Realtime Ops",
    subtitle: "MERN + Socket.IO incident board for missing-item recovery.",
    period: "2025",
    description:
      "A two-sided workflow where reports, chats, and evidence sync across devices in real time.",
    detail:
      "Built as a real-time recovery platform with live claim updates, media sharing, and workflow-driven triage so campus communities can move from report to resolution without waiting on manual refreshes.",
    stats: [
      { label: "Transport", value: "Socket.IO" },
      { label: "Runtime", value: "MERN" },
      { label: "Experience", value: "Live case feed" },
    ],
    techStack: ["MongoDB", "Express", "React", "Node.js", "Socket.IO", "Cloudinary"],
    highlights: [
      "Live report ingestion with optimistic status updates.",
      "Evidence gallery flow with media previews and claim context.",
      "Split-view concept designed for mobile + desktop operator handoff.",
    ],
    primaryLink: "/projects/lost-n-found",
    secondaryLink: "https://github.com/raghavendra1729-cell",
    accent:
      "from-cyan-400/30 via-sky-500/20 to-indigo-500/10",
  },
  {
    slug: "hostel-hub",
    title: "Hostel Hub",
    badge: "Hackathon Build",
    subtitle: "Inventory and request orchestration for hostel operations.",
    period: "2025",
    description:
      "A fast-moving logistics dashboard that helped the team place 7th out of 150+ teams.",
    detail:
      "Hostel Hub centralizes stock movement, room-level requests, and maintenance visibility into a single command surface so wardens can identify low inventory, track issue history, and allocate supplies faster.",
    stats: [
      { label: "Finish", value: "Top 7 / 150+" },
      { label: "Focus", value: "Inventory ops" },
      { label: "UX", value: "Action dashboard" },
    ],
    techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS", "Node.js"],
    highlights: [
      "Low-stock signals prioritized by hostel block and category.",
      "Task routing for maintenance, mess, and admin workflows.",
      "Hackathon-ready execution with clear operational storytelling.",
    ],
    primaryLink: "/projects/hostel-hub",
    secondaryLink: "https://github.com/raghavendra1729-cell",
    accent:
      "from-violet-400/30 via-fuchsia-500/20 to-cyan-500/10",
  },
  {
    slug: "sleep-quality-predictor",
    title: "Sleep Quality Predictor",
    badge: "ML Insight",
    subtitle: "Random Forest model with interpretable wellness signals.",
    period: "2024",
    description:
      "Transforms lifestyle inputs into sleep predictions with confidence-led storytelling.",
    detail:
      "The project explores feature-driven sleep analysis using a Random Forest pipeline, surfacing prediction confidence, the most influential lifestyle variables, and an approachable view of model outcomes for non-technical users.",
    stats: [
      { label: "Model", value: "Random Forest" },
      { label: "Accuracy", value: "86%" },
      { label: "Surface", value: "Explainable UI" },
    ],
    techStack: ["Python", "scikit-learn", "Pandas", "Matplotlib", "Jupyter"],
    highlights: [
      "Feature-prep workflow built for quick experimentation and retraining.",
      "Confidence-led output designed for intuitive interpretation.",
      "Pairs data storytelling with practical health-tech framing.",
    ],
    primaryLink: "/projects/sleep-quality-predictor",
    secondaryLink: "https://github.com/raghavendra1729-cell",
    accent:
      "from-emerald-400/30 via-teal-500/20 to-cyan-500/10",
  },
  {
    slug: "multi-threaded-http-server",
    title: "Multi-threaded HTTP Server",
    badge: "Systems Lab",
    subtitle: "Concurrent Python server built from sockets and worker threads.",
    period: "2024",
    description:
      "A lower-level networking project focused on concurrency, request handling, and observability.",
    detail:
      "Engineered from raw sockets, this server demonstrates request parsing, thread-based concurrency, and the mechanics behind serving responses under load, giving the portfolio a systems-oriented anchor beyond product UI work.",
    stats: [
      { label: "Language", value: "Python" },
      { label: "Core", value: "Threads" },
      { label: "Topic", value: "Networking" },
    ],
    techStack: ["Python", "Sockets", "Threading", "HTTP", "Systems Design"],
    highlights: [
      "Concurrent worker strategy for overlapping client requests.",
      "Manual parsing of request lines, headers, and response codes.",
      "Useful teaching artifact for low-level backend concepts.",
    ],
    primaryLink: "/projects/multi-threaded-http-server",
    secondaryLink: "https://github.com/raghavendra1729-cell",
    accent:
      "from-amber-400/30 via-orange-500/20 to-rose-500/10",
  },
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function ProjectCard({
  project,
  isActive,
  onOpen,
}: {
  project: ProjectRecord;
  isActive: boolean;
  onOpen: (project: ProjectRecord) => void;
}) {
  const [pointerStyle, setPointerStyle] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handlePointerMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;

    setPointerStyle({
      rotateY: (relativeX - 0.5) * 16,
      rotateX: (0.5 - relativeY) * 14,
      scale: 1.015,
    });
  };

  return (
    <motion.button
      type="button"
      layoutId={`project-card-${project.slug}`}
      onClick={() => onOpen(project)}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setPointerStyle({ rotateX: 0, rotateY: 0, scale: 1 })}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-0 text-left shadow-[0_24px_60px_rgba(2,6,23,0.32)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
        isActive && "pointer-events-none opacity-0"
      )}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1600px) rotateX(${pointerStyle.rotateX}deg) rotateY(${pointerStyle.rotateY}deg) scale(${pointerStyle.scale})`,
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      aria-haspopup="dialog"
      aria-expanded={isActive}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", project.accent)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.65))]" />
      <div className="relative flex h-full flex-col gap-6 p-6 [transform:translateZ(36px)]">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cyan-100/90">
            {project.badge}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-300/80">
            {project.period}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{project.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-200/88">{project.subtitle}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {project.stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 text-sm text-slate-100/90">
          <span className="max-w-xs leading-6 text-slate-300">{project.description}</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 font-medium text-white">
            Inspect <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function ProjectsShowcaseSection() {
  const [activeProject, setActiveProject] = useState<ProjectRecord | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const orderedProjects = useMemo(() => projects, []);

  useEffect(() => {
    if (!activeProject) {
      return undefined;
    }

    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveProject(null);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable?.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedElement.current?.focus();
    };
  }, [activeProject]);

  return (
    <SectionFrame
      id="projects-showcase"
      eyebrow="Projects Showcase"
      title="Project stories now unfold like product surfaces, not static thumbnails."
      description="Each module opens into a guided deep dive with motion-led continuity, systems context, and keyboard-friendly exploration so visitors can inspect work without losing their place in the page."
    >
      <LayoutGroup>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {orderedProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              isActive={activeProject?.slug === project.slug}
              onOpen={setActiveProject}
            />
          ))}
        </div>

        <AnimatePresence>
          {activeProject ? (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                type="button"
                className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-md"
                onClick={() => setActiveProject(null)}
                aria-label="Close expanded project view"
              />

              <motion.div
                ref={dialogRef}
                layoutId={`project-card-${activeProject.slug}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`project-title-${activeProject.slug}`}
                className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-[0_30px_120px_rgba(2,6,23,0.7)]"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", activeProject.accent)} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.88)),radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_24%)]" />

                <div className="relative overflow-y-auto p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cyan-100/90">
                          {activeProject.badge}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
                          <CalendarRange className="h-3.5 w-3.5" />
                          {activeProject.period}
                        </span>
                      </div>
                      <h3
                        id={`project-title-${activeProject.slug}`}
                        className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl"
                      >
                        {activeProject.title}
                      </h3>
                      <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200/88 sm:text-lg">
                        {activeProject.detail}
                      </p>
                    </div>

                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setActiveProject(null)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        {activeProject.stats.map((stat) => (
                          <motion.div
                            key={stat.label}
                            layout
                            className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5"
                          >
                            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
                              {stat.label}
                            </p>
                            <p className="mt-3 text-lg font-semibold text-white">{stat.value}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6">
                        <div className="flex items-center gap-3 text-cyan-200">
                          <Workflow className="h-5 w-5" />
                          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-100/70">
                            Mission highlights
                          </p>
                        </div>
                        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200/90">
                          {activeProject.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-3">
                              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6">
                        <div className="flex items-center gap-3 text-violet-200">
                          <Layers3 className="h-5 w-5" />
                          <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-100/70">
                            Stack matrix
                          </p>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {activeProject.techStack.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-slate-100"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
                          Next move
                        </p>
                        <div className="mt-5 space-y-3">
                          <Link
                            href={activeProject.primaryLink}
                            className="inline-flex w-full items-center justify-between rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-50 hover:bg-cyan-400/15"
                          >
                            Open detail route
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href={activeProject.secondaryLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white hover:bg-white/12"
                          >
                            View source / profile
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
    </SectionFrame>
  );
}
