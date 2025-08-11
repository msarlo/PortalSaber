import { z } from "zod";

//item (paragrafo, imagem, etc)
const conteudoItemSchema = z.object({
    tipo: z.enum(["capitulo", "subtitulo", "paragrafo", "imagem"]),
    texto: z.string().optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
});

//capítulo
const capituloSchema = z.object({
    id: z.string(),
    titulo: z.string(),
    conteudo: z.array(conteudoItemSchema),
});

//dados do card que aparecem na home
const cardDataSchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    slug: z.string().min(1, "O slug é obrigatório"),
    image: z.string().min(1,"A URL da imagem deve ser válida"),
    description: z.string().min(1, "A descrição é obrigatória"),
    role: z.enum(["Saude", "SUS"], {
        errorMap: () => ({ message: "O acesso (role) deve ser 'Saude' ou 'SUS' "}),
    }),
});

//conteudo detalhado do tutorial
const tutorialContentSchema = z.object({
    id: z.string(),
    titulo: z.string(),
    capitulos: z.array(capituloSchema),
});


// Esquema completo que a API espera receber no corpo da requisição
export const tutorialCompletoSchema = z.object({
    cardData: cardDataSchema,
    tutorialContent: tutorialContentSchema,
});

export type TutorialCompletoData = z.infer<typeof tutorialCompletoSchema>