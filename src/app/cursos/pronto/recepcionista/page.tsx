import { Banner } from "@/components/Banner";
import { Container } from '@/components/Container';
import { tutoriaisProntoRecepicionista,Tutorial } from '@/lib/prontoData';
const logoProntoBanner = "/assets/images/LogoProntoSemBG.png";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Banner
      title={logoProntoBanner}
      type="image"
        descricao="Tutoriais do Pronto para Recepcionistas"/>

       {/* Barra de Pequisa COMPONENTIZAR DEPOIS*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="p-3 border border-gray-300 rounded-md shadow-sm w-full max-w-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Grid de Profissões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {tutoriaisProntoRecepicionista.map((tutorial: Tutorial) => (
            <Container
              key={tutorial.id}
              img={tutorial.imagemSrc}
              buttonText={tutorial.titulo}
              href={`/cursos/pronto/${tutorial.profissaoSlug}/${tutorial.slug}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
