# SPRINT 1

## Objetivo

Organizar o escopo inicial da plataforma educacional e de mentoria, definindo:

- modelo de dados
- regras de autorização de conteúdo
- fluxo de criação, aprovação e edição de artigos/desafios
- chat com histórico de mensagens
- plano de desenvolvimento e testes para validar cada peça

## Visão geral do produto

A plataforma deve permitir:

- cadastro e login de usuários
- controle de perfis/roles (`MASTER`, `MENTOR`, `APRENDIZ`)
- criação, aprovação e edição de artigos
- criação, aprovação e edição de desafios/quiz
- classificação de conteúdo por área e nível
- histórico de evolução do usuário (leitura de artigos e conclusão de desafios)
- chat com salas, mensagens e histórico completo
- controle de aprovação de conteúdo e revisão de alterações

## Principais domínios

1. Autenticação / autorização
2. Taxonomia de conteúdo (Áreas, Níveis)
3. Conteúdo (Artigos, Desafios)
4. Evolução do usuário
5. Chat e histórico de mensagens
6. Fluxo de aprovação e revisões

## Requisitos funcionais

### Usuários e permissões

- O sistema deve permitir cadastro e login de usuários.
- O login deve ser realizado com email e senha.
- A autenticação deve usar token JWT contendo `user.id` e `role`.
- O JWT deve ser stateless e não precisa ser armazenado no banco.
- Roles mínimas:
  - `MASTER`
  - `MENTOR`
  - `APRENDIZ`

### Conteúdo e aprovação

- Apenas `MASTER` e `MENTOR` podem criar artigos e desafios.
- Conteúdos criados por `MENTOR` devem entrar em estado de aprovação.
- Conteúdos criados ou editados por `MASTER` são aprovados automaticamente.
- Quando um `MENTOR` edita um artigo ou desafio, a alteração deve ser registrada como revisão e aguardar aprovação do `MASTER`.
- O histórico de alterações e aprovações deve ser preservado.
- O conteúdo visível para `APRENDIZ` deve ser apenas o aprovado.

### Taxonomia de conteúdo

- O conteúdo deve ser categorizado por `Area` e `Level`.
- `Area` representa segmentos profissionais, como:
  - Dev Full Stack
  - Dev Front End
  - Dev Back End
- `Level` representa dificuldade ou senioridade, como:
  - Iniciante 1, 2, 3
  - Estagiário 1, 2, 3
  - Júnior 1, 2, 3
  - Pleno 1, 2, 3
  - Senior 1, 2, 3
- Artigos e desafios devem estar vinculados a uma área e a um nível.

### Evolução do usuário

- Registrar quando o usuário lê um artigo.
- Registrar quando o usuário conclui ou tenta um desafio.
- Permitir cálculo de progresso com base nas interações do usuário.
- Manter histórico de evolução para exibir o que já foi consumido.

### Chat

- O chat deve salvar o histórico completo no banco de dados.
- Deve ser possível criar salas de chat para conversas 1x1 ou em grupo.
- Mensagens devem armazenar:
  - conteúdo (`content`)
  - autor (`senderId`)
  - sala (`roomId`)
  - data de envio (`sentAt`)
  - status de leitura (`isRead`)
  - data de edição (`editedAt`)
- A sala deve conter os participantes vinculados.

## Modelo de dados sugerido

### Enum de status

```prisma
enum ContentStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### Role

```prisma
model Role {
  id          Int    @id @default(autoincrement())
  name        String @unique
  description String?
  users       User[]
}
```

### User

```prisma
model User {
  id                         Int                 @id @default(autoincrement())
  name                       String
  email                      String              @unique
  passwordHash               String
  roleId                     Int
  role                       Role                @relation(fields: [roleId], references: [id])

  articlesCreated            Article[]           @relation("ArticleAuthor")
  articlesApproved           Article[]           @relation("ArticleApprover")
  articleRevisionsCreated    ArticleRevision[]   @relation("ArticleRevisionAuthor")
  articleRevisionsReviewed   ArticleRevision[]   @relation("ArticleRevisionReviewer")

  challengesCreated          Challenge[]         @relation("ChallengeCreator")
  challengesApproved         Challenge[]         @relation("ChallengeApprover")
  challengeRevisionsCreated  ChallengeRevision[] @relation("ChallengeRevisionAuthor")
  challengeRevisionsReviewed ChallengeRevision[] @relation("ChallengeRevisionReviewer")

  articleHistory             ArticleEvolution[]
  challengeHistory           ChallengeEvolution[]

  messagesSent               ChatMessage[]
  chatRooms                  ChatParticipant[]

  createdAt                  DateTime            @default(now())
  updatedAt                  DateTime            @updatedAt
}
```

### Area

```prisma
model Area {
  id         Int        @id @default(autoincrement())
  name       String     @unique
  articles   Article[]
  challenges Challenge[]
}
```

### Level

```prisma
model Level {
  id         Int        @id @default(autoincrement())
  name       String     @unique
  order      Int
  articles   Article[]
  challenges Challenge[]
}
```

### Article

```prisma
model Article {
  id           Int                @id @default(autoincrement())
  title        String
  content      String             @db.Text
  status       ContentStatus      @default(PENDING)
  authorId     Int
  author       User               @relation("ArticleAuthor", fields: [authorId], references: [id], onDelete: Cascade)
  approvedById Int?
  approvedBy   User?              @relation("ArticleApprover", fields: [approvedById], references: [id])
  approvedAt   DateTime?
  areaId       Int
  area         Area               @relation(fields: [areaId], references: [id])
  levelId      Int
  level        Level              @relation(fields: [levelId], references: [id])
  interactions ArticleEvolution[]
  revisions    ArticleRevision[]
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
}
```

### ArticleRevision

```prisma
model ArticleRevision {
  id          Int           @id @default(autoincrement())
  articleId   Int
  article     Article       @relation(fields: [articleId], references: [id], onDelete: Cascade)
  title       String
  content     String        @db.Text
  authorId    Int
  author      User          @relation("ArticleRevisionAuthor", fields: [authorId], references: [id])
  status      ContentStatus @default(PENDING)
  reviewerId  Int?
  reviewer    User?         @relation("ArticleRevisionReviewer", fields: [reviewerId], references: [id])
  reviewedAt  DateTime?
  createdAt   DateTime      @default(now())
}
```

### Challenge

```prisma
model Challenge {
  id            Int                 @id @default(autoincrement())
  title         String
  description   String              @db.Text
  status        ContentStatus       @default(PENDING)
  creatorId     Int
  creator       User                @relation("ChallengeCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  approvedById  Int?
  approvedBy    User?               @relation("ChallengeApprover", fields: [approvedById], references: [id])
  approvedAt    DateTime?
  areaId        Int
  area          Area                @relation(fields: [areaId], references: [id])
  levelId       Int
  level         Level               @relation(fields: [levelId], references: [id])
  interactions  ChallengeEvolution[]
  revisions     ChallengeRevision[]
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
}
```

### ChallengeRevision

```prisma
model ChallengeRevision {
  id          Int           @id @default(autoincrement())
  challengeId Int
  challenge   Challenge     @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  title       String
  description String        @db.Text
  authorId    Int
  author      User          @relation("ChallengeRevisionAuthor", fields: [authorId], references: [id])
  status      ContentStatus @default(PENDING)
  reviewerId  Int?
  reviewer    User?         @relation("ChallengeRevisionReviewer", fields: [reviewerId], references: [id])
  reviewedAt  DateTime?
  createdAt   DateTime      @default(now())
}
```

### ArticleEvolution

```prisma
model ArticleEvolution {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  articleId Int
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  readAt    DateTime @default(now())
  @@unique([userId, articleId])
}
```

### ChallengeEvolution

```prisma
model ChallengeEvolution {
  id          Int      @id @default(autoincrement())
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  challengeId Int
  challenge   Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  status      String
  score       Int?
  completedAt DateTime @default(now())
  @@unique([userId, challengeId])
}
```

### ChatRoom

```prisma
model ChatRoom {
  id           Int             @id @default(autoincrement())
  name         String?
  participants ChatParticipant[]
  messages     ChatMessage[]
  createdAt    DateTime        @default(now())
}
```

### ChatParticipant

```prisma
model ChatParticipant {
  roomId   Int
  room     ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  userId   Int
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  joinedAt DateTime @default(now())
  @@id([roomId, userId])
}
```

### ChatMessage

```prisma
model ChatMessage {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  roomId    Int
  room      ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  senderId  Int
  sender    User     @relation(fields: [senderId], references: [id], onDelete: Cascade)
  isRead    Boolean  @default(false)
  editedAt  DateTime?
  sentAt    DateTime @default(now())
}
```

## Fluxo de aprovação e revisão

- Usuário `MASTER` pode criar e aprovar conteúdo diretamente.
- Usuário `MENTOR` pode criar ou editar conteúdo, mas essas alterações ficam em estado `PENDING` até aprovação do `MASTER`.
- Um `MENTOR` não deve publicar conteúdo sem a revisão de um `MASTER`.
- As revisões são preservadas em `ArticleRevision` e `ChallengeRevision` para permitir histórico de mudanças.
- O conteúdo em produção deve ser sempre a última versão aprovada.

## Prioridades do sprint

1. Definição da infraestrutura de banco de dados e ORM.
2. Modelagem de dados com IDs inteiros e relacionamentos claros.
3. Autenticação e autorização via roles.
4. Implementação do fluxo de criação e aprovação de conteúdo.
5. Implementação do histórico de evolução do usuário.
6. Implementação do chat com histórico e indicadores de leitura/edição.
7. Testes automatizados para validar regras de negócio.

## Plano de ação

### Infraestrutura

- Escolher o banco de dados relacional.
- Configurar ORM e schema inicial.
- Preparar migrations e dados iniciais.

### Autenticação e autorização

- Endpoint de registro e login.
- Geração de token JWT.
- Proteção de rotas por role.
- Seed inicial de roles: `MASTER`, `MENTOR`, `APRENDIZ`.

### Conteúdo

- Endpoints para criação, listagem, edição e aprovação de artigos.
- Endpoints para criação, listagem, edição e aprovação de desafios.
- Implementar lógica de visibilidade para aprendizes.

### Revisões

- Registrar alterações de mentor em tabelas de revisão.
- Permitir aprovação e rejeição pelo master.
- Preservar histórico de revisão.

### Evolução

- Registrar leitura de artigos.
- Registrar conclusão de desafios.
- Consultar progresso e histórico do usuário.

### Chat

- Criar salas e relacionamento de participantes.
- Registrar e listar mensagens com `isRead` e `editedAt`.

## Estratégia de testes

### Testes de autenticação

- Registro de usuário e criação de role.
- Login retornando JWT válido.
- Rejeição de login inválido.

### Testes de autorização

- Mentor não aprova conteúdo.
- Aprendiz não cria conteúdo.
- Master aprova e edita diretamente.
- Mentor cria conteúdo em `PENDING`.

### Testes de conteúdo

- Criação de artigo/desafio com status `PENDING`.
- Aprovação pelo master.
- Edição por mentor gerando revisão.
- Listagem apenas de conteúdo aprovado para aprendizes.

### Testes de revisão

- Criação de revisão pelo mentor.
- Aprovação e rejeição de revisão.
- Histórico de revisões consultável.

### Testes de evolução

- Registro de leitura de artigo.
- Registro de conclusão de desafio.
- Prevenção de duplicação de registros.

### Testes de chat

- Criação de sala e adição de participantes.
- Envio e listagem de mensagens.
- Marcação de mensagens como lidas.
- Edição de mensagens e preenchimento de `editedAt`.

## Observações

- Utilizar IDs inteiros com autoincremento para melhor desempenho.
- Adotar `ContentStatus` para controlar publicação e revisão.
- O chat inicial pode usar `isRead` para controle simples de leitura; a expansão para recibos por usuário em grupo pode ser feita depois.
- O foco deste sprint é estabelecer a base técnica e validar os principais fluxos de criação, aprovação e histórico.
