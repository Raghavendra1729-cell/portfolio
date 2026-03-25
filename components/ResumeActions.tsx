"use client";

import type { ReactNode } from "react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import type { ResumeAlternateLink, SiteSettingsRecord } from "@/lib/data";

function getAnchorProps(href: string) {
  return href.startsWith("http")
    ? {
        target: "_blank",
        rel: "noreferrer",
      }
    : {};
}

function InlineResumeLink({
  href,
  download = false,
  children,
}: {
  href: string;
  download?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      download={download}
      {...getAnchorProps(href)}
      className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
    >
      {children}
    </a>
  );
}

export default function ResumeActions({
  siteSettings,
  className,
  compact = false,
  showAlternates = true,
}: {
  siteSettings: Pick<
    SiteSettingsRecord,
    "primaryResumeLabel" | "primaryResumeViewHref" | "primaryResumeDownloadHref" | "alternateResumeLinks"
  >;
  className?: string;
  compact?: boolean;
  showAlternates?: boolean;
}) {
  const hasPrimaryView = Boolean(siteSettings.primaryResumeViewHref);
  const hasPrimaryDownload = Boolean(siteSettings.primaryResumeDownloadHref);

  if (!hasPrimaryView && !hasPrimaryDownload && siteSettings.alternateResumeLinks.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn("flex flex-wrap gap-x-4 gap-y-2", className)}>
        {hasPrimaryView ? (
          <InlineResumeLink href={siteSettings.primaryResumeViewHref}>
            {siteSettings.primaryResumeLabel || "View resume"}
          </InlineResumeLink>
        ) : null}

        {hasPrimaryDownload ? (
          <InlineResumeLink href={siteSettings.primaryResumeDownloadHref} download>
            Download resume
          </InlineResumeLink>
        ) : null}

        {showAlternates
          ? siteSettings.alternateResumeLinks.map((link: ResumeAlternateLink) => (
              <InlineResumeLink key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </InlineResumeLink>
            ))
          : null}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-3">
        {hasPrimaryView ? (
          <MagneticButton
            asChild
            className="surface-cut border-white/12 bg-white px-5 py-3 text-slate-950 shadow-[0_20px_44px_rgba(255,255,255,0.08)]"
          >
            <a href={siteSettings.primaryResumeViewHref} {...getAnchorProps(siteSettings.primaryResumeViewHref)}>
              {siteSettings.primaryResumeLabel || "View resume"}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </MagneticButton>
        ) : null}

        {hasPrimaryDownload ? (
          <MagneticButton
            asChild
            className="surface-cut border-white/10 bg-white/[0.03] px-5 py-3 text-white"
          >
            <a
              href={siteSettings.primaryResumeDownloadHref}
              download
              {...getAnchorProps(siteSettings.primaryResumeDownloadHref)}
            >
              Download resume
              <ArrowDownToLine className="h-4 w-4" />
            </a>
          </MagneticButton>
        ) : null}
      </div>

      {showAlternates && siteSettings.alternateResumeLinks.length > 0 ? (
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {siteSettings.alternateResumeLinks.map((link: ResumeAlternateLink) => (
            <InlineResumeLink key={`${link.label}-${link.href}`} href={link.href}>
              {link.label}
            </InlineResumeLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
