import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import ResumeActions from "@/components/ResumeActions";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type EducationRecord } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "Background, education summary, and engineering approach.",
  path: "/about",
});

export default async function AboutPage() {
  const [siteSettings, education] = (await Promise.all([
    getSiteSettings(),
    getData("education"),
  ])) as [Awaited<ReturnType<typeof getSiteSettings>>, EducationRecord[]];

  const intro = siteSettings.pageIntro.about;

  return (
    <PageShell>
      <PageHeader eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />

      <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <RevealSection className="max-w-3xl border-l border-white/8 pl-6 sm:pl-8">
            <div className="space-y-4 text-base leading-8 text-slate-300">
              {siteSettings.aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </RevealSection>

          <RevealSection>
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                <span>Education</span>
                <span className="h-px w-10 bg-white/10" />
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">
                Academic foundation.
              </h2>
            </div>
          </RevealSection>

          <div className="divide-y divide-white/6 border-y border-white/6">
            {education.length > 0 ? (
              education.map((record, index) => (
                <RevealSection key={record._id} delay={index * 0.04} className="py-7">
                  <article className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{record.institution}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {[record.degree, record.program].filter(Boolean).join(" • ") || "Program details pending"}
                      </p>

                      {record.highlights.length > 0 ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {record.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2 text-sm text-slate-400 lg:text-right">
                      <p>
                        {[record.startDate, record.endDate].filter(Boolean).join(" - ") ||
                          "Timeline pending"}
                      </p>
                      {record.status ? <p>{record.status}</p> : null}
                      {record.grade ? (
                        <p>
                          {record.gradeLabel || "Grade"}:{" "}
                          <span className="text-white">{record.grade}</span>
                        </p>
                      ) : null}
                    </div>
                  </article>
                </RevealSection>
              ))
            ) : (
              <RevealSection className="py-7 text-sm leading-7 text-slate-400">
                Education updates will appear here once records are added.
              </RevealSection>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <RevealSection className="premium-surface premium-outline rounded-[1.8rem] p-6">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
              Profile
            </p>
            <p className="mt-4 text-lg font-semibold text-white">{siteSettings.role}</p>
            <p className="mt-2 text-sm text-slate-400">{siteSettings.location}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{siteSettings.availability}</p>
          </RevealSection>

          <RevealSection className="premium-surface premium-outline rounded-[1.8rem] p-6">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
              Resume
            </p>
            <ResumeActions siteSettings={siteSettings} className="mt-4" />
          </RevealSection>
        </div>
      </section>
    </PageShell>
  );
}
