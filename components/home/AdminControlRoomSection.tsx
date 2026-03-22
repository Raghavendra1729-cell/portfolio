import SectionFrame from "@/components/home/SectionFrame";

export default function AdminControlRoomSection() {
  return (
    <SectionFrame
      eyebrow="Admin Control Room"
      title="The admin dashboard now has a dedicated landing zone on the homepage."
      description="This scaffold marks the control-room area for live traffic, visibility toggles, stat syncing, and contact inbox management without blocking the hero rollout."
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-slate-500">
            Live map placeholder
          </p>
          <div className="mt-4 h-64 rounded-[1.5rem] border border-dashed border-cyan-300/20 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.16),transparent_18%),radial-gradient(circle_at_70%_55%,rgba(168,85,247,0.18),transparent_20%),linear-gradient(180deg,rgba(15,23,42,0.55),rgba(2,6,23,0.78))]" />
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-slate-500">
              Toggle rail
            </p>
            <p className="mt-3 text-white">Project visibility controls land here.</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-slate-500">
              Sync action
            </p>
            <p className="mt-3 text-white">
              The glowing &quot;Sync Stats&quot; button lands here.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-slate-500">
              Inbox
            </p>
            <p className="mt-3 text-white">Contact-message queue lands here.</p>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
