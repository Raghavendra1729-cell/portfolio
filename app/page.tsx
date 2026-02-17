import { getData } from "@/lib/data";
import Hero from "@/components/Hero";
import { RevealSection } from "@/components/Reveal";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

export const revalidate = 3600;

export default async function Home() {
  const projects = await getData("project");
  const experience = await getData("experience");

  const featuredProjects = projects.filter((p: any) => p.featured).slice(0, 3);
  const latestRole = experience[0];

  return (
    <main>
      <Hero />

      {/* --- FEATURED PROJECTS --- */}
      <div id="projects">
        <RevealSection className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">
                  Selected Work
                </span>
                <h2 className="text-3xl font-bold mt-2 text-white">
                  Featured Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden md:flex items-center gap-2 text-indigo-400 font-medium hover:text-indigo-300 transition"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project: any) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="group block"
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-indigo-500/10">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)]" />

                    <div className="h-44 w-full bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
                      {project.images?.[0] ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <span className="text-xl font-bold gradient-text">
                              {project.title[0]}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex gap-2">
                        {project.techStack?.slice(0, 3).map((t: string) => (
                          <span
                            key={t}
                            className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-md border border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-indigo-400 font-medium"
              >
                View All Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </RevealSection>
      </div>

      {/* --- LATEST ROLE --- */}
      {latestRole && (
        <RevealSection className="py-24 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20 mb-6">
              <Briefcase className="w-3 h-3" />
              Current Role
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {latestRole.role} at{" "}
              <span className="gradient-text">{latestRole.company}</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              {latestRole.description?.[0]}
            </p>
            <Link
              href="/experience"
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-indigo-500/30 transition-all inline-flex items-center gap-2"
            >
              See Full Timeline <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RevealSection>
      )}
    </main>
  );
}