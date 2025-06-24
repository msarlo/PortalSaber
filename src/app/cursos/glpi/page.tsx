import React from "react";
import Image from "next/image"; // Importe o componente Image

import { Banner } from "@/components/Banner";
import { SideBar, type SidebarItem } from "@/components/SideBar";
import InteractionButtons from "@/components/InteractionButtons";

// Dados específicos para a documentação GLPI
const glpiSidebarData: SidebarItem[] = [
  { title: "1 - O QUE É O GLPI", slug: "o-que-e-o-glpi" },
  { title: "2 - PROCESSO DE ATENDIMENTO", slug: "processo-de-atendimento" },
  { title: "3 - OBJETIVO", slug: "objetivo" },
  {
    title: "4 - UTILIZANDO O SISTEMA GLPI",
    slug: "utilizando-o-sistema-glpi",
    subItems: [
      { title: "LOGIN", slug: "login" },
      { title: "TELA INICIAL", slug: "tela-inicial" },
    ],
  },
  {
    title: "5 - ABRINDO UM CHAMADO",
    slug: "abrindo-um-chamado",
    subItems: [
      { title: "STATUS DE UM CHAMADO", slug: "status-de-um-chamado" },
      {
        title: "ADICIONANDO ACOMPANHAMENTOS",
        slug: "adicionando-acompanhamentos",
      },
    ],
  },
  {
    title: "6 - ABERTURA DE CHAMADOS VIA E-MAIL",
    slug: "abertura-de-chamados-via-email",
  },
  { title: "7 - FORMULÁRIOS DE CADASTRO", slug: "formularios-de-cadastro" },
  { title: "8 - RESERVA DE COMPUTADOR", slug: "reserva-de-computador" },
];

export default function DocumentacaoGLPIPage() {
  const commonSectionClass = "mb-12 scroll-mt-20";
  const commonTitleClass = "text-2xl font-bold mb-4";
  const commonSubTitleClass = "text-xl font-semibold mb-3 mt-6";
  const paragraphClass = "text-gray-700 leading-relaxed mb-4";
  const listItemTitleClass = "font-semibold text-gray-800";
  const subListItemClass = "ml-4 list-disc list-inside";

  return (
    <div className="flex flex-1 pt-15">
      <SideBar title="Capítulos GLPI" items={glpiSidebarData} />

      <article className="flex-1 p-4 md:pl-80 overflow-y-auto">
        {/* Você pode adicionar um Banner aqui se desejar, ex: <Banner title="Documentação GLPI" /> */}

        <section id="o-que-e-o-glpi" className={commonSectionClass}>
          <h2 className={commonTitleClass}>1 - O QUE É O GLPI</h2>
          <p className="text-gray-700 leading-relaxed">
            O GLPI, abreviatura para Gestion Libre de Parc Informatique, “é um
            sistema desenvolvido com o intuito de fornecer uma poderosa
            ferramenta para gerenciamento de TI e parques computacionais, tendo
            como principais funcionalidades o gerenciamento de HelpDesk e
            Inventário de equipamentos de informática de forma integrada.” Com
            esse sistema, o usuário poderá abrir o próprio chamado e manter um
            acompanhamento do mesmo de forma rápida, eficiente e interativa.
          </p>
        </section>

        <section id="processo-de-atendimento" className={commonSectionClass}>
          <h2 className={commonTitleClass}>2 - PROCESSO DE ATENDIMENTO</h2>
          <p className="text-gray-700 leading-relaxed">
            O GLPI permite a interação entre o usuário e o técnico perante a
            abertura de um chamado, garantindo que eles possam estar cientes de
            todas as tarefas realizadas mantendo um acompanhamento de todo
            processo.
          </p>
        </section>

        <section id="objetivo" className={commonSectionClass}>
          <h2 className={commonTitleClass}>3 - OBJETIVO</h2>
          <p className="text-gray-700 leading-relaxed">
            O presente manual tem por objetivo orientar os usuários sobre os
            procedimentos para abertura, acompanhamento, pesquisa de satisfação
            e validação dos chamados.
          </p>
        </section>

        <section id="utilizando-o-sistema-glpi" className={commonSectionClass}>
          <h2 className={commonTitleClass}>4 - UTILIZANDO O SISTEMA GLPI</h2>

          <article id="login" className="scroll-mt-20">
            <h3 className={commonSubTitleClass}>LOGIN</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Em um navegador web, acesse suporte.pjf.mg.gov.br.
              <br />
              Login: seu e-mail da PJF.
              <br />
              Senha: a senha do e-mail da PJF.
            </p>

            <div className="my-4">
              <Image
                src="/assets/icons/glpi/Login.png"
                alt="Tela de Login do GLPI"
                width={1000}
                height={450}
                className="rounded-md shadow-md"
              />
            </div>
            <p>
              Caso o usuário não tenha o e-mail corporativo será necessário
              solicitar através do email s u por t e@ pjf. mg . gov . br e ao
              recebê-lo mudar o método de login para “Base de Dados do GLPI”.
            </p>
          </article>

          <article id="tela-inicial" className="scroll-mt-20">
            <h3 className={commonSubTitleClass}>TELA INICIAL</h3>
            <p className="text-gray-700 leading-relaxed">
              Após efetuar o Login, o usuário será redirecionado para a tela
              inicial do sistema, onde terá a sua disposição as opções de “Criar
              chamado”, “Chamados”, “Reservas”, “FAQ” e acompanhar os chamados
              que já se encontram abertos
            </p>
            <div className="my-4">
              <Image
                src="/assets/icons/glpi/AbrirChamado.png"
                alt="Tela de Login do GLPI"
                width={1000}
                height={450}
                className="rounded-md shadow-md"
              />
            </div>
          </article>
        </section>

        <section id="abrindo-um-chamado" className={commonSectionClass}>
          <h2 className={commonTitleClass}>5 - ABRINDO UM CHAMADO</h2>
          <p className={paragraphClass}>
            Ao fazer login, você será automaticamente encaminhado para a tela de
            abertura de chamados, clique em uma das opções Criar um Chamado.
          </p>
          <div className="my-4">
            <Image
              src="/assets/icons/glpi/CriarChamado.png"
              alt="Opção Criar um Chamado no GLPI"
              width={1000}
              height={450}
              className="rounded-md shadow-md"
            />
          </div>

          <div className="my-4">
            <Image
              src="/assets/icons/glpi/CriarChamado2.png"
              alt="Formulário de abertura de chamado no GLPI"
              width={1000}
              height={450}
              className="rounded-md shadow-md"
            />
          </div>

          <div className="text-gray-700 leading-relaxed space-y-3">
            <p>
              Para que o chamado seja encaminhado ao setor responsável, preencha
              todos os campos, incluindo os obrigatórios – aqueles que possuem
              um asterisco ao lado (*).
            </p>

            <div>
              <strong className={listItemTitleClass}>• Tipo:</strong> Determina
              o tipo do seu chamado, podendo ser requisição ou incidente.
              <ul className={`${subListItemClass} mt-1 space-y-1`}>
                <li>
                  <strong className="font-medium">Requisição:</strong> É toda e
                  qualquer solicitação, contato, pedido de informação ou dúvida
                  para acessar um serviço de Tecnologia da Informação. Isto é,
                  as requisições não estão relacionadas às paralisações de
                  serviços. Ex.: Alterar a senha de um usuário; Dúvidas sobre
                  utilização do sistema; Treinamentos; Trocar o cartucho de uma
                  impressora; etc.
                </li>
                <li>
                  <strong className="font-medium">Incidente:</strong>{" "}
                  Caracteriza-se por ser uma interrupção ou falha inesperada na
                  qualidade de um serviço de Tecnologia da Informação. Ou seja,
                  são problemas que causam, (ou podem causar), paralisação das
                  atividades de rotina. Ex.: O sistema não está respondendo; A
                  tela do sistema está indisponível; A internet está lenta; A
                  impressora parou de funcionar; etc.
                </li>
              </ul>
            </div>

            <p>
              <strong className={listItemTitleClass}>• Categoria:</strong> A
              categoria é de extrema importância para que seu chamado seja
              delegado corretamente para o técnico responsável. Caso não haja
              uma categoria específica para o seu problema, escolha a que mais
              se assemelhe a ele e insira na descrição do chamado quais são suas
              necessidades.
            </p>

            <p>
              <strong className={listItemTitleClass}>• Localização:</strong>{" "}
              Local onde o computador se encontra. Caso não esteja disponível
              sua localização no sistema, favor informá-la no campo descrição.
            </p>

            <p>
              <strong className={listItemTitleClass}>• Observadores:</strong>{" "}
              Caso usuário queira que mais alguém acompanhe o chamado.
            </p>

            <p>
              <strong className={listItemTitleClass}>• Descrição:</strong> Faça
              uma descrição detalhada do seu problema, com todas as informações
              necessárias para que ele possa ser compreendido e solucionado da
              melhor forma.
            </p>

            <p>
              <strong className={listItemTitleClass}>• Arquivo:</strong> Você
              poderá anexar um documento. Podendo ser algo relacionado ao
              chamado que ajude a identificar o problema. Ex: Print de tela.
            </p>

            <p className="mt-2">
              Por fim, clique no botão{" "}
              <strong className="font-medium">Enviar mensagem</strong> para
              abrir seu chamado. Ele será recebido e direcionado ao técnico que
              ficará responsável pelo mesmo.
            </p>
          </div>

          <article id="status-de-um-chamado" className="scroll-mt-20 mt-8">
            <h3 className={commonSubTitleClass}>STATUS DE UM CHAMADO</h3>
            <p className={`${paragraphClass} mt-2`}>
              No decorrer do processamento do seu chamado, ele poderá ter os
              seguintes status:
            </p>
            <div className="text-gray-700 leading-relaxed space-y-3 mt-2">
              <p>
                <strong className={listItemTitleClass}>• Novo:</strong> chamado
                aberto sem técnico ou programador atribuído.
              </p>
              <p>
                <strong className={listItemTitleClass}>
                  • Processando (atribuído):
                </strong>{" "}
                chamado atribuído ao técnico responsável.
              </p>
              <p>
                <strong className={listItemTitleClass}>
                  • Processando (Planejado):
                </strong>{" "}
                Chamado foi atribuído, porém será atendido conforme planejamento
                técnico.
              </p>
              <p>
                <strong className={listItemTitleClass}>• Pendente:</strong>{" "}
                Status que sinaliza a dependência de terceiros.
              </p>
              <p>
                <strong className={listItemTitleClass}>• Solucionado:</strong>{" "}
                Chamado solucionado, porém aguardando aprovação do usuário.
              </p>
              <p>
                <strong className={listItemTitleClass}>• Fechado:</strong>{" "}
                Chamado solucionado e aprovado pelo usuário.
              </p>
            </div>
          </article>

          <article
            id="adicionando-acompanhamentos"
            className="scroll-mt-20 mt-8"
          >
            <h3 className={commonSubTitleClass}>ADICIONANDO ACOMPANHAMENTOS</h3>
            <p className={paragraphClass}>
              Para se comunicar com o técnico responsável pelo seu chamado, você
              poderá adicionar acompanhamentos ou documentos, informando-o de
              sua necessidade e lhe fornecendo informações que considerar
              importantes para a solução do chamado.
            </p>
            <div className="my-4">
              <Image
                src="/assets/icons/glpi/AdicionandoAcompanhate.png"
                alt="Interface para adicionar acompanhamentos no GLPI"
                width={1000}
                height={500}
                className="rounded-md shadow-md"
              />
            </div>

            <div className="my-4">
              <Image
                src="/assets/icons/glpi/AdicionandoAcompanhate2.png"
                alt="Exemplo de acompanhamento adicionado no GLPI"
                width={1000}
                height={450}
                className="rounded-md shadow-md"
              />
            </div>

            <div className="mt-6 text-gray-700 leading-relaxed space-y-3">
              <p className="font-semibold text-gray-800 mb-2">
                Legenda de Cores nos Acompanhamentos:
              </p>
              <ul className={`${subListItemClass} space-y-1`}>
                <li>
                  <strong className="font-medium text-gray-600">
                    Em cinza:
                  </strong>{" "}
                  acompanhamentos inseridos pelo requerente ou pelo técnico.
                </li>
                <li>
                  <strong className="font-medium text-green-700">
                    Em verde:
                  </strong>{" "}
                  Título e descrição informados pelo requerente no momento da
                  abertura do chamado.
                </li>
                <li>
                  <strong className="font-medium text-green-700">
                    Em verde:
                  </strong>{" "}
                  Aprovação ou recusa da solução final apresentada pelo técnico.
                </li>
              </ul>
              <p className="mt-4">
                Aprovando a solução, o chamado será fechado automaticamente.
                Porém, caso o usuário não aprove ou recuse a solução, o chamado
                será fechado pelo sistema no prazo de 02 dias.
              </p>
              <p className="mt-4 font-semibold text-gray-800">
                Em caso de dúvidas sobre a utilização do sistema ou situações
                críticas, entre em contato com o suporte de informática:
              </p>
              <ul className="list-none ml-4 space-y-1">
                <li>
                  <strong>Horário:</strong> Segunda a sexta-feira das 08h00min
                  às 12h00min e 14h00min às 18h00min
                </li>
                <li>
                  <strong>Telefone:</strong> 3690-7288
                </li>
                <li>
                  <strong>E-mail:</strong>{" "}
                  <a
                    href="mailto:suporte@pjf.mg.gov.br"
                    className="text-blue-600 hover:underline"
                  >
                    suporte@pjf.mg.gov.br
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </section>

        <section
          id="abertura-de-chamados-via-email"
          className={commonSectionClass}
        >
          <h2 className={commonTitleClass}>
            6 - ABERTURA DE CHAMADOS VIA E-MAIL
          </h2>
          <p className={paragraphClass}>
            Para os usuários que não possuem e-mail corporativo (
            <code className="bg-gray-200 px-1 rounded text-sm">
              @pjf.mg.gov.br
            </code>
            ) há a possibilidade da abertura dos chamados via e-mail. Para isso,
            deve-se enviar um e-mail para
            <a
              href="mailto:chamados@pjf.mg.gov.br"
              className="text-blue-600 hover:underline"
            >
              {" "}
              chamados@pjf.mg.gov.br
            </a>{" "}
            informando:
          </p>
          <ul className={`${subListItemClass} ${paragraphClass} space-y-1`}>
            <li>
              Lotação completa (secretaria, subsecretaria, departamento,
              supervisão)
            </li>
            <li>Nome</li>
            <li>Ramal</li>
            <li>O problema que está ocorrendo</li>
            <li>
              O patrimônio do computador que está com problema (se aplicável)
            </li>
          </ul>
          <p className={paragraphClass}>
            Dessa forma será aberto um chamado no GLPI automaticamente e o
            usuário receberá todas as atualizações do chamado via e-mail.
          </p>
        </section>

        <section id="formularios-de-cadastro" className={commonSectionClass}>
          <h2 className={commonTitleClass}>7 - FORMULÁRIOS DE CADASTRO</h2>
          <p className={paragraphClass}>
            Para solicitar cadastro no SIFAN, SIAFEM, Netdein, protocolo, e-mail
            corporativo, liberação de redes sociais, videoconferência,
            compartilhamento de pastas, cadastro na rede interna e cadastro para
            acesso remoto e necessário preencher o formulário disponível na guia
            “Formulários”
          </p>

          <div className="my-4">
            <Image
              src="/assets/icons/glpi/Formularios.png"
              alt="Exemplo de acompanhamento adicionado no GLPI"
              width={1000}
              height={450}
              className="rounded-md shadow-md"
            />
          </div>
        </section>

        <section id="reserva-de-computador" className={commonSectionClass}>
          <h2 className={commonTitleClass}>8 - RESERVA DE COMPUTADOR</h2>
          <p className={paragraphClass}>
            Para que seja feita a reserva do notebook para eventos é necessário
            agendamento prévio. O agendamento é feito pelo sistema GLPI, segue o
            passo a passo para fazer o agendamento. Na página inicial do GLPI
            acessar a guia “Reserva”
          </p>
          <p className={paragraphClass}>
            Procure pela opção <strong className="font-medium">Reservas</strong>{" "}
            no menu principal. Você poderá visualizar a disponibilidade dos
            itens e criar uma nova reserva especificando o item desejado, data e
            horário de início e fim.
          </p>

          <div className="my-4">
            <Image
              src="/assets/icons/glpi/Formularios2.png"
              alt="Exemplo de acompanhamento adicionado no GLPI"
              width={1000}
              height={450}
              className="rounded-md shadow-md"
            />
          </div>

          <div className="my-4">
            <Image
              src="/assets/icons/glpi/Formularios3.png"
              alt="Exemplo de acompanhamento adicionado no GLPI"
              width={1000}
              height={450}
              className="rounded-md shadow-md"
            />
          </div>

          <div className="my-4">
            <Image
              src="/assets/icons/glpi/Formularios4.png"
              alt="Exemplo de acompanhamento adicionado no GLPI"
              width={1000}
              height={450}
              className="rounded-md shadow-md"
            />
          </div>
        </section>

        <InteractionButtons
          tutorialId="glpi"
          initialLikes={0}
          initialDislikes={0}
        />
      </article>
    </div>
  );
}
