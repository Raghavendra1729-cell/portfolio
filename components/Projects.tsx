import Link from 'next/link';

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  techStack?: string[];
  link?: string;
}

export default function Projects({ data, showLink = false }: { data: ProjectItem[], showLink?: boolean }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="w-full mb-16">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold">Recent Projects</h2>
        {showLink && (
          <Link href="/projects" className="text-blue-600 hover:underline text-sm">
            View All →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((project) => (
          // WRAP CARD IN LINK
          <Link key={project._id} href={`/projects/${project._id}`} className="block h-full">
            <div className="group border rounded-xl p-6 hover:shadow-lg transition bg-white flex flex-col justify-between h-full cursor-pointer hover:border-blue-400">
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.techStack?.slice(0, 4).map((tech) => (
                  <span key={tech} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}