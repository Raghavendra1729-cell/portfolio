"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import type { SiteSettingsRecord } from "@/lib/data";
import { publicNavItems } from "@/lib/site-config";

export default function Footer({ siteSettings }: { siteSettings: SiteSettingsRecord }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-10">
        <div className="grid gap-6 py-10 lg:grid-cols-[1.15fr_0.7fr_0.95fr]">
          <div className="premium-surface premium-outline surface-cut p-6 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {siteSettings.role}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white">
              {siteSettings.name}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              {siteSettings.footerBlurb}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="data-chip">{siteSettings.location}</span>
              <span className="data-chip">{siteSettings.availability}</span>
            </div>
          </div>

          <div className="premium-surface premium-outline surface-cut p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">
              Explore
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              {publicNavItems
                .filter((item) => item.href !== "/")
                .map((item) => (
                  <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 hover:text-white">
                    <span className="h-1 w-1 rounded-full bg-white/18" />
                    {item.label}
                  </Link>
                ))}
            </div>
          </div>

          <div className="premium-surface premium-outline surface-cut p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">
              Connect
            </h3>
            <SocialLinks
              links={siteSettings.socialLinks}
              variant="text"
              showValue
              className="mt-5"
            />
            <ResumeActions
              siteSettings={siteSettings}
              compact
              showAlternates={false}
              className="mt-6"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/8 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {siteSettings.name}. Built with intent.</p>
          <p>{siteSettings.availability}</p>
        </div>
      </div>
    </footer>
  );
}
