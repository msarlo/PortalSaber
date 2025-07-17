// src/components/CourseRenderer/SidebarGenerator.tsx
import { Capitulo } from "./types";

export function generateSidebarItems(capitulos: Capitulo[]) {
  return capitulos.map((cap) => ({
    title: cap.titulo,
    slug: cap.id,
    subItems: cap.conteudo
      .filter((item) => item.tipo === "subtopico")
      .map((sub) => ({
        title: sub.titulo!,
        slug: sub.titulo!.toLowerCase().replace(/\s+/g, "-"),
      })),  
  }));
}