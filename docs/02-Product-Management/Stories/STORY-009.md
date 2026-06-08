# STORY-009 — Criar Flow `EOAP_Flow_Employee_Offboarding`

## As a
Admin ServiceNow

## I want
Criar o Flow `EOAP_Flow_Employee_Offboarding` no Flow Designer

## So that
Automatizamos a revogação de acessos quando um usuário é desligado (≤ 60s)

---

## MVP Component
`EOAP_Flow_Employee_Offboarding`

## Artefato Relacionado
`03-Execution/Artifacts/flows/EOAP_Flow_Employee_Offboarding.md`

## Sprint
2

## Tasks
- [ ] Criar Flow no Flow Designer, escopo `x_eoap`
- [ ] Configurar trigger: `sys_user.terminated` changes to `true`
- [ ] Adicionar step: `Get Active Accesses` (query `x_eoap_user_access`)
- [ ] Adicionar loop: `For Each Access`
  - [ ] Update status para `revoked`
  - [ ] Set `revoked_on` para agora
  - [ ] Log via `EOAP_AuditLogger`
- [ ] Adicionar step: `Send Notification to Manager`
- [ ] Ativar o Flow
- [ ] Testar com usuário de teste

## Definition of Done
- [ ] Flow existe e está ativo
- [ ] Trigger funciona quando `terminated` é marcado
- [ ] Todos os acessos ativos são revogados
- [ ] Audit trail é criado para cada revogação
- [ ] Notificação é enviada para o manager
- [ ] Tempo total ≤ 60s
