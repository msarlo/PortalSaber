"use client";
import { useState } from 'react';
import { Banner } from "@/components/Banner";
import { SearchBar } from '@/components/SearchBar';
import { CursoMapRender } from '@/components/CursoMapRender';
import { filterTutoriais } from '@/lib/prontoData';
import { usePathname } from 'next/navigation';

const logoProntoBanner = "/assets/images/LogoProntoSemBG.png";

export default function AuxTecnicoEnfermagemPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const folderName = pathname?.split('/').pop() || "";

  const filteredTutorials = filterTutoriais(folderName, searchTerm);

  return (
    <main className="min-h-screen bg-gray-100">
      <Banner
        title={logoProntoBanner}
        type="image"
        descricao="Tutoriais do Pronto para Auxiliar Técnico de Enfermagem"
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