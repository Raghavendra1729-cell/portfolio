"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function CursorSpotlight() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const pointerX = useMotionValue(-220);
  const pointerY = useMotionValue(-220);
  const x = useSpring(pointerX, { stiffness: 120, damping: 28, mass: 0.9 });
  const y = useSpring(pointerY, { stiffness: 120, damping: 28, mass: 0.9 });

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updateState = () => setEnabled(mediaQuery.matches);
    updateState();

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX - 176);
      pointerY.set(event.clientY - 176);
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
      className="pointer-events-none fixed left-0 top-0 z-30 h-88 w-88 rounded-full bg-[radial-gradient(circle,rgba(142,236,255,0.12)_0%,rgba(142,236,255,0.05)_24%,rgba(255,255,255,0.025)_42%,rgba(8,12,18,0)_70%)] opacity-80 blur-3xl"
    />
  );
}
