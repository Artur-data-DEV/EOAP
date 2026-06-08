# Developer Guide

Guia completo para desenvolvedores que vão trabalhar no EOAP ou em projetos derivados deste template oficial.

## Objetivo

Garantir que qualquer pessoa (ou agente) consiga:

- Configurar o ambiente de desenvolvimento corretamente
- Seguir os padrões de código e nomenclatura do template
- Contribuir de forma consistente usando Fluent SDK + Git
- Manter a documentação e o código sincronizados

## Estrutura desta seção

- [setup.md](./setup.md) — Configuração da PDI + now-sdk + Fluent SDK
- [fluent-guide.md](./fluent-guide.md) — Padrões de uso do Fluent SDK no EOAP
- [git-workflow.md](./git-workflow.md) — Fluxo de branches, commits e PRs
- [standards.md](./standards.md) — Nomenclatura, OOB First, estrutura de pastas e convenções

## Como usar este guia com o sistema agentic

O **Supervisor Agent** e o **Code Agent** seguem rigorosamente o conteúdo destes documentos. Qualquer desvio deve ser justificado e registrado em ADR.

## Requisitos

- Node.js 20+
- npm
- Acesso admin a uma PDI ServiceNow
- Git
- Conhecimento básico de ServiceNow (tabelas, ACLs, Flows)

## Fluxo rápido de início

1. Clone o repositório
2. Siga `setup.md`
3. Leia `standards.md`
4. Execute `npm run build` após qualquer mudança em `src/fluent/`
5. Sempre atualize a documentação relevante quando modificar código

---

**Single Source of Truth**: O código em `src/fluent/**/*.now.ts` + esta documentação.
