import { NextResponse } from "next/server";
import { getListarCursos, getCursoPorSlug, type Curso } from "@/lib/data";
import path from "path";
import { promises as fs } from "fs";

// Cursos em memória para simular o CRUD
let cursosMemoria: Curso[] = [];

// Inicializar com dados de cursos existentes
(async () => {
  try {
    cursosMemoria = await getListarCursos();
  } catch (error) {
    console.error("Erro ao carregar cursos iniciais:", error);
  }
})();

// Helper para garantir que o diretório de dados exista
async function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  try {
    await fs.access(dirname);
  } catch (e) {
    await fs.mkdir(dirname, { recursive: true });
  }
}

// GET - Retorna todos os cursos ou um específico por ID/role/slug
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const role = url.searchParams.get("role");
  const slug = url.searchParams.get("slug");

  // Recuperar dados atualizados
  try {
    cursosMemoria = await getListarCursos();
  } catch (error) {
    console.error("Erro ao atualizar cursos:", error);
  }

  // Filtrar por ID
  if (id) {
    const idNumber = parseInt(id);
    const curso = cursosMemoria.find((c) => c.id === idNumber);
    if (!curso) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(curso);
  }

  // Filtrar por slug
  if (slug) {
    const curso = await getCursoPorSlug(slug);
    if (!curso) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(curso);
  }

  // Filtrar por role (Saude ou SUS)
  if (role) {
    if (role !== "Saude" && role !== "SUS") {
      return NextResponse.json(
        { error: 'Role inválida. Use "Saude" ou "SUS"' },
        { status: 400 }
      );
    }
    const filtrados = cursosMemoria.filter((c) => c.role === role);
    return NextResponse.json(filtrados);
  }

  // Retorna todos os cursos
  return NextResponse.json(cursosMemoria);
}

// POST - Cria um novo curso E o seu conteúdo detalhado
export async function POST(request: Request) {
  try {
    // O body agora contém tanto os dados do card quanto o conteúdo
    const body = await request.json();
    const { cardData, tutorialContent } = body;

    // Validação
    if (!cardData || !tutorialContent || !cardData.slug) {
      return NextResponse.json(
        { message: "Dados do card e conteúdo são obrigatórios." },
        { status: 400 }
      );
    }

    // --- 1. LÓGICA PARA CRIAR O CARD ---
    const maxId = Math.max(...cursosMemoria.map((c) => c.id), 0);
    const novoCursoCard: Curso = {
      id: maxId + 1,
      title: cardData.title,
      image: cardData.image,
      slug: cardData.slug,
      description: cardData.description,
      role: cardData.role,
    };
    cursosMemoria.push(novoCursoCard);
    // Futuramente, aqui vão salvar lista no DB.

    // --- 2. NOVA LÓGICA PARA SALVAR O CONTEÚDO DETALHADO ---
    const tutorialFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "tutorials",
      `${cardData.slug}.json`
    );
    await ensureDirectoryExistence(tutorialFilePath);
    // Salva o objeto tutorialContent diretamente no arquivo JSON
    await fs.writeFile(tutorialFilePath, JSON.stringify(tutorialContent, null, 2));

    return NextResponse.json(novoCursoCard, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 } // Usar 500 para erro de servidor
    );
  }
}

// PUT - Atualiza um curso existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "ID é obrigatório para atualização" },
        { status: 400 }
      );
    }

    // Validar role se fornecida
    if (body.role && body.role !== "Saude" && body.role !== "SUS") {
      return NextResponse.json(
        { error: 'Role inválida. Use "Saude" ou "SUS"' },
        { status: 400 }
      );
    }

    const index = cursosMemoria.findIndex((c) => c.id === body.id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar apenas os campos fornecidos
    cursosMemoria[index] = {
      ...cursosMemoria[index],
      ...body,
      id: cursosMemoria[index].id, // Garantir que o ID não seja alterado
    };

    return NextResponse.json(cursosMemoria[index]);
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 400 }
    );
  }
}

// DELETE - Remove um curso
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID é obrigatório para exclusão" },
      { status: 400 }
    );
  }

  const idNumber = parseInt(id);
  const index = cursosMemoria.findIndex((c) => c.id === idNumber);

  if (index === -1) {
    return NextResponse.json(
      { error: "Curso não encontrado" },
      { status: 404 }
    );
  }

  // Remover o curso
  const removido = cursosMemoria.splice(index, 1)[0];

  return NextResponse.json({
    message: "Curso removido com sucesso",
    curso: removido,
  });
}
