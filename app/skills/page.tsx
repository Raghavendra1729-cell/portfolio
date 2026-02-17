import { getData } from "@/lib/data";
import { Code2, Layers } from "lucide-react";
import { RevealSection } from "@/components/Reveal";

export const revalidate = 3600;

export default async function SkillsPage() {
  const skills = await getData("skill");

  return (
    <main className="relative pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <RevealSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 border border-indigo-500/20">
            <Layers className="w-3 h-3" /> Tech Stack
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold text-white">
            Technical Skills
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Languages, frameworks, and tools I use to build scalable software.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill: any, idx: number) => (
            <RevealSection key={skill._id} delay={idx * 0.05}>
              <div className="group relative h-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5">
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)]" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-white">
                      {skill.category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item: string) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-white/5 text-slate-300 rounded-lg font-medium text-sm border border-white/5 hover:border-indigo-500/30 hover:text-indigo-300 transition-all cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </main>
  );
}