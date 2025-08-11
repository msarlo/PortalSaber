// src/components/CourseRenderer/ContentRenderer.tsx
import React from "react";
import Image from "next/image";
import { ConteudoItem } from "./types";
import { div, h1 } from "framer-motion/client";

export const ContentRenderer = ({ item }: { item: ConteudoItem }) => {
  switch (item.tipo) {
    case "capitulo":
      return <p className="text-gray-700 leading-relaxed mb-4">{item.texto}</p>; 
    case "imagem":
      return (
        <div className="my-4">
          <Image
            src={item.src!}
            alt={item.alt!}
            width={1000}
            height={450}
            className="rounded-md shadow-md"
          />
        </div>
      );

    case "lista":
      return (
        <ul className="space-y-2 mb-4">
          {item.itens?.map((li, index) => (
            <li key={index}>
              <strong>{li.titulo}:</strong> {li.texto}
              {li.subitens && (
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  {li.subitens.map((sub: any, subIndex: number) => (
                    <li key={subIndex}>
                      <strong>{sub.subtitulo}:</strong> {sub.texto}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );

    case "subtitulo":
      return (
        <article
          id={item.titulo?.toLowerCase().replace(/\s+/g, "-")}
          className="scroll-mt-20"
        >
          <h3 className="text-xl font-semibold mb-3 mt-6">{item.titulo}</h3>
          {item.conteudo?.map((subItem, index) => (
            <ContentRenderer key={index} item={subItem} />
          ))}
        </article>
      );

    case "contato":
      return (
        <div className="mt-4">
          <p><strong>Horário:</strong> {item.horario}</p>
          <p><strong>Telefone:</strong> {item.telefone}</p>
          <p><strong>E-mail:</strong> {item.email}</p>
        </div>
      );

    default:
      return null;
  }
};