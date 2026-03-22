"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BrainCircuit, Code2, DatabaseZap, Flame, Layers3 } from "lucide-react";
import SectionFrame from "@/components/home/SectionFrame";
import ScrollProgressIndicator from "@/components/home/ScrollProgressIndicator";
import { cn } from "@/lib/utils";

type SkillCategory = "All" | "Backend" | "LLD" | "Machine Learning" | "Frontend";

type SkillChip = {
  name: string;
  category: Exclude<SkillCategory, "All">;
  signal: string;
};

type CPStatRecord = {
  platform: string;
  headline: string;
  subheadline: string;
  value: string;
  accent: string;
  source: "live" | "fallback";
};

type CPStatsResponse = {
  syncedAt: string;
  summary: {
    totalSolved: number;
    activePlatforms: number;
  };
  platforms: CPStatRecord[];
};

const filters: SkillCategory[] = ["All", "Backend", "LLD", "Machine Learning", "Frontend"];

const skills: SkillChip[] = [
  { name: "Node.js APIs", category: "Backend", signal: "Latency aware" },
  { name: "MongoDB Schema Design", category: "Backend", signal: "Document modeling" },
  { name: "Socket.IO Realtime Flows", category: "Backend", signal: "Bidirectional events" },
  { name: "Threaded Server Architecture", category: "LLD", signal: "Concurrency primitives" },
  { name: "REST + Auth Contracts", category: "LLD", signal: "Interface clarity" },
  { name: "Object Modeling", category: "LLD", signal: "Stateful systems" },
  { name: "Random Forest Pipelines", category: "Machine Learning", signal: "Feature-driven" },
  { name: "Model Evaluation", category: "Machine Learning", signal: "Accuracy + confidence" },
  { name: "Data Cleaning", category: "Machine Learning", signal: "Reliable training" },
  { name: "Next.js App Router", category: "Frontend", signal: "Composable UI" },
  { name: "Framer Motion", category: "Frontend", signal: "Stateful transitions" },
  { name: "Tailwind Systems", category: "Frontend", signal: "Token-led styling" },
];

const fallbackStats: CPStatsResponse = {
  syncedAt: "Cached snapshot",
  summary: {
    totalSolved: 1050,
    activePlatforms: 3,
  },
  platforms: [
    {
      platform: "LeetCode",
      headline: "365-day streak",
      subheadline: "700+ solved problems",
      value: "700+",
      accent: "from-amber-300/35 to-yellow-500/10",
      source: "fallback",
    },
    {
      platform: "Codeforces",
      headline: "Pupil",
      subheadline: "Max rating 1210",
      value: "1210",
      accent: "from-cyan-300/35 to-sky-500/10",
      source: "fallback",
    },
    {
      platform: "CodeChef",
      headline: "3-star profile",
      subheadline: "Max rating 1680",
      value: "1680",
      accent: "from-violet-300/35 to-fuchsia-500/10",
      source: "fallback",
    },
  ],
};

function StatIcon({ platform }: { platform: string }) {
  if (platform === "LeetCode") {
    return <Flame className="h-5 w-5 text-amber-300" />;
  }

  if (platform === "Codeforces") {
    return <Activity className="h-5 w-5 text-cyan-300" />;
  }

  return <BrainCircuit className="h-5 w-5 text-violet-300" />;
}

export default function SkillsHudSection() {
  const [activeFilter, setActiveFilter] = useState<SkillCategory>("All");
  const [stats, setStats] = useState<CPStatsResponse>(fallbackStats);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/cp-stats", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as CPStatsResponse;
        if (!cancelled) {
          setStats(payload);
        }
      } catch {
        // Keep fallback widget data when live fetch is unavailable.
      }
    };

    void fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSkills = useMemo(() => {
    if (activeFilter === "All") {
      return skills;
    }

    return skills.filter((skill) => skill.category === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <ScrollProgressIndicator />
      <SectionFrame
        eyebrow="Skills HUD"
        title="A filtered command surface for engineering breadth and competitive momentum."
        description="Tabs, motion-driven re-layout, and live CP snapshots turn the skills section into a readable operations board instead of a static tag cloud."
      >
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.36)] backdrop-blur-xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-slate-500">
                  Capability matrix
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Filter by discipline
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                      activeFilter === filter
                        ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                        : "border-white/10 bg-slate-950/45 text-slate-300 hover:border-white/20 hover:text-white"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={`${activeFilter}-${skill.name}`}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.94 }}
                    transition={{ duration: 0.22, delay: index * 0.02 }}
                    className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-slate-400">
                        {skill.category}
                      </span>
                      <Code2 className="h-4 w-4 text-cyan-300" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-white">{skill.name}</p>
                    <p className="mt-2 text-sm text-slate-400">{skill.signal}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-slate-500">
                    Competitive pulse
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Synced metrics widget
                  </h3>
                </div>
                <DatabaseZap className="h-5 w-5 text-cyan-300" />
              </div>

              <div className="mt-5 grid gap-4">
                {stats.platforms.map((platform) => (
                  <motion.div
                    key={platform.platform}
                    layout
                    className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5"
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", platform.accent)} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.1),rgba(2,6,23,0.85))]" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <StatIcon platform={platform.platform} />
                          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-slate-300/90">
                            {platform.platform}
                          </p>
                        </div>
                        <p className="mt-4 text-xl font-semibold text-white">{platform.headline}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{platform.subheadline}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-right">
                        <p className="text-lg font-semibold text-white">{platform.value}</p>
                        <p className="text-[0.68rem] uppercase tracking-[0.25em] text-slate-400">
                          {platform.source}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Layers3 className="h-4 w-4 text-violet-300" />
                  <span>
                    {stats.summary.totalSolved}+ tracked solves across {stats.summary.activePlatforms} platforms
                  </span>
                </div>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
                  {stats.syncedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionFrame>
    </>
  );
}
