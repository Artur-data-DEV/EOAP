# STORY-011 — Criar Catalog Item `EOAP Manual Offboarding`

## As a
Manager

## I want
Solicitar offboarding manual via Service Catalog

## So that
Podemos iniciar o fluxo de revogação de acessos sem editar diretamente o usuário

---

## MVP Component
`Catalog Item`

## Artefato Relacionado
`03-Execution/Artifacts/catalog-items/EOAP_Manual_Offboarding.md`

## Sprint
2

## Tasks
- [ ] Criar Catalog Item no escopo `x_eoap`
- [ ] Adicionar variável: `User` (Reference → sys_user, obrigatório)
- [ ] Configurar Process Flow: associar a `EOAP_Flow_Employee_Offboarding`
- [ ] Adicionar ao menu EOAP ou ao Service Catalog
- [ ] Testar solicitação via Catalog

## Definition of Done
- [ ] Catalog Item existe e está publicado
- [ ] Variável `User` está presente e obrigatória
- [ ] Solicitação inicia o Flow corretamente
