import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type SkillRecord } from "@/lib/data";
import { getItemProficiency } from "@/lib/skill-utils";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Skills",
  description: "Skill categories with proficiency and focus signals.",
  path: "/skills",
});

export default async function SkillsPage() {
  const [skills, siteSettings] = (await Promise.all([
    getData("skill"),
    getSiteSettings(),
  ])) as [SkillRecord[], Awaited<ReturnType<typeof getSiteSettings>>];
  const intro = siteSettings.pageIntro.skills;

  return (
    <PageShell>
      <PageHeader
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {skills.length > 0 ? (
          skills.map((category, index) => (
            <RevealSection key={category._id} delay={index * 0.04}>
              <article className="premium-surface premium-outline rounded-[1.8rem] p-6">
                <h2 className="text-xl font-semibold text-white">{category.category}</h2>

                <div className="mt-5 divide-y divide-white/6 border-t border-white/6">
                  {category.items.map((item) => {
                    const proficiency = getItemProficiency(category, item);
                    const focusSignal = category.focusSignals?.[item];

                    return (
                      <div key={item} className="py-4 first:pt-5 last:pb-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">{item}</p>
                          <span className="text-sm text-slate-200">{proficiency}%</span>
                        </div>

                        {focusSignal ? (
                          <p className="mt-2 text-sm leading-7 text-slate-300">{focusSignal}</p>
                        ) : null}

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7">
                          <div
                            className="h-full rounded-full bg-white/80"
                            style={{ width: `${proficiency}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="premium-surface premium-outline rounded-[1.8rem] p-6 text-sm leading-7 text-slate-400 lg:col-span-2">
            No skill categories are available yet.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}
