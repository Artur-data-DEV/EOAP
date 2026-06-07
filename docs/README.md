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
├── now_create/
│   ├── README.md
│   ├── 01-Initiate/
│   │   ├── 01-Initiate-Project_Charter-v1.0.md
│   │   ├── 01-Initiate-Business_Case-v1.0.md
│   │   └── 01-Initiate-Requirements_Gathering-v1.0.md
│   ├── 02-Plan/
│   │   ├── Now_Create_Implementation_Plan.md
│   │   ├── Now_Create_Backlog.md
│   │   └── Now_Create_Roadmap.md
│   ├── 03-Design/
│   │   ├── Now_Create_ARB_Package.md
│   │   ├── Now_Create_Adherence_Assessment.md
│   │   └── Now_Create_Structure_Map.md
│   ├── 04-Build/
│   │   └── Now_Create_Build_Guide.md
│   ├── 05-Validate/
│   │   └── Now_Create_Test_Strategy.md
│   ├── 06-Deploy/
│   │   └── Now_Create_Deployment_Plan.md
│   ├── 07-Operate/
│   │   └── Now_Create_Operational_Model.md
│   └── Now_Create_Gap_Analysis.md
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
└── evidence/
    ├── README.md
    ├── ATF/
    ├── Flows/
    ├── DecisionTables/
    ├── Dashboards/
    └── API/
```

---

## Índice de Documentos

### Now Create (`/docs/now_create`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [README.md](now_create/README.md) | Now Create Documentation - Índice e estrutura por fase | Todos |
| [01-Initiate-Project_Charter](now_create/01-Initiate/01-Initiate-Project_Charter-v1.0.md) | Project Charter - Escopo, objetivos, stakeholders, timeline, budget | Executivos, PMs |
| [01-Initiate-Business_Case](now_create/01-Initiate/01-Initiate-Business_Case-v1.0.md) | Business Case - Problema, solução, benefícios, ROI | Executivos, Financeiro |
| [01-Initiate-Requirements_Gathering](now_create/01-Initiate/01-Initiate-Requirements_Gathering-v1.0.md) | Requirements Gathering - Funcionais, não-funcionais, compliance | Arquitetos, Desenvolvedores |
| [Implementation Plan](now_create/02-Plan/Now_Create_Implementation_Plan.md) | Implementation Plan - Plano detalhado por fase (7 fases, 24 semanas) | PMs, Arquitetos |
| [Backlog](now_create/02-Plan/Now_Create_Backlog.md) | Backlog Executável - 6 Epics, 15 Features, 31 User Stories | PMs, Desenvolvedores |
| [Roadmap](now_create/02-Plan/Now_Create_Roadmap.md) | Roadmap de Construção - 6 Sprints, 12 semanas | PMs, Desenvolvedores |
| [ARB Package](now_create/03-Design/Now_Create_ARB_Package.md) | Architecture Review Board Package - ADD, SDD, ADRs, Security | ARB, Arquitetos |
| [Adherence Assessment](now_create/03-Design/Now_Create_Adherence_Assessment.md) | Now Create Adherence Assessment - Matriz de 86 deliverables | PMs, Arquitetos |
| [Structure Map](now_create/03-Design/Now_Create_Structure_Map.md) | Now Create Structure Map - Mapa de reorganização por fase | PMs, Arquitetos |
| [Build Guide](now_create/04-Build/Now_Create_Build_Guide.md) | Build Guide - Guia detalhado por componente (10 componentes) | Desenvolvedores, Administradores |
| [Test Strategy](now_create/05-Validate/Now_Create_Test_Strategy.md) | Test Strategy - 68 test cases, 6 ATF suites, 43 ATF tests | QA, Desenvolvedores |
| [Deployment Plan](now_create/06-Deploy/Now_Create_Deployment_Plan.md) | Deployment Plan - Deployment, cutover, rollback, go-live, hypercare | Release Manager, Operations |
| [Operational Model](now_create/07-Operate/Now_Create_Operational_Model.md) | Operational Model - Support, incident, problem, monitoring, KPIs, SLAs | Operations, SRE |
| [Gap Analysis](now_create/Now_Create_Gap_Analysis.md) | Gap Analysis - 35 gaps identificados, timeline de 22 semanas | PMs, Arquitetos |

### Architecture (`/docs/architecture`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [ARB.md](architecture/ARB.md) | Architecture Review Board - Resumo executivo, arquitetura, componentes, ADRs | Executivos, ARB, Portfolio |
| [ADD.md](architecture/ADD.md) | Architecture Design Document - Decisões arquiteturais, NFRs, arquitetura lógica | Arquitetos, Desenvolvedores |
| [SDD.md](architecture/SDD.md) | Solution Design Document - Design detalhado de componentes | Desenvolvedores, Implementadores |
| [ARB_REVIEW.md](architecture/ARB_REVIEW.md) | Enterprise Architectural Review - Revisão completa 8 dimensões | ARB, Arquitetos Enterprise |
| [NFRs.md](architecture/NFRs.md) | Non-Functional Requirements - Performance, availability, scalability, security | Arquitetos, SRE |
| [ADRs/](architecture/ADRs/) | Architectural Decision Records - 20 ADRs aprovados | Arquitetos, Desenvolvedores |

### Implementation (`/docs/implementation`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [Implementation_Guide.md](implementation/Implementation_Guide.md) | Guia de implementação completo - 10 passos detalhados | Implementadores, PMs |
| [Installation_Guide.md](implementation/Installation_Guide.md) | Guia de instalação - Application scope, tabelas, roles, ACLs (com scripts de validation/rollback) | Administradores ServiceNow |
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

### Evidence (`/docs/evidence`)

| Documento | Descrição | Audiência |
| --- | --- | --- |
| [README.md](evidence/README.md) | Evidence Pack - Índice de evidências de implementação | ARB, Stakeholders |
| [ATF/](evidence/ATF/) | ATF Results - Resultados de testes automatizados | QA, ARB |
| [Flows/](evidence/Flows/) | Flow Documentation - Documentação de flows | Desenvolvedores, ARB |
| [DecisionTables/](evidence/DecisionTables/) | Decision Table Documentation - Documentação de DTs | Desenvolvedores, ARB |
| [Dashboards/](evidence/Dashboards/) | Dashboard Documentation - Documentação de dashboards | Operations, ARB |
| [API/](evidence/API/) | API Specification - Especificação completa da API REST | Integradores, Desenvolvedores |

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

| SLO | Target | Medição | Alert Threshold |
| --- | --- | --- | --- |
| Offboarding revogação | < 60s | 95th percentile | > 90s |
| Change risk calculation | < 5s | 95th percentile | > 7s |
| Event processing | < 30s | 95th percentile | > 45s |
| Form load time | < 3s | 95th percentile | > 4s |
| CMDB quality | ≥ 95% | Daily average | < 90% |
| Event processing success | ≥ 99% | Daily average | < 95% |
| Availability (EOAP Application) | 99.5% uptime | Monthly | < 99% |
| Availability (API REST) | 99.5% uptime | Monthly | < 99% |

---

## NFRs Completos

| Categoria | Target | Documento |
| --- | --- | --- |
| Performance | Offboarding < 60s, Risk < 5s, Events < 30s | [NFRs.md](architecture/NFRs.md) |
| Availability | 99.5% uptime application, 99% uptime integrações | [NFRs.md](architecture/NFRs.md) |
| Scalability | Ano 1: 10K user_access, Ano 3: 50K, Ano 5: 150K | [NFRs.md](architecture/NFRs.md) |
| Security | Failed auth < 10/hour, ACL violations = 0, MFA 100% (admin, risk_analyst) | [NFRs.md](architecture/NFRs.md) |
| Compliance | SOX 100%, ISO 27001 100%, LGPD 100% | [NFRs.md](architecture/NFRs.md) |
| Reliability | Offboarding success ≥ 99%, Event processing success ≥ 99% | [NFRs.md](architecture/NFRs.md) |
| Usability | Form completion < 2 min, Error rate < 5%, CSAT ≥ 4.0/5.0 | [NFRs.md](architecture/NFRs.md) |
| Maintainability | Code coverage ≥ 80%, ATF pass rate 100% | [NFRs.md](architecture/NFRs.md) |
| Interoperability | IAM 99%, HRIS 99%, SIEM 99% | [NFRs.md](architecture/NFRs.md) |

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
