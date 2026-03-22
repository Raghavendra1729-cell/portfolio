"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
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
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-10">
        <div
          className={cn(
            "command-surface command-outline flex items-center justify-between rounded-[1.7rem] px-4 py-3 transition-all duration-300 sm:px-5",
            scrolled
              ? "border-white/16 bg-slate-950/82 shadow-[0_24px_70px_rgba(2,6,23,0.5)]"
              : "border-white/10 bg-slate-950/60"
          )}
        >
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
          >
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
              <Command className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                {siteConfig.name}
              </p>
              <p className="truncate text-xs text-slate-500">{siteConfig.role}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {publicNavItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative rounded-full px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200",
                    isActive ? "text-white" : "hover:text-white"
                  )}
                >
                  {isActive ? (
                    <span className="absolute inset-0 rounded-full border border-cyan-300/16 bg-cyan-300/10" />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/20 hover:text-white lg:hidden"
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
              className="fixed inset-0 z-[-1] bg-slate-950/72 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:hidden"
            >
              <div className="command-surface command-outline overflow-hidden rounded-[1.8rem] border border-white/12 px-4 py-4">
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
                              ? "border-cyan-300/18 bg-cyan-300/10 text-white"
                              : "border-white/8 bg-slate-950/35 text-slate-300"
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
