//Rota genérica que busca e renderiza o conteúdo de um curso baseado no slug
import React from "react";
import { SideBar } from "@/components/SideBar";
import InteractionButtons from "@/components/InteractionButtons";
import { ContentRenderer } from "@/components/CourseRenderer/ContentRenderer";
import { generateSidebarItems } from "@/components/CourseRenderer/SidebarGenerator";
import { CourseData } from "@/components/CourseRenderer/types";

// Função para buscar dados do curso baseado no slug
async function getCourseData(slug: string): Promise<CourseData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}/api/cursos/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar o curso "${slug}". Status: ${response.status}`);
  }

  return response.json();
}


export default async function CoursePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { slug } = params;
  
  const courseData = await getCourseData(slug);
  
  const sidebarItems = generateSidebarItems(courseData.capitulos);

  return (
    <div className="flex flex-1 pt-15">
      <SideBar 
        title={`Capítulos ${courseData.titulo}`} 
        items={sidebarItems} 
      />

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

// Gera metadata dinâmica para SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const courseData = await getCourseData(params.slug);
  
  return {
    title: `${courseData.titulo} - Portal do Saber`,
    description: `Tutorial completo sobre ${courseData.titulo}`,
  };
}