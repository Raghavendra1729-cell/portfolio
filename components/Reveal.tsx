"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "scale";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
}

const distanceMap: Record<RevealVariant, { x?: number; y?: number; scale?: number }> = {
  "fade-up": { y: 28 },
  "fade-left": { x: -32 },
  "fade-right": { x: 32 },
  scale: { y: 18, scale: 0.94 },
};

function createItemVariants(
  variant: RevealVariant,
  reducedMotion: boolean,
  delay = 0,
): Variants {
  const offset = distanceMap[variant];

  return {
    hidden: reducedMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: offset.x ?? 0,
          y: offset.y ?? 0,
          scale: offset.scale ?? 1,
          filter: "blur(10px)",
        },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: reducedMotion
        ? { duration: 0.2, delay }
        : {
            delay,
            type: "spring",
            stiffness: 118,
            damping: 20,
            mass: 0.8,
            opacity: { duration: 0.34, ease: "easeOut" },
            filter: { duration: 0.3, ease: "easeOut" },
          },
    },
  };
}

function createContainerVariants(staggerDelay: number, delay: number, reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: reducedMotion ? 0.04 : staggerDelay,
        when: "beforeChildren",
      },
    },
  };
}

export function RevealSection({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  stagger = false,
  staggerDelay = 0.12,
}: RevealProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const itemVariants = createItemVariants(variant, reducedMotion, delay);

  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18, margin: "0px 0px -12% 0px" }}
        variants={createContainerVariants(staggerDelay, delay, reducedMotion)}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.24, margin: "0px 0px -10% 0px" }}
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
  variant = "fade-up",
}: Omit<RevealProps, "delay" | "stagger" | "staggerDelay">) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div variants={createItemVariants(variant, reducedMotion)} className={className}>
      {children}
    </motion.div>
  );
}

export default RevealSection;
