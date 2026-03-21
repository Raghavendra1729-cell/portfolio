"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ExternalLink, GraduationCap, Users } from "lucide-react";
import type { ExperienceHighlight, ExperienceLink } from "@/models/Experience";

interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location?: string;
  description: string[];
  technologies?: string[];
  leadership?: ExperienceHighlight[];
  mentorship?: ExperienceHighlight[];
  links?: ExperienceLink[];
  link?: string;
}

function HighlightBlock({
  label,
  icon,
  items,
}: {
  label: string;
  icon: ReactNode;
  items: ExperienceHighlight[];
}) {
  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
        {icon}
        {label}
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title}>
            <p className="text-sm font-medium text-white">{item.title}</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {item.details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Experience({
  data,
  title = "Work Experience",
}: {
  data: ExperienceItem[];
  title?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(data[0]?._id ?? null);

  const sortedData = useMemo(
    () => [...data],
    [data]
  );

  if (!sortedData.length) return null;

  return (
    <section className="mb-16 w-full">
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Leadership Journey
          </p>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Expand each role to review impact, technical execution, and how leadership
          and mentorship scaled delivery across the team.
        </p>
      </div>

      <div className="relative space-y-4 before:absolute before:bottom-0 before:left-[17px] before:top-2 before:w-px before:bg-white/10 md:before:left-6">
        {sortedData.map((exp) => {
          const isOpen = openId === exp._id;
          const leadershipCount = exp.leadership?.reduce(
            (count, entry) => count + entry.details.length,
            0
          ) ?? 0;
          const mentorshipCount = exp.mentorship?.reduce(
            (count, entry) => count + entry.details.length,
            0
          ) ?? 0;
          const primaryLink = exp.link ?? exp.links?.[0]?.url;

          return (
            <article
              key={exp._id}
              className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_10px_40px_rgba(15,23,42,0.2)] transition md:p-6"
            >
              <div className="absolute left-[10px] top-8 h-4 w-4 rounded-full border-4 border-slate-950 bg-indigo-400 md:left-[17px]" />

              <div className="md:pl-10">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : exp._id)}
                  className="flex w-full flex-col gap-4 text-left md:flex-row md:items-start md:justify-between"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                      <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-indigo-300">
                        {exp.company}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                      <span>
                        {exp.startDate} — {exp.endDate}
                      </span>
                      {exp.location && <span>{exp.location}</span>}
                      {primaryLink && (
                        <span className="inline-flex items-center gap-1 text-indigo-300">
                          <ExternalLink className="h-3.5 w-3.5" />
                          External reference
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {exp.description?.length ?? 0} impact bullets
                      </span>
                      {leadershipCount > 0 && (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                          {leadershipCount} leadership highlights
                        </span>
                      )}
                      {mentorshipCount > 0 && (
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                          {mentorshipCount} mentorship highlights
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 md:min-w-[140px] md:justify-end">
                    <span className="text-sm text-slate-500">
                      {isOpen ? "Collapse" : "Expand"}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition">
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-6 grid gap-6 border-t border-white/10 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
                    <div>
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Impact Summary
                      </h4>
                      <ul className="space-y-3 text-sm leading-7 text-slate-300">
                        {exp.description?.map((point) => (
                          <li key={point} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <HighlightBlock
                        label="Leadership"
                        icon={<Users className="h-4 w-4 text-emerald-300" />}
                        items={exp.leadership ?? []}
                      />
                      <HighlightBlock
                        label="Mentorship"
                        icon={<GraduationCap className="h-4 w-4 text-amber-300" />}
                        items={exp.mentorship ?? []}
                      />
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
