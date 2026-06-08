# STORY-005 — Configurar ACLs

## As a
Admin ServiceNow

## I want
Configurar 5 ACLs deny-by-default para as tabelas customizadas

## So that
Protegemos os dados de acessos não autorizados

---

## MVP Component
`ACLs`

## Artefato Relacionado
`03-Execution/Artifacts/acls/README.md`

## Sprint
1

## Tasks
- [ ] Configurar ACLs para `x_eoap_user_access`
- [ ] Configurar ACLs para `x_eoap_audit_trail`
- [ ] Testar acesso com usuários de diferentes roles

## Definition of Done
- [ ] Todas as ACLs aplicadas
- [ ] Teste: Usuário sem role não consegue acessar
- [ ] Teste: `x_eoap_auditor` só lê, não edita
- [ ] Teste: `x_eoap_admin` tem acesso completo
