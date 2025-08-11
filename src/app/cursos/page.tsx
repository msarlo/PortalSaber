"use client";
import React, { useEffect, useState } from "react";

import { LinkButton } from "@/components/LinkButton";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";
import { Banner } from "@/components/Banner";
import { useRouter } from "next/navigation";

interface StoredUserData {
  id: string;
  name: string;
  email: string;
  role: "SAUDE" | "SUS" | "ADMIN";
}

type ProfileRole = "SAUDE" | "SUS";

type Curso = {
  id: number;
  title: string;
  image: string;
  slug: string;
  description?: string;
  role?: string;
};

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursosFiltrados, setCursosFiltrados] = useState<Curso[]>([]);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedRole, setSelectedRole] = useState<ProfileRole | null>(null);
  // Removido authenticatedUserRole pois o botão "Mudar Perfil" será sempre visível se selectedRole existir

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserJson = localStorage.getItem("userData");
    let userRoleFromAuth: ProfileRole | null = null;

    if (token && storedUserJson) {
      try {
        const storedUser: StoredUserData = JSON.parse(storedUserJson);
        if (storedUser.role === "SAUDE") {
          userRoleFromAuth = "SAUDE";
        } else if (storedUser.role === "SUS") {
          userRoleFromAuth = "SUS";
        }
        setSelectedRole(userRoleFromAuth);
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!isCheckingAuth) {
      async function loadCursos() {
        setIsLoadingCursos(true);
        try {
          const res = await fetch("/api/cursos", { cache: "no-store" });
          if (!res.ok) throw new Error("Erro ao buscar cursos");
          const data: Curso[] = await res.json();
          setCursos(data);
        } catch (error) {
          console.error("Erro ao carregar cursos:", error);
          setCursos([]);
        } finally {
          setIsLoadingCursos(false);
        }
      }
      loadCursos();
    }
  }, [isCheckingAuth]);

  useEffect(() => {
    if (selectedRole && cursos.length > 0) {
      const filtered = cursos.filter((curso) => {
        const cursoRoleNormalized = curso.role?.toUpperCase() as
          | ProfileRole
          | undefined;
        return cursoRoleNormalized === selectedRole;
      });
      setCursosFiltrados(filtered);
    } else if (!selectedRole) {
      setCursosFiltrados([]);
    }
  }, [selectedRole, cursos]);

  const handleSelectRole = (role: ProfileRole) => {
    setSelectedRole(role);
  };

  const handleSearch = (query: string) => {
    if (!selectedRole || cursos.length === 0) {
      if (!selectedRole) setCursosFiltrados([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = cursos.filter((curso) => {
      const cursoRoleNormalized = curso.role?.toUpperCase() as
        | ProfileRole
        | undefined;
      const roleMatch = cursoRoleNormalized === selectedRole;

      return (
        roleMatch &&
        (curso.title.toLowerCase().includes(lowerQuery) ||
          (curso.slug && curso.slug.toLowerCase().includes(lowerQuery)))
      );
    });
    setCursosFiltrados(filtered);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-8 border-t-blue-600 border-gray-300 rounded-full animate-spin"></div>
        <p className="mt-6 text-xl text-gray-700">Verificando sessão...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Banner
        title="Bem-vindo ao Portal Saber!"
        descricao="Nossa plataforma foi criada para ajudar profissionais a navegar por processos e ações de forma simples e eficiente. Explore nossos tutoriais e encontre o que você precisa!"
      />

      {!selectedRole && !isLoadingCursos && (
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
            Selecione seu perfil para ver os cursos
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-10">
            <div
              onClick={() => handleSelectRole("SAUDE")}
              className="bg-white border-2 border-blue-600 hover:bg-blue-50 rounded-xl shadow-lg p-8 text-center cursor-pointer transform transition-transform hover:scale-105 flex-1 max-w-md mx-auto"
            >
              <div className="text-blue-600 text-5xl mb-4">
                <span>⚕️</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Sou Profissional da Saúde
              </h3>
              <p className="text-gray-600">
                Acesse conteúdos específicos para profissionais da área da saúde
              </p>
            </div>

            <div
              onClick={() => handleSelectRole("SUS")}
              className="bg-white border-2 border-green-600 hover:bg-green-50 rounded-xl shadow-lg p-8 text-center cursor-pointer transform transition-transform hover:scale-105 flex-1 max-w-md mx-auto"
            >
              <div className="text-green-600 text-5xl mb-4">
                <span>👤</span>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Sou Usuário SUS
              </h3>
              <p className="text-gray-600">
                Acesse conteúdos para o público geral
              </p>
            </div>
          </div>
        </section>
      )}

      {selectedRole && (
        <>
          <div className="container mx-auto px-4 mt-8 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <SearchBar
                placeholder={`Pesquisar cursos para ${
                  selectedRole === "SAUDE"
                    ? "Profissionais da Saúde"
                    : "Usuários Comuns"
                }...`}
                onSearch={handleSearch}
              />
              {/* Botão "Mudar perfil" sempre visível quando um perfil está selecionado */}
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setCursosFiltrados([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm whitespace-nowrap"
              >
                Mudar perfil
              </button>
            </div>
          </div>

          <section className="container mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">
              {isLoadingCursos
                ? `Carregando cursos para ${
                    selectedRole === "SAUDE"
                      ? "Profissionais da Saúde"
                      : "Usuários Comuns"
                  }...`
                : cursosFiltrados.length === 0
                ? "Nenhum curso encontrado para este perfil."
                : `Cursos para ${
                    selectedRole === "SAUDE"
                      ? "Profissionais da Saúde"
                      : "Usuários Comuns"
                  }`}
            </h2>

            {isLoadingCursos ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Carregando cursos...</p>
              </div>
            ) : cursosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cursosFiltrados.map((curso) => (
                  <Container
                    key={curso.id}
                    img={curso.image}
                    buttonText={curso.title}
                    href={`/cursos/${curso.slug}`}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}
