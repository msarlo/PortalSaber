import React from "react";
import Image from "next/image";
import { SideBar } from "@/components/SideBar";
import InteractionButtons from "@/components/InteractionButtons";

// Tipos
type ConteudoItem = {
  tipo: string;
  texto?: string;
  titulo?: string;
  src?: string;
  alt?: string;
  itens?: any[];
  conteudo?: ConteudoItem[];
  horario?: string;
  telefone?: string;
  email?: string;
};

type Capitulo = {
  id: string;
  titulo: string;
  conteudo: ConteudoItem[];
};

type GLPIData = {
  id: string;
  titulo: string;
  capitulos: Capitulo[];
};

// Função auxiliar para gerar itens da sidebar
function generateSidebarItems(capitulos: Capitulo[]) {
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

// Componente para renderizar diferentes tipos de conteúdo
const ContentRenderer = ({ item }: { item: ConteudoItem }) => {
  switch (item.tipo) {
    case "paragrafo":
      return <p className="text-gray-700 leading-relaxed mb-4">{item.texto}</p>;

    case "imagem":
      return (
        <div className="my-4">
          <Image
            src={item.src!}
            alt={item.alt!}
            width={1000}
            height={450}
            className="rounded-md shadow-md"
          />
        </div>
      );

    case "lista":
      return (
        <ul className="space-y-2 mb-4">
          {item.itens?.map((li, index) => (
            <li key={index}>
              <strong>{li.titulo}:</strong> {li.texto}
              {li.subitens && (
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  {li.subitens.map((sub: any, subIndex: number) => (
                    <li key={subIndex}>
                      <strong>{sub.subtitulo}:</strong> {sub.texto}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );

    case "subtopico":
      return (
        <article
          id={item.titulo?.toLowerCase().replace(/\s+/g, "-")}
          className="scroll-mt-20"
        >
          <h3 className="text-xl font-semibold mb-3 mt-6">{item.titulo}</h3>
          {item.conteudo?.map((subItem, index) => (
            <ContentRenderer key={index} item={subItem} />
          ))}
        </article>
      );

    case "contato":
      return (
        <div className="mt-4">
          <p>
            <strong>Horário:</strong> {item.horario}
          </p>
          <p>
            <strong>Telefone:</strong> {item.telefone}
          </p>
          <p>
            <strong>E-mail:</strong> {item.email}
          </p>
        </div>
      );

    default:
      return null;
  }
};

// Função para obter a URL base correta para o ambiente
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
};

export default async function DocumentacaoGLPIPage() {
  const baseUrl = getBaseUrl();
  
  const response = await fetch(`${baseUrl}/api/cursos/glpi`, {
    cache: "no-store", // Garante que os dados sejam sempre frescos
  });

  // Boa prática: verificar se a chamada de API foi bem-sucedida
  if (!response.ok) {
    // Isso vai acionar o error.tsx mais próximo na árvore de componentes
    // Vamos lançar um erro mais detalhado para depuração
    throw new Error(`Falha ao carregar os dados do curso. Status: ${response.status} ${response.statusText}`);
  }

  const glpiData: GLPIData = await response.json();

  const sidebarItems = generateSidebarItems(glpiData.capitulos);

  return (
    <div className="flex flex-1 pt-15">
      <SideBar title="Capítulos GLPI" items={sidebarItems} />

      <article className="flex-1 p-4 md:pl-80 overflow-y-auto">
        {glpiData.capitulos.map((capitulo) => (
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
          tutorialId="glpi"
          initialLikes={0}
          initialDislikes={0}
        />
      </article>
    </div>
  );
}
