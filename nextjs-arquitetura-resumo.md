# Next.js: Rotas, React Router e Separação de Arquitetura

## 1. Como funcionam as rotas no Next.js

O Next.js usa **file-system routing** — a estrutura de pastas define as rotas, diferente do React Router que é declarativo em código.

### App Router (padrão desde Next 13+, recomendado)
```
app/
  page.tsx              → /
  about/page.tsx         → /about
  blog/[slug]/page.tsx    → /blog/:slug
  dashboard/layout.tsx    → layout compartilhado
  loading.tsx             → estado de loading automático
  error.tsx               → error boundary automático
```
- Cada rota é uma pasta com `page.tsx`
- Suporta layouts aninhados, Server Components por padrão, streaming
- Convenções extras: `(grupo)` (organiza sem afetar URL), `[slug]` (dinâmica), `@slot` (parallel routes), `(.)` (intercepting routes)

### Pages Router (legado, `pages/`)
Mais simples, mas sem Server Components e sem layouts avançados nativos.

## 2. Next.js Router vs React Router (react-router-dom)

| Aspecto | Next.js Router | React Router |
|---|---|---|
| Definição de rotas | Estrutura de pastas | Componentes `<Route>` ou config JS |
| Precisa de framework específico | Sim | Não, funciona em qualquer app React |
| SSR/SSG | Nativo | Não, precisa de outra camada (Remix resolve isso) |
| Code-splitting por rota | Automático | Manual (`React.lazy` + `Suspense`) |
| Data fetching | Integrado | Nada nativo (v6.4+ tem loader/action opcional) |
| Server Components | Sim | Não existe |
| Navegação SPA pura | Possível, mas contra a corrente do framework | Caso de uso natural |

**Vantagens do Next.js:** SSR/SSG/ISR/streaming prontos, otimizações automáticas, convenções fortes, SEO mais fácil.
**Desvantagens do Next.js:** menos flexível para rotas muito dinâmicas em runtime, acoplamento ao framework, curva de aprendizado maior.

**Vantagens do React Router:** simplicidade, controle explícito, funciona em qualquer setup, ótimo para SPAs/dashboards internos.
**Desvantagens do React Router:** sem SSR nativo, tudo (cache, code-splitting) é manual.

## 3. Separação Frontend / Backend no projeto (contexto do projeto real)

Situação inicial: projeto Next.js com pasta `app/` (frontend) e pasta `server/` (backend interno, com `actions/services/repositories`), tudo rodando como monólito em um único container Docker (`harmonico-web`).

### Ponto-chave sobre Server Actions
Server Actions (`"use server"`) são uma feature do runtime do Next.js — **não existem fora do processo do Next.js**. Não dá para simplesmente "mover" a pasta `server/` para outro container mantendo Server Actions; elas precisam virar chamadas HTTP para uma API externa.

### Caminho recomendado (projeto ainda limpo/inicial)
Como o projeto está no início, a decisão certa é **começar já com dois projetos separados**, em vez de migrar depois:

```
projeto/
  app/            → Next.js (frontend + Server Actions como client HTTP/BFF)
  server-api/     → API própria e independente (Node + TypeScript)
```

Dois `package.json`, dois `Dockerfile`, dois deploys desde o início.

### BFF (Backend for Frontend) — Server Actions como camada intermediária
Fluxo: `Browser → Server Action (no processo do Next.js) → fetch() → server-api → banco`

**Vantagens do BFF:**
- Segurança: credenciais/tokens de API nunca ficam expostos no browser
- `server-api` pode ficar em rede interna/privada, sem IP público
- Agregação de múltiplas chamadas em uma só resposta pro client
- CORS simplificado (server-to-server, não browser-to-server)
- Integração nativa com cache/revalidação do Next.js (`revalidatePath`, `revalidateTag`)

**Vantagens do fetch direto client-side:**
- Menos latência (um hop a menos)
- Menos carga no servidor Next.js
- Mais simples de implementar (sem escrever uma Server Action por endpoint)

**Sobre balanceamento de carga:** o BFF não balanceia sozinho — quem faz isso é a infraestrutura do `server-api` (múltiplas instâncias atrás de um load balancer). O Next.js/BFF só aponta pra uma URL (`API_URL`), que pode ser um load balancer ou service discovery interno.

**Recomendação:** usar Server Actions como BFF, dado o objetivo de deploy independente + segurança/organização de equipe.

## 4. Stack decidida e pendências

- **server-api:** Node + TypeScript (decidido)
  - Fastify: leve, rápido, baixa curva de aprendizado — bom para times pequenos
  - NestJS: estrutura opinativa (DI, decorators, módulos), melhor para times maiores e projetos que crescem — mais alinhado ao objetivo de "equipe separada mexendo com testes bem definidos"
- **Tipagem compartilhada:** ainda em aberto. Sugestão inicial: **monorepo com pnpm workspaces**, com um pacote `shared-types` importado tanto pelo `web` quanto pelo `server-api`, sem precisar de tRPC ou geração via OpenAPI por enquanto.

```
projeto/
  packages/
    shared-types/
  apps/
    web/            → Next.js
    server-api/      → Nest ou Fastify
  pnpm-workspace.yaml
```

## Próximos passos sugeridos
- [ ] Decidir entre Fastify e NestJS
- [ ] Montar o monorepo (workspaces) com `web`, `server-api` e `shared-types`
- [ ] Escrever Dockerfiles separados para cada app
- [ ] Atualizar `docker-compose.yml` com os dois serviços (`web` e `api`)
- [ ] Definir Server Actions como camada BFF chamando o `server-api` via `API_URL`
