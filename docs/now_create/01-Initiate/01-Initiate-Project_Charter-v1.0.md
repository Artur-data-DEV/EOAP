# 01-Initiate - Project Charter v1.0

| Atributo | Valor |
| --- | --- |
| Documento | Project Charter |
| Now Create Phase | 01-Initiate |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Sponsor | CIO / CTO |
| Product Owner | Enterprise Architecture Team |
| Process Owner | IT Operations Team |
| ServiceNow Architect | Principal ServiceNow Architect, CTA |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Charter Corporativo |

---

## 1. Executive Summary

### 1.1 Project Overview

**Project Name**: EOAP — Enterprise Operations Automation Platform

**Project Type**: ServiceNow Scoped Application Development

**Project Duration**: 24 semanas (6 meses)

**Total Budget**: $750,000 USD

**Business Priority**: Critical

### 1.2 Problem Statement

A organização enfrenta desafios significativos em governança operacional:

- **Lack of Visibility**: Acessos a aplicações não são rastreáveis ou governados
- **Manual Processes**: Offboarding e reconciliação são manuais e propensos a erros
- **Compliance Risk**: Audit trail incompleto para SOX, ISO 27001, LGPD
- **Change Risk**: Risco de mudança não é calculado objetivamente
- **Operational Overhead**: Processos manuais consomem recursos significativos

### 1.3 Solution Overview

EOAP é uma plataforma de governança operacional sobre ServiceNow que:

- Governa access lifecycle de forma automatizada
- Calcula risco de mudança de forma objetiva
- Fornece audit trail completo e imutável
- Automatiza offboarding e reconciliação
- Integra com IAM, HRIS e SIEM

### 1.4 Business Value

**Quantified Benefits**:
- Redução de 80% em tempo de offboarding (de 4h para 45s)
- Redução de 90% em drift de acesso (reconciliação automática)
- Compliance 100% para SOX, ISO 27001, LGPD
- Redução de 70% em overhead operacional

**ROI**: 300% em 18 meses

---

## 2. Project Scope

### 2.1 In-Scope

**Functional Scope**:
- Employee lifecycle automation (onboarding, move, offboarding)
- Access governance (request, approval, provisioning, revocation)
- Change risk assessment (objective scoring, banding)
- Audit trail (complete, immutable, 7-year retention)
- Event-driven architecture (IAM, HRIS, SIEM integration)
- CMDB quality management (completeness, accuracy, freshness)
- Access reconciliation (daily automated)
- Exception management (formal, compensating controls)

**Technical Scope**:
- Scoped application `x_eoap`
- 7 custom tables
- 20 ADRs
- 6 Decision Tables
- 3 Flows (onboarding, move, offboarding)
- REST API (4 endpoints)
- OAuth 2.0 authentication
- ATF (6 suites, 43 tests)

**Organizational Scope**:
- Enterprise-wide deployment
- 500 colaboradores Ano 1
- 50 aplicações críticas
- 3 integrações (IAM, HRIS, SIEM)

### 2.2 Out-of-Scope

**Functional Out-of-Scope**:
- HRIS como source of record (HRIS é integration, NÃO é um Sistema de Registro/SoR)
- IAM como source of record (IAM é integration, NÃO é um Sistema de Registro/SoR)
- Physical access management
- Network access management
- Cloud access management (AWS, Azure, GCP)
- Data loss prevention (DLP)
- Identity governance beyond access lifecycle

**Technical Out-of-Scope**:
- Mobile app
- Service Portal custom development
- Custom UI/UX (OOB Service Catalog)
- Machine learning models
- Blockchain integration
- Custom middleware

**Organizational Out-of-Scope**:
- External partners
- Customers
- Suppliers

### 2.3 Assumptions

- ServiceNow Utah ou posterior disponível
- Plugins (Flow Designer, IntegrationHub, Event Management, Decision Tables, ATF) instalados
- CMDB existente com qualidade ≥ 80%
- IAM existente (Okta, Azure AD, ou similar)
- HRIS existente (Workday, SAP SuccessFactors, ou similar)
- SIEM existente (Splunk, Sentinel, ou similar)
- Stakeholders disponíveis e engajados
- Budget aprovado

### 2.4 Constraints

**Technical Constraints**:
- Deve ser scoped application `x_eoap`
- OOB First principle
- Máximo 7 custom tables
- Máximo 20 ADRs
- Performance targets (offboarding < 60s, risk < 5s)

**Organizational Constraints**:
- Timeline fixo de 24 semanas
- Budget fixo de $750,000
- Resource constraints (1 ServiceNow Architect, 2 Developers, 1 Admin, 1 Tester)
- Change freeze windows (quartais)

**Compliance Constraints**:
- SOX compliance obrigatório
- ISO 27001 compliance obrigatório
- LGPD compliance obrigatório
- Audit trail 7-year retention

---

## 3. Objectives

### 3.1 Primary Objectives

1. **Governance**: Automatizar governança de acesso com 100% rastreabilidade
2. **Compliance**: Alcançar 100% compliance para SOX, ISO 27001, LGPD
3. **Efficiency**: Reduzir tempo de offboarding em 80% (para < 60s)
4. **Risk**: Implementar cálculo objetivo de risco de mudança
5. **Auditability**: Fornecer audit trail completo e imutável

### 3.2 Secondary Objectives

1. **Visibility**: Fornecer visibilidade 100% de acessos
2. **Automation**: Automatizar reconciliação diária
3. **Integration**: Integrar com IAM, HRIS, SIEM
4. **Quality**: Melhorar qualidade CMDB para ≥ 95%
5. **Support**: Reduzir overhead operacional em 70%

### 3.3 Success Criteria

| Objective | Target | Measurement |
| --- | --- | --- |
| Offboarding Time | < 60s | 95th percentile |
| Risk Calculation | < 5s | 95th percentile |
| Compliance | 100% | Quarterly audit |
| CMDB Quality | ≥ 95% | Daily average |
| Access Drift | < 5% | Daily reconciliation |
| Audit Trail | 100% | All events logged |
| Availability | 99.5% uptime | Monthly |
| ATF Pass Rate | 100% | Release gate |

---

## 4. Stakeholders

### 4.1 Stakeholder Analysis

| Stakeholder | Role | Interest | Influence | Communication Frequency |
| --- | --- | --- | --- | --- |
| CIO | Sponsor | High | High | Weekly |
| CTO | Sponsor | High | High | Weekly |
| Enterprise Architecture Team | Product Owner | High | High | Weekly |
| IT Operations Team | Process Owner | High | High | Weekly |
| Security Team | Reviewer | High | High | Weekly |
| Compliance Team | Reviewer | High | High | Weekly |
| HR Team | Reviewer | Medium | Medium | Monthly |
| IAM Team | Integration Partner | High | High | Weekly |
| HRIS Team | Integration Partner | High | High | Weekly |
| SIEM Team | Integration Partner | High | High | Weekly |
| End Users | Consumer | Medium | Low | Monthly |

### 4.2 RACI Matrix

| Activity | CIO | CTO | Enterprise Architecture | IT Operations | Security | Compliance | HR | IAM | HRIS | SIEM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Project Charter | A | A | R | C | C | C | C | C | C | C |
| Requirements Gathering | C | C | A | R | R | R | C | C | C | C |
| Architecture Design | C | C | A | C | R | R | C | C | C | C |
| Solution Design | C | C | A | R | C | C | C | C | C | C |
| Development | C | C | C | C | C | C | C | C | C | C |
| Testing | C | C | C | R | C | R | C | C | C | C |
| Deployment | A | A | R | A | C | C | C | C | C | C |
| Operations | C | C | C | A | C | C | C | C | C | C |
| Compliance Audit | A | A | C | C | C | A | C | C | C | C |

**Legend**:
- **A**: Accountable (approver)
- **R**: Responsible (doer)
- **C**: Consulted (input)
- **I**: Informed (notification)

---

## 5. Deliverables

### 5.1 Phase 01 - Initiate Deliverables

- Project Charter (este documento)
- Stakeholder Analysis
- Business Case
- Requirements Gathering
- Vision Statement
- Success Criteria
- Risk Register
- Assumptions & Constraints

### 5.2 Phase 02 - Plan Deliverables

- Project Plan
- WBS
- Resource Plan
- Schedule/Gantt Chart
- Communication Plan
- Training Plan
- Change Management Plan
- Quality Plan
- Budget & Cost Plan

### 5.3 Phase 03 - Design Deliverables

- Architecture Design Document (ADD)
- Solution Design Document (SDD)
- Data Model Design
- Integration Design
- Security Design
- UI/UX Design
- Process Design
- Reporting Design
- Technical Specifications
- ADR Catalog

### 5.4 Phase 04 - Build Deliverables

- Application Scope
- Tables & Fields
- Roles & Groups
- ACLs
- Business Rules
- Script Includes
- Decision Tables
- Flows
- Subflows
- Notifications
- Catalog Items
- Record Producers
- Service Portal Pages
- Integration Hub Spokes
- REST Messages
- Import Sets
- Transform Maps
- Scheduled Jobs
- System Properties

### 5.5 Phase 05 - Validate Deliverables

- Test Strategy
- ATF Strategy
- Unit Test Plan
- Integration Test Plan
- System Test Plan
- UAT Plan
- Security Test Plan
- Performance Test Plan
- Test Cases
- Test Data Strategy
- Defect Management Plan
- Test Results

### 5.6 Phase 06 - Deploy Deliverables

- Deployment Strategy
- Deployment Checklist
- Cutover Plan
- Rollback Plan
- Go-Live Checklist
- Go-Live Validation
- Hypercare Plan
- Post-Go-Live Validation
- Data Migration Plan
- Environment Strategy
- Release Notes

### 5.7 Phase 07 - Operate Deliverables

- Support Model
- Runbook
- Monitoring Strategy
- Incident Management Plan
- Problem Management Plan
- Change Management Plan
- Knowledge Management Plan
- SLA/OLA Definitions
- KPI Dashboard
- Continuous Improvement Plan
- Backup & Recovery Plan
- Disaster Recovery Plan

---

## 6. Timeline & Milestones

### 6.1 Overall Timeline

| Phase | Duration | Start Date | End Date |
| --- | --- | --- | --- |
| 01-Initiate | 3 semanas | 2026-06-06 | 2026-06-27 |
| 02-Plan | 3 semanas | 2026-06-28 | 2026-07-18 |
| 03-Design | 6 semanas | 2026-07-19 | 2026-08-30 |
| 04-Build | 8 semanas | 2026-08-31 | 2026-10-26 |
| 05-Validate | 4 semanas | 2026-10-27 | 2026-11-24 |
| 06-Deploy | 2 semanas | 2026-11-25 | 2026-12-08 |
| 07-Operate | Ongoing | 2026-12-09 | Ongoing |

**Total Project Duration**: 24 semanas

### 6.2 Key Milestones

| Milestone | Date | Deliverable |
| --- | --- | --- |
| M1: Charter Approved | 2026-06-13 | Project Charter signed |
| M2: Requirements Complete | 2026-06-27 | Requirements Gathering complete |
| M3: Plan Approved | 2026-07-18 | Project Plan signed |
| M4: Design Approved | 2026-08-30 | ADD, SDD approved by ARB |
| M5: Build Complete | 2026-10-26 | All build deliverables complete |
| M6: UAT Signed | 2026-11-24 | UAT sign-off |
| M7: Go-Live | 2026-12-08 | Production deployment |
| M8: Hypercare Complete | 2027-01-08 | Hypercare period complete |

---

## 7. Budget

### 7.1 Total Budget

| Category | Cost (USD) | Percentage |
| --- | --- | --- |
| Personnel | $450,000 | 60% |
| Software Licenses | $75,000 | 10% |
| Training | $50,000 | 7% |
| Infrastructure | $50,000 | 7% |
| Contingency | $125,000 | 16% |
| **Total** | **$750,000** | **100%** |

### 7.2 Personnel Budget

| Role | FTE | Monthly Cost | Total Cost (24 weeks) |
| --- | --- | --- | --- |
| ServiceNow Architect | 1.0 | $15,000 | $90,000 |
| Technical Lead | 1.0 | $12,000 | $72,000 |
| Developer | 2.0 | $10,000 | $120,000 |
| Admin | 1.0 | $8,000 | $48,000 |
| Tester | 1.0 | $8,000 | $48,000 |
| PM | 0.5 | $12,000 | $36,000 |
| **Total** | **6.5** | - | **$414,000** |

### 7.3 Software Licenses

| License | Cost (USD) |
| --- | --- |
| ServiceNow (additional) | $50,000 |
| Integration Hub | $15,000 |
| Event Management | $10,000 |
| **Total** | **$75,000** |

---

## 8. Risks

### 8.1 Risk Register

| Risk | Probability | Impact | Risk Score | Mitigation Strategy |
| --- | --- | --- | --- | --- |
| CMDB quality < 80% | Medium | High | 15 | CMDB quality improvement initiative |
| IAM integration failure | Medium | High | 15 | Integration Hub, fallback manual |
| HRIS integration failure | Medium | High | 15 | Integration Hub, fallback manual |
| Stakeholder resistance | Low | High | 5 | Change management, training |
| Timeline overrun | Medium | Medium | 10 | Scope management, contingency |
| Budget overrun | Low | Medium | 5 | Contingency fund, scope management |
| Compliance audit failure | Low | Critical | 5 | Early compliance review |
| Performance targets not met | Medium | Medium | 10 | Performance testing, optimization |

**Risk Score Calculation**: Probability × Impact

**Risk Threshold**: Score ≥ 15 requires mitigation plan

---

## 9. Approval

### 9.1 Sign-Off

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Sponsor (CIO) | [Name] | [Signature] | [Date] |
| Sponsor (CTO) | [Name] | [Signature] | [Date] |
| Product Owner | [Name] | [Signature] | [Date] |
| Process Owner | [Name] | [Signature] | [Date] |
| ServiceNow Architect | [Name] | [Signature] | [Date] |

---

*Project Charter - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 01-Initiate*
