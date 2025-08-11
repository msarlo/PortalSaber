"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { useAuth } from "@/contexts/AuthContext";

// Seus tipos existentes
type ConteudoItem = {
  tipo: "capitulo" | "subtitulo" | "paragrafo" | "imagem";
  texto?: string;
  src?: string;
  alt?: string;
};

// Função principal para converter JSON do tutorial em blocos do editor
const convertTutorialToBlocks = (tutorialData: any): ConteudoItem[] => {
  const blocos: ConteudoItem[] = [];
  
  console.log('🔄 Convertendo tutorial para blocos:', tutorialData);
  
  if (!tutorialData) {
    console.log('❌ Nenhum dado de tutorial encontrado');
    return blocos;
  }

  // Verificar se já está no formato de blocos (array de objetos com tipo)
  if (Array.isArray(tutorialData)) {
    console.log('📦 Dados já estão em formato de blocos');
    tutorialData.forEach((item: any) => {
      if (item.tipo && ['capitulo', 'subtitulo', 'paragrafo', 'imagem'].includes(item.tipo)) {
        blocos.push({
          tipo: item.tipo,
          texto: item.texto || '',
          src: item.src || '',
          alt: item.alt || ''
        });
      }
    });
    return blocos;
  }

  // Verificar se tem estrutura de capítulos
  if (tutorialData.capitulos && Array.isArray(tutorialData.capitulos)) {
    console.log('📚 Processando capítulos...');
    
    tutorialData.capitulos.forEach((capitulo: any, capIndex: number) => {
      console.log(`📖 Processando capítulo ${capIndex}:`, capitulo);
      
      if (capitulo.conteudo) {
        // Se o conteúdo já é um array de blocos
        if (Array.isArray(capitulo.conteudo)) {
          console.log('📋 Conteúdo é array de blocos');
          capitulo.conteudo.forEach((item: any) => {
            if (item.tipo && ['capitulo', 'subtitulo', 'paragrafo', 'imagem'].includes(item.tipo)) {
              blocos.push({
                tipo: item.tipo,
                texto: item.texto || '',
                src: item.src || '',
                alt: item.alt || ''
              });
            }
          });
        } 
        // Se o conteúdo é uma string HTML
        else if (typeof capitulo.conteudo === 'string') {
          console.log('🏷️ Conteúdo é HTML string');
          const htmlBlocks = parseHtmlToBlocks(capitulo.conteudo);
          blocos.push(...htmlBlocks);
        }
        // Se o conteúdo é um objeto
        else if (typeof capitulo.conteudo === 'object') {
          console.log('🔧 Conteúdo é objeto, tentando processar...');
          // Tentar extrair propriedades conhecidas
          if (capitulo.conteudo.texto) {
            blocos.push({
              tipo: 'paragrafo',
              texto: capitulo.conteudo.texto
            });
          }
        }
      }
    });
  }
  
  // Se não encontrou nada nos capítulos, tentar processar o próprio objeto
  if (blocos.length === 0) {
    console.log('🔍 Tentando processar objeto principal...');
    
    // Se tem propriedades diretas
    if (tutorialData.titulo) {
      blocos.push({
        tipo: 'capitulo',
        texto: tutorialData.titulo
      });
    }
    
    if (tutorialData.descricao || tutorialData.description) {
      blocos.push({
        tipo: 'paragrafo',
        texto: tutorialData.descricao || tutorialData.description
      });
    }
  }

  console.log('✅ Blocos convertidos:', blocos);
  return blocos;
};

// Função para converter HTML em blocos (caso o conteúdo seja salvo como HTML)
const parseHtmlToBlocks = (htmlString: string): ConteudoItem[] => {
  const blocos: ConteudoItem[] = [];
  
  try {
    // Criar um elemento temporário para parsing (apenas no cliente)
    if (typeof window !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      
      // Iterar pelos elementos filhos
      Array.from(tempDiv.children).forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const textContent = element.textContent?.trim() || '';
        
        switch (tagName) {
          case 'h1':
            if (textContent) {
              blocos.push({
                tipo: 'capitulo',
                texto: textContent
              });
            }
            break;
            
          case 'h2':
          case 'h3':
            if (textContent) {
              blocos.push({
                tipo: 'subtitulo',
                texto: textContent
              });
            }
            break;
            
          case 'p':
            if (textContent) {
              blocos.push({
                tipo: 'paragrafo',
                texto: textContent
              });
            }
            break;
            
          case 'img':
            const img = element as HTMLImageElement;
            blocos.push({
              tipo: 'imagem',
              src: img.src || '',
              alt: img.alt || ''
            });
            break;
            
          case 'div':
            // Se é uma div com imagem
            const imgElements = element.querySelectorAll('img');
            if (imgElements.length > 0) {
              imgElements.forEach(img => {
                blocos.push({
                  tipo: 'imagem',
                  src: img.src || '',
                  alt: img.alt || ''
                });
              });
            } else if (textContent) {
              blocos.push({
                tipo: 'paragrafo',
                texto: textContent
              });
            }
            break;
        }
      });
    }
  } catch (error) {
    console.error('Erro ao fazer parse do HTML:', error);
  }
  
  return blocos;
};

// ========== FIM DAS FUNÇÕES A INSERIR ==========

export default function CriarTutorialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('edit'); // Agora usa SLUG em vez de ID
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Verificar se é admin
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  // Estados existentes
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [conteudo, setConteudo] = useState<ConteudoItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      alert('Acesso negado. Apenas administradores podem acessar esta área.');
      router.push('/');
    }
  }, [isAdmin, authLoading, router]);

  // Carregar dados do curso para edição usando SLUG
  useEffect(() => {
    if (editSlug && isAdmin) {
      loadCourseData(editSlug);
    }
  }, [editSlug, isAdmin]);

  const loadCourseData = async (courseSlug: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      console.log('🔍 Carregando dados do curso:', courseSlug);
      
      // 1. BUSCAR DADOS DO CARD usando sua API existente
      const cardResponse = await fetch(`/api/cursos?slug=${courseSlug}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!cardResponse.ok) {
        throw new Error(`Curso não encontrado (${cardResponse.status})`);
      }
      
      const cardData = await cardResponse.json();
      console.log('📋 Dados do card carregados:', cardData);
      
      // Preencher os campos básicos do formulário
      setTitle(cardData.title || '');
      setSlug(cardData.slug || '');
      setImage(cardData.image || '');
      setDescription(cardData.description || '');
      setRole(cardData.role || '');

      // 2. BUSCAR CONTEÚDO DETALHADO usando sua API dinâmica
      console.log('📖 Buscando conteúdo detalhado do tutorial...');
      
      try {
        const tutorialResponse = await fetch(`/api/cursos/${courseSlug}`);
        
        if (tutorialResponse.ok) {
          const tutorialData = await tutorialResponse.json();
          console.log('📚 Conteúdo detalhado encontrado:', tutorialData);
          
          // CONVERTER PARA BLOCOS DO EDITOR
          const blocosConvertidos = convertTutorialToBlocks(tutorialData);
          
          if (blocosConvertidos.length > 0) {
            console.log('✅ Blocos convertidos com sucesso:', blocosConvertidos);
            setConteudo(blocosConvertidos);
          } else {
            console.log('⚠️ Iniciando com conteúdo vazio');
            setConteudo([]);
          }
        } else {
          console.log('ℹ️ Arquivo de tutorial não encontrado, criando novo');
          setConteudo([]);
        }
      } catch (tutorialError) {
        console.error('❌ Erro ao buscar conteúdo detalhado:', tutorialError);
        setConteudo([]);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar curso:', error);
      setError(
        `Erro ao carregar dados do curso: ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message?: string }).message
            : String(error)
        }`
      );
      setConteudo([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Suas funções existentes para gerenciar blocos
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

  const atualizarBloco = (index: number, field: keyof ConteudoItem, value: string) => {
    const novosBlocos = [...conteudo];
    (novosBlocos[index] as any)[field] = value;
    setConteudo(novosBlocos);
  };

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

    try {
      const token = localStorage.getItem('authToken');
      const url = editSlug ? `/api/cursos/${editSlug}` : '/api/cursos/';
      const method = editSlug ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  // Loading states
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Carregando dados do curso...' : 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

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
          {editSlug ? 'Editar Tutorial' : 'Criar Novo Tutorial'}
        </h1>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

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
                disabled={!!editSlug} // Não permitir edição do slug em modo de edição
              />
              {editSlug && (
                <p className="text-sm text-gray-500 mt-1">
                  O slug não pode ser alterado durante a edição para manter a consistência das URLs
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
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                placeholder="/assets/images/exemplo.png"
              />
            </div>
          </div>
        </fieldset>

        {/* Editor de Conteúdo Dinâmico - mantém seu código existente */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold px-2">Conteúdo do Tutorial</legend>
          
          <div className="space-y-6">
            {conteudo.map((bloco, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                <button 
                  type="button" 
                  onClick={() => removerBloco(index)} 
                  className="absolute top-2 right-2 text-red-500 font-bold hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
                
                {bloco.tipo === 'capitulo' && (
                  <div>
                    <label className="block font-medium">Título</label>
                    <input 
                      type="text" 
                      value={bloco.texto || ''} 
                      onChange={(e) => atualizarBloco(index, 'texto', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-2xl font-bold border p-2" 
                    />
                  </div>
                )}

                {bloco.tipo === 'subtitulo' && (
                  <div>
                    <label className="block font-medium">Subtítulo</label>
                    <input 
                      type="text" 
                      value={bloco.texto || ''} 
                      onChange={(e) => atualizarBloco(index, 'texto', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-xl font-semibold border p-2" 
                    />
                  </div>
                )}

                {bloco.tipo === 'paragrafo' && (
                  <div>
                    <label className="block font-medium">Parágrafo</label>
                    <textarea 
                      value={bloco.texto || ''} 
                      onChange={(e) => atualizarBloco(index, 'texto', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" 
                      rows={4} 
                    />
                  </div>
                )}

                {bloco.tipo === 'imagem' && (
                  <ImageUpload
                    value={bloco.src || ''}
                    onChange={(url) => atualizarBloco(index, 'src', url)}
                    altValue={bloco.alt || ''}
                    onAltChange={(alt) => atualizarBloco(index, 'alt', alt)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <span className="font-medium mr-4">Adicionar novo bloco:</span>
            <button type="button" onClick={() => adicionarBloco('capitulo')} className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50">Título</button>
            <button type="button" onClick={() => adicionarBloco('subtitulo')} className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50">Subtítulo</button>
            <button type="button" onClick={() => adicionarBloco('paragrafo')} className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50">Parágrafo</button>
            <button type="button" onClick={() => adicionarBloco('imagem')} className="px-3 py-1 border rounded-md mr-2 hover:bg-gray-50">Imagem</button>
          </div>
        </fieldset>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-lg font-bold"
          >
            {isSubmitting ? 
              (editSlug ? "Atualizando Tutorial..." : "Salvando Tutorial...") : 
              (editSlug ? "Atualizar Tutorial" : "Salvar Tutorial Completo")
            }
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