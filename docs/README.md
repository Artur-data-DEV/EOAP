# EOAP — Enterprise Operations Automation Platform (Template Oficial)

| Atributo              | Valor                                      |
|-----------------------|--------------------------------------------|
| **Status**            | EXECUTION PHASE + Agentic Foundation       |
| **Current Sprint**    | 0 (Setup) → 1 (Foundation)                 |
| **Current Goal**      | Estrutura de template + base agentic       |
| **Next Milestone**    | Sprint 1 Concluído + build/deploy limpo    |
| **Tipo**              | Template Oficial da organização            |

## O que é o EOAP

EOAP é uma **aplicação escopada** (`x_eoap`) para automação completa do ciclo de vida de acessos (Onboarding, Move, Offboarding), com CMDB como backbone, audit trail imutável e governança forte.

Este repositório é o **Template Oficial** para todos os novos projetos ServiceNow Scoped Apps da organização.

## Estrutura Obrigatória do Repositório (Template)

- `now.config.json` + `package.json`
- `src/fluent/` (core, access, governance, integrations, automation)
- `src/server/`
- `src/metadata/`
- `docs/` (now_create, architecture/ADRs, developer, implementation, 02-Product-Management, 03-Execution, etc.)
- `prompts/` (system prompts para agentes)
- `agents/` (definições de Supervisor + agentes especializados)
- `templates/`
- `.github/workflows/`

## Visão Agentic

O desenvolvimento e manutenção seguem um modelo multi-agente:

- **Supervisor Agent** orquestra tudo
- **Code Agent**, **Doc Agent**, **Validator Agent**, **VTB Agent**, **KB Agent**, **Report Agent**

A partir de um prompt simples do usuário, o sistema planeja, executa código Fluent, atualiza documentação, sincroniza VTB/KB e gera relatórios — tudo com rastreabilidade total no Git.

## Fluxo Documental

```
01-Architecture (ADRs)
    ↓
02-Product-Management (Backlog → Stories)
    ↓
03-Execution (Sprint Planning → Step-by-Step → Artifacts)
    ↓
04-Quality (Testing)
    ↓
05-Evidence (Resultados)

+ prompts/ e agents/ (orquestração)
+ docs/developer + docs/now_create (template)
```

## Princípios Máximos (inflexíveis)

1. **Git é a única fonte da verdade**
2. **Implementation (Fluent SDK) is the Source of Truth**
3. **Deny-by-Default**
4. **OOB First**
5. **Nomenclatura rigorosa** (`x_eoap_*` / `EOAP_*`)
6. **Híbrido controlado** — manual só quando necessário, sempre documentado e com plano de retorno ao Git

## Como começar

Leia:
- `docs/developer/getting-started.md`
- `docs/developer/agentic-development.md`
- `prompts/supervisor-system.md`
- `agents/README.md`

Para desenvolvimento agentic, forneça o prompt do Supervisor para um LLM forte e delegue as tarefas.

## Fonte Única da Verdade para Implementação

`docs/03-Execution/Step-by-Step/EOAP-MVP-Implementation-Guide.md` (atualize conforme o código evolui).
