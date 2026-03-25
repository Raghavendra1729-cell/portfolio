import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type ExperienceRecord } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";


export const metadata: Metadata = createPageMetadata({
  title: "Experience",
  description:
    "Work history, responsibilities, and technical impact.",
  path: "/experience",
});

export default async function ExperiencePage() {
  const [experience, siteSettings] = (await Promise.all([
    getData("experience"),
    getSiteSettings(),
  ])) as [ExperienceRecord[], Awaited<ReturnType<typeof getSiteSettings>>];
  const intro = siteSettings.pageIntro.experience;

  return (
    <PageShell>
      <PageHeader
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />

      <div className="divide-y divide-white/6 border-y border-white/6">
        {experience.length > 0 ? (
          experience.map((item, index) => (
            <RevealSection key={item._id} delay={index * 0.04} className="py-8">
              <article className="grid gap-6 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-8">
                <div className="space-y-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    {[item.startDate, item.endDate || (item.current ? "Present" : undefined)]
                      .filter(Boolean)
                      .join(" - ") || "Timeline pending"}
                  </p>
                  {item.current ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-200">
                      <span className="status-dot bg-white/80" />
                      Current
                    </span>
                  ) : null}
                </div>

                <div>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{item.role}</h2>
                      <p className="mt-2 text-sm text-slate-300">{item.company}</p>
                    </div>

                    {item.location ? (
                      <p className="text-sm text-slate-500 md:text-right">{item.location}</p>
                    ) : null}
                  </div>

                  {item.description.length > 0 ? (
                    <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-300 marker:text-slate-600">
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
                          className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="py-8 text-sm leading-7 text-slate-400">
            Experience records will appear here as they are added.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}
