# EOAP Documentation

**Enterprise Operations Automation Platform**  
Official Template for ServiceNow Scoped Applications with Agentic Orchestration

**Single Source of Truth**: This repository (Git + `src/fluent/` code)

## Navigation

### Core Methodology
- [Now Create](./now_create/README.md) — Full project lifecycle (Strategy → Deploy)
  - 01-Strategy
  - 02-Plan (Backlog + Stories)
  - 03-Execution (Artifacts + Sprint Planning)
  - 04-Build
  - 05-Deploy

### Technical
- [Architecture](./architecture/README.md) — ADRs, standards, diagrams
- [Developer Guide](./developer/README.md) — Setup, Fluent SDK, Git workflow, standards
- [Implementation](./implementation/README.md) — MVP guide and step-by-step

### Supporting Areas
- [Agentic System](./agentic/README.md) — Multi-agent orchestration (the unique part of this template)
- [Governance](./governance/README.md)
- [Testing](./testing/README.md)
- [Operations](./operations/README.md)
- [Evidence](./evidence/README.md)

## Quick Links for Common Tasks

- **I want to develop**: Start with `developer/setup.md` and `developer/fluent-guide.md`
- **I want to understand the architecture**: `architecture/ADRs/`
- **I want the implementation specs**: `now_create/03-Execution/artifacts/`
- **I want to use the agents**: `agentic/README.md` + `npm run agent:orchestrate`
- **I want the backlog/stories**: `now_create/02-Plan/`

This structure is intentionally clean and Now Create aligned. Legacy scattered folders have been consolidated.
