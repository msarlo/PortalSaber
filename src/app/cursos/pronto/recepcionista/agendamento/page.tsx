import InteractionButtons from "@/components/InteractionButtons";
import React from "react";

export default function AgendamentoPage() {
    return (
        <main>
            <img src="/assets/img/Agendamento26.png" alt="Primeiro Passo Agendamento" />
            <img src="/assets/img/Agendamento27.png" alt="Segundo Passo Agendamento" />
            <img src="/assets/img/Agendamento28.png" alt="Terceiro Passo Agendamento" />
            <img src="/assets/img/Agendamento29.png" alt="Quarto Passo Agendamento" />
            <img src="/assets/img/Agendamento30.png" alt="Quinto Passo Agendamento" />
            <img src="/assets/img/Agendamento31.png" alt="Sexto Passo Agendamento" />
            <img src="/assets/img/Agendamento32.png" alt="Sétimo Passo Agendamento" />
            <img src="/assets/img/Agendamento33.png" alt="Oitavo Passo Agendamento" />
            <img src="/assets/img/Agendamento34.png" alt="Nono Passo Agendamento" />
            <InteractionButtons tutorialId="agendamento" initialLikes={0} initialDislikes={0} />
        </main>
    );
}