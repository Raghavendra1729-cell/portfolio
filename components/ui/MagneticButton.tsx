"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HOVER_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
  wrapperClassName?: string;
  intensity?: number;
};

export function MagneticButton({
  asChild = false,
  className,
  wrapperClassName,
  intensity = 14,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const baseClassName =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[1rem] border px-5 py-3 text-sm font-medium shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-strong)]/55";

  const handlePointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) {
      onMouseMove?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * intensity * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * intensity * 2;

    setOffset({ x, y });
    onMouseMove?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
  };

  const handlePointerLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setOffset({ x: 0, y: 0 });
    onMouseLeave?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
  };

  return (
    <motion.div
      animate={reducedMotion ? undefined : { x: offset.x, y: offset.y }}
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={HOVER_SPRING}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className={cn("inline-flex", wrapperClassName)}
    >
      {(() => {
        if (asChild && React.isValidElement(children)) {
          const child = React.Children.only(children) as React.ReactElement<{
            className?: string;
            children?: React.ReactNode;
          }>;
          const childProps = child.props;

          return React.cloneElement(child, {
            ...props,
            ...childProps,
            className: cn(baseClassName, className, childProps.className),
            children: (
              <>
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_56%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  {childProps.children}
                </span>
              </>
            ),
          });
        }

        return (
          <button className={cn(baseClassName, className)} {...props}>
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_56%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
          </button>
        );
      })()}
    </motion.div>
  );
}
