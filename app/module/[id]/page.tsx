import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePage } from "@/components/module/ModulePage";
import { modulesById, moduleIds } from "@/data/modules";

type ModuleRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  return moduleIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: ModuleRouteProps): Promise<Metadata> {
  const { id } = await params;
  const module = modulesById[id];
  if (!module) {
    return {};
  }

  return {
    title: `Module ${module.id} | Deep Learning`,
    description: module.description,
  };
}

export default async function ModuleRoutePage({ params }: ModuleRouteProps) {
  const { id } = await params;
  const module = modulesById[id];

  if (!module) {
    notFound();
  }

  return <ModulePage module={module} />;
}
