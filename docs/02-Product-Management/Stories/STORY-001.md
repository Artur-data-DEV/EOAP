# STORY-001 — Criar tabela `x_eoap_user_access`

## As a
Admin ServiceNow

## I want
Criar a tabela `x_eoap_user_access` com campos e índices

## So that
Temos uma fonte única de verdade para governança de lifecycle de acessos

---

## MVP Component
`x_eoap_user_access`

## Artefato Relacionado
`03-Execution/Artifacts/tables/x_eoap_user_access.md`

## Sprint
1

## Tasks
- [ ] Criar tabela `x_eoap_user_access` (standalone) no escopo `x_eoap`
- [ ] Adicionar campos conforme especificação
- [ ] Criar índices: `user`, `application`, `status`
- [ ] Criar formulário e lista
- [ ] Adicionar ao menu `EOAP`

## Definition of Done
- [ ] Tabela existe no escopo correto
- [ ] Todos os campos criados com tipos e referências válidas
- [ ] Índices configurados
- [ ] Formulário e lista acessíveis
- [ ] Teste: Criar registro manualmente como `x_eoap_admin` com sucesso
