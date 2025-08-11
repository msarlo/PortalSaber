import { NextResponse } from "next/server";
import { type Curso, cursosDefault } from "@/lib/data";
import path from "path";
import { promises as fs } from "fs";
import { tutorialCompletoSchema } from "@/schemas/tutorialSchemas";

// Função para ler cursos do arquivo (apenas servidor)
async function getListarCursosServer(): Promise<Curso[]> {
  try {
    const cursosPath = path.join(process.cwd(), "src", "data", "cursos-sincronizados.json");
    const fileContent = await fs.readFile(cursosPath, "utf8");
    const cursos = JSON.parse(fileContent);
    console.log("📚 Cursos carregados do arquivo sincronizado");
    return cursos;
  } catch (error) {
    console.log("⚠️ Arquivo sincronizado não encontrado, usando dados padrão");
    return cursosDefault;
  }
}

// Cursos em memória
let cursosMemoria: Curso[] = [];

// Inicializar com dados sincronizados
(async () => {
  try {
    cursosMemoria = await getListarCursosServer();
    console.log("📚 Cursos carregados:", cursosMemoria.length);
  } catch (error) {
    console.error("Erro ao carregar cursos iniciais:", error);
    cursosMemoria = cursosDefault;
  }
})();

// Helper para garantir diretórios
async function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  try {
    await fs.access(dirname);
  } catch (e) {
    await fs.mkdir(dirname, { recursive: true });
  }
}

// GET - Buscar por slug ou listar todos
export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  // Atualizar dados do arquivo
  try {
    cursosMemoria = await getListarCursosServer();
  } catch (error) {
    console.error("Erro ao atualizar cursos:", error);
  }

  // Buscar por slug específico
  if (slug) {
    const course = cursosMemoria.find((c) => c.slug === slug);
    if (course) {
      return NextResponse.json(course);
    } else {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
    }
  }

  // Retornar todos os cursos
  return NextResponse.json(cursosMemoria);
}

// POST - Criar novo curso completo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = tutorialCompletoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { cardData, tutorialContent } = validation.data;

    // 1. Criar card do curso
    const maxId = Math.max(...cursosMemoria.map((c) => c.id), 0);
    const novoCurso: Curso = {
      id: maxId + 1,
      title: cardData.title,
      image: cardData.image,
      slug: cardData.slug,
      description: cardData.description,
      role: cardData.role,
    };
    cursosMemoria.push(novoCurso);

    // 2. Salvar conteúdo detalhado
    const tutorialFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "tutorials",
      `${cardData.slug}.json`
    );
    await ensureDirectoryExistence(tutorialFilePath);
    await fs.writeFile(tutorialFilePath, JSON.stringify(tutorialContent, null, 2));

    // 3. Sincronizar automaticamente
    await sincronizarCursos();

    console.log("✅ Curso criado:", novoCurso.title);
    return NextResponse.json(novoCurso, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar curso por slug
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const body = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Slug é obrigatório para atualização" },
        { status: 400 }
      );
    }

    const index = cursosMemoria.findIndex((c) => c.slug === slug);
    if (index === -1) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar dados do card
    if (body.cardData) {
      cursosMemoria[index] = {
        ...cursosMemoria[index],
        title: body.cardData.title,
        description: body.cardData.description,
        image: body.cardData.image,
        role: body.cardData.role,
      };
    }

    // Atualizar conteúdo se fornecido
    if (body.tutorialContent) {
      const tutorialFilePath = path.join(
        process.cwd(),
        "src",
        "data",
        "tutorials",
        `${slug}.json`
      );
      await fs.writeFile(tutorialFilePath, JSON.stringify(body.tutorialContent, null, 2));
    }

    // Sincronizar
    await sincronizarCursos();

    return NextResponse.json(cursosMemoria[index]);
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Função auxiliar para sincronização
async function sincronizarCursos() {
  try {
    const syncFilePath = path.join(process.cwd(), "src", "data", "cursos-sincronizados.json");
    await ensureDirectoryExistence(syncFilePath);
    await fs.writeFile(syncFilePath, JSON.stringify(cursosMemoria, null, 2));
    console.log("🔄 Cursos sincronizados automaticamente");
  } catch (error) {
    console.error("❌ Erro na sincronização:", error);
  }
}
