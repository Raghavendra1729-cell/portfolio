import { getData } from '@/lib/data';
import { Code2 } from 'lucide-react';

export const revalidate = 3600;

export default async function SkillsPage() {
  const skills = await getData('skill');

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Technical Skills</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive list of the languages, frameworks, and tools I use to build software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill: any) => (
          <div key={skill._id} className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl">{skill.category}</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {skill.items.map((item: string) => (
                <span key={item} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium border hover:border-blue-300 transition cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}