import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/components/ProjectDetail";
import PageShell from "@/components/layout/PageShell";
import { getItem, getSiteSettings, type ProjectRecord } from "@/lib/data";
import { createPageMetadata } from "@/lib/metadata";

async function getProject(id: string) {
  return (await getItem("project", id)) as ProjectRecord | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [project, siteSettings] = await Promise.all([getProject(id), getSiteSettings()]);
  const projectsPath = siteSettings.pageIntro.projects.path || "/projects";

  if (!project) {
    return createPageMetadata({
      title: "Project",
      description: "Project details page.",
      path: projectsPath,
      keywords: siteSettings.siteMetadata.keywords,
    });
  }

  return createPageMetadata({
    title: project.title,
    description: project.description || `Case study for ${project.title}.`,
    path: `${projectsPath}/${id}`,
    keywords: [...siteSettings.siteMetadata.keywords, project.title],
  });
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <PageShell>
      <ProjectDetailClient project={project} />
    </PageShell>
  );
}
