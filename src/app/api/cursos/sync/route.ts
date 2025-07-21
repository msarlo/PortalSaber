// Endpoint que sincroniza automaticamente todos os JSONs de tutoriais com os cards
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getListarCursos } from "@/lib/data";
import type { Curso } from "@/lib/data";

// Buscar cursos em memória atual
let cursosMemoria: Curso[] = [];

export async function POST() {
  try {
    console.log("🔄 Iniciando sincronização automática de cursos...");
    
    // Carregar cursos existentes
    try {
      cursosMemoria = await getListarCursos();
      console.log(`📋 Cursos em memória: ${cursosMemoria.length}`);
    } catch (error) {
      console.log("📝 Nenhum curso em memória, começando do zero");
      cursosMemoria = [];
    }

    // Listar todos os arquivos JSON de tutorials
    const tutorialsPath = path.join(process.cwd(), "src", "data", "tutorials");
    
    try {
      await fs.access(tutorialsPath);
    } catch {
      console.log("📁 Criando diretório de tutorials...");
      await fs.mkdir(tutorialsPath, { recursive: true });
    }
    
    const files = await fs.readdir(tutorialsPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`📄 Arquivos JSON encontrados: ${jsonFiles.length}`);
    
    let novosCardsCriados = 0;
    
    // Para cada arquivo JSON, criar/atualizar card automaticamente
    for (const file of jsonFiles) {
      const slug = file.replace('.json', '');
      
      // Verificar se já existe card para este curso
      const existingCourse = cursosMemoria.find(c => c.slug === slug);
      
      if (!existingCourse) {
        console.log(`➕ Criando novo card para: ${slug}`);
        
        // Ler dados do tutorial
        const filePath = path.join(tutorialsPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        const tutorialData = JSON.parse(content);
        
        // Determinar role baseado no conteúdo ou usar padrão
        const role = determineRoleFromContent(tutorialData) || "Saude";
        
        // Criar novo card automaticamente
        const newCard: Curso = {
          id: Math.max(...cursosMemoria.map(c => c.id), 0) + 1,
          title: tutorialData.titulo,
          image: generateImagePath(slug), // Gera caminho da imagem
          slug: slug,
          description: generateDescription(tutorialData), // Gera descrição
          role: role
        };
        
        cursosMemoria.push(newCard);
        novosCardsCriados++;
        
        console.log(`✅ Card criado: ${newCard.title}`);
      } else {
        console.log(`⏭️  Card já existe para: ${slug}`);
      }
    }
    
    // Salvar cursos atualizados de volta na memória/arquivo
    await saveUpdatedCourses(cursosMemoria);
    
    console.log(`🎉 Sincronização concluída! ${novosCardsCriados} novos cards criados.`);
    
    return NextResponse.json({ 
      message: "Cursos sincronizados com sucesso",
      novosCardsCriados,
      totalCursos: cursosMemoria.length,
      cursos: cursosMemoria 
    });
    
  } catch (error) {
    console.error("💥 Erro na sincronização:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar cursos", details: error },
      { status: 500 }
    );
  }
}

// Função para determinar o role baseado no conteúdo
function determineRoleFromContent(tutorialData: any): "Saude" | "SUS" {
  const titulo = tutorialData.titulo?.toLowerCase() || "";
  const conteudo = JSON.stringify(tutorialData).toLowerCase();
  
  // Palavras-chave para SUS
  const susKeywords = ["sus", "sistema único", "saúde pública", "municipio"];
  // Palavras-chave para Saude
  const saudeKeywords = ["saude", "hospital", "clinica", "prontuario"];
  
  const susMatch = susKeywords.some(keyword => 
    titulo.includes(keyword) || conteudo.includes(keyword)
  );
  
  const saudeMatch = saudeKeywords.some(keyword => 
    titulo.includes(keyword) || conteudo.includes(keyword)
  );
  
  if (susMatch) return "SUS";
  if (saudeMatch) return "Saude";
  
  return "Saude"; // Padrão
}

// Função para gerar caminho da imagem
function generateImagePath(slug: string): string {
  // Verificar se existe imagem específica, senão usar placeholder
  const possibleImages = [
    `/assets/images/${slug}.png`,
    `/assets/images/${slug}.jpg`,
    `/assets/images/placeholder-curso.png`,
    `/assets/icons/default-course.svg`
  ];
  
  // Por enquanto retorna o primeiro, mas pode ser melhorado
  // para verificar se o arquivo existe
  return possibleImages[0];
}

// Função para gerar descrição automática
function generateDescription(tutorialData: any): string {
  const titulo = tutorialData.titulo;
  const primeiroCapitulo = tutorialData.capitulos?.[0];
  
  if (primeiroCapitulo?.conteudo?.[0]?.texto) {
    // Usar primeiras palavras do primeiro parágrafo
    const primeiroTexto = primeiroCapitulo.conteudo[0].texto;
    const descricao = primeiroTexto.substring(0, 150).trim();
    return descricao.endsWith('.') ? descricao : descricao + '...';
  }
  
  return `Tutorial completo sobre ${titulo}. Aprenda passo a passo todas as funcionalidades.`;
}

// Função para salvar cursos atualizados
async function saveUpdatedCourses(cursos: Curso[]) {
  // Aqui você pode implementar a lógica para salvar de volta
  // Por enquanto, apenas atualiza a variável em memória
  // No futuro, pode salvar em arquivo ou banco de dados
  
  // Exemplo: salvar em arquivo JSON
  const cursosPath = path.join(process.cwd(), "src", "data", "cursos-sincronizados.json");
  await fs.writeFile(cursosPath, JSON.stringify(cursos, null, 2));
  
  console.log("💾 Cursos salvos em:", cursosPath);
}

// GET para verificar status da sincronização
export async function GET() {
  try {
    const tutorialsPath = path.join(process.cwd(), "src", "data", "tutorials");
    const files = await fs.readdir(tutorialsPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    cursosMemoria = await getListarCursos();
    
    const status = {
      tutorialsEncontrados: jsonFiles.length,
      cursosEmMemoria: cursosMemoria.length,
      tutorialsSemCard: jsonFiles.filter(file => 
        !cursosMemoria.some(curso => curso.slug === file.replace('.json', ''))
      ),
      ultimaSync: new Date().toISOString()
    };
    
    return NextResponse.json(status);
    
  } catch (error) {
    return NextResponse.json({ error: "Erro ao verificar status" }, { status: 500 });
  }
}