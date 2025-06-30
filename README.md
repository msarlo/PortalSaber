# Portal Saber

Portal web desenvolvido para a Prefeitura de Juiz de Fora, dedicado a concentrar tutoriais e manuais de plataformas essenciais utilizadas por colaboradores do município, inicialmente voltado à área da saúde e agora expandido para outros setores administrativos.

LINK:(https://portal-saber.vercel.app/)

---

## Índice

- [O que é o Portal Saber?](#o-que-é-o-portal-saber)
- [Por que este projeto existe?](#por-que-este-projeto-existe)
- [Como funciona?](#como-funciona)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como instalar e executar](#como-instalar-e-executar)
- [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
- [Banco de Dados e Prisma](#banco-de-dados-e-prisma)
- [Padrões e Dicas](#padrões-e-dicas)
- [Créditos](#créditos)
- [Licença](#licença)

---

## O que é o Portal Saber?

O Portal Saber é uma plataforma web que centraliza tutoriais e conteúdos instrutivos dirigidos aos servidores da Prefeitura de Juiz de Fora. Seu objetivo é tornar o acesso ao conhecimento sobre sistemas institucionais mais fácil, organizado e rápido, promovendo capacitação e autonomia dos colaboradores em diferentes áreas, como saúde, administração e muito mais.

---

## Por que este projeto existe?

A Prefeitura de Juiz de Fora utiliza diversas plataformas digitais no dia a dia de seus colaboradores. A curva de aprendizado e a diversidade de sistemas podem dificultar o uso eficiente dessas ferramentas. O Portal Saber foi criado para:

- Centralizar o conhecimento sobre plataformas de uso comum.
- Reduzir dúvidas recorrentes e agilizar o onboarding de novos colaboradores.
- Diminuir demandas repetitivas ao suporte técnico.
- Fomentar a cultura de autoatendimento e capacitação contínua.

---

## Como funciona?

- Os usuários acessam tutoriais categorizados por áreas e sistemas.
- Cada tutorial pode conter textos, imagens, vídeos e links úteis.
- O conteúdo é atualizado e expandido conforme novas demandas surgem.
- O portal é responsivo e pensado para facilitar o acesso tanto em desktop quanto em dispositivos móveis.

---

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) (React Framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) (ORM)
- [Node.js](https://nodejs.org/)

---

## Como instalar e executar

1. **Clone o repositório**
   ```bash
   git clone https://github.com/msarlo/PortalSaber.git
   cd PortalSaber
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**  
   Copie o arquivo `.env.example` para `.env` e ajuste conforme sua configuração local.

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   O portal estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Workflow de Desenvolvimento

- **Branches**
  - `main` — Produção
  - `Dev` — Integração de desenvolvimento
  - `feature/JIRA-XXX-descricao` — Novas funcionalidades

- **Processo**
  1. Crie sua branch a partir de `Dev`.
  2. Commits frequentes e descritivos, sempre referenciando o JIRA.
  3. Pull Requests sempre para `Dev`.
  4. Revisão obrigatória antes do merge.
  5. Nunca faça push direto para `main` ou `Dev`.

Veja detalhes do workflow no [Guia de Desenvolvimento](#workflow-de-desenvolvimento).

---

## Banco de Dados e Prisma

Para rodar o banco de dados localmente usando Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

---

## Padrões e Dicas

- **Branches**: `feature/JIRA-XXX-breve-descricao`
- **Commits**: `[JIRA-XXX] Descrição clara da alteração`
- **Pull Requests**: `[JIRA-XXX] Descrição da funcionalidade`
- Mantenha os commits focados e claros
- Resolva conflitos em sua branch de feature

---

## Créditos

Projeto desenvolvido pelo DPETS(Departamento de planejamento e tecnologia da saúde) da Prefeitura de Juiz de Fora.  
Principais colaboradores:
- [@msarlo](https://github.com/msarlo)
- [@Theml](https://github.com/Theml)
- [@DiogoAAbreu](https://github.com/DiogoAAbreu)

---

## Licença

Copyright © Prefeitura de Juiz de Fora.
Todos os direitos reservados.
