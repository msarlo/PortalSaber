'use client'
import { Tutorial } from '@/lib/prontoData';
import { Container } from './Container';

type Props = {
    tutoriais: Tutorial[];
}

export const CursoMapRender = ({ tutoriais }: Props) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {tutoriais.map((tutorial: Tutorial) => (
                <Container
                    key={tutorial.id}
                    img={tutorial.imagemSrc}
                    buttonText={tutorial.titulo}
                    href={tutorial.url || `/cursos/pronto/${tutorial.profissaoSlug}/${tutorial.slug}`}
                />
            ))}
        </div>
    );
}