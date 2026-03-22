import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import { getData } from "@/lib/data";
import { RevealSection } from "@/components/Reveal";

type AchievementRecord = {
  _id: string;
  title: string;
  organization?: string;
  date?: string;
  description: string;
  images?: string[];
  links?: Array<{
    name?: string;
    url?: string;
  }>;
};

export const revalidate = 3600;

export default async function AchievementsPage() {
  const achievements = (await getData("achievement")) as AchievementRecord[];

  return (
    <main className="relative px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl space-y-16">
        <RevealSection className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <Award className="h-3 w-3" /> Achievements
          </span>
          <h1 className="mt-5 text-4xl font-bold text-white md:text-5xl">
            Results, rankings, and milestones
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            This section combines awards, competitive programming milestones, and
            other proof points into one clear recruiter-facing view.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {achievements.map((achievement, index) => {
            const primaryLink = achievement.links?.find((link) => link.url);

            return (
              <RevealSection key={achievement._id} delay={index * 0.05}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5">
                  {achievement.images?.[0] && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <Image
                        src={achievement.images[0]}
                        alt={achievement.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    </div>
                  )}

                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-amber-300">
                          {achievement.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                          {achievement.organization && <span>{achievement.organization}</span>}
                          {achievement.organization && achievement.date && <span> • </span>}
                          {achievement.date}
                        </p>
                      </div>

                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
                        Proof
                      </span>
                    </div>

                    <p className="text-sm leading-7 text-slate-300">
                      {achievement.description}
                    </p>

                    {primaryLink?.url && (
                      <a
                        href={primaryLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200"
                      >
                        {primaryLink.name || "View reference"}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </main>
  );
}
