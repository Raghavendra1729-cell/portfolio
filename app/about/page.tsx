import { getData } from '@/lib/data';
import Link from 'next/link';

export const revalidate = 3600; // Update every hour

export default async function AboutPage() {
  // 1. Fetch ALL the data in parallel
  const [experience, education, skills, achievements, cpProfiles] = await Promise.all([
    getData('experience'),
    getData('education'),
    getData('skill'),
    getData('achievement'),
    getData('cpprofile')
  ]);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      
      {/* --- HEADER --- */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        <div className="prose prose-lg text-gray-600">
          <p>
            I am a Computer Science student passionate about building scalable backend systems and solving complex algorithmic problems. 
            Currently studying at <strong>BITS Pilani</strong> and <strong>Scaler School of Technology</strong>.
          </p>
          <p className="mt-4">
            My focus areas are <strong>Data Structures & Algorithms</strong>, <strong>System Design</strong>, and <strong>AI Engineering</strong>. 
            When I am not coding, I enjoy exploring new tech stacks and participating in hackathons.
          </p>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill: any) => (
            <div key={skill._id} className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="font-bold text-lg mb-3">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item: string) => (
                  <span key={item} className="px-3 py-1 bg-white border rounded-full text-sm text-gray-700 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Work Experience</h2>
        <div className="space-y-8">
          {experience.map((exp: any) => (
            <div key={exp._id} className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-1/4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  {exp.startDate} — {exp.endDate}
                </p>
                <p className="text-sm text-gray-500 mt-1">{exp.location}</p>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                <p className="text-blue-600 font-medium mb-2">
                  {exp.company}
                  {exp.link && (
                    <a href={exp.link} target="_blank" className="ml-2 text-xs text-gray-400 hover:text-blue-600">↗</a>
                  )}
                </p>
                <ul className="list-disc list-outside ml-4 space-y-1 text-gray-600">
                  {exp.description.map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                {/* Tech Stack used in this job */}
                {exp.technologies?.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {exp.technologies.map((t: string) => (
                       <span key={t} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                         {t}
                       </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CP & ACHIEVEMENTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* EDUCATION */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Education</h2>
          <div className="space-y-6">
            {education.map((edu: any) => (
              <div key={edu._id}>
                <h3 className="text-lg font-bold">{edu.institution}</h3>
                <p className="text-gray-700">{edu.degree}</p>
                <p className="text-sm text-gray-500 mb-1">{edu.startDate} - {edu.endDate}</p>
                {edu.grade && <p className="text-sm font-medium text-blue-600">Grade: {edu.grade}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Achievements</h2>
          <div className="space-y-6">
            {achievements.map((ach: any) => (
              <div key={ach._id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold">{ach.title}</h3>
                <p className="text-sm text-gray-600">{ach.organization} • {ach.date}</p>
                <p className="text-sm text-gray-500 mt-1">{ach.description}</p>
                {ach.link && (
                  <a href={ach.link} target="_blank" className="text-xs text-blue-500 hover:underline mt-1 block">
                    View Certificate →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- CP PROFILES (Optional) --- */}
      {cpProfiles.length > 0 && (
        <section className="mt-16">
           <h2 className="text-2xl font-bold mb-6 border-b pb-2">Competitive Programming</h2>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {cpProfiles.map((cp: any) => (
               <div key={cp._id} className="border p-4 rounded-lg text-center hover:bg-gray-50 transition">
                 <h3 className="font-bold text-lg">{cp.platform}</h3>
                 <p className="text-3xl font-bold text-blue-600 my-2">{cp.rating}</p>
                 <p className="text-sm text-gray-500">Max: {cp.maxRating}</p>
                 <p className="text-sm font-medium mt-1">{cp.rank}</p>
               </div>
             ))}
           </div>
        </section>
      )}

    </main>
  );
}