"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import HeroBackgroundVideo from "@/components/home/HeroBackgroundVideo";
import { siteConfig } from "@/lib/site-config";

const heroName = siteConfig.name.split("");

const statusPills = [
  "Backend Engineering",
  "Distributed Systems",
  "Problem Solving",
];

const signalBars = [
  { label: "Focus", value: "Backend systems", tone: "cyan" },
  { label: "Strength", value: "Clean execution", tone: "violet" },
  { label: "Approach", value: "Product thinking", tone: "emerald" },
];

const socialLinks = [
  {
    href: siteConfig.githubHref,
    label: "GitHub",
    icon: Github,
  },
  {
    href: siteConfig.linkedinHref,
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: siteConfig.emailHref,
    label: "Email",
    icon: Mail,
  },
];

export default function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden px-6 pb-14 pt-28 sm:px-8 lg:px-10">
      <HeroBackgroundVideo />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-slate-950" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.32em] text-slate-200 shadow-[0_12px_35px_rgba(2,6,23,0.38)] backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
            Software Engineer Portfolio
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-3">
            {statusPills.map((pill, index) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.35 }}
                className="rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-sm text-slate-200/90 backdrop-blur-md"
              >
                {pill}
              </motion.span>
            ))}
          </div>

          <h1 className="mt-8 text-[3.6rem] font-semibold leading-none tracking-[-0.08em] text-white sm:text-[5.2rem] lg:text-[8.4rem]">
            <span className="block text-sm font-medium uppercase tracking-[0.5em] text-slate-400 sm:text-base">
              Engineering Interfaces with Signal
            </span>
            <span className="mt-4 block">
              {heroName.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 56, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.18 + index * 0.05,
                    duration: 0.62,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block hero-letter"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.48, ease: "easeOut" }}
            className="mt-8 max-w-2xl text-lg leading-8 text-slate-200/82 sm:text-xl"
          >
            Backend-focused engineer with a strong interest in distributed systems,
            scalable application design, and building products that feel reliable,
            polished, and useful.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.45 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <Link
              href="/about"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_65px_rgba(34,211,238,0.45)]"
            >
              View profile
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-xl transition-all duration-300 hover:border-fuchsia-400/35 hover:bg-fuchsia-400/10"
            >
              Contact me
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.45 }}
            className="mt-8 flex items-center gap-3"
          >
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={reducedMotion ? undefined : { y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 text-slate-200 shadow-[0_12px_30px_rgba(2,6,23,0.32)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-300/35 hover:text-cyan-200"
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: reducedMotion ? 0 : 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.62, duration: 0.55, ease: "easeOut" }}
          className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.16),transparent_26%)]" />
          <div className="relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.35em] text-slate-400">
                  Professional Snapshot
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Core strengths
                </h2>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Open to opportunities
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {signalBars.map(({ label, value, tone }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + index * 0.1, duration: 0.4 }}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono uppercase tracking-[0.22em] text-slate-400">
                      {label}
                    </span>
                    <span
                      className={
                        tone === "cyan"
                          ? "text-cyan-200"
                          : tone === "violet"
                            ? "text-fuchsia-200"
                            : "text-emerald-200"
                      }
                    >
                      {value}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${78 + index * 8}%` }}
                      transition={{ delay: 1 + index * 0.12, duration: 0.7, ease: "easeOut" }}
                      className={
                        tone === "cyan"
                          ? "h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.35),rgba(103,232,249,1))] shadow-[0_0_20px_rgba(34,211,238,0.55)]"
                          : tone === "violet"
                            ? "h-full rounded-full bg-[linear-gradient(90deg,rgba(168,85,247,0.35),rgba(232,121,249,1))] shadow-[0_0_20px_rgba(192,132,252,0.45)]"
                            : "h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,0.35),rgba(74,222,128,1))] shadow-[0_0_20px_rgba(74,222,128,0.45)]"
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
                    Explore
                  </p>
                  <p className="mt-2 text-base text-white">
                    About, skills, achievements, and contact are available in the navigation.
                  </p>
                </div>
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-full border border-cyan-300/30 bg-cyan-300/10 p-3 text-cyan-200"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.45 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.a
          href="/about"
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          className="group flex flex-col items-center gap-2 text-slate-300/70"
        >
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.35em]">
            Scroll
          </span>
          <span className="rounded-full border border-white/10 bg-white/6 p-3 shadow-[0_0_25px_rgba(34,211,238,0.18)] transition-all duration-300 group-hover:border-cyan-300/35 group-hover:text-cyan-200">
            <ChevronDown className="h-4 w-4" />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
