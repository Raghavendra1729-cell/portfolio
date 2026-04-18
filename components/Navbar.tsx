"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { SECTION_TRANSITION } from "@/lib/motion";
import type { SiteSettingsRecord } from "@/lib/data";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({ siteSettings }: { siteSettings: SiteSettingsRecord }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();
  const navigationItems = siteSettings.navigationItems.filter((item) => item.enabled);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.header
      initial={reducedMotion ? undefined : { y: -36, opacity: 0 }}
      animate={reducedMotion ? undefined : { y: 0, opacity: 1 }}
      transition={SECTION_TRANSITION}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-10">
        <div
          className={cn(
            "premium-surface premium-outline surface-cut flex items-center justify-between gap-4 px-4 py-3 sm:px-5",
            scrolled
              ? "border-white/12 bg-[#05070b]/90 shadow-[0_22px_60px_rgba(0,0,0,0.4)]"
              : "border-white/10 bg-[#05070b]/78"
          )}
        >
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex min-w-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-strong)]/55"
          >
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-[-0.03em] text-white">
                {siteSettings.name}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  {siteSettings.role}
                </span>
                <span className="h-px w-6 bg-white/10" />
              </div>
            </div>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-2 lg:flex">
            {navigationItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "surface-cut inline-flex items-center border px-3 py-2 text-sm tracking-[-0.01em]",
                    isActive
                      ? "border-white/14 bg-white/[0.08] text-white"
                      : "border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {siteSettings.primaryResumeViewHref ? (
              <a
                href={siteSettings.primaryResumeViewHref}
                target="_blank"
                rel="noreferrer"
                className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white px-4 py-2.5 text-sm font-medium text-slate-950 shadow-[0_18px_42px_rgba(255,255,255,0.06)]"
              >
                Resume
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>

          <button
            className="surface-cut inline-flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/14 hover:bg-white/[0.06] hover:text-white lg:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1] bg-[#04070b]/84 backdrop-blur-md lg:hidden"
            />
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.28, ease: SECTION_TRANSITION.ease }}
              className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:hidden"
            >
              <div
                className="premium-surface premium-outline surface-cut overflow-hidden border border-white/12 px-4 py-4"
                role="dialog"
                aria-label="Mobile navigation"
              >
                <div className="grid gap-2">
                  {navigationItems.map((item, index) => {
                    const isActive = isActivePath(pathname, item.href);

                    return (
                      <motion.div
                        key={item.href}
                        initial={reducedMotion ? undefined : { opacity: 0, x: -10 }}
                        animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "surface-cut flex items-center justify-between border px-4 py-3.5 text-sm",
                            isActive
                              ? "border-white/14 bg-white/[0.07] text-white"
                              : "border-white/8 bg-[#07090d]/65 text-slate-300"
                          )}
                        >
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {siteSettings.primaryResumeViewHref ? (
                  <a
                    href={siteSettings.primaryResumeViewHref}
                    target="_blank"
                    rel="noreferrer"
                    className="surface-cut mt-4 inline-flex w-full items-center justify-center gap-2 border border-white/10 bg-white px-4 py-3 text-sm font-medium text-slate-950"
                  >
                    Resume
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
