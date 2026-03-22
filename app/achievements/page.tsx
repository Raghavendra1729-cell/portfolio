import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import {
  getData,
  type AchievementRecord,
  type CPProfileRecord,
  type HackathonRecord,
} from "@/lib/data";

function getHackathonMeta(hackathon: HackathonRecord) {
  return [hackathon.event, hackathon.organizer, hackathon.date].filter(Boolean).join(" • ");
}

export default async function AchievementsPage() {
  const [achievements, hackathons, cpProfiles] = (await Promise.all([
    getData("achievement"),
    getData("hackathon"),
    getData("cpProfile"),
  ])) as [AchievementRecord[], HackathonRecord[], CPProfileRecord[]];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Achievements"
        title="Achievements."
        description="Achievements, competitive profiles, and hackathons."
      />

      {cpProfiles.length > 0 ? (
        <section className="mb-12">
          <RevealSection className="mb-4">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Competitive profiles
            </h2>
          </RevealSection>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cpProfiles.map((profile, index) => (
              <RevealSection key={profile._id} delay={index * 0.04}>
                <article className="command-surface command-outline rounded-[1.8rem] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{profile.platform}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {[profile.username, profile.rank].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                    {profile.rating ? (
                      <span className="text-sm text-cyan-200">{profile.rating}</span>
                    ) : null}
                  </div>

                  {profile.summary ? (
                    <p className="mt-4 text-sm leading-7 text-slate-300">{profile.summary}</p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-300">
                    <span>Solved: {profile.solvedCount}</span>
                    {profile.maxRating ? <span>Max: {profile.maxRating}</span> : null}
                    {profile.streak ? <span>Streak: {profile.streak}</span> : null}
                  </div>

                  {profile.profileUrl ? (
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200"
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

      <section className="mb-12">
        <RevealSection className="mb-4">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Achievements</h2>
        </RevealSection>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <RevealSection key={achievement._id} delay={index * 0.04}>
                <article className="command-surface command-outline overflow-hidden rounded-[1.8rem]">
                  {achievement.images[0] ? (
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={achievement.images[0]}
                        alt={achievement.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">{achievement.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {[achievement.organization, achievement.date].filter(Boolean).join(" • ")}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{achievement.description}</p>

                    {achievement.links[0] ? (
                      <a
                        href={achievement.links[0].url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-amber-200"
                      >
                        {achievement.links[0].name}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </RevealSection>
            ))
          ) : (
            <RevealSection className="command-surface command-outline rounded-[1.8rem] p-6 text-sm leading-7 text-slate-400 md:col-span-2 xl:col-span-3">
              Achievements will appear here once records are added.
            </RevealSection>
          )}
        </div>
      </section>

      <section>
        <RevealSection className="mb-4">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Hackathons</h2>
        </RevealSection>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hackathons.length > 0 ? (
            hackathons.map((hackathon, index) => (
              <RevealSection key={hackathon._id} delay={index * 0.04}>
                <article className="command-surface command-outline overflow-hidden rounded-[1.8rem]">
                  {hackathon.images[0] ? (
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={hackathon.images[0]}
                        alt={hackathon.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{hackathon.title}</h3>
                        <p className="mt-2 text-sm text-slate-400">{getHackathonMeta(hackathon)}</p>
                      </div>
                      {hackathon.result ? (
                        <span className="text-sm text-cyan-200">{hackathon.result}</span>
                      ) : null}
                    </div>

                    {hackathon.description ? (
                      <p className="mt-4 text-sm leading-7 text-slate-300">{hackathon.description}</p>
                    ) : null}

                    {hackathon.links[0] ? (
                      <a
                        href={hackathon.links[0].url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200"
                      >
                        {hackathon.links[0].name}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </RevealSection>
            ))
          ) : (
            <RevealSection className="command-surface command-outline rounded-[1.8rem] p-6 text-sm leading-7 text-slate-400 md:col-span-2 xl:col-span-3">
              Hackathons will appear here once records are added.
            </RevealSection>
          )}
        </div>
      </section>
    </PageShell>
  );
}
