# STORY-006 — Criar Business Rules de proteção

## As a
Admin ServiceNow

## I want
Criar 3 Business Rules para proteger registros de exclusão/edição

## So that
Garantimos audit trail imutável e não perdemos dados de acessos

---

## MVP Component
`Business Rules`

## Artefato Relacionado
`03-Execution/Artifacts/business-rules/README.md`

## Sprint
1

## Tasks
- [ ] Criar `BR_EOAP_UserAccess_Delete_Protect`
- [ ] Criar `BR_EOAP_AuditTrail_Protect_Write`
- [ ] Criar `BR_EOAP_AuditTrail_Protect_Delete`
- [ ] Testar as regras

## Definition of Done
- [ ] Todas as BR existem e estão ativas
- [ ] Teste: Tentar deletar `x_eoap_user_access` → abortado
- [ ] Teste: Tentar editar/deletar `x_eoap_audit_trail` → abortado
