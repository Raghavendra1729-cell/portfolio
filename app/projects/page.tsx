import { getData } from '@/lib/data';
import Projects from '@/components/Projects';

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getData('project');

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto pt-20">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">All Projects</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A collection of my work in Backend Engineering, System Design, and Full Stack Development.
        </p>
      </section>

      {/* Reusing the component we already built, but passing ALL projects */}
      <Projects data={projects} showLink={false} />
    </main>
  );
}