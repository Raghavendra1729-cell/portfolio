import { getData } from "@/lib/data";
import { Briefcase } from "lucide-react";
import { RevealSection } from "@/components/Reveal";

export const revalidate = 3600;

export default async function ExperiencePage() {
  const experience = await getData("experience");

  return (
    <main className="relative pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealSection className="mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 border border-indigo-500/20">
            <Briefcase className="w-3 h-3" /> Experience
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-white">
            Work Experience & Internships
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl">
            A timeline of roles where I&apos;ve designed, built, and shipped
            real systems.
          </p>
        </RevealSection>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-12">
          {/* Animated timeline line */}
          <div className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-indigo-500/30 to-transparent" />

          <div className="space-y-10">
            {experience.map((exp: any, idx: number) => (
              <RevealSection
                key={exp._id}
                delay={idx * 0.1}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-8 md:-left-12 top-3 flex items-center justify-center">
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-40 animate-ping" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-indigo-500 border-2 border-slate-950" />
                  </span>
                </div>

                <article className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/20 px-6 py-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_60%)]" />

                  <div className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {exp.role}
                        </h3>
                        <p className="text-sm font-medium text-indigo-400">
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 border border-white/5">
                          {exp.startDate} – {exp.endDate}
                        </span>
                        {exp.location && (
                          <span className="text-xs text-slate-500">
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="ml-4 list-disc space-y-2 text-sm text-slate-400 leading-relaxed">
                      {exp.description?.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>

                    {exp.technologies?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {exp.technologies.map((t: string) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}