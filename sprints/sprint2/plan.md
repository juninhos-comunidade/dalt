# SPRINT 2

## Objetivo

Criar as features principais da plataforma com sequência estrita de implementação e validação por testes. Cada passo deve ser marcado como concluído antes de iniciar o próximo.

## Instruções

- Cada item principal é uma feature implementável.
- Não iniciar o próximo passo antes de terminar e revisar o anterior.
- Cada passo deve conter testes cobrindo todos os cenários possíveis.
- Revisar mudanças antes de marcar como concluído.

## Features e checklist passo a passo

### 1. Configurar infraestrutura de autenticação

- [x] Implementar endpoint de registro de usuário.
  - Testes:
    - [x] usuário novo é criado com role correta
    - [x] email duplicado retorna erro
    - [x] senha fraca é rejeitada se regra definida
- [x] Implementar endpoint de login com JWT.
  - Testes:
    - [x] login válido retorna token JWT
    - [x] login inválido retorna erro de credenciais
    - [x] token inclui `user.id` e `role`
- [x] Implementar middleware de validação de JWT.
  - Testes:
    - [x] rota autenticada aceita token válido
    - [x] token expirado ou inválido é rejeitado
    - [x] rota pública funciona sem token

### 2. Criar roles e validação de permissões

- [ ] Definir roles `MASTER`, `MENTOR`, `APRENDIZ` no seed inicial. (Nota: `MASTER` nunca será criado via endpoint).
  - Testes:
    - [ ] roles existem após seed
    - [ ] criação de usuário atribui role correta (`APRENDIZ` por padrão)
- [ ] Implementar guardas de autorização por role.
  - Testes:
    - [ ] `APRENDIZ` não consegue criar conteúdo (Artigos, Desafios, Eventos, Mentorias)
    - [ ] `MENTOR` consegue criar conteúdo, mas não aprovar
    - [ ] `MASTER` consegue aprovar conteúdo
- [ ] Validar que apenas `MASTER` e `MENTOR` podem acessar endpoints de criação de conteúdo.
  - Testes:
    - [ ] acesso de `APRENDIZ` é negado
    - [ ] `MENTOR` e `MASTER` recebem 200 em criação válida

### 3. Implementar criação e aprovação de artigos e eventos

- [ ] Criar modelo e endpoint de criação de artigo e evento.
  - Testes:
    - [ ] `MASTER` cria artigo/evento aprovado automaticamente
    - [ ] `MENTOR` cria artigo/evento com status `PENDING`
    - [ ] dados inválidos são rejeitados
- [ ] Criar endpoint de listagem de artigos e eventos aprovados.
  - Testes:
    - [ ] apenas itens `APPROVED` aparecem para `APRENDIZ`
    - [ ] `MASTER` vê todos os itens com status
- [ ] Implementar endpoint de aprovação de artigo/evento.
  - Testes:
    - [ ] `MASTER` aprova item pendente
    - [ ] `MENTOR` não consegue aprovar
    - [ ] aprovação atualiza `approvedAt` e `approvedBy`

### 4. Implementar criação e aprovação de desafios e ofertas de mentoria

- [ ] Criar modelo e endpoint de criação de desafio e oferta de mentoria.
  - Testes:
    - [ ] `MASTER` cria desafio/mentoria aprovado automaticamente
    - [ ] `MENTOR` cria desafio/mentoria em `PENDING`
    - [ ] validação de campos funciona corretamente
- [ ] Criar endpoint de listagem de desafios e mentorias aprovadas.
  - Testes:
    - [ ] `APRENDIZ` vê apenas itens aprovados
    - [ ] lista retorna áreas/níveis/assuntos corretamente
- [ ] Implementar endpoint de aprovação de desafio/mentoria.
  - Testes:
    - [ ] `MASTER` aprova item pendente
    - [ ] `MENTOR` não consegue aprovar
    - [ ] aprovação atualiza metadata de revisão

### 5. Registrar histórico de evolução do usuário

- [ ] Implementar registro de leitura de artigo.
  - Testes:
    - [ ] leitura única gera um registro
    - [ ] leitura repetida não duplica registro
    - [ ] usuário com artigo não lido agora possui registro
- [ ] Implementar registro de conclusão de desafio.
  - Testes:
    - [ ] conclusão grava status e score
    - [ ] reexecução com novo score atualiza corretamente
    - [ ] usuário não pode concluir desafio inexistente
- [ ] Criar endpoint de progresso do usuário.
  - Testes:
    - [ ] retorna contagem de conteúdos concluídos
    - [ ] retorna dados de evolução por área/nível

### 6. Implementar chat com histórico

- [x] Criar modelo de sala de chat e participantes.
  - Testes:
    - [x] sala criada com participantes válidos
    - [x] usuário não participante não vê sala
- [x] Implementar envio de mensagens.
  - Testes:
    - [x] mensagem salva com `sentAt`
    - [x] `isRead` inicial é falso
    - [x] mensagem inválida é rejeitada
- [x] Implementar listagem de mensagens e status de leitura.
  - Testes:
    - [x] mensagens aparecem em ordem cronológica
    - [x] marcar como lida atualiza `isRead`
    - [x] edição atualiza `editedAt`

### 7. Revisão e melhoria final

- [ ] Revisar todo o código implementado.
  - Testes:
    - [ ] verificar que todos os testes existentes passam
    - [ ] validar cobertura dos cenários principais
    - [ ] confirmar que não há endpoints acessíveis indevidamente
- [ ] Ajustar documentação interna das rotas e modelos.
  - Verificar se endpoints e fluxos estão descritos com clareza.
- [ ] Realizar commit final e preparar para próxima sprint.
  - Garantir que cada etapa foi revisada e assinada.

## Observação

Cada item deve ser concluído sequencialmente. Marque a caixa somente após a implementação funcionar e os testes passarem. Em caso de dúvida, revise a alteração antes de prosseguir para a próxima feature.
