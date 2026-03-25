import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function PageShell({
  children,
  className,
  contentClassName,
}: PageShellProps) {
  return (
    <section className={cn("relative overflow-hidden px-4 pb-24 pt-8 sm:px-6 lg:px-10", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_20%_20%,rgba(217,70,239,0.1),transparent_18%)]" />
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-400/8 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-300/16 to-transparent" />
      <div className={cn("mx-auto max-w-7xl", contentClassName)}>{children}</div>
    </section>
  );
}
