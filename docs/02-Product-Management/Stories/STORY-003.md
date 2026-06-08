# STORY-003 — Adicionar campo `x_eoap_access_owner`

## As a
Admin ServiceNow

## I want
Adicionar o campo `x_eoap_access_owner` à `cmdb_ci_business_app`

## So that
Definimos o responsável por governança de acessos em cada Business Application

---

## MVP Component
`x_eoap_access_owner`

## Sprint
1

## Tasks
- [ ] Adicionar campo `x_eoap_access_owner` à tabela `cmdb_ci_business_app`
- [ ] Tipo: `Reference → sys_user`
- [ ] Adicionar ao formulário padrão de Business Application
- [ ] Configurar ACL para permitir `x_eoap_admin` editar

## Definition of Done
- [ ] Campo existe na tabela global
- [ ] Campo é visível no formulário
- [ ] `x_eoap_admin` pode editar, outros não
