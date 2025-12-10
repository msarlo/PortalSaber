export interface Profissao {
  id: string;
  nome: string;
  slug: string; // Usado na URL, ex: "recepcionista"
  imagemSrc: string; // Caminho para a imagem/ícone da profissão na pasta public
  // outros campos se necessário
}

export interface Tutorial {
  id: string;
  titulo: string;
  slug: string; // Usado na URL, ex: "pesquisar-usuario"
  profissaoSlug: string; // Para linkar com a profissão
  imagemSrc: string;
}

export const profissoesPronto: Profissao[] = [
  {
    //check
    id: "rec",
    nome: "Recepcionista",
    slug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    //check
    id: "med",
    nome: "Médico",
    slug: "medico",
    imagemSrc: "/assets/icons/pronto/doctor.png",
  },
  {
    id: "enf",
    nome: "Enfermeiro",
    slug: "enfermeiro",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "den",
    nome: "Dentista",
    slug: "dentista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "farm",
    nome: "Farmacêutico",
    slug: "farmaceutico",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "vig",
    nome: "Vigilância Sanitária",
    slug: "vigilanciaSanitaria",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "as",
    nome: "Assistente Social",
    slug: "assistenteSocial",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "acs",
    nome: "Agente Comunitário de Saúde",
    slug: "agenteComunitarioSaude",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "auxenf",
    nome: "Aux./Técnico em Enfermagem",
    slug: "auxTecnicoEnfermagem",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
];

export const tutoriaisProntoRecepicionista: Tutorial[] = [
  {
    id: "1",
    titulo: "Cadastrar Usuário",
    slug: "cadastrarUsuario",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "2",
    titulo: "Pesquisar Usuário",
    slug: "pesquisarUsuario",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "3",
    titulo: "Importar Usuário",
    slug: "importarUsuario",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "4",
    titulo: "Atualizar Dados do Usuário",
    slug: "atualizarDados",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "5",
    titulo: "Fila de Atendimento",
    slug: "filaDeAtendimento",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "6",
    titulo: "Agendamento ",
    slug: "agendamento",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "7",
    titulo: "Marcar Consulta",
    slug: "marcarConsulta",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "8",
    titulo: "Recepção de Serviço",
    slug: "recepcaoDeServico",
    profissaoSlug: "recepcionista",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
];

export const tutoriaisProntoAcs: Tutorial[] = [
  {
    id: "9",
    titulo: "Cadastrar SUS",
    slug: "cadastrarCidadao",
    profissaoSlug: "agenteComunitarioSaude",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "10",
    titulo: "Cadastrar Domicílio",
    slug: "cadastrarDomicilio",
    profissaoSlug: "agenteComunitarioSaude",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "11",
    titulo: "Adicionar Membro da Família",
    slug: "adicionarMembro",
    profissaoSlug: "agenteComunitarioSaude",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
  {
    id: "12",
    titulo: "Enviar Dados",
    slug: "enviarDados",
    profissaoSlug: "agenteComunitarioSaude",
    imagemSrc: "/assets/icons/pronto/Recepicionista.webp",
  },
];
// Funções helper para buscar dados (simulação)
export const getProfissaoBySlug = async (
  slug: string
): Promise<Profissao | undefined> => {
  return profissoesPronto.find((p) => p.slug === slug);
};

export const getTutoriaisByProfissaoSlug = async (
  profissaoSlug: string
): Promise<Tutorial[]> => {
  return tutoriaisProntoRecepicionista.filter(
    (t) => t.profissaoSlug === profissaoSlug
  );
};

export const getTutorialBySlugs = async (
  profissaoSlug: string,
  tutorialSlug: string
): Promise<Tutorial | undefined> => {
  return tutoriaisProntoRecepicionista.find(
    (t) => t.profissaoSlug === profissaoSlug && t.slug === tutorialSlug
  );
};
