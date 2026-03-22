"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.25,
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-40 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative h-1 overflow-hidden rounded-full border border-cyan-400/10 bg-slate-900/70 shadow-[0_0_0_1px_rgba(15,23,42,0.35)] backdrop-blur">
          <motion.div
            style={{ scaleX, transformOrigin: "0% 50%" }}
            className="h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.9),rgba(129,140,248,0.9),rgba(168,85,247,0.9))] shadow-[0_0_22px_rgba(34,211,238,0.5)]"
          />
        </div>
      </div>
    </div>
  );
}
