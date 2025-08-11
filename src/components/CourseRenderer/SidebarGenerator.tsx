import { Capitulo } from "./types";

// Helpers (sugestão: extrair para util compartilhado com o ContentRenderer)
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

export type SidebarItem = {
  title: string;
  slug: string; // deve bater com os ids dos headings
  subItems: { title: string; slug: string }[];
};

// Garante slugs únicos (evita colisões de âncora na página)
const makeUniqueSlugger = () => {
  const counts = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text);
    const n = counts.get(base) ?? 0;
    counts.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
};

export function generateSidebarItems(capitulos: Capitulo[]): SidebarItem[] {
  const items: SidebarItem[] = [];
  const uniq = makeUniqueSlugger();

  for (const cap of capitulos) {
    let currentTop: SidebarItem | null = null;
    let createdTopForThisCap = false;

    for (const item of cap.conteudo || []) {
      const tipo = normalizeTipo(item.tipo);

      if (tipo === "capitulo" || tipo === "titulo") {
        if (item.texto && item.texto.trim()) {
          const top: SidebarItem = {
            title: item.texto,
            slug: uniq(item.texto),
            subItems: [],
          };
          items.push(top);
          currentTop = top;
          createdTopForThisCap = true;
        }
      } else if (tipo === "subtitulo") {
        if (item.texto && item.texto.trim()) {
          const sub = { title: item.texto, slug: uniq(item.texto) };
          if (currentTop) {
            currentTop.subItems.push(sub);
          } else {
            // Subtítulo sem capítulo anterior: cria grupo “Seção”
            const orphan: SidebarItem = {
              title: "Seção",
              slug: uniq("secao"),
              subItems: [sub],
            };
            items.push(orphan);
            currentTop = orphan;
            createdTopForThisCap = true;
          }
        }
      }
    }

    // Fallback: se o capítulo não gerou um "top" por conteúdo,
    // usa cap.titulo (quando existir)
    if (!createdTopForThisCap && cap.titulo && cap.titulo.trim()) {
      items.push({
        title: cap.titulo,
        slug: uniq(cap.titulo),
        subItems: [],
      });
    }
  }

  return items;
}