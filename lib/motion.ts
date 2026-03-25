export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export const SECTION_TRANSITION = {
  duration: 0.55,
  ease: MOTION_EASE,
} as const;

export const HOVER_SPRING = {
  type: "spring",
  stiffness: 190,
  damping: 22,
  mass: 0.72,
} as const;
