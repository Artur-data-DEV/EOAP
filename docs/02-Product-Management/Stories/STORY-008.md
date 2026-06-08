# STORY-008 — Criar Script Include `EOAP_AccessGovernanceService`

## As a
Admin ServiceNow

## I want
Criar o Script Include `EOAP_AccessGovernanceService`

## So that
Centralizamos a lógica de negócio de governança de acessos

---

## MVP Component
`EOAP_AccessGovernanceService`

## Artefato Relacionado
`03-Execution/Artifacts/script-includes/EOAP_AccessGovernanceService.md`

## Sprint
2

## Tasks
- [ ] Criar Script Include `EOAP_AccessGovernanceService` no escopo `x_eoap`
- [ ] Implementar método `getActiveAccesses()`
- [ ] Implementar método `revokeAccess()`
- [ ] Implementar método `validateAccessOwner()`
- [ ] Testar métodos via Background Script

## Definition of Done
- [ ] Script Include existe e está ativo
- [ ] `getActiveAccesses()` retorna lista de acessos ativos do usuário
- [ ] `revokeAccess()` atualiza status para `revoked` e loga a ação
- [ ] Teste: Chamar métodos via Background Script → sucesso
