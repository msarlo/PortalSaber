"use client";
import Image, { StaticImageData } from 'next/image';
import { LinkButton } from '@/components/LinkButton';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
    img: string | StaticImageData;
    buttonText: string;
    href: string;
    courseId?: string; // ID do curso para edição
}

export const Container = ({ img, buttonText, href, courseId }: Props) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // Verificar se é admin
    const isAdmin = isAuthenticated && user?.role === 'ADMIN';

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (courseId) { 
            router.push(`/adm/addTutorial?edit=${courseId}`);
        }
    };

    const handleCardClick = () => {
        router.push(href);
    };
    
    return (
        <div 
            onClick={handleCardClick}
            className="relative bg-gradient-to-br from-blue-400 w-64 h-64 rounded-lg shadow-md p-4 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
            {/* Botão de edição para admin */}
            {isAdmin && courseId && (
                <button
                    onClick={handleEdit}
                    className="absolute top-2 right-2 p-2 bg-white text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 z-10 shadow-md"
                    title="Editar curso"
                >
                    <Pencil size={16} />
                </button>
            )}
            
            <Image 
                src={img}
                alt="Container image"
                width={100}
                height={100}
            />
            <LinkButton 
                href={href}
                label={buttonText}
            />
        </div>
    );
};
