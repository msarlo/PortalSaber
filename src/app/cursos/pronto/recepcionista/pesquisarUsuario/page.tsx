import React from "react";
import InteractionButtons from "@/components/InteractionButtons";

export default function PesquisarUsuarioPage() {
    return (
        <main>
            <img src={"/assets/img/pesquisar_usuarioPG11.png"} alt="Passo 1 Pesquisar usuario"/>
            <img src={"/assets/img/pesquisar_usuarioPG12.png"} alt="Passo 2 Pesquisar usuario"/>
            <img src={"/assets/img/pesquisar_usuarioPG13.png"} alt="Passo 3 Pesquisar usuario"/>
            <InteractionButtons tutorialId="pesquisar_usuario" initialLikes={0} initialDislikes={0} />
        </main>
    );
}