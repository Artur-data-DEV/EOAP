# Now Create Adherence Assessment - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Now Create Adherence Assessment |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect, CTA |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Em Análise** |
| Classificação | Confidencial — Documento de Avaliação Corporativa |

> **Propósito**: Avaliar aderência do projeto EOAP à metodologia oficial Now Create da ServiceNow. Identificar entregáveis existentes, incompletos e ausentes.

---

## 1. Now Create Framework Overview

Now Create é a metodologia oficial da ServiceNow para implementação de soluções, estruturada em 7 fases:

| Fase | Objetivo Principal | Duração Típica |
| --- | --- | --- |
| 01-Initiate | Definir escopo, stakeholders, objetivos de negócio | 2-4 semanas |
| 02-Plan | Planejamento detalhado, roadmap, recursos | 2-4 semanas |
| 03-Design | Design arquitetural, técnico, de dados e de integração | 4-8 semanas |
| 04-Build | Desenvolvimento, configuração, customização | 8-16 semanas |
| 05-Validate | Testes, UAT, validação de requisitos | 4-8 semanas |
| 06-Deploy | Implantação em produção, cutover, go-live | 2-4 semanas |
| 07-Operate | Operação contínua, suporte, melhoria contínua | Ongoing |

---

## 2. Now Create Deliverables Matrix

### 2.1 Phase 01 - Initiate

| Now Create Deliverable | Status | Documento Atual | Gap | Prioridade |
| --- | --- | --- | --- | --- |
| Project Charter | **Missing** | - | Documento completo com objetivos, escopo, stakeholders, KPIs | Critical |
| Stakeholder Analysis | **Missing** | - | Identificação completa de stakeholders, RACI, comunicação | Critical |
| Business Case | **Missing** | - | Business case completo com ROI, benefícios, custos | Critical |
| Requirements Gathering | **Missing** | - | Requisitos funcionais e não-funcionais documentados | Critical |
| Vision Statement | **Partial** | ARB.md (executive summary) | Vision statement separado e detalhado | High |
| Success Criteria | **Partial** | NFRs.md (parcial) | Success criteria completos por fase | High |
| Risk Register | **Missing** | - | Registro de riscos completo com mitigação | High |
| Assumptions & Constraints | **Missing** | - | Assunções e restrições documentadas | High |

**Status Summary**: 1 Partial, 6 Missing

---

### 2.2 Phase 02 - Plan

| Now Create Deliverable | Status | Documento Atual | Gap | Prioridade |
| --- | --- | --- | --- | --- |
| Project Plan | **Missing** | - | Plano de projeto detalhado com WBS, milestones, recursos | Critical |
| Work Breakdown Structure (WBS) | **Missing** | - | WBS detalhado do projeto | Critical |
| Resource Plan | **Missing** | - | Plano de recursos com papéis, alocação, custos | Critical |
| Schedule/Gantt Chart | **Missing** | - | Cronograma detalhado com dependências | Critical |
| Communication Plan | **Missing** | - | Plano de comunicação com stakeholders | High |
| Training Plan | **Missing** | - | Plano de treinamento por role | High |
| Change Management Plan | **Missing** | - | Plano de gestão de mudança | High |
| Quality Plan | **Partial** | Test_Strategy.md, ATF_Strategy.md | Plano de qualidade completo | High |
| Budget & Cost Plan | **Missing** | - | Plano de orçamento e custos | High |

**Status Summary**: 1 Partial, 9 Missing

---

### 2.3 Phase 03 - Design

| Now Create Deliverable | Status | Documento Atual | Gap | Prioridade |
| --- | --- | --- | --- | --- |
| Architecture Design Document | **Complete** | ADD.md, ARB.md, ARB_REVIEW.md | - | - |
| Solution Design Document | **Complete** | SDD.md | - | - |
| Data Model Design | **Complete** | SDD.md (tabelas, campos, índices) | - | - |
| Integration Design | **Partial** | SDD.md (parcial), EOAP_REST_API_Spec.md | Design de integração completo com IAM, HRIS, SIEM | High |
| Security Design | **Complete** | Security_Model.md, STRIDE analysis | - | - |
| UI/UX Design | **Missing** | - | Wireframes, mockups, design system | Medium |
| Process Design | **Partial** | Flows documentados | Process design completo com BPMN | High |
| Reporting Design | **Partial** | Dashboards documentados | Reporting design completo com requisitos | High |
| Technical Specifications | **Complete** | SDD.md (Script Includes, Decision Tables) | - | - |
| ADR Catalog | **Complete** | ADRs (20 ADRs documentados) | - | - |

**Status Summary**: 6 Complete, 3 Partial, 1 Missing

---

### 2.4 Phase 04 - Build

| Now Create Deliverable | Status | Documento Atual | Gap | Prioridade |
| --- | --- | --- | --- | --- |
| Application Scope | **Complete** | Installation_Guide.md (Step 1) | - | - |
| Tables & Fields | **Complete** | SDD.md, Installation_Guide.md (Step 2) | - | - |
| Roles & Groups | **Complete** | Installation_Guide.md (Step 3) | - | - |
| ACLs | **Complete** | Installation_Guide.md (Step 4) | - | - |
| Business Rules | **Partial** | SDD.md (parcial) | Business rules completos documentados | High |
| Script Includes | **Complete** | SDD.md (Script Includes documentados) | - | - |
| Decision Tables | **Complete** | Configuration_Guide.md, DT_Access_Approval_Routing.md | - | - |
| Flows | **Complete** | Configuration_Guide.md, EOAP_Flow_Employee_Onboarding.md | - | - |
| Subflows | **Partial** | Flows documentados | Subflows completos documentados | High |
| Notifications | **Partial** | Configuration_Guide.md (parcial) | Notifications completas documentadas | High |
| Catalog Items | **Partial** | Configuration_Guide.md (parcial) | Catalog items completos documentados | High |
| Record Producers | **Missing** | - | Record producers documentados | High |
| Service Portal Pages | **Missing** | - | Service portal pages documentadas | Medium |
| Integration Hub Spokes | **Missing** | - | Integration Hub spokes documentados | High |
| REST Messages | **Partial** | EOAP_REST_API_Spec.md | REST messages completos documentados | High |
| Import Sets | **Partial** | SDD.md (staging tables) | Import sets completos documentados | High |
| Transform Maps | **Missing** | - | Transform maps documentadas | High |
| Scheduled Jobs | **Missing** | - | Scheduled jobs documentados | High |
| System Properties | **Missing** | - | System properties documentadas | Medium |

**Status Summary**: 5 Complete, 8 Partial, 5 Missing

---

### 2.5 Phase 05 - Validate

| Now Create Deliverable | Status | Documento Atual | Gap | Prioridade |
| --- | --- | --- | --- | --- |
| Test Strategy | **Complete** | Test_Strategy.md | - | - |
| ATF Strategy | **Complete** | ATF_Strategy.md | - | - |
| Unit Test Plan | **Missing** | - | Unit test plan detalhado | High |
| Integration Test Plan | **Partial** | Test_Strategy.md (parcial) | Integration test plan detalhado | High |
| System Test Plan | **Partial** | Test_Strategy.md (parcial) | System test plan detalhado | High |
| UAT Plan | **Missing** | - | UAT plan detalhado com scripts | Critical |
| Security Test Plan | **Partial** | ATF_Strategy.md (Security Negative) | Security test plan detalhado | High |
| Performance Test Plan | **Missing** | - | Performance test plan detalhado | High |
| Test Cases | **Partial** | ATF_Strategy.md (testes documentados) | Test cases completos documentados | High |
| Test Data Strategy | **Missing** | - | Test data strategy documentada | High |
| Defect Management Plan | **Missing** | - | Defect management plan documentado | High |
| Test Results | **Partial** | ATF Results (parcial) | Test results completos documentados | High |

**Status Summary**: 2 Complete, 8 Partial, 4 Missing

---

### 2.6 Phase 06 - Deploy

| Now Create Deliverable | Status | Documento Atual | Gap | Prioridade |
| --- | --- | --- | --- | --- |
| Deployment Strategy | **Missing** | - | Deployment strategy documentada | Critical |
| Deployment Checklist | **Missing** | - | Deployment checklist detalhado | Critical |
| Cutover Plan | **Missing** | - | Cutover plan detalhado | Critical |
| Rollback Plan | **Partial** | Installation_Guide.md (rollback por etapa) | Rollback plan completo por fase | Critical |
| Go-Live Checklist | **Missing** | - | Go-live checklist detalhado | Critical |
| Go-Live Validation | **Missing** | - | Go-live validation plan detalhado | Critical |
| Hypercare Plan | **Missing** | - | Hypercare plan detalhado | Critical |
| Post-Go-Live Validation | **Missing** | - | Post-go-live validation plan detalhado | Critical |
| Data Migration Plan | **Missing** | - | Data migration plan (se aplicável) | Medium |
| Environment Strategy | **Missing** | - | Environment strategy (DEV, TEST, PROD) | High |
| Release Notes | **Missing** | - | Release notes documentadas | High |

**Status Summary**: 1 Partial, 10 Missing

---

### 2.7 Phase 07 - Operate

| Now Create Deliverable | Status | Documento Atual | Gap | Prioridade |
| --- | --- | --- | --- | --- |
| Support Model | **Complete** | Support_Model.md | - | - |
| Runbook | **Complete** | Runbook.md | - | - |
| Monitoring Strategy | **Complete** | Monitoring.md | - | - |
| Incident Management Plan | **Partial** | Runbook.md (parcial) | Incident management plan detalhado | High |
| Problem Management Plan | **Missing** | - | Problem management plan detalhado | High |
| Change Management Plan | **Missing** | - | Change management plan detalhado | High |
| Knowledge Management Plan | **Missing** | - | Knowledge management plan detalhado | High |
| SLA/OLA Definitions | **Partial** | Support_Model.md (SLAs) | SLA/OLA definitions completas | High |
| KPI Dashboard | **Partial** | Dashboards documentados | KPI dashboard completo | High |
| Continuous Improvement Plan | **Missing** | - | Continuous improvement plan detalhado | High |
| Backup & Recovery Plan | **Missing** | - | Backup & recovery plan detalhado | High |
| Disaster Recovery Plan | **Partial** | NFRs.md (RPO/RTO) | Disaster recovery plan completo | High |

**Status Summary**: 3 Complete, 5 Partial, 5 Missing

---

## 3. Overall Adherence Summary

### 3.1 Status by Phase

| Fase | Complete | Partial | Missing | Total | Adherence |
| --- | --- | --- | --- | --- | --- |
| 01-Initiate | 0 | 1 | 6 | 7 | 14% |
| 02-Plan | 0 | 1 | 9 | 10 | 10% |
| 03-Design | 6 | 3 | 1 | 10 | 60% |
| 04-Build | 5 | 8 | 5 | 18 | 28% |
| 05-Validate | 2 | 8 | 4 | 14 | 14% |
| 06-Deploy | 0 | 1 | 10 | 11 | 9% |
| 07-Operate | 3 | 5 | 5 | 13 | 23% |
| **Total** | **16** | **27** | **40** | **83** | **19%** |

### 3.2 Critical Gaps

| Gap | Fase | Impact | Prioridade |
| --- | --- | --- | --- |
| Project Charter | 01-Initiate | Sem escopo definido, stakeholders não identificados | Critical |
| Business Case | 01-Initiate | Sem justificativa de negócio, ROI não calculado | Critical |
| Requirements Gathering | 01-Initiate | Requisitos não documentados formalmente | Critical |
| Project Plan | 02-Plan | Sem cronograma, recursos, WBS | Critical |
| UAT Plan | 05-Validate | Sem plano de UAT, scripts não documentados | Critical |
| Deployment Strategy | 06-Deploy | Sem estratégia de implantação | Critical |
| Cutover Plan | 06-Deploy | Sem plano de cutover | Critical |
| Go-Live Checklist | 06-Deploy | Sem checklist de go-live | Critical |
| Go-Live Validation | 06-Deploy | Sem validação de go-live | Critical |
| Hypercare Plan | 06-Deploy | Sem plano de hypercare | Critical |

### 3.3 Strengths

| Strength | Fase | Documento |
| --- | --- | --- |
| Architecture Design | 03-Design | ADD.md, ARB.md, ARB_REVIEW.md |
| Solution Design | 03-Design | SDD.md |
| ADR Catalog | 03-Design | 20 ADRs documentados |
| Security Design | 03-Design | Security_Model.md, STRIDE |
| Test Strategy | 05-Validate | Test_Strategy.md, ATF_Strategy.md |
| Support Model | 07-Operate | Support_Model.md |
| Runbook | 07-Operate | Runbook.md |
| Monitoring Strategy | 07-Operate | Monitoring.md |

---

## 4. Recommendations

### 4.1 Immediate Actions (Critical)

1. **Criar Project Charter** (01-Initiate)
   - Definir escopo, objetivos, stakeholders
   - Documentar KPIs e success criteria
   - Criar RACI matrix

2. **Criar Business Case** (01-Initiate)
   - Calcular ROI
   - Documentar benefícios e custos
   - Criar análise de custo-benefício

3. **Criar Project Plan** (02-Plan)
   - Criar WBS detalhado
   - Cronograma com milestones
   - Plano de recursos

4. **Criar UAT Plan** (05-Validate)
   - Scripts de UAT
   - Critérios de aceitação
   - Plano de execução

5. **Criar Deployment Strategy** (06-Deploy)
   - Estratégia de implantação
   - Environment strategy
   - Release notes

6. **Criar Cutover Plan** (06-Deploy)
   - Plano detalhado de cutover
   - Rollback procedures
   - Communication plan

### 4.2 Short-term Actions (High Priority)

1. **Criar Requirements Gathering** (01-Initiate)
2. **Criar Risk Register** (01-Initiate)
3. **Criar Communication Plan** (02-Plan)
4. **Criar Training Plan** (02-Plan)
5. **Criar Change Management Plan** (02-Plan)
6. **Completar Integration Design** (03-Design)
7. **Completar Business Rules** (04-Build)
8. **Completar Subflows** (04-Build)
9. **Completar Notifications** (04-Build)
10. **Criar Integration Hub Spokes** (04-Build)

### 4.3 Medium-term Actions (Medium Priority)

1. **Criar UI/UX Design** (03-Design)
2. **Criar Service Portal Pages** (04-Build)
3. **Criar Unit Test Plan** (05-Validate)
4. **Criar Performance Test Plan** (05-Validate)
5. **Criar Test Data Strategy** (05-Validate)
6. **Criar Defect Management Plan** (05-Validate)
7. **Criar Data Migration Plan** (06-Deploy)
8. **Criar Problem Management Plan** (07-Operate)
9. **Criar Knowledge Management Plan** (07-Operate)
10. **Criar Disaster Recovery Plan** (07-Operate)

---

## 5. Next Steps

1. **Reorganizar estrutura de diretórios** por fases Now Create
2. **Criar documentos críticos ausentes** (Project Charter, Business Case, Project Plan, UAT Plan, Deployment Strategy, Cutover Plan)
3. **Criar plano de implementação completo** por fase
4. **Gerar backlog executável** (Epics, Features, User Stories)
5. **Criar roadmap de construção** (Sprints)
6. **Criar Build Guide detalhado**
7. **Criar estratégia de testes completa**
8. **Criar plano de implantação**
9. **Criar modelo operacional**
10. **Criar Architecture Review Board Package**

---

*Now Create Adherence Assessment - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Em Análise*
*Aderência Atual: 19%*
