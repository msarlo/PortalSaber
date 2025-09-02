"use client";

import React, { useState, useEffect, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { useAuth } from "@/contexts/AuthContext";

type ConteudoItem = {
  tipo: "capitulo" | "subtitulo" | "paragrafo" | "imagem";
  texto?: string;
  src?: string;
  alt?: string;
};

// Converte JSON do tutorial em blocos do editor
const convertTutorialToBlocks = (tutorialData: any): ConteudoItem[] => {
  const blocos: ConteudoItem[] = [];
  if (!tutorialData) return blocos;

  if (Array.isArray(tutorialData)) {
    tutorialData.forEach((item: any) => {
      if (
        item?.tipo &&
        ["capitulo", "subtitulo", "paragrafo", "imagem"].includes(item.tipo)
      ) {
        blocos.push({
          tipo: item.tipo,
          texto: item.texto || "",
          src: item.src || "",
          alt: item.alt || "",
        });
      }
    });
    return blocos;
  }

  if (tutorialData.capitulos && Array.isArray(tutorialData.capitulos)) {
    tutorialData.capitulos.forEach((capitulo: any) => {
      if (capitulo?.conteudo) {
        if (Array.isArray(capitulo.conteudo)) {
          capitulo.conteudo.forEach((item: any) => {
            if (
              item?.tipo &&
              ["capitulo", "subtitulo", "paragrafo", "imagem"].includes(
                item.tipo
              )
            ) {
              blocos.push({
                tipo: item.tipo,
                texto: item.texto || "",
                src: item.src || "",
                alt: item.alt || "",
              });
            }
          });
        } else if (typeof capitulo.conteudo === "string") {
          const htmlBlocks = parseHtmlToBlocks(capitulo.conteudo);
          blocos.push(...htmlBlocks);
        } else if (
          typeof capitulo.conteudo === "object" &&
          capitulo.conteudo.texto
        ) {
          blocos.push({ tipo: "paragrafo", texto: capitulo.conteudo.texto });
        }
      }
    });
  }

  if (blocos.length === 0) {
    if (tutorialData.titulo) {
      blocos.push({ tipo: "capitulo", texto: tutorialData.titulo });
    }
    if (tutorialData.descricao || tutorialData.description) {
      blocos.push({
        tipo: "paragrafo",
        texto: tutorialData.descricao || tutorialData.description,
      });
    }
  }

  return blocos;
};

// Converte HTML em blocos (fallback)
const parseHtmlToBlocks = (htmlString: string): ConteudoItem[] => {
  const blocos: ConteudoItem[] = [];
  try {
    if (typeof window !== "undefined") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;

      Array.from(tempDiv.children).forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const textContent = element.textContent?.trim() || "";

        switch (tagName) {
          case "h1":
            if (textContent)
              blocos.push({ tipo: "capitulo", texto: textContent });
            break;
          case "h2":
          case "h3":
            if (textContent)
              blocos.push({ tipo: "subtitulo", texto: textContent });
            break;
          case "p":
            if (textContent)
              blocos.push({ tipo: "paragrafo", texto: textContent });
            break;
          case "img": {
            const img = element as HTMLImageElement;
            blocos.push({
              tipo: "imagem",
              src: img.src || "",
              alt: img.alt || "",
            });
            break;
          }
          case "div": {
            const imgElements = element.querySelectorAll("img");
            if (imgElements.length > 0) {
              imgElements.forEach((img) => {
                blocos.push({
                  tipo: "imagem",
                  src: img.src || "",
                  alt: img.alt || "",
                });
              });
            } else if (textContent) {
              blocos.push({ tipo: "paragrafo", texto: textContent });
            }
            break;
          }
        }
      });
    }
  } catch {
    // silenciado
  }
  return blocos;
};

// Inner component (usa useSearchParams) — precisa estar dentro de <Suspense>
function AddTutorialInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [conteudo, setConteudo] = useState<ConteudoItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      alert("Acesso negado. Apenas administradores podem acessar esta área.");
      router.push("/");
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (editSlug && isAdmin) loadCourseData(editSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSlug, isAdmin]);

  const loadCourseData = async (courseSlug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      // 1) Card
      const cardResponse = await fetch(`/api/cursos?slug=${courseSlug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!cardResponse.ok)
        throw new Error(`Curso não encontrado (${cardResponse.status})`);
      const cardData = await cardResponse.json();

      setTitle(cardData.title || "");
      setSlug(cardData.slug || "");
      setImage(cardData.image || "");
      setDescription(cardData.description || "");
      setRole(cardData.role || "");

      // 2) Conteúdo
      const tutorialResponse = await fetch(`/api/cursos/${courseSlug}`);
      if (tutorialResponse.ok) {
        const tutorialData = await tutorialResponse.json();
        const blocos = convertTutorialToBlocks(tutorialData);
        setConteudo(blocos.length > 0 ? blocos : []);
      } else {
        setConteudo([]);
      }
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar dados do curso");
      setConteudo([]);
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarBloco = (tipo: ConteudoItem["tipo"]) => {
    const novoBloco: ConteudoItem = { tipo };
    if (tipo === "imagem") {
      novoBloco.src = "";
      novoBloco.alt = "";
    } else {
      novoBloco.texto = "";
    }
    setConteudo((prev) => [...prev, novoBloco]);
  };

  const atualizarBloco = (
    index: number,
    field: keyof ConteudoItem,
    value: string
  ) => {
    setConteudo((prev) => {
      const novos = [...prev];
      (novos[index] as any)[field] = value;
      return novos;
    });
  };

  const removerBloco = (index: number) => {
    setConteudo((prev) => prev.filter((_, i) => i !== index));
  };

  const moverBloco = (index: number, direcao: "cima" | "baixo") => {
    setConteudo((prev) => {
      const novos = [...prev];
      if (direcao === "cima" && index > 0) {
        [novos[index - 1], novos[index]] = [novos[index], novos[index - 1]];
      }
      if (direcao === "baixo" && index < novos.length - 1) {
        [novos[index], novos[index + 1]] = [novos[index + 1], novos[index]];
      }
      return novos;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    setConteudo((prev) => {
      const novos = [...prev];
      const draggedItem = novos[draggedIndex];

      // Remove o item da posição original
      novos.splice(draggedIndex, 1);

      // Insere na nova posição
      novos.splice(dropIndex, 0, draggedItem);

      return novos;
    });

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      const url = editSlug ? `/api/cursos/${editSlug}` : "/api/cursos/";
      const method = editSlug ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(tutorialCompleto),
      });

      if (!response.ok) {
        let msg = "Falha ao salvar o tutorial.";
        try {
          const errorData = await response.json();
          if (errorData?.message) msg = errorData.message;
        } catch {
          // silenciado
        }
        throw new Error(msg);
      }

      router.push("/adm/sync?action=auto&curso=" + slug);
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">
            {isLoading ? "Carregando dados do curso..." : "Carregando..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold">
          {editSlug ? "Editar Tutorial" : "Criar Novo Tutorial"}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold px-2">
            Informações do Card
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                placeholder="tutorial-exemplo"
                required
                disabled={!!editSlug}
              />
              {editSlug && (
                <p className="text-sm text-gray-500 mt-1">
                  O slug não pode ser alterado durante a edição para manter a
                  consistência das URLs
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                placeholder="ex: Enfermeiro, Médico, etc."
              />
            </div>
            <div>
              <label className="block font-medium">Imagem do Card</label>
              <ImageUpload value={image} onChange={(url) => setImage(url)} />
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold px-2">
            Conteúdo do Tutorial
          </legend>

          <div className="space-y-6">
            {conteudo.map((bloco, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-4 border rounded-lg relative cursor-move transition-all ${
                  draggedIndex === index
                    ? "opacity-50 transform scale-105 shadow-lg border-blue-400"
                    : "hover:shadow-md"
                }`}
              >
                {/* Indicador visual de que é arrastável */}
                <div className="absolute top-2 left-2 text-gray-400 text-xs flex items-center gap-1">
                  <span>⋮⋮</span>
                  <span className="text-xs">Arrastar</span>
                </div>

                <button
                  type="button"
                  onClick={() => removerBloco(index)}
                  className="absolute top-2 right-2 text-red-500 font-bold hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center z-10"
                  title="Remover bloco"
                >
                  ×
                </button>

                {/* Conteúdo do bloco com margem para não sobrepor os controles */}
                <div className="mt-8">
                  {bloco.tipo === "capitulo" && (
                    <div>
                      <label className="block font-medium">Título</label>
                      <input
                        type="text"
                        value={bloco.texto || ""}
                        onChange={(e) =>
                          atualizarBloco(index, "texto", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-2xl font-bold border p-2"
                      />
                    </div>
                  )}

                  {bloco.tipo === "subtitulo" && (
                    <div>
                      <label className="block font-medium">Subtítulo</label>
                      <input
                        type="text"
                        value={bloco.texto || ""}
                        onChange={(e) =>
                          atualizarBloco(index, "texto", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-xl font-semibold border p-2"
                      />
                    </div>
                  )}

                  {bloco.tipo === "paragrafo" && (
                    <div>
                      <label className="block font-medium">Parágrafo</label>
                      <textarea
                        value={bloco.texto || ""}
                        onChange={(e) =>
                          atualizarBloco(index, "texto", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        rows={4}
                      />
                    </div>
                  )}

                  {bloco.tipo === "imagem" && (
                    <ImageUpload
                      value={bloco.src || ""}
                      onChange={(url) => atualizarBloco(index, "src", url)}
                      altValue={bloco.alt || ""}
                      onAltChange={(alt) => atualizarBloco(index, "alt", alt)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <span className="font-medium mr-4">Adicionar novo bloco:</span>
            <button
              type="button"
              onClick={() => adicionarBloco("capitulo")}
              className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50"
            >
              Título
            </button>
            <button
              type="button"
              onClick={() => adicionarBloco("subtitulo")}
              className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50"
            >
              Subtítulo
            </button>
            <button
              type="button"
              onClick={() => adicionarBloco("paragrafo")}
              className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50"
            >
              Parágrafo
            </button>
            <button
              type="button"
              onClick={() => adicionarBloco("imagem")}
              className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50"
            >
              Imagem
            </button>
          </div>
        </fieldset>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-lg font-bold"
          >
            {isSubmitting
              ? editSlug
                ? "Atualizando Tutorial..."
                : "Salvando Tutorial..."
              : editSlug
              ? "Atualizar Tutorial"
              : "Salvar Tutorial Completo"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-lg font-bold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

// Evitar SSG e garantir compatibilidade com useSearchParams
export const dynamic = "force-dynamic";

export default function AddTutorialPage() {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <AddTutorialInner />
    </Suspense>
  );
}
