"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HeroPortrait from "@/components/HeroPortrait";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import { RevealSection } from "@/components/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { LandingPageRecord, SiteSettingsRecord } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

type HeroProps = {
  siteSettings: SiteSettingsRecord;
  landingPage: LandingPageRecord;
  introLines: readonly string[];
  signals: ReadonlyArray<{ label: string; value: string }>;
};

export default function Hero({
  siteSettings,
  landingPage,
  introLines,
  signals,
}: HeroProps) {
  const profileImage = siteSettings.profileImage || siteConfig.defaultProfileImage;
  const profileAlt = siteSettings.profileImageAlt || `${siteSettings.name} portrait`;

  return (
    <section className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center">
      <RevealSection className="space-y-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
            <span>{landingPage.heroEyebrow}</span>
            <span className="h-px w-8 bg-white/12" />
            <span>{siteSettings.location}</span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-[-0.085em] text-white sm:text-6xl lg:text-[5.4rem] lg:leading-[0.92]">
              {landingPage.heroTitle}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-[1.12rem]">
              {landingPage.heroSubtitle}
            </p>
            <p className="max-w-2xl text-base leading-8 text-slate-500">
              {landingPage.heroSummary}
            </p>
          </div>
        </div>

        {introLines.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {introLines.map((line, index) => (
              <div key={line} className="metric-panel surface-cut rounded-[1.15rem] p-4">
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{line}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {landingPage.primaryCtaLabel && landingPage.primaryCtaHref ? (
            <MagneticButton
              asChild
              className="surface-cut border-white/12 bg-white px-5 py-3 text-slate-950 shadow-[0_20px_44px_rgba(255,255,255,0.08)]"
            >
              <Link href={landingPage.primaryCtaHref}>
                {landingPage.primaryCtaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
          ) : null}

          {landingPage.secondaryCtaLabel && landingPage.secondaryCtaHref ? (
            <MagneticButton
              asChild
              className="surface-cut border-white/10 bg-white/[0.03] px-5 py-3 text-white"
            >
              <Link href={landingPage.secondaryCtaHref}>
                {landingPage.secondaryCtaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
          ) : null}
        </div>

        <ResumeActions siteSettings={siteSettings} />

        {signals.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {signals.map((signal) => (
              <div key={signal.label} className="surface-cut border border-white/8 bg-white/[0.025] p-4">
                <p className="font-mono text-[0.63rem] uppercase tracking-[0.28em] text-slate-500">
                  {signal.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{signal.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <SocialLinks links={siteSettings.socialLinks} variant="icon" />
      </RevealSection>

      <RevealSection delay={0.08}>
        <HeroPortrait
          src={profileImage}
          alt={profileAlt}
          name={siteSettings.name}
          badge={siteSettings.profileBadge}
          role={siteSettings.role}
          location={siteSettings.location}
          availability={siteSettings.availability}
        />
      </RevealSection>
    </section>
  );
}
