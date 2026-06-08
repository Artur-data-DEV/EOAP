# EOAP - Documentação

**Enterprise Operations Automation Platform**

Template oficial para projetos ServiceNow Scoped Apps com foco em automação de operações, governança de acessos e orquestração agentic.

**Single Source of Truth**: Git + Fluent SDK (`.now.ts`)

---

## Navegação Rápida

| Área | Descrição | Link |
|------|-----------|------|
| **Now Create** | Metodologia completa (Strategy → Plan → Execution → Build → Deploy) | [now_create/README.md](./now_create/README.md) |
| **Arquitetura** | ADRs, diagramas, padrões e decisões técnicas | [architecture/README.md](./architecture/README.md) |
| **Developer Guide** | Configuração, Fluent SDK, Git workflow e padrões de código | [developer/README.md](./developer/README.md) |
| **Implementação** | Guias práticos, MVP e passo a passo | [implementation/README.md](./implementation/README.md) |
| **Governança** | Compliance, controles, audit e políticas | [governance/README.md](./governance/README.md) |
| **Testes** | Estratégia de testes e qualidade | [testing/README.md](./testing/README.md) |
| **Operações** | Runbooks, manutenção e suporte | [operations/README.md](./operations/README.md) |
| **Evidências** | Resultados para ARB, auditorias e stakeholders | [evidence/README.md](./evidence/README.md) |

---

## Princípios da Documentação

- **Clara e navegável**: Estrutura hierárquica com índices em cada seção.
- **Alinhada ao Now Create**: As pastas `now_create/` seguem as fases oficiais.
- **Código como fonte primária**: A documentação descreve e referencia o que está implementado em `src/fluent/`.
- **Agentic ready**: Prompts e agentes em `prompts/` e `agents/` são parte da documentação viva.
- **Versionada no Git**: Toda alteração de docs deve acompanhar o código quando aplicável.

---

## Status do Projeto

- **Fase atual**: Foundation + início da orquestração agentic
- **Template**: Oficial da organização para novos Scoped Apps
- **Escopo**: `x_eoap`

Para começar a desenvolver, consulte **[Developer Guide → Setup](./developer/setup.md)**.

Para entender as decisões arquiteturais, consulte **[Architecture → ADRs](./architecture/ADRs/)**.
