# Arquitetura

Esta seção concentra todas as decisões técnicas, padrões e artefatos arquiteturais do EOAP.

## Conteúdo

- **ADRs** — Architectural Decision Records (todos os ADRs do projeto)
- **Diagrams** — Diagramas de arquitetura, fluxos e integrações
- **Standards** — Padrões obrigatórios de nomenclatura, desenvolvimento e governança

## ADRs

Os ADRs são a memória arquitetural do projeto. Todo desenvolvedor (ou agente) deve consultá-los antes de tomar decisões significativas.

Local: [ADRs/](./ADRs/)

Principais ADRs atuais:
- ADR-001: CMDB como espinha dorsal
- ADR-002: Decision Tables antes de scripts
- ADR-003: Scoped Application `x_eoap`

## Padrões (Standards)

Consulte [standards/](./standards/) para:
- Nomenclatura rigorosa (`x_eoap_*` / `EOAP_*`)
- OOB First policy
- Deny-by-Default
- Estrutura de pastas obrigatória
- Regras de uso do Fluent SDK

## Diagramas

Pasta `diagrams/` — Use Mermaid, Draw.io ou imagens versionadas. Sempre referencie o ADR ou Story que motivou o diagrama.

## Relação com Agentic Development

O Supervisor Agent e o Validator Agent validam todas as propostas contra os ADRs e standards desta seção.
