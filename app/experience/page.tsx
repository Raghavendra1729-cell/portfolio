import { getData } from '@/lib/data';
import { Briefcase } from 'lucide-react';

export const revalidate = 3600;

export default async function ExperiencePage() {
  const experience = await getData('experience');

  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Work Experience</h1>
        <p className="text-gray-600">My professional journey and internships.</p>
      </div>

      <div className="relative border-l-2 border-gray-200 ml-3 md:ml-6 space-y-16">
        {experience.map((exp: any) => (
          <div key={exp._id} className="relative pl-8 md:pl-12">
            {/* Dot */}
            <span className="absolute -left-[9px] top-1 w-5 h-5 bg-white border-4 border-blue-600 rounded-full"></span>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{exp.role}</h3>
                <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
              </div>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                {exp.startDate} - {exp.endDate}
              </span>
            </div>

            <ul className="list-disc list-outside ml-4 space-y-3 text-gray-700 text-lg leading-relaxed">
              {exp.description.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>

            {/* Tech Stack for this role */}
            {exp.technologies?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {exp.technologies.map((t: string) => (
                  <span key={t} className="px-3 py-1 bg-gray-50 border rounded-lg text-sm text-gray-600">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}