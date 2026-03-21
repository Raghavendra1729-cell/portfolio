import { getData } from "@/lib/data";
import { Briefcase } from "lucide-react";
import Experience from "@/components/Experience";
import { RevealSection } from "@/components/Reveal";

export const revalidate = 3600;

export default async function ExperiencePage() {
  const experience = await getData("experience");

  return (
    <main className="relative pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealSection className="mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 border border-indigo-500/20">
            <Briefcase className="w-3 h-3" /> Experience
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-white">
            Work Experience & Internships
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl">
            A timeline of roles where I&apos;ve designed, built, and shipped
            real systems.
          </p>
        </RevealSection>

        <RevealSection delay={0.1}>
          <Experience data={experience} title="Work Experience & Internships" />
        </RevealSection>
      </div>
    </main>
  );
}
