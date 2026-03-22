import SectionFrame from "@/components/home/SectionFrame";

const hudModules = [
  "Radar / spider chart surface",
  "365-day streak heat map",
  "Animated progress rings for CP platforms",
];

export default function SkillsHudSection() {
  return (
    <SectionFrame
      eyebrow="Skills HUD"
      title="The stats layer is scaffolded as a heads-up display."
      description="This section is ready to host the command-center visualizations for backend depth, machine learning fluency, and competitive programming metrics."
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.36)] backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-3">
          {hudModules.map((module) => (
            <div
              key={module}
              className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-slate-500">
                Reserved slot
              </p>
              <p className="mt-3 text-base font-medium text-white">{module}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
