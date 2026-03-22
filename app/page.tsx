import {
  AdminControlRoomSection,
  HeroSection,
  ProjectsShowcaseSection,
  SkillsHudSection,
} from "@/components/home";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ProjectsShowcaseSection />
      <SkillsHudSection />
      <AdminControlRoomSection />
    </main>
  );
}
