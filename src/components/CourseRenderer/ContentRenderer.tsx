// src/components/CourseRenderer/ContentRenderer.tsx
import React from "react";
import { ConteudoItem } from "./types";

// Helpers locais (sugestão: extrair para um util compartilhado)
const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const normalizeTipo = (s?: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

type Props = { item: ConteudoItem };

export const ContentRenderer: React.FC<Props> = ({ item }) => {
  const tipo = normalizeTipo(item.tipo);

  switch (tipo) {
    // Trata tanto "capítulo"/"capitulo" quanto "título"/"titulo" como heading principal
    case "capitulo":
    case "titulo": {
      const id = item.texto ? slugify(item.texto) : undefined;
      return (
        <h2 id={id} className="text-2xl font-extrabold mt-8 mb-4">
          {item.texto || ""}
        </h2>
      );
    }

    case "subtitulo": {
      const id = item.texto ? slugify(item.texto) : undefined;
      return (
        <h3 id={id} className="text-xl font-semibold mt-6 mb-3">
          {item.texto || ""}
        </h3>
      );
    }

    case "paragrafo":
      return <p className="mb-4 leading-relaxed">{item.texto || ""}</p>;

    case "imagem":
      return item.src ? (
        <div className="my-6 flex justify-center">
          <img
            src={item.src}
            alt={item.alt || ""}
            loading="lazy"
            decoding="async"
            className="max-w-full rounded shadow-md"
          />
        </div>
      ) : null;

    default:
      return null;
  }
};