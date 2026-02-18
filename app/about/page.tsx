import { getData } from "@/lib/data";
import { GraduationCap, Award, Sparkles, User } from "lucide-react";
import { RevealSection } from "@/components/Reveal";

export const revalidate = 3600;

export default async function AboutPage() {
  const [education, achievements] = await Promise.all([
    getData("education"),
    getData("achievement"),
  ]);

  return (
    <main className="relative pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* BIO HEADER */}
        <RevealSection className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/[0.06] px-6 py-12 md:px-12">
          {/* Background blobs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-12">
            
            {/* Text Content */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 border border-indigo-500/20">
                <User className="w-3 h-3" /> About
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Raghavendra, the engineer behind the{" "}
                <span className="gradient-text">systems</span>.
              </h1>
              <div className="mt-6 text-base md:text-lg text-slate-400 leading-relaxed space-y-4">
                <p>
                  I am a Computer Science student currently pursuing a dual degree
                  program at{" "}
                  <strong className="text-white">BITS Pilani</strong> and{" "}
                  <strong className="text-white">
                    Scaler School of Technology
                  </strong>
                  .
                </p>
                <p>
                  My passion lies in{" "}
                  <strong className="text-indigo-300">
                    Distributed Systems
                  </strong>
                  ,{" "}
                  <strong className="text-indigo-300">
                    Backend Engineering
                  </strong>
                  , and{" "}
                  <strong className="text-indigo-300">
                    Artificial Intelligence
                  </strong>
                  . I enjoy deconstructing complex problems and building systems
                  that scale.
                </p>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="w-full max-w-sm shrink-0">
               <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Placeholder for User Image */}
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500 gap-3">
                     <User className="w-12 h-12 opacity-50" />
                     <span className="text-sm font-medium uppercase tracking-widest">Profile Photo</span>
                  </div>
                  {/* <img src="/about-photo.jpg" alt="About Raghavendra" className="w-full h-full object-cover" /> */}
               </div>
               
               {/* Optional Caption/Stats */}
               <div className="flex justify-between items-center mt-4 px-2">
                 <div className="text-center">
                    <p className="text-2xl font-bold text-white">3+</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Years Coding</p>
                 </div>
                 <div className="h-8 w-px bg-white/10" />
                 <div className="text-center">
                    <p className="text-2xl font-bold text-white">10+</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Projects</p>
                 </div>
                 <div className="h-8 w-px bg-white/10" />
                 <div className="text-center">
                    <p className="text-2xl font-bold text-white">100%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Commitment</p>
                 </div>
               </div>
            </div>

          </div>
        </RevealSection>

        {/* EDUCATION */}
        <RevealSection>
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white">Education</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {education.map((edu: any) => (
              <article
                key={edu._id}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/20 px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_60%)]" />
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      {edu.institution}
                    </h3>
                    <p className="text-slate-400">{edu.degree}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/20">
                      {edu.startDate} – {edu.endDate}
                    </span>
                    {edu.grade && (
                      <p className="mt-1 text-xs text-slate-500">
                        Grade:{" "}
                        <span className="font-medium text-slate-300">
                          {edu.grade}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </RevealSection>

        {/* ACHIEVEMENTS */}
        <RevealSection>
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((ach: any) => (
              <article
                key={ach._id}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.05),transparent_60%)]" />

                {ach.images?.[0] && (
                  <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                    <img
                      src={ach.images[0]}
                      alt={ach.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  </div>
                )}

                <div className="relative p-5 space-y-2">
                  <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {ach.organization && <span>{ach.organization}</span>}
                    {ach.organization && ach.date && <span> • </span>}
                    {ach.date}
                  </p>
                  {ach.description && (
                    <p className="text-sm text-slate-400 line-clamp-3">
                      {ach.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </RevealSection>
      </div>
    </main>
  );
}