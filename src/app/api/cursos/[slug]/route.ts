//Rota dinâmica que busca e retorna os dados de um curso específico baseado no slug
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    console.log('🔍 API: Buscando tutorial para slug:', slug);
    
    // Busca o arquivo JSON do tutorial baseado no slug
    const dataDirectory = path.join(process.cwd(), "src", "data", "tutorials");
    const filePath = path.join(dataDirectory, `${slug}.json`);
    
    console.log('📁 API: Caminho do diretório:', dataDirectory);
    console.log('📁 API: Caminho do arquivo:', filePath);
    
    // Verificar se o diretório existe
    try {
      await fs.access(dataDirectory);
      console.log('✅ API: Diretório encontrado');
    } catch {
      console.log('❌ API: Diretório não encontrado, criando...');
      await fs.mkdir(dataDirectory, { recursive: true });
    }
    
    // Verificar se o arquivo existe
    try {
      await fs.access(filePath);
      console.log('✅ API: Arquivo encontrado');
    } catch {
      console.log('❌ API: Arquivo não encontrado:', filePath);
      
      // Criar um arquivo padrão se não existir
      const defaultContent = {
        id: slug,
        titulo: `Tutorial ${slug.toUpperCase()}`,
        capitulos: [
          {
            id: "capitulo-principal",
            titulo: "Conteúdo Principal",
            conteudo: [
              {
                tipo: "capitulo",
                texto: `Introdução ao ${slug.toUpperCase()}`
              },
              {
                tipo: "paragrafo",
                texto: "Este tutorial está sendo criado. Adicione o conteúdo através do editor."
              }
            ]
          }
        ]
      };
      
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2), "utf8");
      console.log('✅ API: Arquivo padrão criado');
      
      return NextResponse.json(defaultContent);
    }
    
    const fileContent = await fs.readFile(filePath, "utf8");
    console.log('📄 API: Conteúdo do arquivo lido, tamanho:', fileContent.length);
    
    const tutorialData = JSON.parse(fileContent);
    console.log('📊 API: Dados parseados:', tutorialData);
    
    return NextResponse.json(tutorialData);
  } catch (error) {
    console.error('❌ API: Erro detalhado:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: typeof error === "object" && error !== null && "message" in error ? (error as any).message : String(error),
        details: 'Verifique os logs do servidor para mais informações'
      }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { cardData, tutorialContent } = body || {};

    // 1) Garantir diretório e salvar conteúdo do tutorial
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

    // 2) Atualizar cursos-sincronizados.json com os dados do card (se enviados)
    if (cardData) {
      const cursosFile = path.join(dataDir, "cursos-sincronizados.json");

      let cursos: any[] = [];
      try {
        const content = await fs.readFile(cursosFile, "utf8");
        cursos = JSON.parse(content);
      } catch {
        cursos = [];
      }

      const idx = cursos.findIndex((c) => c.slug === slug);
      if (idx >= 0) {
        cursos[idx] = {
          ...cursos[idx],
          title: cardData.title,
          image: cardData.image,
          description: cardData.description,
          role: cardData.role,
          slug, // mantém coerência
        };
      } else {
        const maxId = cursos.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
        cursos.push({
          id: maxId + 1,
          title: cardData.title,
          image: cardData.image,
          slug,
          description: cardData.description,
          role: cardData.role,
        });
      }

      await fs.mkdir(path.dirname(cursosFile), { recursive: true });
      await fs.writeFile(cursosFile, JSON.stringify(cursos, null, 2), "utf8");
    }

    return NextResponse.json({ ok: true, slug });
  } catch (error: any) {
    console.error("❌ PUT /api/cursos/[slug] erro:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar curso", message: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const dataDir = path.join(process.cwd(), "src", "data");
    const tutorialsDir = path.join(dataDir, "tutorials");
    const tutorialFilePath = path.join(tutorialsDir, `${slug}.json`);
    const cursosFilePath = path.join(dataDir, "cursos-sincronizados.json");

    // Remover arquivo do tutorial (se existir)
    let removedTutorial = false;
    try {
      await fs.unlink(tutorialFilePath);
      removedTutorial = true;
    } catch (err: any) {
      if (err?.code !== "ENOENT") {
        throw err; // Outro erro que não seja "arquivo não existe"
      }
    }

    // Remover card do cursos-sincronizados.json
    let removedCard = false;
    let cursos: any[] = [];
    try {
      const content = await fs.readFile(cursosFilePath, "utf8");
      cursos = JSON.parse(content);
    } catch {
      cursos = [];
    }

    const beforeCount = cursos.length;
    const updatedCursos = cursos.filter((c) => c.slug !== slug);
    removedCard = updatedCursos.length < beforeCount;

    // Persistir arquivo de cursos (mesmo que não tenha removido nada, mantemos idempotente)
    await fs.mkdir(path.dirname(cursosFilePath), { recursive: true });
    await fs.writeFile(cursosFilePath, JSON.stringify(updatedCursos, null, 2), "utf8");

    if (!removedTutorial && !removedCard) {
      return NextResponse.json(
        { ok: false, message: "Curso não encontrado para exclusão", slug },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      slug,
      removedTutorial,
      removedCard,
    });
  } catch (error: any) {
    console.error("❌ DELETE /api/cursos/[slug] erro:", error);
    return NextResponse.json(
      { error: "Erro ao deletar curso", message: error?.message },
      { status: 500 }
    );
  }
}