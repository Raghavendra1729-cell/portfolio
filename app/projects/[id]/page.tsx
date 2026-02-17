import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

// 1. Generate Static Params for faster page loads (Optional but recommended)
export async function generateStaticParams() {
  await dbConnect();
  const projects = await Project.find({}).select('_id');
  return projects.map((p) => ({
    id: p._id.toString(),
  }));
}

// 2. Fetch data for a specific project
async function getProject(id: string) {
  await dbConnect();
  // We use findById because we are looking up by the MongoDB _id
  try {
    const project = await Project.findById(id).lean();
    if (!project) return null;
    
    // Serialization fix
    return {
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt?.toString(),
      updatedAt: project.updatedAt?.toString(),
    };
  } catch (e) {
    return null;
  }
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project: any = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto pt-20">
      <Link 
        href="/projects" 
        className="text-sm text-gray-500 hover:text-blue-600 mb-8 inline-block transition"
      >
        ← Back to all projects
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{project.title}</h1>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech: string) => (
              <span key={tech} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 ml-auto">
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Live Demo ↗
              </a>
            )}
            {project.repo && (
              <a 
                href={project.repo} 
                target="_blank" 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-lg text-gray-700 max-w-none">
        {/* We assume description might be multiline or markdown in the future, 
            but for now we display it simply. */}
        <p className="whitespace-pre-wrap">{project.description}</p>
      </article>

    </main>
  );
}