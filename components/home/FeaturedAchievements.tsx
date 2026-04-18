import { ArrowUpRight } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import type { AchievementRecord, LandingPageRecord } from "@/lib/data";

export default function FeaturedAchievements({
  landingPage,
  achievements,
}: {
  landingPage: LandingPageRecord;
  achievements: AchievementRecord[];
}) {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <RevealSection className="max-w-3xl">
        <div className="section-badge">
          <span>{landingPage.achievementsEyebrow}</span>
        </div>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
          {landingPage.achievementsTitle}
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-400">
          {landingPage.achievementsDescription}
        </p>
      </RevealSection>

      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement, index) => (
          <RevealSection key={achievement._id} delay={index * 0.04}>
            <article className="premium-surface premium-outline surface-cut h-full p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  {[achievement.organization, achievement.date].filter(Boolean).join(" • ") || "Highlight"}
                </p>
                {achievement.featured ? (
                  <span className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                    Featured
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                {achievement.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {achievement.description}
              </p>
              {achievement.links[0] ? (
                <a
                  href={achievement.links[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                >
                  {achievement.links[0].name}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </article>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
