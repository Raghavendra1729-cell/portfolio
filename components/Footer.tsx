"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavItems, siteConfig, socialLinks } from "@/lib/site-config";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-20">
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-10">
        <div className="command-surface command-outline rounded-[2rem] px-6 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="max-w-md">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-cyan-200/80">
                {siteConfig.name}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {siteConfig.role}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Software engineer and student focused on adaptable problem solving, fast learning,
                and clear execution.
              </p>
              <p className="mt-3 text-sm text-slate-400">{siteConfig.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
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

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Connect
              </h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} {siteConfig.name}.</p>
            <p>{siteConfig.availability}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
