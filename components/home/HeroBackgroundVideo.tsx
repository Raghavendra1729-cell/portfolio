"use client";

type HeroBackgroundVideoProps = {
  src?: string;
};

export default function HeroBackgroundVideo({
  src = "/videos/hero-command-center.mp4",
}: HeroBackgroundVideoProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="hero-video absolute inset-0 h-full w-full object-cover opacity-40"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(168,85,247,0.18),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.25),rgba(2,6,23,0.84))]" />
      <div className="command-grid absolute inset-0 opacity-55" />
      <div className="scanlines absolute inset-0 opacity-25 mix-blend-screen" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_55%)]" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-400/15 blur-[110px]" />
      <div className="absolute -right-10 bottom-10 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-[140px]" />
    </div>
  );
}
