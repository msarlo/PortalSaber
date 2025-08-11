// src/components/CourseRenderer/types.ts
export type ConteudoItem = {
  tipo: string;
  texto?: string;
  titulo?: string;
  src?: string;
  alt?: string;
  itens?: any[];
  conteudo?: ConteudoItem[];
  horario?: string;
  telefone?: string;
  email?: string;
};

export type Capitulo = {
  id: string;
  titulo: string;
  conteudo: ConteudoItem[];
};

export type CourseData = {
  id: string;
  titulo: string;
  capitulos: Capitulo[];
};