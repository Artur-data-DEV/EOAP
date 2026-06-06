# EOAP Enterprise Documentation

| Atributo | Valor |
| --- | --- |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documentação Corporativa |

> **Propósito**: Documentação corporativa da EOAP organizada em hierarquia corporativa padrão. Todos os documentos seguem padrão enterprise ServiceNow e foram aprovados pelo Architecture Review Board (ARB).

---

## Estrutura de Diretórios

```
/docs
├── README.md (este arquivo)
├── architecture/
│   ├── README.md
│   ├── ARB.md (Architecture Review Board)
│   ├── ADD.md (Architecture Design Document)
│   ├── SDD.md (Solution Design Document)
│   ├── ARB_REVIEW.md (Enterprise Architectural Review)
│   └── ADRs/
│       ├── README.md
│       ├── ADR-001.md a ADR-020.md
├── implementation/
│   ├── README.md
│   ├── Implementation_Guide.md
│   ├── Installation_Guide.md
│   └── Configuration_Guide.md
├── operations/
│   ├── README.md
│   ├── Runbook.md
│   ├── Monitoring.md
│   └── Support_Model.md
├── testing/
│   ├── README.md
│   ├── Test_Strategy.md
│   └── ATF_Strategy.md
├── governance/
│   ├── README.md
│   ├── Security_Model.md
│   ├── Compliance.md
│   └── Audit_Model.md
└── archive/
    └── (documentos históricos e duplicados)
```

---

## Índice de Documentos

### Architecture (`/docs/architecture`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [ARB.md](architecture/ARB.md) | Architecture Review Board - Resumo executivo, arquitetura, componentes, ADRs | Executivos, ARB, Portfolio |
| [ADD.md](architecture/ADD.md) | Architecture Design Document - Decisões arquiteturais, NFRs, arquitetura lógica | Arquitetos, Desenvolvedores |
| [SDD.md](architecture/SDD.md) | Solution Design Document - Design detalhado de componentes | Desenvolvedores, Implementadores |
| [ARB_REVIEW.md](architecture/ARB_REVIEW.md) | Enterprise Architectural Review - Revisão completa 8 dimensões | ARB, Arquitetos Enterprise |
| [ADRs/](architecture/ADRs/) | Architectural Decision Records - 20 ADRs aprovados | Arquitetos, Desenvolvedores |

### Implementation (`/docs/implementation`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [Implementation_Guide.md](implementation/Implementation_Guide.md) | Guia de implementação completo - 10 passos detalhados | Implementadores, PMs |
| [Installation_Guide.md](implementation/Installation_Guide.md) | Guia de instalação - Application scope, tabelas, roles, ACLs | Administradores ServiceNow |
| [Configuration_Guide.md](implementation/Configuration_Guide.md) | Guia de configuração - Decision Tables, Flows, Integrações | Implementadores, Administradores |

### Operations (`/docs/operations`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [Runbook.md](operations/Runbook.md) | Runbook operacional - Incidentes, DLQ, reconciliação, offboarding | Operations, L1/L2/L3 |
| [Monitoring.md](operations/Monitoring.md) | Estratégia de monitoramento - SLOs, dashboards, alerting | Operations, SRE |
| [Support_Model.md](operations/Support_Model.md) | Modelo de suporte - SLAs, escalation, RACI | Support, L1/L2/L3 |

### Testing (`/docs/testing`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [Test_Strategy.md](testing/Test_Strategy.md) | Estratégia de teste - Tipos, abordagem, cobertura | QA, Desenvolvedores |
| [ATF_Strategy.md](testing/ATF_Strategy.md) | Estratégia ATF - 6 suites, 43 testes automatizados | QA, Desenvolvedores |

### Governance (`/docs/governance`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [Security_Model.md](governance/Security_Model.md) | Modelo de segurança - RBAC, ACL, SoD, STRIDE | Security, Compliance |
| [Compliance.md](governance/Compliance.md) | Modelo de compliance - SOX, ISO 27001, LGPD | Compliance, Legal |
| [Audit_Model.md](governance/Audit_Model.md) | Modelo de auditoria - Audit trail, logging, procedimentos | Auditores, Compliance |

---

## ADRs (Architectural Decision Records)

| ADR | Decisão | Status |
| --- | --- | --- |
| [ADR-001](architecture/ADRs/ADR-001.md) | CMDB como espinha dorsal | Accepted |
| [ADR-002](architecture/ADRs/ADR-002.md) | Decision Tables antes de scripts | Accepted |
| [ADR-003](architecture/ADRs/ADR-003.md) | Scoped Application `x_eoap` | Accepted |
| [ADR-004](architecture/ADRs/ADR-004.md) | Flow Designer como orquestração primária | Accepted |
| [ADR-005](architecture/ADRs/ADR-005.md) | Catalog como entrada humana | Accepted |
| [ADR-006](architecture/ADRs/ADR-006.md) | Audit Trail write-only | Accepted |
| [ADR-007](architecture/ADRs/ADR-007.md) | RBAC segregado por persona | Accepted |
| [ADR-008](architecture/ADRs/ADR-008.md) | Classificação e criticidade em Business Application | Accepted |
| [ADR-009](architecture/ADRs/ADR-009.md) | Access Owner distinto de owned_by | Accepted |
| [ADR-010](architecture/ADRs/ADR-010.md) | Risk Engine em três camadas | Accepted |
| [ADR-011](architecture/ADRs/ADR-011.md) | User Access Registry | Accepted |
| [ADR-012](architecture/ADRs/ADR-012.md) | Arquitetura híbrida Sync/Async | Accepted |
| [ADR-013](architecture/ADRs/ADR-013.md) | Logging padronizado | Accepted |
| [ADR-014](architecture/ADRs/ADR-014.md) | Exceções de acesso formais | Accepted |
| [ADR-015](architecture/ADRs/ADR-015.md) | CMDB Quality como pré-requisito | Accepted |
| [ADR-016](architecture/ADRs/ADR-016.md) | Retenção e archiving | Accepted |
| [ADR-017](architecture/ADRs/ADR-017.md) | Cross-Scope Access Policy | Accepted |
| [ADR-018](architecture/ADRs/ADR-018.md) | Indexing Strategy | Accepted |
| [ADR-019](architecture/ADRs/ADR-019.md) | Avaliação OOB antes de customização | Accepted |
| [ADR-020](architecture/ADRs/ADR-020.md) | Staging tables para integração | Accepted |

---

## Padrão de Nomenclatura

### Tabelas Customizadas

| Padrão | Exemplo |
| --- | --- |
| x_eoap_* | x_eoap_user_access, x_eoap_audit_trail |

### Roles

| Padrão | Exemplo |
| --- | --- |
| x_eoap_* | x_eoap_admin, x_eoap_access_owner |

### Decision Tables

| Padrão | Exemplo |
| --- | --- |
| x_eoap_dt_* | x_eoap_dt_access_approval_routing |

### Script Includes

| Padrão | Exemplo |
| --- | --- |
| EOAP_* | EOAP_RiskEngine, EOAP_AuditLogger |

### Flows

| Padrão | Exemplo |
| --- | --- |
| EOAP_Flow_* | EOAP_Flow_Employee_Onboarding |

---

## Gates de Promoção

| Gate | Critério |
| --- | --- |
| DEV → TEST | ATF 100%, ADRs Accepted, code review |
| TEST → PROD | UAT assinado, load test 50% Ano 1, MFA ativo, CSDM ≥ 95% |
| Release | SemVer, back-out plan, DT snapshot Git |

---

## SLOs Operacionais

| SLO | Target |
| --- | --- |
| Offboarding revogação | < 60s |
| Change risk calculation | < 5s |
| Event processing | < 30s |
| Form load time | < 3s |
| CMDB quality | ≥ 95% |
| Event processing success | ≥ 99% |

---

## Compliance

| Regulamento | Status |
| --- | --- |
| SOX | ✅ Compliant |
| ISO 27001 | ✅ Compliant |
| LGPD | ✅ Compliant |

---

## Contato

| Role | Responsabilidade |
| --- | --- |
| Principal ServiceNow Architect | Arquitetura, ADRs, Governança |
| Platform Owners | Aprovação de mudanças, Capacity planning |
| x_eoap_admin | Administração EOAP |
| x_eoap_auditor | Auditoria e Compliance |

---

*EOAP Enterprise Documentation v1.0*
*2026-06-06*
*Aprovado por Architecture Review Board*
