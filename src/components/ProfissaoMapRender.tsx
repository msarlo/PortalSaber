'use client'
import { Container } from './Container';
import { Profissao } from '@/lib/prontoData';

type Props = {
    profissoes: Profissao[];
}

export const ProfissaoMapRender = ({ profissoes }: Props) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {profissoes.map((profissao: Profissao) => (
                <Container
                    key={profissao.id}
                    img={profissao.imagemSrc}
                    buttonText={profissao.nome}
                    href={`/cursos/pronto/${profissao.slug}`}
                />
            ))}
        </div>
    );
}