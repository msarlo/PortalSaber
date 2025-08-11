"use client";
import React, { useEffect, useState } from "react";
import { Banner } from "@/components/Banner";
import { LinkButton } from "@/components/LinkButton";
import { type Curso } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function HomePage() {
  const [mainCourses, setMainCourses] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Verificar se o usuário é admin
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  useEffect(() => {
    async function loadMainCourses() {
      try {
        const res = await fetch("/api/cursos", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao buscar cursos");
        const cursos: Curso[] = await res.json();
        setMainCourses(cursos); 
      } catch (err) {
        console.error("Erro ao carregar cursos:", err);
        setMainCourses([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadMainCourses();
  }, []);

  const handleCourseClick = (courseSlug: string) => {
    window.location.href = `/cursos/${courseSlug}`;
  };

  const handleEditCourse = (e: React.MouseEvent, courseSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔧 Editando curso:', courseSlug);
    router.push(`/adm/addTutorial?edit=${courseSlug}`);
  };

  const handleDeleteCourse = async (e: React.MouseEvent, courseSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      const res = await fetch(`/api/cursos/${courseSlug}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Falha ao excluir curso');
      }
      setMainCourses(prev => prev.filter(c => c.slug !== courseSlug));
    } catch (err) {
      console.error('Erro ao excluir curso:', err);
      alert('Não foi possível excluir o curso.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Banner
        title="Bem-vindo ao Portal Saber!"
        descricao="Nossa plataforma foi criada para ajudar profissionais a navegar por processos e ações
            de forma simples e eficiente. Explore nossos tutoriais e encontre o que você precisa!"
      />

      <section className="container mx-auto py-12 px-4">
        <div className="grid gap-8">
          <div className="p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800">
                Principais Cursos
              </h2>
              <LinkButton href="/cursos" label="Todos os Cursos" />
            </div>

            {/* Loading state */}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Carregando cursos...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mainCourses.map((course) => (
                  <div
                    key={course.id}
                    className="relative p-4 bg-white rounded-lg shadow-md transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-blue-600/80 hover:-translate-y-1 hover:scale-105"
                    onClick={() => handleCourseClick(course.slug)}
                  >
                    {/* Botões de ação para admin */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={(e) => handleEditCourse(e, course.slug)}
                          className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700 z-10"
                          title="Editar curso"
                          aria-label="Editar curso"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={(e) => handleDeleteCourse(e, course.slug)}
                          className="absolute top-12 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 z-10"
                          title="Excluir curso"
                          aria-label="Excluir curso"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}

                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {course.title}
                    </h3>
                    {course.image && (
                      <div className="flex justify-center items-center h-48 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-contain rounded transition-transform duration-300 ease-in-out"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && mainCourses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Nenhum curso disponível no momento.
                </p>
                <LinkButton href="/cursos" label="Explorar Todos os Cursos" />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
