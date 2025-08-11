//Rota dinâmica que busca e retorna os dados de um curso específico baseado no slug
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

// Aceita params como objeto ou Promise (Next 14/15)
async function getSlug(context: any): Promise<string> {
  const p = context?.params;
  if (!p) throw new Error("Missing route params");
  if (typeof p?.then === "function") {
    const r = await p;
    return r?.slug as string;
  }
  return (p as { slug: string })?.slug;
}

export async function GET(request: Request, context: any) {
  try {
    const slug = await getSlug(context);
    const dataDir = path.join(process.cwd(), "src", "data", "tutorials");
    const filePath = path.join(dataDir, `${slug}.json`);

    const file = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(file);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar tutorial" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const slug = await getSlug(context);
    const body = await request.json();
    const { cardData, tutorialContent } = body || {};

    const dataDir = path.join(process.cwd(), "src", "data");
    const tutorialsDir = path.join(dataDir, "tutorials");
    await fs.mkdir(tutorialsDir, { recursive: true });

    if (tutorialContent) {
      const tutorialFilePath = path.join(tutorialsDir, `${slug}.json`);
      await fs.writeFile(
        tutorialFilePath,
        JSON.stringify(tutorialContent, null, 2),
        "utf8"
      );
    }

    if (cardData) {
      const cursosFile = path.join(dataDir, "cursos-sincronizados.json");
      let cursos: any[] = [];
      try {
        cursos = JSON.parse(await fs.readFile(cursosFile, "utf8"));
      } catch {
        cursos = [];
      }

      const idx = cursos.findIndex((c) => c.slug === slug);
      if (idx >= 0) {
        cursos[idx] = { ...cursos[idx], ...cardData, slug };
      } else {
        const maxId = cursos.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
        cursos.push({ id: maxId + 1, slug, ...cardData });
      }

      await fs.mkdir(path.dirname(cursosFile), { recursive: true });
      await fs.writeFile(cursosFile, JSON.stringify(cursos, null, 2), "utf8");
    }

    return NextResponse.json({ ok: true, slug });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao atualizar curso", message: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const slug = await getSlug(context);

    const dataDir = path.join(process.cwd(), "src", "data");
    const tutorialsDir = path.join(dataDir, "tutorials");
    const tutorialFilePath = path.join(tutorialsDir, `${slug}.json`);
    const cursosFilePath = path.join(dataDir, "cursos-sincronizados.json");

    // Remove tutorial
    try {
      await fs.unlink(tutorialFilePath);
    } catch (err: any) {
      if (err?.code !== "ENOENT") throw err;
    }

    // Remove card
    let cursos: any[] = [];
    try {
      cursos = JSON.parse(await fs.readFile(cursosFilePath, "utf8"));
    } catch {
      cursos = [];
    }
    const updated = cursos.filter((c) => c.slug !== slug);
    await fs.writeFile(cursosFilePath, JSON.stringify(updated, null, 2), "utf8");

    return NextResponse.json({ ok: true, slug });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao deletar curso", message: error?.message },
      { status: 500 }
    );
  }
}