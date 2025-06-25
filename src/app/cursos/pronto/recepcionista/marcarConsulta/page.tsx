import InteractionButtons from "@/components/InteractionButtons";
import Image from "next/image";
import React from "react";

export default function MarcarConsultaPage() {
    return (
        <main>
            <h1>Tutorial aqui</h1>
            <p>Em breve, um tutorial completo sobre como marcar uma consulta.</p>

            <InteractionButtons tutorialId="marcar_consulta" initialLikes={0} initialDislikes={0} />
        </main>
    );
}