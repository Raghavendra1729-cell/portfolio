import { getData } from "@/lib/data";
import { Trophy, TrendingUp, Target, Zap } from "lucide-react";
import { RevealSection } from "@/components/Reveal";

export const revalidate = 3600;

export default async function CPPage() {
  const profiles = await getData("cpprofile");

  return (
    <main className="relative pt-32 pb-24 px-6">
      {/* Extra background effects for this page */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <div className="absolute -z-10 blur-[150px] opacity-30 bg-indigo-500/30 w-[500px] h-[500px] rounded-full top-10 left-1/4" />
      <div className="absolute -z-10 blur-[120px] opacity-20 bg-cyan-500/30 w-[400px] h-[400px] rounded-full bottom-10 right-10" />

      <div className="max-w-6xl mx-auto">
        <RevealSection className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 border border-emerald-500/20">
            <Zap className="w-3 h-3" /> Live Snapshot
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-white">
            Competitive Programming
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Ratings, peaks, and ranks across platforms that reflect my
            problem‑solving journey.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((cp: any, idx: number) => (
            <RevealSection key={cp._id} delay={idx * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col h-full">
                {/* Accent glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_60%)]" />

                <div className="relative p-6 pb-4">
                  <h3 className="text-2xl font-semibold text-white tracking-tight">
                    {cp.platform}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">@{cp.username}</p>
                </div>

                <div className="relative px-6 pb-6 flex-1 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
                        Current Rating
                      </p>
                      <p className="text-3xl font-semibold text-emerald-400">
                        {cp.rating}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-slate-400">
                        <Trophy className="w-4 h-4 text-amber-400" /> Max
                        Rating
                      </span>
                      <span className="font-medium text-white">
                        {cp.maxRating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-slate-400">
                        <Target className="w-4 h-4 text-cyan-400" /> Global Rank
                      </span>
                      <span className="font-medium text-white">{cp.rank}</span>
                    </div>
                  </div>

                  <a
                    href={cp.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </main>
  );
}