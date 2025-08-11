'client side'
import React from "react";
import path from "path";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";
import { SideBar } from "@/components/SideBar";
import InteractionButtons from "@/components/InteractionButtons";
import { ContentRenderer } from "@/components/CourseRenderer/ContentRenderer";
import { generateSidebarItems } from "@/components/CourseRenderer/SidebarGenerator";
import { CourseData } from "@/components/CourseRenderer/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Função para buscar dados do curso baseado no slug (lendo direto do FS)
async function getCourseData(slug: string): Promise<CourseData> {
  const tutorialsDir = path.join(process.cwd(), "src", "data", "tutorials");
  const filePath = path.join(tutorialsDir, `${slug}.json`);

  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as CourseData;
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      notFound();
    }
    throw new Error(`Falha ao ler o arquivo do curso "${slug}"`);
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const courseData = await getCourseData(slug);
  const sidebarItems = generateSidebarItems(courseData.capitulos);

  return (
    <div className="flex flex-1 pt-15">
      <SideBar title={`Capítulos ${courseData.titulo}`} items={sidebarItems} />

      <article className="flex-1 p-4 md:pl-80 overflow-y-auto">
        {courseData.capitulos.map((capitulo) => (
          <section
            key={capitulo.id}
            id={capitulo.id}
            className="mb-12 scroll-mt-20"
          >
            <h2 className="text-2xl font-bold mb-4">{capitulo.titulo}</h2>
            {capitulo.conteudo.map((item, index) => (
              <ContentRenderer key={index} item={item} />
            ))}
          </section>
        ))}

        <InteractionButtons
          tutorialId={slug}
          initialLikes={0}
          initialDislikes={0}
        />
      </article>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const courseData = await getCourseData(slug);

  return {
    title: `${courseData.titulo} - Portal do Saber`,
    description: `Tutorial completo sobre ${courseData.titulo}`,
  };
}