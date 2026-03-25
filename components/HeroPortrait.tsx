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
  name: string;
  badge: string;
  role: string;
  location: string;
  availability: string;
};

export default function HeroPortrait({
  src,
  alt,
  name,
  badge,
  role,
  location,
  availability,
}: HeroPortraitProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 120, damping: 18, mass: 0.78 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18, mass: 0.78 });
  const beamX = useMotionValue(50);
  const beamY = useMotionValue(30);
  const beam = useMotionTemplate`radial-gradient(circle at ${beamX}% ${beamY}%, rgba(142, 236, 255, 0.22), rgba(142, 236, 255, 0.04) 26%, rgba(6, 9, 14, 0) 62%)`;
  const panelGlow = useMotionTemplate`radial-gradient(circle at ${beamX}% ${beamY}%, rgba(255, 255, 255, 0.16), rgba(6, 9, 14, 0) 50%)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;

    rotateY.set(x);
    rotateX.set(y);
    beamX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    beamY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    beamX.set(50);
    beamY.set(30);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1400 }}
      className="relative mx-auto w-full max-w-[32rem]"
    >
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(142,236,255,0.12),rgba(142,236,255,0)_64%)] blur-[90px]" />
      <motion.div
        style={{ backgroundImage: beam }}
        className="pointer-events-none absolute inset-0 rounded-[1.8rem]"
      />
      <motion.div
        style={{ backgroundImage: panelGlow }}
        className="pointer-events-none absolute inset-0 rounded-[1.8rem]"
      />

      <div className="premium-surface premium-outline hero-surface surface-cut relative overflow-hidden rounded-[1.8rem] p-4 sm:p-5">
        <div className="premium-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="premium-noise pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.18]" />

        <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/70">
          <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4">
            <div className="surface-cut inline-flex items-center gap-3 border border-white/10 bg-black/56 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-slate-200/80 backdrop-blur-md">
              <span className="status-dot bg-[color:var(--signal)]" />
              {badge}
            </div>
            <div className="surface-cut border border-white/10 bg-black/56 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400 backdrop-blur-md">
              {location}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-4">
            <div className="surface-cut border border-white/10 bg-black/60 p-4 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="mt-1 text-sm text-slate-300">{role}</p>
                </div>
                <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                  <span className="status-dot bg-[color:var(--signal)]" />
                  Open
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{availability}</p>
            </div>
          </div>

          <div className="relative aspect-[4/5]">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              unoptimized={typeof src === "string"}
              sizes="(max-width: 1024px) 100vw, 32rem"
              className="object-cover object-center saturate-[0.72] contrast-[1.06]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.08),rgba(5,7,10,0.18)_30%,rgba(5,7,10,0.76)_100%)]" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div className="metric-panel surface-cut rounded-[1.15rem] p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-slate-500">
              Profile
            </p>
            <p className="mt-3 text-base font-semibold text-white">Developer-grade systems</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Stronger emphasis on maintainability, hierarchy, and product thinking.
            </p>
          </div>

          <div className="metric-panel surface-cut rounded-[1.15rem] p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-slate-500">
              Style
            </p>
            <p className="mt-3 text-base font-semibold text-white">Sharp, dark, restrained</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Neobrutalist structure with controlled motion and low-noise presentation.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
