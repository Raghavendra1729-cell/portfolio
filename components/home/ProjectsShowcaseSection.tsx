import SectionFrame from "@/components/home/SectionFrame";

const modules = [
  {
    title: "Lost n Found Realtime Split View",
    description:
      "Reserved for the dual-device Socket.IO animation showing a mobile post instantly appearing on the web client.",
  },
  {
    title: "Sleep Quality ML Predictor",
    description:
      "Reserved for the interactive predictor widget with drag controls, live confidence visuals, and animated inference feedback.",
  },
  {
    title: "Python HTTP Server Terminal",
    description:
      "Reserved for the glass terminal scene where an incoming request fans out into concurrent worker streams before returning 200 OK.",
  },
];

export default function ProjectsShowcaseSection() {
  return (
    <SectionFrame
      id="projects-showcase"
      eyebrow="Projects Showcase"
      title="Interactive project demos will replace static thumbnails."
      description="This scaffold defines the project area and preserves the command-center visual system. Each card maps directly to a richer interactive demo in the next pass."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {modules.map((module) => (
          <article
            key={module.title}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.32)] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.09),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_24%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cyan-100/80">
                Phase 2 target
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">{module.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{module.description}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
