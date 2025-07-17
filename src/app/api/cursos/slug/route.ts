// src/app/api/cursos/[slug]/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Busca o arquivo JSON do tutorial baseado no slug
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "tutorials",
      `${slug}.json`
    );
    
    const fileContent = await fs.readFile(filePath, "utf8");
    const tutorialData = JSON.parse(fileContent);
    
    return NextResponse.json(tutorialData);
  } catch (error) {
    console.error(`Erro ao buscar curso "${params.slug}":`, error);
    return NextResponse.json(
      { error: "Curso não encontrado" },
      { status: 404 }
    );
  }
}