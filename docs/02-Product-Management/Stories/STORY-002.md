# STORY-002 — Criar tabela `x_eoap_audit_trail`

## As a
Admin ServiceNow

## I want
Criar a tabela `x_eoap_audit_trail` com campos e índices

## So that
Temos um log imutável para compliance SOX/ISO 27001

---

## MVP Component
`x_eoap_audit_trail`

## Artefato Relacionado
`03-Execution/Artifacts/tables/x_eoap_audit_trail.md`

## Sprint
1

## Tasks
- [ ] Criar tabela `x_eoap_audit_trail` (standalone) no escopo `x_eoap`
- [ ] Adicionar campos conforme especificação
- [ ] Criar índices: `entity_type`, `entity_sys_id`, `correlation_id`
- [ ] Criar formulário e lista
- [ ] Adicionar ao menu `EOAP`

## Definition of Done
- [ ] Tabela existe no escopo correto
- [ ] Todos os campos criados com tipos e referências válidas
- [ ] Índices configurados
- [ ] Formulário e lista acessíveis
- [ ] Teste: Criar registro manualmente como `x_eoap_admin` com sucesso
