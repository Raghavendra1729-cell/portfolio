import { notFound } from "next/navigation";
import ProjectDetailClient from "@/components/ProjectDetail";
import PageShell from "@/components/layout/PageShell";
import { getItem, type ProjectRecord } from "@/lib/data";

async function getProject(id: string) {
  return (await getItem("project", id)) as ProjectRecord | null;
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
