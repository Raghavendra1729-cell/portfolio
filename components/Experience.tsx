interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location?: string;
  description: string[];
  technologies?: string[];
  link?: string;
}

export default function Experience({ data, title = "Work Experience" }: { data: ExperienceItem[], title?: string }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="w-full mb-16">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">{title}</h2>
      <div className="space-y-8">
        {data.map((exp) => (
          <div key={exp._id} className="flex flex-col md:flex-row gap-4 md:gap-8 bg-white p-4 rounded-lg hover:bg-gray-50 transition">
            <div className="md:w-1/4 shrink-0">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                {exp.startDate} — {exp.endDate}
              </p>
              {exp.location && <p className="text-sm text-gray-500 mt-1">{exp.location}</p>}
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
              <p className="text-blue-600 font-medium mb-2">
                {exp.company}
                {exp.link && (
                  <a href={exp.link} target="_blank" className="ml-2 text-xs text-gray-400 hover:text-blue-600">↗</a>
                )}
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-gray-600 mb-3">
                {exp.description?.slice(0, 3).map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {exp.technologies.map((t) => (
                     <span key={t} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border">
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
  );
}