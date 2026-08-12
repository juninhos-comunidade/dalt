# Projeto Harmônico

> Uma plataforma de mentoria e desenvolvimento humano para reduzir a barreira de entrada de desenvolvedores juniores no mercado de trabalho.

## 📖 Sobre o Projeto

O **Harmônico** nasce de uma dor comum no início de carreira em tecnologia: a distância entre o que se aprende nos cursos e o que o mercado realmente exige — tanto em habilidades técnicas quanto, principalmente, em habilidades humanas.

O diferencial da plataforma está em unir três pilares num único ecossistema:

- **Soft Skills e vivência de mercado**, através de mentoria real e simulações do dia a dia de um time de desenvolvimento;
- **Hard Skills essenciais**, com uma trilha objetiva e sem excesso de teoria, focada no que é usado na prática;
- **Saúde mental e suporte de carreira**, conectando novatos a profissionais especializados.

O motor que sustenta tudo isso é o **senso de comunidade** e a cultura de **_pay it forward_**: quem é ajudado hoje, ajuda amanhã.

## 📚 Documentation

- Keep this `README.md` up-to-date: any change that affects setup, running, environment variables, Docker configuration, or developer workflow must be reflected here. This ensures developers and CI maintainers can reproduce and run the project reliably.

## ✨ Principais Funcionalidades

### 🤝 Sistema de Apadrinhamento (Mentoria)

Conexão entre novatos e desenvolvedores experientes, 100% voluntária e sem cobrança. Inclui bate-papos de orientação, alinhamento de expectativas e **entrevistas simuladas** com feedback construtivo, com matchmaking baseado nos objetivos do novato e na vivência do padrinho.

### 🧠 Trilha de Hard Skills

Base essencial e prática: Estrutura de Dados e Algoritmos, Banco de Dados (SQL), Redes e Protocolos Web, Git/GitHub, Linha de Comando e Linux, Lógica Aplicada e Automação, e noções de Segurança e Testes.

### 🗣️ Trilha de Soft Skills e Vivência Corporativa

Simulação de metodologias ágeis na prática (Dailies, Sprints, Kanban) e desenvolvimento de comunicação técnica e interpessoal.

### 💚 Apoio Psicológico e de Carreira

Espaço de vitrine para psicólogos e especialistas de RH (revisão de currículo, LinkedIn). A plataforma **não intermedia pagamentos** — a negociação ocorre totalmente fora dela.

### 🖼️ Mural / Vitrine da Comunidade

Espaço central que reúne diferentes tipos de vitrine dentro da plataforma:

- **Profissionais independentes** (psicólogos, especialistas de RH) se apresentando aos novatos;
- **Empresas parceiras** acompanhando talentos em destaque, com consentimento do usuário, como método de recrutamento;
- **Portfólio e Dúvidas**, espaço para registrar a evolução de carreira na plataforma e canais rápidos para dúvidas da comunidade.

### 🏆 Engajamento e Gamificação Leve

Hall da Fama mensal para mentores destaque e recomendações públicas que geram valor real de carreira (ex: para uso no LinkedIn). Convite automático para o novato virar padrinho ao atingir o nível pleno.

### 🐞 Laboratório de "Projetos Quebrados"

Repositórios com bugs propositais para o novato investigar, corrigir e enviar Pull Requests — treinando debugging, leitura de código alheio e resiliência diante de problemas reais.

## 🛠️ Tecnologias

O projeto é desenvolvido utilizando a arquitetura de **Monorepo** com `pnpm workspaces`, separando totalmente o Frontend e o Backend:

- **Frontend (`apps/web`)**: [Next.js](https://nextjs.org/) (App Router) + Tailwind CSS.
- **Backend (`apps/server-api`)**: Node.js puro com [Fastify](https://fastify.dev/) para roteamento HTTP.
- **Tipagens (`packages/shared-types`)**: Pacote compartilhado garantindo consistência entre o front e o back.
- **Infra e Execução**: [Docker](https://www.docker.com/) e [Supabase](https://supabase.com/).

## 📁 Estrutura do Projeto e Rotas

Abaixo está o mapa atual da organização do **Monorepo** e como as rotas estão estruturadas no Next.js:

```
harmonico/
├── apps/
│   ├── web/                    # Frontend (Next.js)
│   │   ├── app/
│   │   │   ├── (public)/       # 🟢 ROTAS PÚBLICAS (Acesso livre)
│   │   │   │   ├── page.tsx    # -> / (Home)
│   │   │   │   ├── sobre/      # -> /sobre
│   │   │   │   └── projetos/   # -> /projetos
│   │   │   │
│   │   │   ├── (private)/      # 🔴 ROTAS PRIVADAS (Requer Login)
│   │   │   │   ├── conta/      # -> /conta
│   │   │   │   ├── configuracoes/# -> /configuracoes
│   │   │   │   └── privacidade/# -> /privacidade
│   │   │   │
│   │   │   └── mural/          # 🟡 ROTA MISTA
│   │   │       └── page.tsx    # -> /mural (Visualização pública, interação privada)
│   │   │
│   │   └── middleware.ts       # Valida cookies e protege rotas (private) redirecionando para a Home
│   │
│   └── server-api/             # Backend (Node.js + Fastify)
│       └── src/
│           ├── services/       # Regras de Negócio e Casos de Uso
│           └── repositories/   # Acesso a Dados
│
├── packages/
│   └── shared-types/           # Tipagens (Typescript) importadas pelo front e pelo back
│
├── pnpm-workspace.yaml         # Configuração do Monorepo
└── docker-compose.yml          # Orquestração dos containers (harmonico-web e harmonico-api)
```

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada, que já inclui o `npm` e `npx`) **ou** [Docker](https://www.docker.com/) / [Docker Compose](https://docs.docker.com/compose/)
- Uma conta e projeto criados no [Supabase](https://supabase.com/)
- Conta no [Resend](https://resend.com/) (opcional para testes locais de e-mail)

### Opção 1: Via Node.js (Ambiente de Desenvolvimento)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/harmonico.git
cd harmonico

# 2. Instale as dependências usando pnpm (obrigatório para o workspace)
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Rode o projeto em ambiente de desenvolvimento
pnpm run dev
```

O projeto estará disponível em `http://localhost:3000`.

### Opção 2: Via Docker (Container Otimizado / Standalone)

O repositório conta com configuração de **Docker** e **Docker Compose** multi-stage no modo `standalone`, permitindo rodar a aplicação em um ambiente isolado sem precisar instalar o Node.js localmente:

```bash
# 1. Clone o repositório e acesse a pasta
git clone https://github.com/seu-usuario/harmonico.git
cd harmonico

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha com suas credenciais (Supabase, Resend, etc)

# 3. Construa e suba o container em segundo plano
docker compose up -d --build

# 4. Para acompanhar os logs em tempo real
docker compose logs -f
```

O projeto estará disponível em `http://localhost:3000`. Para encerrar o container, execute `docker compose down`.
