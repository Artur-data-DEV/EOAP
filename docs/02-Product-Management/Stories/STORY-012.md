# STORY-012 — Criar Scheduled Job `EOAP_Job_Reconciliation`

## As a
Admin ServiceNow

## I want
Criar o Scheduled Job `EOAP_Job_Reconciliation`

## So that
Detectamos drift entre acessos na EOAP e sistemas externos (mock para MVP)

---

## MVP Component
`EOAP_Job_Reconciliation`

## Artefato Relacionado
`03-Execution/Artifacts/scheduled-jobs/EOAP_Job_Reconciliation.md`

## Sprint
3

## Tasks
- [ ] Criar Scheduled Job no escopo `x_eoap`
- [ ] Configurar para rodar **diariamente às 02:00**
- [ ] Adicionar script: logar que o job rodou (mock para MVP)
- [ ] Ativar o Job
- [ ] Testar execução manual

## Definition of Done
- [ ] Scheduled Job existe e está ativo
- [ ] Script loga uma entrada em `x_eoap_audit_trail`
- [ ] Teste: Executar manualmente → sucesso
