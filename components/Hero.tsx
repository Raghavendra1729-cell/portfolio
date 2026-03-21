"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { type PointerEventHandler, useCallback } from "react";
import { ArrowRight, Github, Linkedin, Mail, ChevronDown } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 110,
      damping: 18,
      mass: 0.85,
      opacity: { duration: 0.35, ease: "easeOut" as const },
      filter: { duration: 0.35, ease: "easeOut" as const },
    },
  },
};

const socialLinks = [
  { href: "https://github.com/raghavendra1729-cell", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:your.email@example.com", icon: Mail, label: "Email" },
];

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, { stiffness: 110, damping: 18, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 110, damping: 18, mass: 0.6 });

  const rotateX = useTransform(springY, [-0.5, 0.5], reducedMotion ? [0, 0] : [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-8, 8]);
  const orbX = useTransform(springX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-20, 20]);
  const orbY = useTransform(springY, [-0.5, 0.5], reducedMotion ? [0, 0] : [-14, 14]);
  const gridShiftX = useTransform(springX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-10, 10]);
  const gridShiftY = useTransform(springY, [-0.5, 0.5], reducedMotion ? [0, 0] : [-8, 8]);
  const highlight = useMotionTemplate`radial-gradient(520px circle at calc(50% + ${springX}px * 120) calc(38% + ${springY}px * 120), rgba(99, 102, 241, 0.20), transparent 62%)`;

  const handlePointerMove = useCallback<PointerEventHandler<HTMLElement>>((event) => {
    if (reducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const nextY = (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerX.set(nextX);
    pointerY.set(nextY);
  }, [pointerX, pointerY, reducedMotion]);

  const resetPointer = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <section
      className="hero-surface relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: highlight }}
      />

      <motion.div
        aria-hidden="true"
        className="hero-grid absolute inset-0 opacity-60"
        style={{ x: gridShiftX, y: gridShiftY }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-[-10%] top-[8%] h-[30rem] w-[30rem] rounded-full bg-primary/18 blur-[120px]"
        style={{ x: orbX, y: orbY }}
        animate={reducedMotion ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-12%] left-[-6%] h-[26rem] w-[26rem] rounded-full bg-primary/12 blur-[110px]"
        style={{ x: useTransform(orbX, (value) => value * -0.6), y: useTransform(orbY, (value) => value * -0.7) }}
        animate={reducedMotion ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl"
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-10 md:px-14 md:py-14"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary/90 shadow-[0_0_0_1px_rgba(99,102,241,0.12)]">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_14px_rgba(99,102,241,0.75)]" />
              Available for opportunities
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mx-auto mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl md:text-8xl"
          >
            Design-conscious engineering for products that feel
            <span className="gradient-text block pb-1"> fast, intentional, and premium.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            I&apos;m <span className="font-medium text-white">Raghavendra</span>, a Computer Science student at
            <span className="font-medium text-white"> BITS Pilani</span> and <span className="font-medium text-white">Scaler</span> focused on scalable backend systems, algorithmic problem solving, and AI-enabled experiences.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_16px_35px_rgba(99,102,241,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(99,102,241,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View my work
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <motion.div
              className="flex items-center gap-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.07, delayChildren: 0.12 },
                },
              }}
            >
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/50 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-300 hover:border-primary/35 hover:bg-primary/10 hover:text-white"
                  variants={{
                    hidden: { opacity: 0, y: 18, scale: 0.92 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 180, damping: 16 },
                    },
                  }}
                  whileHover={reducedMotion ? undefined : { y: -3, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.45 }}
      >
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
