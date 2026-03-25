"use client";

import { Github, Globe, Linkedin, Mail } from "lucide-react";
import type { SiteSettingsRecord, SocialLink } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialLink["kind"], typeof Mail> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
  other: Globe,
};

export default function SocialLinks({
  links,
  variant = "text",
  showValue = false,
  className,
}: {
  links: SiteSettingsRecord["socialLinks"];
  variant?: "text" | "pill" | "icon";
  showValue?: boolean;
  className?: string;
}) {
  if (variant === "icon") {
    return (
      <div className={cn("flex flex-wrap gap-2.5", className)}>
        {links.map((link) => {
          const Icon = ICONS[link.kind] || Globe;

          return (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={link.label}
              className="surface-cut group inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.03] text-slate-300 hover:border-[color:var(--signal)]/40 hover:bg-white/[0.06] hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "pill" ? "flex flex-wrap gap-2.5" : "flex flex-wrap gap-x-5 gap-y-3",
        className,
      )}
    >
      {links.map((link) => {
        return (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={link.label}
            className={cn(
              "group inline-flex items-center transition",
              variant === "pill"
                ? "surface-cut gap-2 border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 hover:border-[color:var(--signal)]/40 hover:bg-white/[0.06] hover:text-white"
                : "gap-2 text-sm text-slate-400 hover:text-white",
            )}
          >
            <span
              className={cn(
                "tracking-[-0.01em]",
                variant === "pill" ? "text-white" : "font-medium text-slate-200 group-hover:text-white",
              )}
            >
              {link.label}
            </span>
            {showValue && link.value ? (
              <>
                <span className="h-1 w-1 rounded-full bg-white/14" />
                <span className="text-slate-500 group-hover:text-slate-300">{link.value}</span>
              </>
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
