import { getData } from '@/lib/data';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';

export const revalidate = 3600;

export default async function Home() {
  const projects = await getData('project');
  const experience = await getData('experience');

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-white text-black">
      <Hero />
      <Experience data={experience.slice(0, 1)} title="Where I Work" />
      <Projects data={projects.slice(0, 2)} showLink={true} />
    </main>
  );
}