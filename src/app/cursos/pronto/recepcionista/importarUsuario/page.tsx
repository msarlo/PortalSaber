import InteractionButtons from "@/components/InteractionButtons";
import React from "react";

export default function ImportarUsuarioPage() {
    return (
        <main >
            <img src="/assets/img/importar_usuarioPG15.png" alt="Primeiro Passo importando usuario" />
            <img src="/assets/img/importar_usuarioPG16.png" alt="Primeiro Passo importando usuario" />
            <img src="/assets/img/importar_usuarioPG17.png" alt="Primeiro Passo importando usuario" />
            <img src="/assets/img/importar_usuarioPG18.png" alt="Primeiro Passo importando usuario" />
            <InteractionButtons tutorialId="importar_usuario" initialLikes={0} initialDislikes={0} />
        </main>
    );
}