# Criação de Cursos

## Visão Geral
Este documento descreve o processo completo para criação e gerenciamento de cursos no sistema PortalSaber, destinado a administradores.

## Pré-requisitos
- Acesso de administrador ao sistema
- Login realizado com privilégios administrativos

## Processo de Criação de Curso

### 1. Acesso Inicial
Após fazer login como administrador, você terá duas opções para criar ou editar cursos:

#### Opção A: Criação de Novo Tutorial
- Clique no botão **"Adicionar Tutorial"** localizado no header da página
- Esta opção criará um tutorial completamente do zero

#### Opção B: Edição de Tutorial Existente
- Na página inicial, localize o container dos cursos
- Clique no ícone de **edição** (ícone de lápis da biblioteca Lucide React)
- Esta opção permitirá editar um curso já existente
- **Nota:** Também existe a opção de deletar curso, localizada abaixo do botão de editar

### 2. Redirecionamento
Ambas as opções redirecionarão você para o endpoint: `/adm/addTutorial`

### 3. Preenchimento dos Dados do Card

Na primeira etapa, você deve preencher as informações que aparecerão no card do curso na tela inicial:

#### Campos Obrigatórios:

**Slug**
- Define o endpoint único do curso
- Deve ser único no sistema
- Será usado na URL de acesso ao curso

**Função**
- ⚠️ **Temporário:** Preencha como "SUS"
- Este campo será removido em versões futuras

**Imagem de Capa**
- Selecione a imagem que aparecerá como capa do tutorial
- Esta será a imagem principal exibida no card

**Outros campos necessários para o card:**
- Título do curso
- Descrição
- Demais informações relevantes

### 4. Criação do Conteúdo do Curso

Após preencher os dados do card, você pode adicionar o conteúdo do curso através de **blocos**:

#### Tipos de Blocos Disponíveis:

1. **Título**
   - Para seções principais do conteúdo

2. **Subtítulo**
   - Para subdivisões do conteúdo

3. **Parágrafo**
   - Para conteúdo textual

4. **Imagem**
   - Para inserção de imagens no conteúdo

#### Expansões Futuras:
O sistema suportará novos tipos de blocos:
- Vídeo
- GIF
- Outros formatos multimídia

### 5. Finalização e Sincronização

#### Redirecionamento Automático
Após terminar a criação do curso, você será automaticamente redirecionado para a **Tela de Sincronização**.

#### Tela de Sincronização
Esta tela funciona como um painel de monitoramento dos cursos e possui 3 botões principais:

##### Botão 1: Verificar Status
- Permite visualizar o status atual dos cursos
- Mostra quantos cursos estão identificados no sistema

##### Botão 2: Ver Cursos Atuais
- Lista todos os cursos atualmente disponíveis
- Permite verificar quais cursos estão ativos

##### Botão 3: Sincronizar
- **Função principal:** Atualiza o sistema com o novo curso criado
- Gera automaticamente o card do curso na tela inicial
- Permite acesso à página do tutorial criado ou atualizado

### 6. Edição de Cursos Existentes

Quando você editar um curso existente:
- Os dados anteriores já estarão preenchidos
- Todos os campos podem ser alterados conforme necessário
- O processo de sincronização é o mesmo da criação

## Fluxo Resumido

```
Login Admin → [Adicionar Tutorial / Editar Curso] → /adm/addTutorial
     ↓
Preencher dados do card (Slug, Função=SUS, Imagem, etc.)
     ↓
Adicionar blocos de conteúdo (Título, Subtítulo, Parágrafo, Imagem)
     ↓
Finalizar criação → Tela de Sincronização
     ↓
Sincronizar → Curso disponível na tela inicial
```

## Notas Importantes

- ⚠️ O campo "Função" é temporário e deve ser preenchido como "SUS"
- ✅ O Slug deve ser único para cada curso
- 🔄 A sincronização é necessária para que o curso apareça na tela inicial
- ✏️ Cursos podem ser editados a qualquer momento seguindo o mesmo processo

## Suporte Técnico

Para questões técnicas relacionadas à criação de cursos, consulte a equipe de desenvolvimento ou verifique a documentação técnica do sistema.