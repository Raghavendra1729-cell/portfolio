import { RevealSection } from "@/components/Reveal";
import Projects from "@/components/Projects";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData } from "@/lib/data";

export default async function ProjectsPage() {
  const projects = await getData("project");

  return (
    <PageShell>
      <PageHeader
        eyebrow="Projects"
        title="Projects."
        description="Selected work."
      />

      <RevealSection>
        <Projects data={projects} />
      </RevealSection>
    </PageShell>
  );
}
