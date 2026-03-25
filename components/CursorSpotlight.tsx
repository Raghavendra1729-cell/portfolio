"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function CursorSpotlight() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const pointerX = useMotionValue(-240);
  const pointerY = useMotionValue(-240);
  const x = useSpring(pointerX, { stiffness: 140, damping: 26, mass: 0.8 });
  const y = useSpring(pointerY, { stiffness: 140, damping: 26, mass: 0.8 });

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updateState = () => setEnabled(mediaQuery.matches);
    updateState();

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX - 192);
      pointerY.set(event.clientY - 192);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    mediaQuery.addEventListener("change", updateState);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      mediaQuery.removeEventListener("change", updateState);
    };
  }, [pointerX, pointerY, reducedMotion]);

  if (reducedMotion || !enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-30 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.025)_28%,rgba(17,24,39,0)_68%)] opacity-70 blur-3xl"
    />
  );
}
