# SPRINT 1 — Features (Checklist sequencial)

> Atenção: siga esta sequência estrita. Não inicie o próximo passo sem marcar o anterior como concluído (implementação, testes e revisão).

## Nota de uso

- Marque a caixa apenas depois que:
  1. A implementação estiver feita e funcionando.
  2. Os testes cobrirem todos os cenários listados e passarem.
  3. Um review de código for realizado e aprovado.
  4. O `README.md` foi atualizado se as mudanças alterarem execução, configuração ou instruções de desenvolvimento.

## Passo a passo (sequencial)

### 1 — Infraestrutura do banco e ORM

- [x] Implementação:
  - [x] Banco de dados relacional (Postgres)
  - [x] O banco de dados terá que ficar em um docker compose separado, pode criar um docker compose.db
  - [x] Adicionar dependências e configuração de conexão
  - [x] Criar schema inicial (migrations básicas)
  - [x] Adicionar seeds mínimos (roles)
- [x] Testes (valide localmente):
  - [x] conexão com banco funciona em ambiente de teste
  - [x] migrations aplicam e rollback funcionam
  - [x] seeds criam `MASTER`, `MENTOR`, `APRENDIZ`

  Commands to validate locally (run from repo root):

  ```bash
  docker-compose -f docker-compose.db.yml up -d
  cd apps/server-api
  pnpm install
  pnpm prisma:generate
  pnpm prisma:migrate   # or pnpm prisma:dbpush
  pnpm run prisma:seed
  ```

- [ ] Revisão:
- [x] Revisão:
- [x] revisar configuração de connection string e secrets (vamos usar variáveis de ambiente, .env por favor)
- [x] checar scripts de migration no CI
- [x] vamos deixar funcionando em container por favor

### 2 — Autenticação (registro, login, JWT)

- [ ] Implementação:
  - [ ] endpoint `POST /auth/register`
  - [ ] endpoint `POST /auth/login`
  - [ ] hashing de senha seguro (bcrypt/scrypt/argon2)
  - [ ] geração de JWT contendo `user.id` e `role`
  - [ ] middleware de proteção de rotas por JWT
- [ ] Testes:
  - [ ] registro cria usuário com role correto
  - [ ] registro com email duplicado retorna 4xx
  - [ ] login válido retorna JWT assinada
  - [ ] token inválido/expirado é rejeitado
  - [ ] rotas protegidas aceitam token e rejeitam requests sem token
- [ ] Revisão:
  - [ ] revisar política de expiração e refresh se necessário
  - [ ] checar logs de autenticação para dados sensíveis

### 3 — Roles e autorização por papel

- [ ] Implementação:
  - [ ] seed das roles no banco
  - [ ] middleware/guard para autorização por `role`
  - [ ] utilitários para checagem `isMaster()`, `isMentor()`, `isAprendiz()`
- [ ] Testes:
  - [ ] `APRENDIZ` não consegue acessar endpoints de criação
  - [ ] `MENTOR` consegue criar conteúdo, mas não aprovar
  - [ ] `MASTER` consegue aprovar e editar diretamente
- [ ] Revisão:
  - [ ] revisar regras de escalonamento de permissões
  - [ ] documentar roles e permissões em `docs/` ou no README

### 4 — Modelos de Conteúdo (Article / Challenge)

- [ ] Implementação:
  - [ ] modelagem no ORM: `Article`, `ArticleRevision`, `Challenge`, `ChallengeRevision`, `Area`, `Level`
  - [ ] endpoints CRUD mínimos: criação, leitura, edição (versão), listagem
  - [ ] associação com `area` e `level`
- [ ] Testes:
  - [ ] criação com dados válidos funciona
  - [ ] validação de campos rejeita payloads inválidos
  - [ ] `MASTER` cria e já tem status `APPROVED`
  - [ ] `MENTOR` cria e fica `PENDING`
- [ ] Revisão:
  - [ ] revisar modelos quanto a relacionamentos e onDelete
  - [ ] verificar tamanho de campos (text vs varchar)

### 5 — Fluxo de aprovação e revisões

- [ ] Implementação:
  - [ ] endpoint de submissão de revisão por `MENTOR`
  - [ ] endpoint de aprovação/rejeição por `MASTER`
  - [ ] persistir histórico de revisões (`ArticleRevision`, `ChallengeRevision`)
- [ ] Testes:
  - [ ] revisão criada por `MENTOR` fica em `PENDING`
  - [ ] `MASTER` aprova e registra `approvedBy` e `approvedAt`
  - [ ] rejeição mantém histórico e seta motivo (se aplicável)
- [ ] Revisão:
  - [ ] percorrer casos de edição simultânea e conflitos
  - [ ] garantir auditoria mínima (quem, quando, o quê)

### 6 — Histórico de evolução do usuário

- [ ] Implementação:
  - [ ] endpoints para registrar leitura de artigos e conclusão de desafios
  - [ ] modelos `ArticleEvolution`, `ChallengeEvolution`
  - [ ] endpoint de progresso consolidado por usuário
- [ ] Testes:
  - [ ] primeira leitura gera registro
  - [ ] leituras subsequentes não duplicam (idempotência)
  - [ ] conclusão de desafio grava `score` e `completedAt`
  - [ ] progresso retorna contagens por area/level
- [ ] Revisão:
  - [ ] revisar índices e consultas para performance
  - [ ] checar possibilidade de limpezas e retenção de dados

### 7 — Chat com histórico

- [ ] Implementação:
  - [ ] modelos `ChatRoom`, `ChatParticipant`, `ChatMessage`
  - [ ] endpoints: criar sala, adicionar participantes, enviar mensagem, listar mensagens
  - [ ] salvar `isRead`, `editedAt`
- [ ] Testes:
  - [ ] criar sala com participantes válidos
  - [ ] envio de mensagem persiste `sentAt` e conteúdo
  - [ ] listar mensagens em ordem cronológica
  - [ ] marcar como lida atualiza `isRead`
  - [ ] edição atualiza `editedAt`
- [ ] Revisão:
  - [ ] avaliar limitação de carga e paginação
  - [ ] checar comportamentos em salas grandes (pagination cursor)

### 8 — Cobertura de testes e integração final

- [ ] Implementação:
  - [ ] criar suíte de testes de integração que percorra os fluxos principais
  - [ ] scripts para rodar testes local/CI
  - [ ] adicionar checks básicos no pipeline (se existir)
- [ ] Testes:
  - [ ] testes unitários cobrem regras de negócio críticas
  - [ ] testes de integração validam fluxo: criar conteúdo -> revisão -> aprovação -> visibilidade
  - [ ] testes de autorização garantem isolamento por role
- [ ] Revisão:
  - [ ] corrigir gaps descobertos nos testes
  - [ ] documentar como rodar testes e interpretar falhas

## Finalização

- [ ] Revisão geral: garantir que cada passo teve implementação, testes e revisão aprovados.
- [ ] Atualizar `sprints/sprints.md` e `sprints/sprint1/plan.md` se houver mudanças de escopo.
- [ ] Comentar no PR quais passos foram concluídos e quais permanecem pendentes.

> Lembrete: marque cada caixa apenas após a implementação, todos os testes passando e revisão aprovada.
