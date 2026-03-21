import { getData } from "@/lib/data";
import {
  Activity,
  Code2,
  Database,
  Flame,
  Globe,
  Layers3,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RawCPProfile = {
  _id?: string;
  platform?: string;
  username?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  solvedCount?: number;
  profileUrl?: string;
  ratingHistory?: Array<{ label?: string; date?: string; rating?: number }>;
  problemCounts?: {
    total?: number;
    easy?: number;
    medium?: number;
    hard?: number;
    contest?: number;
  };
  topicBreakdown?: Array<{ topic?: string; count?: number; percentage?: number }>;
  languageStats?: Array<{
    language?: string;
    problemsSolved?: number;
    percentage?: number;
  }>;
  dataSource?: "seed" | "manual" | "cached" | "live";
  lastSyncedAt?: string;
  fallbackEnabled?: boolean;
};

type RatingPoint = { label: string; rating: number };
type BreakdownItem = { label: string; count: number; percentage: number };

type NormalizedProfile = {
  id: string;
  platform: string;
  username: string;
  rating: number;
  maxRating: number;
  rank: string;
  solvedCount: number;
  profileUrl: string;
  ratingHistory: RatingPoint[];
  problemCounts: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    contest: number;
  };
  topicBreakdown: BreakdownItem[];
  languageStats: BreakdownItem[];
  dataSource: "seed" | "manual" | "cached" | "live";
  lastSyncedAt?: string;
  fallbackEnabled: boolean;
};

const FALLBACK_PROFILES: NormalizedProfile[] = [
  {
    id: "leetcode-fallback",
    platform: "LeetCode",
    username: "raghavendra1729",
    rating: 1750,
    maxRating: 1788,
    rank: "Knight",
    solvedCount: 700,
    profileUrl: "https://leetcode.com/u/raghavendra1729",
    ratingHistory: [
      { label: "2024 Q2", rating: 1520 },
      { label: "2024 Q3", rating: 1604 },
      { label: "2024 Q4", rating: 1688 },
      { label: "2025 Q1", rating: 1726 },
      { label: "2025 Q2", rating: 1750 },
    ],
    problemCounts: { total: 700, easy: 260, medium: 330, hard: 110, contest: 48 },
    topicBreakdown: [
      { label: "DP", count: 132, percentage: 19 },
      { label: "Graphs", count: 120, percentage: 17 },
      { label: "Binary Search", count: 86, percentage: 12 },
      { label: "Greedy", count: 98, percentage: 14 },
    ],
    languageStats: [
      { label: "C++", count: 430, percentage: 61 },
      { label: "Java", count: 210, percentage: 30 },
      { label: "Python", count: 60, percentage: 9 },
    ],
    dataSource: "cached",
    lastSyncedAt: "Cached snapshot",
    fallbackEnabled: true,
  },
  {
    id: "codeforces-fallback",
    platform: "Codeforces",
    username: "raghavendra_cf",
    rating: 1210,
    maxRating: 1296,
    rank: "Pupil",
    solvedCount: 150,
    profileUrl: "https://codeforces.com/profile/raghavendra_cf",
    ratingHistory: [
      { label: "Contest 1", rating: 942 },
      { label: "Contest 4", rating: 1048 },
      { label: "Contest 8", rating: 1142 },
      { label: "Contest 12", rating: 1184 },
      { label: "Contest 16", rating: 1210 },
    ],
    problemCounts: { total: 150, easy: 54, medium: 70, hard: 26, contest: 24 },
    topicBreakdown: [
      { label: "Implementation", count: 44, percentage: 29 },
      { label: "Math", count: 26, percentage: 17 },
      { label: "Greedy", count: 24, percentage: 16 },
      { label: "Data Structures", count: 18, percentage: 12 },
    ],
    languageStats: [
      { label: "C++", count: 132, percentage: 88 },
      { label: "Java", count: 12, percentage: 8 },
      { label: "Python", count: 6, percentage: 4 },
    ],
    dataSource: "cached",
    lastSyncedAt: "Cached snapshot",
    fallbackEnabled: true,
  },
  {
    id: "codechef-fallback",
    platform: "CodeChef",
    username: "raghavendra_cc",
    rating: 1680,
    maxRating: 1712,
    rank: "3-Star",
    solvedCount: 200,
    profileUrl: "https://www.codechef.com/users/raghavendra_cc",
    ratingHistory: [
      { label: "2024 Jan", rating: 1410 },
      { label: "2024 Apr", rating: 1496 },
      { label: "2024 Aug", rating: 1568 },
      { label: "2025 Jan", rating: 1634 },
      { label: "2025 Mar", rating: 1680 },
    ],
    problemCounts: { total: 200, easy: 80, medium: 86, hard: 34, contest: 30 },
    topicBreakdown: [
      { label: "Arrays", count: 40, percentage: 20 },
      { label: "Ad Hoc", count: 34, percentage: 17 },
      { label: "Dynamic Programming", count: 31, percentage: 16 },
      { label: "Trees", count: 21, percentage: 11 },
    ],
    languageStats: [
      { label: "C++", count: 124, percentage: 62 },
      { label: "Java", count: 66, percentage: 33 },
      { label: "Python", count: 10, percentage: 5 },
    ],
    dataSource: "cached",
    lastSyncedAt: "Cached snapshot",
    fallbackEnabled: true,
  },
];

const TOPIC_COLORS = [
  "bg-cyan-400/80",
  "bg-emerald-400/80",
  "bg-violet-400/80",
  "bg-amber-400/80",
  "bg-rose-400/80",
];

export const revalidate = 3600;

function clampNumber(value: number | undefined, fallback = 0) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

function normalizeBreakdown(
  items: Array<{ topic?: string; language?: string; count?: number; problemsSolved?: number; percentage?: number }> | undefined,
  labelKey: "topic" | "language"
): BreakdownItem[] {
  return (items ?? [])
    .map((item) => {
      const rawLabel = labelKey === "topic" ? item.topic : item.language;
      const count = clampNumber(item.count ?? item.problemsSolved, 0);
      const percentage = clampNumber(item.percentage, 0);

      return {
        label: rawLabel?.trim() || "Unknown",
        count,
        percentage,
      };
    })
    .filter((item) => item.count > 0 || item.percentage > 0)
    .sort((a, b) => b.count - a.count || b.percentage - a.percentage);
}

function normalizeProfile(profile: RawCPProfile, index: number): NormalizedProfile {
  const solvedCount = clampNumber(profile.solvedCount, 0);
  const problemCounts = {
    total: clampNumber(profile.problemCounts?.total, solvedCount),
    easy: clampNumber(profile.problemCounts?.easy, 0),
    medium: clampNumber(profile.problemCounts?.medium, 0),
    hard: clampNumber(profile.problemCounts?.hard, 0),
    contest: clampNumber(profile.problemCounts?.contest, 0),
  };

  const ratingHistory = (profile.ratingHistory ?? [])
    .map((point, pointIndex) => ({
      label: point.label?.trim() || point.date?.slice(0, 10) || `Point ${pointIndex + 1}`,
      rating: clampNumber(point.rating, 0),
    }))
    .filter((point) => point.rating > 0);

  const normalizedTopics = normalizeBreakdown(profile.topicBreakdown, "topic");
  const normalizedLanguages = normalizeBreakdown(profile.languageStats, "language");

  return {
    id: profile._id || `${profile.platform || "platform"}-${index}`,
    platform: profile.platform?.trim() || `Platform ${index + 1}`,
    username: profile.username?.trim() || "unknown_user",
    rating: clampNumber(profile.rating, 0),
    maxRating: clampNumber(profile.maxRating, clampNumber(profile.rating, 0)),
    rank: profile.rank?.trim() || "Unranked",
    solvedCount: problemCounts.total || solvedCount,
    profileUrl: profile.profileUrl?.trim() || "#",
    ratingHistory,
    problemCounts,
    topicBreakdown: normalizedTopics,
    languageStats: normalizedLanguages,
    dataSource: profile.dataSource || "manual",
    lastSyncedAt: profile.lastSyncedAt,
    fallbackEnabled: Boolean(profile.fallbackEnabled),
  };
}

function buildSparkline(points: RatingPoint[]) {
  if (!points.length) return "";

  const values = points.map((point) => point.rating);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const normalizedY = 100 - ((point.rating - min) / spread) * 100;
      return `${x},${normalizedY}`;
    })
    .join(" ");
}

function aggregateBreakdown(profiles: NormalizedProfile[], key: "topicBreakdown" | "languageStats") {
  const totals = new Map<string, number>();

  for (const profile of profiles) {
    for (const item of profile[key]) {
      totals.set(item.label, (totals.get(item.label) || 0) + item.count);
    }
  }

  const totalCount = [...totals.values()].reduce((sum, count) => sum + count, 0) || 1;

  return [...totals.entries()]
    .map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / totalCount) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, key === "languageStats" ? 4 : 5);
}

function formatSource(profile: NormalizedProfile) {
  if (profile.fallbackEnabled || profile.dataSource === "cached") {
    return profile.lastSyncedAt ? `${profile.lastSyncedAt} · fallback ready` : "Cached fallback ready";
  }

  switch (profile.dataSource) {
    case "live":
      return profile.lastSyncedAt ? `Live sync · ${profile.lastSyncedAt}` : "Live sync available";
    case "seed":
      return "Seeded portfolio snapshot";
    default:
      return profile.lastSyncedAt ? `Manual snapshot · ${profile.lastSyncedAt}` : "Manual snapshot";
  }
}

export default async function CPPage() {
  const rawProfiles = (await getData("cpprofile")) as RawCPProfile[];
  const normalizedProfiles = rawProfiles.map(normalizeProfile).filter((profile) => profile.platform);
  const profiles = normalizedProfiles.length ? normalizedProfiles : FALLBACK_PROFILES;
  const isUsingFallbackOnly = normalizedProfiles.length === 0;

  const totalSolved = profiles.reduce((sum, profile) => sum + profile.solvedCount, 0);
  const highestRating = Math.max(...profiles.map((profile) => profile.maxRating), 0);
  const averageRating = Math.round(
    profiles.reduce((sum, profile) => sum + profile.rating, 0) / Math.max(profiles.length, 1)
  );
  const languageLeaders = aggregateBreakdown(profiles, "languageStats");
  const topicLeaders = aggregateBreakdown(profiles, "topicBreakdown");
  const cPlusPlusShare = languageLeaders.find((entry) => entry.label === "C++")?.percentage ?? 0;
  const javaShare = languageLeaders.find((entry) => entry.label === "Java")?.percentage ?? 0;

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_48%)]" />
      <div className="absolute left-1/4 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[150px] opacity-30" />
      <div className="absolute bottom-10 right-10 -z-10 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[120px] opacity-20" />

      <div className="mx-auto max-w-7xl space-y-10">
        <RevealSection className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            <Zap className="h-3 w-3" /> Competitive Programming Analytics
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ratings, volume, and topic depth in one resilient dashboard
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-slate-400">
            A platform-by-platform view of rating progression, solved-problem distribution,
            language mix, and category coverage with a stored snapshot fallback whenever
            external data is unavailable.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Database className="h-3.5 w-3.5 text-cyan-300" />
              {isUsingFallbackOnly ? "Using cached portfolio snapshot" : "Database-backed analytics"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Code2 className="h-3.5 w-3.5 text-emerald-300" />
              C++ {cPlusPlusShare}% · Java {javaShare}% share across tracked solves
            </span>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Trophy,
                label: "Problems tracked",
                value: totalSolved.toLocaleString(),
                hint: `${profiles.length} platform snapshots`,
              },
              {
                icon: TrendingUp,
                label: "Average current rating",
                value: averageRating.toString(),
                hint: "Across all visible profiles",
              },
              {
                icon: Flame,
                label: "Peak rating reached",
                value: highestRating.toString(),
                hint: "Highest personal best in the dataset",
              },
              {
                icon: Layers3,
                label: "Top strength areas",
                value: topicLeaders.slice(0, 2).map((item) => item.label).join(" · ") || "General problem solving",
                hint: "Derived from topic/category breakdown",
              },
            ].map((stat, index) => (
              <RevealSection key={stat.label} delay={index * 0.06}>
                <Card className="border-white/10 bg-white/[0.035] shadow-lg shadow-black/10 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-slate-400">{stat.label}</CardDescription>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span className="text-2xl md:text-3xl">{stat.value}</span>
                      <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
                        <stat.icon className="h-5 w-5" />
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm text-slate-400">{stat.hint}</CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </RevealSection>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <RevealSection>
            <Card className="border-white/10 bg-white/[0.035] shadow-lg shadow-black/10 backdrop-blur-sm">
              <CardHeader>
                <CardDescription className="text-slate-400">Cross-platform trends</CardDescription>
                <CardTitle className="text-white">Language focus and category depth</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-4 text-sm font-medium text-slate-300">Language distribution</p>
                  <div className="space-y-3">
                    {languageLeaders.map((item) => (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-slate-400">{item.count} solves · {item.percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/6">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                            style={{ width: `${Math.max(item.percentage, 6)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-4 text-sm font-medium text-slate-300">Topic/category coverage</p>
                  <div className="space-y-3">
                    {topicLeaders.map((item, index) => (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-slate-400">{item.count} problems</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/6">
                          <div
                            className={`h-2 rounded-full ${TOPIC_COLORS[index % TOPIC_COLORS.length]}`}
                            style={{ width: `${Math.max(item.percentage, 8)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </RevealSection>

          <RevealSection delay={0.08}>
            <Card className="border-white/10 bg-white/[0.035] shadow-lg shadow-black/10 backdrop-blur-sm">
              <CardHeader>
                <CardDescription className="text-slate-400">Reliability notes</CardDescription>
                <CardTitle className="text-white">Data sourcing and fallback behavior</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">Fast by default</p>
                  <p className="mt-1 text-slate-400">
                    The page is statically revalidated hourly and renders from stored profile documents.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">Graceful degradation</p>
                  <p className="mt-1 text-slate-400">
                    If profile documents are incomplete or missing, the UI falls back to curated cached snapshots instead of failing empty.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">Backward-compatible schema</p>
                  <p className="mt-1 text-slate-400">
                    Legacy fields such as solved count, rating, and rank still render, while richer analytics use optional nested data when present.
                  </p>
                </div>
              </CardContent>
            </Card>
          </RevealSection>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile, index) => {
            const sparkline = buildSparkline(profile.ratingHistory);
            const difficultyBreakdown = [
              { label: "Easy", value: profile.problemCounts.easy, color: "bg-emerald-400" },
              { label: "Medium", value: profile.problemCounts.medium, color: "bg-amber-400" },
              { label: "Hard", value: profile.problemCounts.hard, color: "bg-rose-400" },
            ];
            const difficultyTotal = difficultyBreakdown.reduce((sum, item) => sum + item.value, 0) || 1;
            const topLanguages = profile.languageStats.slice(0, 3);
            const topTopics = profile.topicBreakdown.slice(0, 4);

            return (
              <RevealSection key={profile.id} delay={index * 0.06}>
                <Card className="h-full border-white/10 bg-white/[0.035] shadow-lg shadow-black/10 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl text-white">{profile.platform}</CardTitle>
                        <CardDescription className="mt-1 text-slate-400">@{profile.username}</CardDescription>
                      </div>
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Current</p>
                        <p className="text-2xl font-semibold text-emerald-300">{profile.rating}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Peak {profile.maxRating}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{profile.rank}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{profile.solvedCount} solves</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-300">Rating history</p>
                        <span className="text-xs text-slate-500">{profile.ratingHistory.at(-1)?.label || "No trend data"}</span>
                      </div>
                      {sparkline ? (
                        <svg viewBox="0 0 100 100" className="h-28 w-full" preserveAspectRatio="none" aria-label={`${profile.platform} rating history`}>
                          <defs>
                            <linearGradient id={`gradient-${profile.id}`} x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="rgb(52 211 153)" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0.8" />
                            </linearGradient>
                          </defs>
                          <polyline
                            fill="none"
                            stroke={`url(#gradient-${profile.id})`}
                            strokeWidth="4"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            points={sparkline}
                          />
                        </svg>
                      ) : (
                        <div className="flex h-28 items-center justify-center text-sm text-slate-500">
                          Trend data not available for this snapshot.
                        </div>
                      )}
                      {profile.ratingHistory.length > 0 && (
                        <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                          <span>{profile.ratingHistory[0].label}</span>
                          <span>{profile.ratingHistory.at(-1)?.label}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="mb-3 text-sm font-medium text-slate-300">Problem counts</p>
                        <div className="space-y-3">
                          {difficultyBreakdown.map((item) => {
                            const share = Math.round((item.value / difficultyTotal) * 100);
                            return (
                              <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-300">{item.label}</span>
                                  <span className="text-slate-400">{item.value} · {share}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/6">
                                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${Math.max(share, item.value ? 8 : 0)}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Contest appearances tracked: {profile.problemCounts.contest}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="mb-3 text-sm font-medium text-slate-300">Language stats</p>
                        <div className="space-y-3">
                          {topLanguages.length ? (
                            topLanguages.map((language) => (
                              <div key={language.label} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-300">{language.label}</span>
                                  <span className="text-slate-400">{language.count} · {language.percentage}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/6">
                                  <div
                                    className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                                    style={{ width: `${Math.max(language.percentage, 8)}%` }}
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No language mix recorded yet.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Activity className="h-4 w-4 text-cyan-300" /> Topic/category breakdown
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {topTopics.length ? (
                          topTopics.map((topic) => (
                            <span
                              key={topic.label}
                              className="rounded-full border border-cyan-500/15 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-100"
                            >
                              {topic.label} · {topic.count}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">Topic data will appear once the profile snapshot includes category counts.</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                        <Globe className="h-3.5 w-3.5 text-emerald-300" />
                        {formatSource(profile)}
                      </div>
                      <a
                        href={profile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white transition hover:border-emerald-500/30 hover:bg-white/10"
                      >
                        View profile
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </main>
  );
}
