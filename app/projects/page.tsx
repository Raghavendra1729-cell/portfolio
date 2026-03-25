import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import Projects from "@/components/Projects";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";


export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected projects with context, stack choices, and outcomes.",
  path: "/projects",
});

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