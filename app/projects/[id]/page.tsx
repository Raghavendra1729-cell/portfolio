import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectDetailClient from "@/components/ProjectDetail";

export async function generateStaticParams() {
  await dbConnect();
  const projects = await Project.find({}).select("_id");
  return projects.map((p) => ({ id: p._id.toString() }));
}

async function getProject(id: string) {
  await dbConnect();
  try {
    const project = await Project.findById(id).lean();
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
  } catch {
    return null;
  }
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}