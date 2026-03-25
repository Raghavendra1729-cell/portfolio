import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, type EducationRecord } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";


export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Background, education summary, and engineering approach.",
  path: "/about",
});

export default async function AboutPage() {
  const education = (await getData("education")) as EducationRecord[];

  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title="About me."
        description="A short introduction and education summary."
      />

      <section className="grid gap-6">
        <RevealSection className="command-surface command-outline rounded-[2rem] p-6 sm:p-7">
          <div className="space-y-4 text-base leading-8 text-slate-300">
            <p>
              I&apos;m a software engineer and student who adapts quickly, learns new tools fast,
              and works independently to turn ideas into working software.
            </p>
            <p>
              I care about clarity, good execution, and building things that are useful.
            </p>
          </div>
        </RevealSection>

        <RevealSection className="mb-2">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Education</h2>
        </RevealSection>

        <div className="grid gap-4">
          {education.length > 0 ? (
            education.map((record) => (
              <RevealSection key={record._id}>
                <article className="command-surface command-outline rounded-[1.8rem] p-6">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{record.institution}</h3>
                      <p className="mt-2 text-sm text-cyan-200">
                        {[record.degree, record.program].filter(Boolean).join(" • ")}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-400 lg:text-right">
                      <p>{[record.startDate, record.endDate].filter(Boolean).join(" - ") || "Timeline pending"}</p>
                      {record.status ? <p>{record.status}</p> : null}
                      {record.grade ? (
                        <p>
                          {record.gradeLabel || "Grade"}: <span className="text-white">{record.grade}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </RevealSection>
            ))
          ) : (
            <RevealSection className="command-surface command-outline rounded-[1.8rem] p-6 text-sm leading-7 text-slate-400">
              Education updates will appear here once records are added.
            </RevealSection>
          )}
        </div>
      </section>
    </PageShell>
  );
}