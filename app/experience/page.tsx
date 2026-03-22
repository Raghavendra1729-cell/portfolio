import { MapPin } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, type ExperienceRecord } from "@/lib/data";

export default async function ExperiencePage() {
  const experience = (await getData("experience")) as ExperienceRecord[];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Experience"
        title="Experience."
        description="Work history."
      />

      <div className="grid gap-4">
        {experience.length > 0 ? (
          experience.map((item, index) => (
            <RevealSection key={item._id} delay={index * 0.04}>
              <article className="command-surface command-outline rounded-[2rem] p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{item.role}</h2>
                    <p className="mt-2 text-sm text-cyan-200">{item.company}</p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-400 lg:text-right">
                    <p>
                      {[item.startDate, item.endDate || (item.current ? "Present" : undefined)]
                        .filter(Boolean)
                        .join(" - ") || "Timeline pending"}
                    </p>
                    {item.location ? (
                      <p className="inline-flex items-center gap-2 lg:justify-end">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </p>
                    ) : null}
                  </div>
                </div>

                {item.description.length > 0 ? (
                  <ul className="mt-5 space-y-2 text-sm leading-7 text-slate-300">
                    {item.description.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}

                {item.technologies.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-slate-200/85"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="command-surface command-outline rounded-[2rem] p-6 text-sm leading-7 text-slate-400">
            Experience records will appear here as they are added.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}
