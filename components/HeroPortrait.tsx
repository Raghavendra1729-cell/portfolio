"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type HeroPortraitProps = {
  src: string | StaticImageData;
  alt: string;
  badge: string;
  role: string;
  location: string;
  availability: string;
};

export default function HeroPortrait({
  src,
  alt,
  badge,
  role,
  location,
  availability,
}: HeroPortraitProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 140, damping: 18, mass: 0.7 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 18, mass: 0.7 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(18);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.16), rgba(17, 24, 39, 0) 52%)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;

    rotateY.set(x);
    rotateX.set(y);
    glowX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    glowY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(18);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      className="relative mx-auto w-full max-w-[26rem]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%)]" />
      <motion.div
        style={{ backgroundImage: glow }}
        className="pointer-events-none absolute inset-0 rounded-[2.2rem]"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] border border-white/8" />
      <div className="pointer-events-none absolute -inset-6 rounded-[2.6rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),rgba(7,10,17,0)_64%)] blur-3xl" />

      <div className="premium-surface premium-outline relative overflow-hidden rounded-[2.2rem] p-4 sm:p-5">
        <div className="premium-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="premium-noise pointer-events-none absolute inset-0 opacity-[0.035]" />

        <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/60">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-black/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-200/75 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
              {badge}
            </div>
          </div>

          <div className="relative aspect-[4/5]">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              unoptimized={typeof src === "string"}
              sizes="(max-width: 1024px) 100vw, 26rem"
              className="object-cover object-center saturate-[0.82] contrast-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,12,0.02),rgba(4,7,12,0.12)_42%,rgba(4,7,12,0.68)_100%)]" />
          </div>
        </div>

        <div className="relative mt-4 rounded-[1.4rem] border border-white/8 bg-white/[0.025] p-4 backdrop-blur-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Profile
          </p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">{role}</p>
              <p className="mt-2 text-sm text-slate-400">{location}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-200">
              <span className="status-dot bg-white/80" />
              Open
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{availability}</p>
        </div>
      </div>
    </motion.div>
  );
}
