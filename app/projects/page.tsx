import type { Metadata } from "next";
import { RevealSection } from "@/components/Reveal";
import Projects from "@/components/Projects";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata(pageMetadata.projects);

export default async function ProjectsPage() {
  const [projects, siteSettings] = await Promise.all([getData("project"), getSiteSettings()]);
  const intro = siteSettings.pageIntro.projects;
  const featuredCount = projects.filter((project) => project.featured).length;
  const liveCount = projects.filter((project) => Boolean(project.link)).length;

  return (
    <PageShell>
      <PageHeader
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
        stats={[
          { label: "Projects", value: String(projects.length) },
          { label: "Featured", value: String(featuredCount) },
          { label: "Live demos", value: String(liveCount) },
        ]}
      />

      <RevealSection>
        <Projects data={projects} />
      </RevealSection>
    </PageShell>
  );
}
