import Link from 'next/link';
import { getData } from '@/lib/data';

// 1. Revalidate this page every hour
export const revalidate = 3600;

export default async function Home() {
  // 2. Fetch data for the home page
  const projects = await getData('project');
  const experience = await getData('experience');

  // Get only the first 2 items for the preview
  const featuredProjects = projects.slice(0, 2);
  const latestExperience = experience.slice(0, 1);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-white text-black">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-4xl w-full text-center mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          Hi, I'm Raghavendra.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A Computer Science student at BITS Pilani and Scaler School of Technology. 
          I build scalable backend systems, solve complex DSA problems, and explore AI engineering.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/projects" 
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            View Projects
          </Link>
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* --- LATEST EXPERIENCE --- */}
      {latestExperience.length > 0 && (
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Where I Work</h2>
          <div className="bg-gray-50 p-6 rounded-xl border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold">{latestExperience[0].role}</h3>
                <p className="text-blue-600 font-medium">{latestExperience[0].company}</p>
              </div>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                {latestExperience[0].startDate} - {latestExperience[0].endDate}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{latestExperience[0].description?.[0]}</p>
          </div>
        </section>
      )}

      {/* --- FEATURED PROJECTS --- */}
      <section className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link href="/projects" className="text-blue-600 hover:underline text-sm">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project: any) => (
            <div key={project._id} className="group border rounded-xl p-6 hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}