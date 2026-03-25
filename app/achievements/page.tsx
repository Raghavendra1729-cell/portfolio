import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { pageSectionVisibility } from "@/content/structure";
import { RevealSection } from "@/components/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import {
  getData,
  getSiteSettings,
  type AchievementRecord,
  type CPProfileRecord,
  type HackathonRecord,
} from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";
import { pageMetadata } from "@/lib/site-config";

function getHackathonMeta(hackathon: HackathonRecord) {
  return [hackathon.event, hackathon.organizer, hackathon.date].filter(Boolean).join(" • ");
}

export const metadata: Metadata = createPageMetadata(pageMetadata.achievements);

export default async function AchievementsPage() {
  const [siteSettings, achievements, hackathons, cpProfiles] = (await Promise.all([
    getSiteSettings(),
    getData("achievement"),
    getData("hackathon"),
    getData("cpProfile"),
  ])) as [
    Awaited<ReturnType<typeof getSiteSettings>>,
    AchievementRecord[],
    HackathonRecord[],
    CPProfileRecord[],
  ];
  const intro = siteSettings.pageIntro.achievements;
  const visibility = pageSectionVisibility.achievements;

  return (
    <PageShell>
      <PageHeader eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />

      <div className="space-y-12">
        {visibility.competitiveProfiles && cpProfiles.length > 0 ? (
          <section className="space-y-5">
            <RevealSection>
              <div className="section-badge">
                <span>Competitive profiles</span>
              </div>
            </RevealSection>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cpProfiles.map((profile, index) => (
                <RevealSection key={profile._id} delay={index * 0.04}>
                  <article className="premium-surface premium-outline surface-cut h-full p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{profile.platform}</h3>
                        <p className="mt-2 text-sm text-slate-400">
                          {[profile.username, profile.rank].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                      {profile.rating ? (
                        <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-slate-200">
                          {profile.rating}
                        </span>
                      ) : null}
                    </div>

                    {profile.summary ? (
                      <p className="mt-4 text-sm leading-7 text-slate-300">{profile.summary}</p>
                    ) : null}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="surface-cut border border-white/8 bg-white/[0.03] p-3.5">
                        <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">
                          Solved
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{profile.solvedCount}</p>
                      </div>
                      <div className="surface-cut border border-white/8 bg-white/[0.03] p-3.5">
                        <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">
                          Peak
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{profile.maxRating || profile.rating || "N/A"}</p>
                      </div>
                    </div>

                    {profile.profileUrl ? (
                      <a
                        href={profile.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
                      >
                        Open profile
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </article>
                </RevealSection>
              ))}
            </div>
          </section>
        ) : null}

        {visibility.achievements ? (
          <section className="space-y-5">
            <RevealSection>
              <div className="section-badge">
                <span>Achievements</span>
              </div>
            </RevealSection>

            <div className="grid gap-4">
              {achievements.length > 0 ? (
                achievements.map((achievement, index) => (
                  <RevealSection key={achievement._id} delay={index * 0.04}>
                    <TiltCard intensity={6}>
                      <article className="premium-surface premium-outline surface-cut overflow-hidden">
                        <div className="grid gap-0 md:grid-cols-[15rem_minmax(0,1fr)]">
                          {achievement.images[0] ? (
                            <div className="relative min-h-[14rem] border-b border-white/8 md:border-b-0 md:border-r">
                              <Image
                                src={achievement.images[0]}
                                alt={achievement.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="relative hidden border-r border-white/8 bg-black/35 md:block">
                              <div className="premium-grid absolute inset-0 opacity-30" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_62%)]" />
                            </div>
                          )}

                          <div className="p-6">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-xl font-semibold text-white">{achievement.title}</h3>
                              {achievement.featured ? (
                                <span className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                                  Featured
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 text-sm text-slate-400">
                              {[achievement.organization, achievement.date].filter(Boolean).join(" • ")}
                            </p>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                              {achievement.description}
                            </p>

                            {achievement.links[0] ? (
                              <a
                                href={achievement.links[0].url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
                              >
                                {achievement.links[0].name}
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </TiltCard>
                  </RevealSection>
                ))
              ) : (
                <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400">
                  Achievements will appear here once records are added.
                </RevealSection>
              )}
            </div>
          </section>
        ) : null}

        {visibility.hackathons ? (
          <section className="space-y-5">
            <RevealSection>
              <div className="section-badge">
                <span>Hackathons</span>
              </div>
            </RevealSection>

            <div className="grid gap-4">
              {hackathons.length > 0 ? (
                hackathons.map((hackathon, index) => (
                  <RevealSection key={hackathon._id} delay={index * 0.04}>
                    <TiltCard intensity={6}>
                      <article className="premium-surface premium-outline surface-cut overflow-hidden">
                        <div className="grid gap-0 md:grid-cols-[15rem_minmax(0,1fr)]">
                          {hackathon.images[0] ? (
                            <div className="relative min-h-[14rem] border-b border-white/8 md:border-b-0 md:border-r">
                              <Image
                                src={hackathon.images[0]}
                                alt={hackathon.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="relative hidden border-r border-white/8 bg-black/35 md:block">
                              <div className="premium-grid absolute inset-0 opacity-30" />
                            </div>
                          )}

                          <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-xl font-semibold text-white">{hackathon.title}</h3>
                                <p className="mt-2 text-sm text-slate-400">{getHackathonMeta(hackathon)}</p>
                              </div>
                              {hackathon.result ? (
                                <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-slate-200">
                                  {hackathon.result}
                                </span>
                              ) : null}
                            </div>

                            {hackathon.description ? (
                              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                                {hackathon.description}
                              </p>
                            ) : null}

                            {hackathon.techStack.length > 0 ? (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {hackathon.techStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="surface-cut border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            {hackathon.links[0] ? (
                              <a
                                href={hackathon.links[0].url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
                              >
                                {hackathon.links[0].name}
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </TiltCard>
                  </RevealSection>
                ))
              ) : (
                <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400">
                  Hackathon updates will appear here once records are added.
                </RevealSection>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
