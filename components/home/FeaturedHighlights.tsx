import { RevealSection } from "@/components/Reveal";
import type { LandingPageRecord } from "@/lib/data";

export default function FeaturedHighlights({
  cards,
}: {
  cards: LandingPageRecord["highlightCards"];
}) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <RevealSection id="home-highlights" className="space-y-6">
      <div className="section-badge">
        <span>Core signal</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((item, index) => (
          <div key={item.title} className="metric-panel surface-cut rounded-[1.5rem] p-6">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
