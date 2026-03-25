import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeaderTone = "cyan" | "fuchsia" | "emerald" | "amber";

type PageHeaderStat = {
  label: string;
  value: string;
  tone?: HeaderTone;
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
    <div className={cn("relative mb-14 border-b border-white/6 pb-8", className)}>
      <div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
        <div
          className={cn(
            "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500",
            centered && "justify-center"
          )}
        >
          <span>{eyebrow}</span>
          <span className="h-px w-10 bg-white/10" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.075em] text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[0.94]">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>

      {stats.length > 0 ? (
        <div
          className={cn(
            "mt-8 grid gap-3 border-t border-white/6 pt-6 sm:grid-cols-2 xl:grid-cols-4",
            centered && "mx-auto max-w-5xl"
          )}
        >
          {stats.map((stat) => {
            return (
              <div
                key={`${stat.label}-${stat.value}`}
                className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4"
              >
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-xl font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
