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
    <footer className="mt-24 border-t border-white/6">
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-10">
        <div className="grid gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr_0.9fr]">
          <div className="max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">
              {siteSettings.role}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              {siteSettings.name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {siteSettings.footerBlurb}
            </p>
            <p className="mt-3 text-sm text-slate-500">{siteSettings.location}</p>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Explore
            </h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              {publicNavItems
                .filter((item) => item.href !== "/")
                .map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Connect
              </h3>
              <SocialLinks
                links={siteSettings.socialLinks}
                variant="text"
                showValue
                className="mt-4"
              />
            </div>
            <ResumeActions
              siteSettings={siteSettings}
              compact
              showAlternates={false}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {siteSettings.name}.</p>
          <p>{siteSettings.availability}</p>
        </div>
      </div>
    </footer>
  );
}
