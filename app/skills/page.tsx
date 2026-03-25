import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, type SkillRecord } from "@/lib/data";
import { getItemProficiency } from "@/lib/skill-utils";
import { createPageMetadata } from "@/lib/metadata";


export const metadata: Metadata = createPageMetadata({
  title: "Skills",
  description:
    "Skill categories with proficiency and focus signals.",
  path: "/skills",
});

export default async function SkillsPage() {
  const skills = (await getData("skill")) as SkillRecord[];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Skills"
        title="Skills."
        description="Skills and current levels."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {skills.length > 0 ? (
          skills.map((category, index) => (
            <RevealSection key={category._id} delay={index * 0.04}>
              <article className="command-surface command-outline rounded-[1.8rem] p-6">
                <h2 className="text-xl font-semibold text-white">{category.category}</h2>

                <div className="mt-5 space-y-4">
                  {category.items.map((item) => {
                    const proficiency = getItemProficiency(category, item);
                    const focusSignal = category.focusSignals?.[item];

                    return (
                      <div key={item} className="rounded-[1.2rem] border border-white/8 bg-slate-950/45 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">{item}</p>
                          <span className="text-sm text-cyan-200">{proficiency}%</span>
                        </div>

                        {focusSignal ? (
                          <p className="mt-2 text-sm leading-7 text-slate-300">{focusSignal}</p>
                        ) : null}

                        <div className="mt-3 grid grid-cols-10 gap-1.5">
                          {Array.from({ length: 10 }).map((_, levelIndex) => (
                            <span
                              key={`${category._id}-${item}-${levelIndex}`}
                              className={`h-2.5 rounded-full ${
                                levelIndex < Math.round(proficiency / 10)
                                  ? "data-beam"
                                  : "bg-white/8"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="command-surface command-outline rounded-[1.8rem] p-6 text-sm leading-7 text-slate-400 md:col-span-2 xl:col-span-3">
            No skill categories are available yet.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}