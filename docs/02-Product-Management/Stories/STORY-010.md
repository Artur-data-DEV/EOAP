# STORY-010 — Criar Flow `EOAP_Flow_Access_Revocation`

## As a
Admin ServiceNow

## I want
Criar o Flow `EOAP_Flow_Access_Revocation`

## So that
Podemos revogar acessos manualmente via Flow

---

## MVP Component
`EOAP_Flow_Access_Revocation`

## Artefato Relacionado
`03-Execution/Artifacts/flows/EOAP_Flow_Access_Revocation.md`

## Sprint
2

## Tasks
- [ ] Criar Flow no Flow Designer, escopo `x_eoap`
- [ ] Configurar trigger: `x_eoap_user_access.status` changes to `revoked`
- [ ] Adicionar step: `Log Audit Trail` via `EOAP_AuditLogger`
- [ ] (Opcional) Adicionar step: `Call IAM Deprovision` (mock)
- [ ] Ativar o Flow
- [ ] Testar com registro de teste

## Definition of Done
- [ ] Flow existe e está ativo
- [ ] Trigger funciona quando status muda para `revoked`
- [ ] Audit trail é criado
