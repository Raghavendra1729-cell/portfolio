import { getData } from "@/lib/data";
import Projects from "@/components/Projects";
import { RevealSection } from "@/components/Reveal";

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getData("project");

  return (
    <main className="relative pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <RevealSection className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 border border-indigo-500/20">
            Portfolio
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-white">
            All Projects
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            A curated collection of systems, experiments, and full-stack builds
            across backend, distributed systems, and AI.
          </p>
        </RevealSection>

        <RevealSection delay={0.1}>
          <Projects data={projects} showLink={false} />
        </RevealSection>
      </div>
    </main>
  );
}