"use client";
import { useState } from 'react';
import { Banner } from "@/components/Banner";
import { SearchBar } from '@/components/SearchBar';
import { CursoMapRender } from '@/components/CursoMapRender';
import { filterTutoriais } from '@/lib/prontoData';

const logoProntoBanner = "/assets/images/LogoProntoSemBG.png";

export default function CursosProntoPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTutorials = filterTutoriais('agenteComunitarioSaude', searchTerm);

  return (
    <main className="min-h-screen bg-gray-100">
      <Banner
        title={logoProntoBanner}
        type="image"
        descricao="Nossa plataforma foi criada para ajudar profissionais a navegar por processos e ações de forma simples e eficiente. Explore a partir do seu cargo e encontre o que você precisa!"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar onSearch={setSearchTerm} />
        </div>

        {/* Grid de Profissões */}
        <CursoMapRender tutoriais={filteredTutorials} />
      </div>
    </main>
  );
}