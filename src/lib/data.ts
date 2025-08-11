import { promises as fs } from "fs";
import path from "path";

export interface Curso {
  id: number;
  title: string;
  image: string;
  slug: string;
  description: string;
  role: string;
}

// Dados estáticos de fallback (para casos extremos)
export const cursosDefault: Curso[] = [
  {
    id: 1,
    title: "Sistema PRONTO",
    image: "/assets/images/LogoProntoSemBG.png",
    slug: "pronto",
    description:
      "Aprenda os fundamentos do sistema e suas principais funcionalidades.",
    role: "Saude",
  },
  {
    id: 2,
    title: "GLPI",
    image: "/assets/images/glpi_logo2.png",
    slug: "glpi",
    description: "Domine as ferramentas essenciais para gestão de chamados.",
    role: "SUS",
  },
  {
    id: 3,
    title: "1DOC",
    image: "/assets/images/umdoc.webp",
    slug: "umdoc",
    description: "Gerencie documentos e processos com este sistema completo.",
    role: "SUS",
  },
];

export async function getListarCursos(): Promise<Curso[]> {
  try {
    // Tentar ler do arquivo sincronizado primeiro
    const cursosPath = path.join(
      process.cwd(),
      "src",
      "data",
      "cursos-sincronizados.json"
    );

    try {
      const fileContent = await fs.readFile(cursosPath, "utf8");
      const cursosSincronizados = JSON.parse(fileContent);
      console.log("📚 Cursos carregados do arquivo sincronizado");
      return cursosSincronizados;
    } catch (fileError) {
      console.log("⚠️ Arquivo sincronizado não encontrado, usando dados padrão");

      // Fallback para dados estáticos se o arquivo não existir
      return cursosDefault;
    }
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    return [];
  }
}

export async function getCursoPorSlug(
  slug: string
): Promise<Curso | undefined> {
  const cursos = await getListarCursos();
  return cursos.find((curso) => curso.slug === slug);
}
