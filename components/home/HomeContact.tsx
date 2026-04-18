import { RevealSection } from "@/components/Reveal";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import type { LandingPageRecord, SiteSettingsRecord } from "@/lib/data";

export default function HomeContact({
  landingPage,
  siteSettings,
}: {
  landingPage: LandingPageRecord;
  siteSettings: SiteSettingsRecord;
}) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <RevealSection className="premium-surface premium-outline surface-cut p-6 sm:p-7">
        <div className="section-badge">
          <span>{landingPage.contactEyebrow}</span>
        </div>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
          {landingPage.contactTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
          {landingPage.contactDescription}
        </p>
        <div className="mt-7">
          <ResumeActions siteSettings={siteSettings} />
        </div>
      </RevealSection>

      <RevealSection className="space-y-4">
        <div className="premium-surface premium-outline surface-cut p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Contact links
          </p>
          <SocialLinks links={siteSettings.socialLinks} variant="pill" className="mt-5" />
        </div>
        <div className="metric-panel surface-cut rounded-[1.5rem] p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Availability
          </p>
          <p className="mt-4 text-lg font-semibold text-white">
            Open for focused engineering conversations.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {siteSettings.availability}
          </p>
        </div>
      </RevealSection>
    </section>
  );
}
