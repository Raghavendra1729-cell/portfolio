export default function Skills({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Technical Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((skill) => (
          <div key={skill._id} className="bg-gray-50 p-5 rounded-xl border hover:border-blue-200 transition">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{skill.category}</h3>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item: string) => (
                <span key={item} className="px-3 py-1 bg-white border rounded-full text-sm text-gray-600 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}