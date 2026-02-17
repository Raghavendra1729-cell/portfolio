import { getData } from '@/lib/data';
import Hero from '@/components/Hero';
import Link from 'next/link';
import { ArrowRight, Trophy, Briefcase } from 'lucide-react';

export const revalidate = 3600;

export default async function Home() {
  // Fetch only what we need for the preview
  const projects = await getData('project');
  const experience = await getData('experience');

  // Get top items
  const featuredProjects = projects.filter((p: any) => p.featured).slice(0, 2);
  const latestRole = experience[0];

  return (
    <main className="bg-white">
      <Hero />

      {/* --- FEATURED PREVIEW --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Selected Work</h2>
              <p className="text-gray-500">A glimpse into my recent engineering projects.</p>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:underline">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project: any) => (
              <Link key={project._id} href={`/projects/${project._id}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition h-full flex flex-col">
                  <div className="h-48 bg-gray-200 w-full object-cover relative">
                    {/* Placeholder for project image */}
                    {project.images?.[0] && (
                       <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{project.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description}</p>
                    <div className="mt-auto flex gap-2">
                      {project.techStack?.slice(0, 3).map((t: string) => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
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
            <Link href="/projects" className="inline-flex items-center gap-2 text-blue-600 font-medium">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- LATEST ROLE TEASER --- */}
      {latestRole && (
        <section className="py-20 border-t">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Current Role
            </span>
            <h2 className="text-3xl font-bold mb-4">Software Engineer at {latestRole.company}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {latestRole.description?.[0]}
            </p>
            <Link 
              href="/experience" 
              className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition inline-flex items-center gap-2"
            >
              See Full Timeline <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}