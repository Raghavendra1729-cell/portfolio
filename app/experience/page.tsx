import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type ExperienceRecord } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata(pageMetadata.experience);

export default async function ExperiencePage() {
  const [experience, siteSettings] = (await Promise.all([
    getData("experience"),
    getSiteSettings(),
  ])) as [ExperienceRecord[], Awaited<ReturnType<typeof getSiteSettings>>];
  const intro = siteSettings.pageIntro.experience;

  return (
    <PageShell>
      <PageHeader eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />

      <div className="space-y-4">
        {experience.length > 0 ? (
          experience.map((item, index) => (
            <RevealSection key={item._id} delay={index * 0.04}>
              <article className="premium-surface premium-outline surface-cut p-6 sm:p-7">
                <div className="grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      {[item.startDate, item.endDate || (item.current ? "Present" : undefined)]
                        .filter(Boolean)
                        .join(" - ") || "Timeline pending"}
                    </p>
                    <div className="surface-cut border border-white/8 bg-white/[0.03] px-4 py-3">
                      <p className="text-sm text-slate-300">{item.location || "Location pending"}</p>
                    </div>
                    {item.current ? (
                      <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                        <span className="status-dot bg-[color:var(--signal)]" />
                        Current
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">{item.role}</h2>
                        <p className="mt-2 text-sm text-slate-300">{item.company}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="metric-panel surface-cut rounded-[1rem] p-3.5">
                          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">
                            Stack
                          </p>
                          <p className="mt-2 text-sm text-slate-200">{item.technologies.length} tools</p>
                        </div>
                        <div className="metric-panel surface-cut rounded-[1rem] p-3.5">
                          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">
                            Notes
                          </p>
                          <p className="mt-2 text-sm text-slate-200">{item.description.length} key points</p>
                        </div>
                      </div>
                    </div>

                    {item.description.length > 0 ? (
                      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                        {item.description.map((point) => (
                          <li key={point} className="flex gap-3">
                            <span className="mt-3 h-1.5 w-1.5 rounded-full bg-white/35" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {item.technologies.length > 0 ? (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="surface-cut border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {item.links.length > 0 ? (
                      <div className="mt-6 flex flex-wrap gap-5 text-sm">
                        {item.links.map((link) => (
                          <a
                            key={`${link.name}-${link.url}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                          >
                            {link.name}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400">
            Experience records will appear here as they are added.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}
