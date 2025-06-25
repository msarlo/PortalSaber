import InteractionButtons from "@/components/InteractionButtons";
import Image from "next/image";
import React from "react";

export default function RecepcaoDeServicoPage() {
    return (
        <main>
            <h1>Tutorial aqui</h1>
            <p>Esta página está em construção. Em breve, você aprenderá a fazer recepção de serviço.</p>
            
            <InteractionButtons tutorialId="recepcao_de_servico" initialLikes={0} initialDislikes={0} />
        </main>
    );
}