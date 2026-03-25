import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderStat = {
  label: string;
  value: string;
};

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats?: PageHeaderStat[];
  align?: "left" | "center";
  children?: ReactNode;
  className?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  stats = [],
  align = "left",
  children,
  className,
}: PageHeaderProps) {
  const centered = align === "center";

  return (
    <section className={cn("relative mb-14 border-b border-white/8 pb-9", className)}>
      <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]", centered && "lg:grid-cols-1")}>
        <div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
          <div className={cn("section-badge", centered && "justify-center")}>
            <span>{eyebrow}</span>
          </div>
          <h1 className="mt-6 max-w-5xl text-balance text-4xl font-semibold tracking-[-0.075em] text-white sm:text-5xl lg:text-[4.6rem] lg:leading-[0.92]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {description}
          </p>
          {children ? <div className="mt-7">{children}</div> : null}
        </div>

        {!centered ? (
          <div className="hidden lg:block">
            <div className="metric-panel surface-cut rounded-[1.5rem] p-5">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-slate-500">
                Page signal
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Clean hierarchy, restrained motion, and clearer content framing carry through each section.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <div className={cn("mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4", centered && "mx-auto max-w-5xl")}>
          {stats.map((stat) => (
            <div key={`${stat.label}-${stat.value}`} className="metric-panel surface-cut rounded-[1.3rem] p-4">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
