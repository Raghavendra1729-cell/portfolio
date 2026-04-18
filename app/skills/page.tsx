import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type SkillRecord } from "@/lib/data";
import { getSitePageMetadata } from "@/lib/metadata";
import { getItemProficiency } from "@/lib/skill-utils";

export async function generateMetadata() {
  return getSitePageMetadata("skills");
}

export default async function SkillsPage() {
  const [skills, siteSettings] = (await Promise.all([
    getData("skill"),
    getSiteSettings(),
  ])) as [SkillRecord[], Awaited<ReturnType<typeof getSiteSettings>>];
  const intro = siteSettings.pageIntro.skills;

  return (
    <PageShell>
      <PageHeader eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />

      <div className="grid gap-6 lg:grid-cols-2">
        {skills.length > 0 ? (
          skills.map((category, index) => (
            <RevealSection key={category._id} delay={index * 0.04}>
              <article className="premium-surface premium-outline surface-cut p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                      Capability area
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {category.category}
                    </h2>
                  </div>
                  <div className="surface-cut border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                    {category.items.length} items
                  </div>
                </div>

                <div className="mt-6 divide-y divide-white/6 border-t border-white/6">
                  {category.items.map((item) => {
                    const proficiency = getItemProficiency(category, item);
                    const focusSignal = category.focusSignals?.[item];

                    return (
                      <div key={item} className="py-4 first:pt-5 last:pb-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">{item}</p>
                          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-slate-400">
                            {proficiency}%
                          </span>
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(142,236,255,0.76))]"
                            style={{ width: `${proficiency}%` }}
                          />
                        </div>

                        {focusSignal ? (
                          <p className="mt-3 text-sm leading-7 text-slate-300">{focusSignal}</p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400 lg:col-span-2">
            No skill categories are available yet.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}
