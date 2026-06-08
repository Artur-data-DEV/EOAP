# STORY-007 — Criar Script Include `EOAP_AuditLogger`

## As a
Admin ServiceNow

## I want
Criar o Script Include `EOAP_AuditLogger`

## So that
Podemos logar ações de governança de forma centralizada e imutável

---

## MVP Component
`EOAP_AuditLogger`

## Artefato Relacionado
`03-Execution/Artifacts/script-includes/EOAP_AuditLogger.md`

## Sprint
2

## Tasks
- [ ] Criar Script Include `EOAP_AuditLogger` no escopo `x_eoap`
- [ ] Implementar método `log()`
- [ ] Implementar método `generateCorrelationId()`
- [ ] Testar criação de logs via script

## Definition of Done
- [ ] Script Include existe e está ativo
- [ ] Método `log()` cria registros em `x_eoap_audit_trail` com todos os campos
- [ ] Correlation ID é gerado automaticamente
- [ ] Teste: Chamar `log()` via Background Script → sucesso
