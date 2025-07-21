"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

// Tipos para o nosso conteúdo dinâmico, espelhando seu JSON
type ConteudoItem = {
  tipo: "capitulo" | "subtitulo" | "paragrafo" | "imagem";
  texto?: string; // Para título, subtítulo, parágrafo
  src?: string;   // Para imagem
  alt?: string;   // Para imagem
};

export default function CriarTutorialPage() {
  const router = useRouter();

  // Estado para os metadados do card
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  // ... outros campos do card

  // ESTADO PRINCIPAL: Um array para os blocos de conteúdo do tutorial
  const [conteudo, setConteudo] = useState<ConteudoItem[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para adicionar um novo bloco de conteúdo
  const adicionarBloco = (tipo: ConteudoItem['tipo']) => {
    const novoBloco: ConteudoItem = { tipo };
    if (tipo === 'imagem') {
      novoBloco.src = '';
      novoBloco.alt = '';
    } else {
      novoBloco.texto = '';
    }
    setConteudo([...conteudo, novoBloco]);
  };

  // Função para atualizar um bloco existente
  const atualizarBloco = (index: number, field: keyof ConteudoItem, value: string) => {
    const novosBlocos = [...conteudo];
    (novosBlocos[index] as any)[field] = value;
    setConteudo(novosBlocos);
  };

  // Função para remover um bloco
  const removerBloco = (index: number) => {
    const novosBlocos = conteudo.filter((_, i) => i !== index);
    setConteudo(novosBlocos);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const tutorialCompleto = {
      cardData: { title, slug, image, description, role },
      tutorialContent: {
        id: slug,
        titulo: title,
        capitulos: [
          {
            id: "capitulo-principal",
            titulo: "Conteúdo Principal",
            conteudo: conteudo,
          },
        ],
      },
    };

    console.log("Enviando para a API:", JSON.stringify(tutorialCompleto, null, 2));
    
    try {
      const response = await fetch('/api/cursos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutorialCompleto)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao salvar o tutorial.");
      }
      router.push('/adm/sync?action=auto&curso=' + slug);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Tutorial</h1>
      
      {/* Formulário para os metadados do Card */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold px-2">Informações do Card</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="tutorial-exemplo"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block font-medium">Função/Cargo</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="ex: Enfermeiro, Médico, etc."
              />
            </div>
            <div>
              <label className="block font-medium">Imagem do Card</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="/assets/images/exemplo.png"
              />
            </div>
          </div>
        </fieldset>

        {/* Editor de Conteúdo Dinâmico */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold px-2">Conteúdo do Tutorial</legend>
          
          {/* Renderiza os blocos de conteúdo existentes */}
          <div className="space-y-6">
            {conteudo.map((bloco, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                <button type="button" onClick={() => removerBloco(index)} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
                
                {bloco.tipo === 'capitulo' && (
                  <div>
                    <label className="block font-medium">Título</label>
                    <input type="text" value={bloco.texto} onChange={(e) => atualizarBloco(index, 'texto', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-2xl font-bold" />
                  </div>
                )}

                {bloco.tipo === 'subtitulo' && (
                  <div>
                    <label className="block font-medium">Subtítulo</label>
                    <input type="text" value={bloco.texto} onChange={(e) => atualizarBloco(index, 'texto', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-xl font-semibold" />
                  </div>
                )}

                {bloco.tipo === 'paragrafo' && (
                  <div>
                    <label className="block font-medium">Parágrafo</label>
                    <textarea value={bloco.texto} onChange={(e) => atualizarBloco(index, 'texto', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={4} />
                  </div>
                )}

                {bloco.tipo === 'imagem' && (
                  <ImageUpload
                    value={bloco.src}
                    onChange={(url) => atualizarBloco(index, 'src', url)}
                    altValue={bloco.alt}
                    onAltChange={(alt) => atualizarBloco(index, 'alt', alt)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Controles para adicionar novos blocos */}
          <div className="mt-6 border-t pt-4">
            <span className="font-medium mr-4">Adicionar novo bloco:</span>
            <button type="button" onClick={() => adicionarBloco('capitulo')} className="px-3 py-1 border rounded-md mr-2">Título</button>
            <button type="button" onClick={() => adicionarBloco('subtitulo')} className="px-3 py-1 border rounded-md mr-2">Subtítulo</button>
            <button type="button" onClick={() => adicionarBloco('paragrafo')} className="px-3 py-1 border rounded-md mr-2">Parágrafo</button>
            <button type="button" onClick={() => adicionarBloco('imagem')} className="px-3 py-1 border rounded-md mr-2">Imagem</button>
          </div>
        </fieldset>

        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-lg font-bold">
          {isSubmitting ? "Salvando Tutorial..." : "Salvar Tutorial Completo"}
        </button>
      </form>
    </main>
  );
}