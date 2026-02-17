import { getData } from '@/lib/data';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';

export const revalidate = 3600;

export default async function AboutPage() {
  const [experience, education, skills, achievements, cpProfiles] = await Promise.all([
    getData('experience'),
    getData('education'),
    getData('skill'),
    getData('achievement'),
    getData('cpprofile')
  ]);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      {/* Bio Section */}
      <section className="mb-16 pt-10">
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

      <Skills data={skills} />
      
      <Experience data={experience} title="Work Experience" />

      {/* Education & Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Education</h2>
          <div className="space-y-6">
            {education.map((edu: any) => (
              <div key={edu._id} className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-bold">{edu.institution}</h3>
                <p className="text-gray-700">{edu.degree}</p>
                <p className="text-sm text-gray-500 mb-1">{edu.startDate} - {edu.endDate}</p>
                {edu.grade && <p className="text-sm font-medium text-blue-600">Grade: {edu.grade}</p>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Achievements</h2>
          <div className="space-y-6">
            {achievements.map((ach: any) => (
              <div key={ach._id} className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="font-bold">{ach.title}</h3>
                <p className="text-sm text-gray-600">{ach.organization} • {ach.date}</p>
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

      {/* CP Stats */}
      {cpProfiles.length > 0 && (
        <section className="mb-16">
           <h2 className="text-2xl font-bold mb-6 border-b pb-2">Competitive Programming</h2>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {cpProfiles.map((cp: any) => (
               <div key={cp._id} className="border p-4 rounded-lg text-center hover:bg-gray-50 transition">
                 <h3 className="font-bold text-lg">{cp.platform}</h3>
                 <p className="text-3xl font-bold text-blue-600 my-2">{cp.rating}</p>
                 <p className="text-xs text-gray-400">Max: {cp.maxRating} | Rank: {cp.rank}</p>
               </div>
             ))}
           </div>
        </section>
      )}
    </main>
  );
}