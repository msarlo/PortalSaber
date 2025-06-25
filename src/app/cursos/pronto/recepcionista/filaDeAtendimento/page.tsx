import InteractionButtons from "@/components/InteractionButtons";
import React from "react";

export default function FilaDeAtendimentoPage() {
    return (
        <main>
            <img src="/assets/img/filaAtendimento36.png" alt="Primeiro Passo Fila de Atendimento" />
            <img src="/assets/img/filaAtendimento37.png" alt="Segundo Passo Fila de Atendimento" />
            <InteractionButtons tutorialId="fila_atendimento" initialLikes={0} initialDislikes={0} />
        </main>
    );
}