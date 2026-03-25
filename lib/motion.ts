export const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

export const SECTION_TRANSITION = {
  duration: 0.58,
  ease: MOTION_EASE,
} as const;

export const HOVER_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 0.68,
} as const;
