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

function toneClasses(tone: HeaderTone = "cyan") {
  if (tone === "fuchsia") {
    return {
      border: "border-fuchsia-400/16 bg-fuchsia-400/10 text-fuchsia-100",
      value: "text-fuchsia-200",
    };
  }

  if (tone === "emerald") {
    return {
      border: "border-emerald-400/16 bg-emerald-400/10 text-emerald-100",
      value: "text-emerald-200",
    };
  }

  if (tone === "amber") {
    return {
      border: "border-amber-400/16 bg-amber-400/10 text-amber-100",
      value: "text-amber-200",
    };
  }

  return {
    border: "border-cyan-300/16 bg-cyan-300/10 text-cyan-50",
    value: "text-cyan-200",
  };
}

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
    <div className={cn("relative mb-12", className)}>
      <div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
        <span className="inline-flex items-center gap-3 rounded-full border border-cyan-300/16 bg-cyan-300/10 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cyan-50/80">
          <span className="status-dot bg-cyan-300" />
          {eyebrow}
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>

      {stats.length > 0 ? (
        <div
          className={cn(
            "mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
            centered && "mx-auto max-w-5xl"
          )}
        >
          {stats.map((stat) => {
            const tone = toneClasses(stat.tone);

            return (
              <div
                key={`${stat.label}-${stat.value}`}
                className={cn(
                  "command-surface-muted rounded-[1.4rem] p-4",
                  tone.border
                )}
              >
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                  {stat.label}
                </p>
                <p className={cn("mt-3 text-xl font-semibold", tone.value)}>
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
