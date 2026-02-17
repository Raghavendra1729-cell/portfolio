import { getData } from '@/lib/data';
import { GraduationCap, Award, User } from 'lucide-react';

export const revalidate = 3600;

export default async function AboutPage() {
  const [education, achievements] = await Promise.all([
    getData('education'),
    getData('achievement')
  ]);

  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      
      {/* BIO HEADER */}
      <section className="mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>
        <div className="prose prose-lg text-gray-600 leading-relaxed">
          <p>
            I am a Computer Science student currently pursuing a dual degree program at 
            <strong> BITS Pilani</strong> and <strong>Scaler School of Technology</strong>.
          </p>
          <p>
            My passion lies in <strong>Distributed Systems</strong>, <strong>Backend Engineering</strong>, and <strong>Artificial Intelligence</strong>. 
            I enjoy deconstructing complex problems and building systems that scale. When I'm not coding, 
            you can find me grinding LeetCode problems or exploring the latest in Generative AI.
          </p>
        </div>
      </section>

      {/* EDUCATION GRID */}
      <section className="mb-20">
        <h2 className="flex items-center gap-3 text-2xl font-bold mb-8 border-b pb-4">
          <GraduationCap className="text-blue-600" /> Education
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {education.map((edu: any) => (
            <div key={edu._id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-xl border">
              <div>
                <h3 className="font-bold text-lg">{edu.institution}</h3>
                <p className="text-gray-700">{edu.degree}</p>
              </div>
              <div className="text-left md:text-right mt-2 md:mt-0">
                <span className="block text-sm font-medium text-blue-600">{edu.startDate} - {edu.endDate}</span>
                {edu.grade && <span className="text-sm text-gray-500">Grade: {edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section>
        <h2 className="flex items-center gap-3 text-2xl font-bold mb-8 border-b pb-4">
          <Award className="text-blue-600" /> Achievements
        </h2>
        <div className="space-y-6">
          {achievements.map((ach: any) => (
            <div key={ach._id} className="flex gap-4 items-start group">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 group-hover:bg-blue-600 transition shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{ach.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{ach.organization} • {ach.date}</p>
                <p className="text-gray-600">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}