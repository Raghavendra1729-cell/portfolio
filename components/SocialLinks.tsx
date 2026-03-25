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
              className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] text-slate-300 transition hover:border-white/14 hover:bg-white/[0.04] hover:text-white"
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
                ? "gap-2 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-2.5 text-sm text-slate-300 hover:border-white/14 hover:bg-white/[0.04] hover:text-white"
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
                <span className="h-1 w-1 rounded-full bg-white/12" />
                <span className="text-slate-500 group-hover:text-slate-300">{link.value}</span>
              </>
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
