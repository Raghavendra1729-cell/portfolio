import type { Metadata } from "next";
import { pageSectionVisibility } from "@/content/structure";
import { RevealSection } from "@/components/Reveal";
import ResumeActions from "@/components/ResumeActions";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type EducationRecord } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata(pageMetadata.about);

export default async function AboutPage() {
  const [siteSettings, education] = (await Promise.all([
    getSiteSettings(),
    getData("education"),
  ])) as [Awaited<ReturnType<typeof getSiteSettings>>, EducationRecord[]];

  const intro = siteSettings.pageIntro.about;
  const visibility = pageSectionVisibility.about;

  return (
    <PageShell>
      <PageHeader eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-8">
          <RevealSection className="premium-surface premium-outline surface-cut p-6 sm:p-7">
            <div className="section-badge">
              <span>Profile</span>
            </div>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-300">
              {siteSettings.aboutParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>
          </RevealSection>

          {visibility.education ? (
            <section className="space-y-5">
              <RevealSection className="max-w-2xl">
                <div className="section-badge">
                  <span>Education</span>
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                  Academic foundation and current path.
                </h2>
              </RevealSection>

              <div className="space-y-4">
                {education.length > 0 ? (
                  education.map((record, index) => (
                    <RevealSection key={record._id} delay={index * 0.04}>
                      <article className="premium-surface premium-outline surface-cut p-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
                          <div>
                            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                              {record.institution}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                              {[record.degree, record.program].filter(Boolean).join(" • ") || "Program details pending"}
                            </p>

                            {record.highlights.length > 0 ? (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {record.highlights.map((highlight) => (
                                  <span
                                    key={highlight}
                                    className="surface-cut border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <div className="space-y-3">
                            <div className="metric-panel surface-cut rounded-[1.15rem] p-4">
                              <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                                Timeline
                              </p>
                              <p className="mt-3 text-sm text-slate-200">
                                {[record.startDate, record.endDate].filter(Boolean).join(" - ") || "Timeline pending"}
                              </p>
                            </div>
                            {record.status ? (
                              <div className="metric-panel surface-cut rounded-[1.15rem] p-4">
                                <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                                  Status
                                </p>
                                <p className="mt-3 text-sm text-slate-200">{record.status}</p>
                              </div>
                            ) : null}
                            {record.grade ? (
                              <div className="metric-panel surface-cut rounded-[1.15rem] p-4">
                                <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                                  {record.gradeLabel || "Grade"}
                                </p>
                                <p className="mt-3 text-sm text-slate-200">{record.grade}</p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </RevealSection>
                  ))
                ) : (
                  <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-7 text-sm leading-7 text-slate-400">
                    Education updates will appear here once records are added.
                  </RevealSection>
                )}
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-4">
          {visibility.profileSummary ? (
            <RevealSection className="premium-surface premium-outline surface-cut p-6">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                Snapshot
              </p>
              <p className="mt-4 text-xl font-semibold text-white">{siteSettings.role}</p>
              <p className="mt-2 text-sm text-slate-400">{siteSettings.location}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{siteSettings.availability}</p>
            </RevealSection>
          ) : null}

          {visibility.resume ? (
            <RevealSection className="premium-surface premium-outline surface-cut p-6">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                Resume
              </p>
              <ResumeActions siteSettings={siteSettings} className="mt-4" />
            </RevealSection>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
