# Especificação — Sistema de Chat (Mentores x Aprendizes)

## 1. Visão geral

Sistema de mensagens em tempo real dentro da plataforma, com três modalidades de conversa:

1. **Chat 1:1** entre mentor e aprendiz (iniciado pelo mentor a partir da listagem de aprendizes, ou pelo aprendiz a partir da listagem de mentores).
2. **Chat geral / grupo** — todos os usuários logados da plataforma, tipo "sala pública".
3. (sugestão futura) **Grupos temáticos** — grupos menores criados por assunto/turma, reaproveitando a mesma infraestrutura do chat geral.

---

## 2. Perfis e permissões

| Perfil   | Pode iniciar chat 1:1      | Pode ser chamado em 1:1 por quem | Pode falar no chat geral | Pode mutar                                 | Pode enviar áudio |
| -------- | -------------------------- | -------------------------------- | ------------------------ | ------------------------------------------ | ----------------- |
| Aprendiz | Sim (com mentor)           | Mentor, Admin                    | Sim                      | Não                                        | Sim, se logado    |
| Mentor   | Sim (com aprendiz)         | Aprendiz, Admin                  | Sim                      | Sim (no seu chat e no geral, se moderador) | Sim, se logado    |
| Admin    | Sim (com qualquer usuário) | Qualquer usuário                 | Sim                      | Sim                                        | Sim, se logado    |

- **Admin tem 1:1 irrestrito**: pode chamar qualquer usuário da plataforma (aprendiz ou mentor) em um chat privado, e também pode ser chamado por qualquer usuário — diferente do par mentor↔aprendiz, que só se conecta entre si. Na prática, o admin funciona como um terceiro tipo de participante válido em qualquer chat direto, não só como moderador do chat geral.
- Admin envia áudio nas mesmas condições dos demais perfis: liberado sempre que estiver logado, sem depender do status online/offline do destinatário (ver seção 3.3).

> Ponto em aberto: quem tem poder de mutar no **chat geral** — todo mentor, ou só um papel de moderador dedicado? Recomendo criar um papel `moderador` separado de `mentor`, mesmo que hoje sejam a mesma pessoa, para não travar a regra de negócio depois.

---

## 3. Fluxos principais

### 3.1. Chat 1:1 mentor ↔ aprendiz

- Mentor acessa listagem de aprendizes → seleciona um → sistema verifica se já existe uma conversa (`chat_id`) entre os dois.
  - Se existir, abre o histórico.
  - Se não existir, cria o registro do chat no momento do primeiro envio (evita "chats fantasmas" vazios no banco).
- O mesmo fluxo se aplica no botão da listagem de mentores (visão do aprendiz).

### 3.1.1. Chat 1:1 envolvendo admin

- Admin acessa uma listagem geral de usuários (aprendizes + mentores) — pode ser a mesma tela de listagem já existente, com um botão "Chamar no privado" visível só para o perfil admin.
- Mesma lógica de criação preguiçosa (`lazy creation`): o chat só é gravado no banco no primeiro envio de mensagem.
- Do outro lado, qualquer aprendiz ou mentor deve conseguir chamar o admin no privado (ex.: botão "Falar com o suporte/admin" em algum ponto da plataforma) — a regra de permissão aqui não é "quem pode iniciar", e sim "o admin sempre pode estar do outro lado de qualquer 1:1".
- No modelo de dados, isso **não exige mudança de schema**: `chats` do tipo `direct` já suporta qualquer par de `user_id` em `chat_participants`, então o par aprendiz↔admin ou mentor↔admin usa exatamente a mesma estrutura do par mentor↔aprendiz. A diferença é só na regra de autorização da API (quem tem permissão de criar o chat com quem).

### 3.2. Chat geral

- Sala única, todo usuário logado entra automaticamente ao abrir o modal na aba "Geral".
- Mensagens antigas carregadas com paginação (scroll infinito), não tudo de uma vez.

### 3.3. Usuário offline

- Não existe "modo offline" separado no backend — **toda mensagem é sempre persistida no banco antes de qualquer tentativa de entrega via WebSocket**. Isso já resolve o caso do usuário offline: ele simplesmente vê a mensagem no histórico quando entrar.
- A restrição de "sem áudio para offline" citada no rascunho eu sugiro reformular: em vez de bloquear áudio por estar sem WebSocket ativo, trate como **duas features independentes**:
  - Envio de texto: sempre permitido, com fallback de entrega via histórico.
  - Envio de áudio: permitido sempre que o remetente estiver logado (a limitação real de infraestrutura é o _upload_ do arquivo de áudio para storage, não o status online/offline do destinatário).
- Opcional: notificação push/e-mail quando o destinatário está offline e recebe mensagem (fica como item de fase 2).

---

## 4. Arquitetura técnica sugerida

**Frontend:** React + WebSocket client (socket.io-client, ou WebSocket nativo se o backend não usar socket.io).

**Backend (sugestão, a definir junto com o time):**

- API REST para histórico, login, listagem, moderação (mute/unmute).
- Camada WebSocket separada (socket.io ou `ws`) só para tempo real: envio/recebimento de mensagem, presença (online/offline), "digitando...".
- Autenticação do WebSocket via JWT no handshake (não confiar em `userId` mandado pelo client).
- Se houver mais de uma instância do servidor de WebSocket (escala horizontal), usar **Redis pub/sub** (ou adapter equivalente) para sincronizar mensagens entre instâncias — senão usuários conectados em servidores diferentes não se enxergam.

**Banco de dados (sugestão):**

- Relacional (Postgres) para usuários, chats, participantes, mutes, logs de auditoria — dados com relações fortes.
- Mensagens em si podem ficar no mesmo Postgres (mais simples) ou em algo otimizado para escrita/leitura em sequência (Mongo, ou tabela particionada por data) se o volume crescer muito.

**Armazenamento de áudio:**

- Upload direto para bucket (S3 ou equivalente), backend só recebe/guarda a URL + metadados (duração, tamanho, mime type).
- Nunca guardar o binário de áudio dentro do banco relacional.

---

## 5. Modelo de dados (rascunho)

```
users            (id, name, role, ...)
chats            (id, type: 'direct' | 'group', created_at)
chat_participants(chat_id, user_id, joined_at)
messages         (id, chat_id, sender_id, type: 'text' | 'audio',
                  content, audio_url, created_at, edited_at, deleted_at)
message_logs     (id, message_id, action: 'sent'|'delivered'|'read'|'deleted', actor_id, created_at)
mutes            (id, user_id, chat_id (nullable = mute global),
                  muted_by, muted_type: 'text'|'audio'|'both',
                  starts_at, ends_at, reason)
```

- `message_logs` separado de `messages` permite auditoria completa (quem apagou, quando foi lido) sem poluir a tabela principal.
- `mutes` com `chat_id` nulo permite mutar alguém no chat geral inteiro; com `chat_id` preenchido, muta só naquele chat 1:1 (embora mutar em 1:1 seja um caso de uso estranho — provavelmente a regra de mute só se aplica ao chat geral/grupo, vale confirmar).

---

## 6. Sanitização e segurança

- **Nunca confiar no HTML/texto vindo do client.** Sanitizar no backend (ex.: `DOMPurify` no server via `jsdom`, ou uma allowlist de texto puro sem HTML/markdown perigoso) antes de persistir — sanitizar só no front não protege nada, porque a mensagem passa pela API de qualquer forma.
- Escapar a mensagem também na renderização do front (mesmo já sanitizada no backend, defesa em profundidade).
- Rate limiting por usuário (ex.: máx. de N mensagens por minuto) para evitar spam/flood no chat geral.
- Validar upload de áudio: mime type real do arquivo (não confiar só na extensão), tamanho máximo, duração máxima.
- Validar JWT em toda conexão WebSocket, não só na API REST.
- Logs de auditoria não devem guardar dados sensíveis desnecessários; considerar política de retenção (relevante para LGPD, já que são dados pessoais/conversas).

---

## 7. Moderação (mute)

- Mute com duração determinada (`starts_at` / `ends_at`), aplicável separadamente a **texto** e **áudio** (o rascunho original já previa isso — mantive).
- Ao tentar enviar mensagem/áudio durante o mute, o backend rejeita mesmo que o front esconha o botão (o front some com a opção só por UX, a regra de verdade é sempre no servidor).
- Notificar o usuário mutado (mensagem de sistema no chat) informando duração e motivo.
- Tela/listagem para o moderador ver mutes ativos e poder revogar antes do prazo.

---

## 8. UI/UX

- Botão flutuante visível para todos (logados ou não), mas ao clicar sem estar logado → redireciona para login/cadastro.
- Modal com abas: **Geral** / **Conversas** (lista de chats 1:1).
- Bubble de mensagem estilo rede social (mensagem própria alinhada à direita, do outro à esquerda), com indicador de "enviado / lido" e timestamp.
- Player de áudio simples embutido na bubble quando `type: 'audio'`.
- Badge de contador de mensagens não lidas no botão flutuante.
- Indicador de presença (online/offline) na lista de conversas e no cabeçalho do chat 1:1.

---

## 9. Pontos em aberto (decidir antes de detalhar o backlog)

1. Quem pode mutar no chat geral: todo mentor ou só moderador dedicado?
2. Mute se aplica também a chats 1:1, ou só ao chat geral/grupo?
3. Retenção dos logs de mensagens — por quanto tempo guardar, e qual a política de exclusão de conta/LGPD?
4. Precisa de notificação (push/e-mail) para mensagem recebida com usuário offline, ou fica só no histórico dentro da plataforma?
5. Tamanho/duração máxima do áudio, e se haverá transcrição automática (acessibilidade).
6. O chat geral terá apenas uma sala única, ou múltiplas salas por tema/turma desde o início?

---

## 10. Sugestão de fases (MVP → evolução)

**MVP (Implementado Parcialmente na Sprint 2 - API e DB criados)**

- [x] Chat 1:1 texto, criado a partir da listagem de mentores/aprendizes (Backend concluído).
- [ ] Chat geral só texto.
- [x] Persistência de histórico + sanitização básica (Schema e rotas concluídas).
- [ ] Modal + botão flutuante.

**Fase 2**

- Áudio no 1:1 e no geral.
- Presença online/offline + indicador de leitura.
- Mute (texto/áudio) com painel de moderação.

**Fase 3**

- Notificações push para mensagens offline.
- Grupos temáticos.
- Escala horizontal do WebSocket (Redis).
