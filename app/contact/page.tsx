import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getSiteSettings } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Direct contact methods for opportunities and collaboration.",
  path: "/contact",
});

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const intro = siteSettings.pageIntro.contact;

  return (
    <PageShell>
      <PageHeader
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />

      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="divide-y divide-white/6 border-y border-white/6">
          {siteSettings.socialLinks.map((link, index) => (
            <RevealSection key={`${link.label}-${link.href}`} delay={index * 0.04}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-start justify-between gap-6 py-6 transition"
              >
                <div className="flex gap-5">
                  <span className="w-8 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      {link.label}
                    </p>
                    <p className="mt-3 text-xl font-semibold text-white">{link.value || link.label}</p>
                    <p className="mt-2 text-sm text-slate-500">{link.href}</p>
                  </div>
                </div>
                <ArrowUpRight className="mt-1 h-5 w-5 text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            </RevealSection>
          ))}
        </div>

        <div className="space-y-6">
          <RevealSection className="premium-surface premium-outline rounded-[1.8rem] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Availability
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Open for serious conversations.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{siteSettings.availability}</p>
          </RevealSection>

          <RevealSection className="space-y-4">
            <SocialLinks links={siteSettings.socialLinks} />
            <ResumeActions siteSettings={siteSettings} />
          </RevealSection>
        </div>
      </section>
    </PageShell>
  );
}
