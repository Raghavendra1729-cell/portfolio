"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SECTION_TRANSITION } from "@/lib/motion";
import { publicNavItems } from "@/lib/site-config";
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
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
      initial={reducedMotion ? undefined : { y: -40, opacity: 0 }}
      animate={reducedMotion ? undefined : { y: 0, opacity: 1 }}
      transition={SECTION_TRANSITION}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-10">
        <div
          className={cn(
            "premium-surface premium-outline flex items-center justify-between rounded-[1.3rem] px-4 py-3 transition-all duration-300 sm:px-5",
            scrolled
              ? "border-white/10 bg-[#05070c]/90 shadow-[0_20px_56px_rgba(0,0,0,0.36)]"
              : "border-white/8 bg-[#05070c]/72"
          )}
        >
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex min-w-0 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-strong)]/55"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-white">
                {siteSettings.name}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  {siteSettings.role}
                </span>
                <span className="h-px w-6 bg-white/10" />
              </div>
            </div>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
            {publicNavItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative py-2 text-sm tracking-[-0.01em] text-slate-400 transition-colors duration-200",
                    isActive ? "text-white" : "hover:text-white"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive ? (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-white" />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/14 hover:text-white lg:hidden"
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
              className="fixed inset-0 z-[-1] bg-[#05070d]/78 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.28, ease: SECTION_TRANSITION.ease }}
              className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:hidden"
            >
              <div className="premium-surface premium-outline overflow-hidden rounded-[1.4rem] border border-white/12 px-4 py-4" role="dialog" aria-label="Mobile navigation">
                <div className="grid gap-2">
                  {publicNavItems.map((item, index) => {
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
                            "flex items-center justify-between rounded-[1.15rem] border px-4 py-3.5 text-sm transition-all",
                            isActive
                              ? "border-white/14 bg-white/[0.05] text-white"
                              : "border-white/8 bg-[#06080d]/55 text-slate-300"
                          )}
                        >
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
