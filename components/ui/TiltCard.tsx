"use client";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export default function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 140, damping: 18, mass: 0.7 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 18, mass: 0.7 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * intensity * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -intensity * 2;

    rotateY.set(x);
    rotateX.set(y);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={reducedMotion ? undefined : { y: -4, scale: 1.006 }}
      transition={{ type: "spring", stiffness: 160, damping: 22, mass: 0.7 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
