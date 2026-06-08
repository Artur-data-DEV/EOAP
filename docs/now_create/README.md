# Now Create — Metodologia EOAP

Esta seção alinha o projeto EOAP à metodologia oficial **Now Create** da ServiceNow.

## Fases

| Fase | Descrição | Conteúdo |
|------|-----------|----------|
| **01-Strategy** | Definição de visão, objetivos, stakeholders e valor | `01-Strategy/` |
| **02-Plan** | Backlog, stories, roadmap, estimativas | `02-Plan/` |
| **03-Execution** | Desenvolvimento, testes, integração | `03-Execution/` |
| **04-Build** | Empacotamento, validação, preparação para deploy | `04-Build/` |
| **05-Deploy** | Implantação, ativação, treinamento, hipercare | `05-Deploy/` |

## Como o EOAP usa Now Create

- **Git + Fluent SDK** substitui grande parte do trabalho manual de "Build" e "Deploy".
- O sistema agentic (Supervisor + Agents) acelera a geração de artefatos de todas as fases.
- A documentação é mantida viva e sincronizada com o código.

## Integração com o Template

Todo novo projeto baseado neste template deve iniciar preenchendo as fases em `now_create/`.

O Supervisor Agent pode ser instruído a gerar o conteúdo inicial de cada fase a partir de um prompt de alto nível do usuário.

## Links úteis

- Developer Guide (para a fase de Execution/Build)
- Architecture (decisões que impactam Strategy e Plan)
- Evidence (resultados para fase de Deploy e governança)
