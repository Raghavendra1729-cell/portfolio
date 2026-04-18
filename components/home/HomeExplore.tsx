import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import type { LandingPageRecord } from "@/lib/data";

export default function HomeExplore({
  landingPage,
}: {
  landingPage: LandingPageRecord;
}) {
  if (landingPage.featuredSections.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <RevealSection className="max-w-xl">
        <div className="section-badge">
          <span>{landingPage.exploreEyebrow}</span>
        </div>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
          {landingPage.exploreTitle}
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-400">
          {landingPage.exploreDescription}
        </p>
      </RevealSection>

      <RevealSection>
        <div className="divide-y divide-white/6 border-y border-white/6">
          {landingPage.featuredSections.map((item, index) => (
            <Link
              key={`${item.href}-${item.title}`}
              href={item.href}
              className="group flex items-start justify-between gap-6 py-6 transition"
            >
              <div className="flex gap-5">
                <span className="w-8 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white transition group-hover:text-slate-200">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="mt-1 h-5 w-5 text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </RevealSection>
    </section>
  );
}
