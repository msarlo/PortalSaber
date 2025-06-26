"use client";
import React from "react";
import InteractionButtons from "@/components/InteractionButtons";

export default function CadastrarUsuarioPage() {
  return (
    <main>
      <img src="/assets/img/CadastrUsuario21.png" alt="Primeiro Passo" />
      <img src="/assets/img/CadastrUsuario22.png" alt="Segundo Passo" />
      <img src="/assets/img/CadastrUsuario23.png" alt="Terceiro Passo" />
      <InteractionButtons tutorialId="cadastrarUsuario" initialLikes={0} initialDislikes={0} />
    </main>
  );
}
