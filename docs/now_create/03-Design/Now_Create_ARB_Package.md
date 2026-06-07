# Now Create Architecture Review Board Package - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Architecture Review Board Package |
| Now Create Phase | 03-Design |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| ServiceNow Architect | Principal ServiceNow Architect, CTA |
| ARB Chair | ARB Chair |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de ARB Corporativo |

---

## 1. ARB Package Overview

### 1.1 Purpose

Este package contém todos os artefatos necessários para submissão ao Architecture Review Board (ARB) para aprovação da arquitetura da solução EOAP.

### 1.2 ARB Objectives

**ARB Objectives**:
- Validar arquitetura técnica
- Validar conformidade com ADRs
- Validar conformidade com CSDM
- Validar conformidade com segurança
- Validar conformidade com compliance
- Validar escalabilidade e performance
- Validar operabilidade

### 1.3 ARB Process

**ARB Process**:
1. **Submission**: ServiceNow Architect submete ARB package
2. **Review**: ARB members review package
3. **Questions**: ARB members submetem questions
4. **Responses**: ServiceNow Architect responde questions
5. **Decision**: ARB toma decisão (Approve, Approve with Conditions, Reject)
6. **Follow-up**: ServiceNow Architect implementa follow-up actions

### 1.4 ARB Timeline

**Timeline**:
- **Submission**: 2026-07-19
- **Review**: 2026-07-19 - 2026-07-26 (1 semana)
- **Questions**: 2026-07-26 - 2026-07-30 (4 dias)
- **Responses**: 2026-07-30 - 2026-08-02 (3 dias)
- **Decision**: 2026-08-02
- **Follow-up**: 2026-08-02 - 2026-08-09 (1 semana)

**Total ARB Duration**: 3 semanas

---

## 2. ARB Submission

### 2.1 Submission Information

**Submitter**: Principal ServiceNow Architect, CTA

**Submission Date**: 2026-07-19

**Project**: EOAP v3.0 — Enterprise Operations Automation Platform

**Phase**: 03-Design

**ARB Review Type**: Full ARB Review

### 2.2 Submission Checklist

**Required Artefatos**:
- [x] Architecture Design Document (ADD)
- [x] Solution Design Document (SDD)
- [x] ADR Catalog
- [x] Security Design Document
- [x] Integration Design Document
- [x] Data Model Design
- [x] Process Design Document
- [x] Reporting Design Document
- [x] Technical Specifications
- [x] ARB Questionnaire Responses

**Optional Artefatos**:
- [x] Proof of Concept (POC) Results
- [x] Performance Test Results
- [x] Security Test Results

---

## 3. Architecture Design Document (ADD)

### 3.1 Executive Summary

**Solution**: EOAP v3.0 — Enterprise Operations Automation Platform

**Objective**: Automatizar employee lifecycle, governar access, calcular risco de mudança, fornecer audit trail completo.

**Architecture Pattern**: Event-Driven Architecture com ServiceNow como plataforma central.

**Key Components**:
- Scoped Application `x_eoap`
- 7 custom tables
- 20 ADRs
- 6 Decision Tables
- 3 Flows
- 4 Subflows
- 5 Script Includes
- 4 REST APIs
- 3 Integration Hub Spokes
- 2 Scheduled Jobs
- 3 Dashboards

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         External Systems                          │
├─────────────────────────────────────────────────────────────────┤
│  HRIS System  │  IAM System  │  SIEM System  │  CMDB (OOB)      │
└───────┬────────┴───────┬──────┴───────┬──────┴───────┬──────────┘
        │                │                │                │
        │ Integration Hub Spokes          │                │
        └────────────────┬───────────────┘                │
                         │                                │
┌────────────────────────┼────────────────────────────────────────┐
│                    ServiceNow Platform                         │
├────────────────────────┼────────────────────────────────────────┤
│                         │                                        │
│  ┌──────────────────────┴──────────────────────┐                │
│  │          Scoped Application x_eoap            │                │
│  ├─────────────────────────────────────────────┤                │
│  │  Tables  │  Decision Tables  │  Flows        │                │
│  │  Script  │  REST APIs        │  Subflows     │                │
│  │  Includes│  OAuth 2.0        │  Scheduled    │                │
│  │          │  Integration Hub  │  Jobs         │                │
│  └─────────────────────────────────────────────┘                │
│                         │                                        │
│  ┌──────────────────────┴──────────────────────┐                │
│  │          OOB ServiceNow Components           │                │
│  ├─────────────────────────────────────────────┤                │
│  │  CMDB  │  Event Management  │  Flow Designer │                │
│  │  ITSM  │  Security Ops     │  Decision Mgmt  │                │
│  └─────────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Architecture Principles

**Principle 1: OOB First**
- Usar funcionalidades OOB sempre que possível
- Customizar apenas quando necessário
- Exemplo: CMDB OOB, Event Management OOB

**Principle 2: Event-Driven Architecture**
- Arquitetura baseada em eventos
- Desacoplamento de sistemas
- Exemplo: HRIS → Integration Hub → EOAP

**Principle 3: CSDM Compliance**
- Conformidade com Common Service Data Model
- Relacionamentos CSDM configurados
- Exemplo: cmdb_ci_business_app, cmdb_ci_service

**Principle 4: Security by Design**
- ACL deny-by-default
- MFA para roles críticos
- Audit trail imutável

**Principle 5: Scalability**
- Escalabilidade para 50K user_access (Ano 3)
- Performance targets definidos
- Exemplo: Offboarding SLA < 60s

### 3.4 Technology Stack

**Platform**: ServiceNow (Utah ou posterior)

**Plugins**:
- Flow Designer
- IntegrationHub
- Event Management
- Decision Tables
- ATF (Automated Test Framework)

**Integrations**:
- IAM (REST API, OAuth 2.0)
- HRIS (REST API, OAuth 2.0)
- SIEM (REST API, OAuth 2.0)

**Languages**:
- JavaScript (Server-side)
- Flow Designer (Low-code)

### 3.5 Architecture Decisions

**Decision 1: Scoped Application vs Global Application**
- **Decision**: Scoped Application `x_eoap`
- **Rationale**: Isolamento, versionamento, governança
- **ADR**: ADR-001: Use Scoped Application

**Decision 2: Event-Driven Architecture vs Polling**
- **Decision**: Event-Driven Architecture
- **Rationale**: Real-time, desacoplamento, escalabilidade
- **ADR**: ADR-002: Use Event-Driven Architecture

**Decision 3: Flow Designer vs Business Rules**
- **Decision**: Flow Designer
- **Rationale**: Low-code, visual, manutenibilidade
- **ADR**: ADR-003: Use Flow Designer for Workflows

**Decision 4: Integration Hub vs REST Messages**
- **Decision**: Integration Hub
- **Rationale**: Standardização, reuso, monitoramento
- **ADR**: ADR-004: Use Integration Hub for Integrations

**Decision 5: Decision Tables vs Script Includes**
- **Decision**: Decision Tables para lógica de negócio
- **Rationale**: Visibilidade, manutenibilidade, não-code
- **ADR**: ADR-005: Use Decision Tables for Business Logic

---

## 4. Solution Design Document (SDD)

### 4.1 Solution Overview

**Solution**: EOAP v3.0 — Enterprise Operations Automation Platform

**Scope**:
- Employee lifecycle automation (onboarding, move, offboarding)
- Access governance (request, approval, provisioning, revocation)
- Change risk assessment (objective scoring, banding)
- Audit trail (complete, immutable, 7-year retention)
- Event-driven architecture (IAM, HRIS, SIEM integration)
- CMDB quality management (completeness, accuracy, freshness)
- Access reconciliation (daily automated)
- Exception management (formal, compensating controls)

### 4.2 Solution Components

**Component 1: Employee Lifecycle Automation**
- **Description**: Automatizar employee lifecycle (onboarding, move, offboarding)
- **Flows**: EOAP_Flow_Employee_Onboarding, EOAP_Flow_Employee_Move, EOAP_Flow_Employee_Offboarding
- **Subflows**: EOAP_Subflow_Grant_Access_Profile, EOAP_Subflow_Revoke_Access_Profile
- **Decision Tables**: x_eoap_dt_lifecycle_actions

**Component 2: Access Governance**
- **Description**: Governar access lifecycle (request, approval, provisioning, revocation)
- **Flows**: EOAP_Flow_Access_Request, EOAP_Flow_Access_Approval
- **Decision Tables**: x_eoap_dt_access_approval_routing, x_eoap_dt_exception_approval_routing
- **REST APIs**: POST /api/x_eoap/v1/access

**Component 3: Change Risk Assessment**
- **Description**: Calcular risco de mudança de forma objetiva
- **Script Includes**: EOAP_RiskEngine
- **Decision Tables**: x_eoap_dt_risk_weights, x_eoap_dt_risk_banding
- **Tables**: x_eoap_risk_evidence

**Component 4: Audit Trail**
- **Description**: Fornecer audit trail completo, imutável, 7-year retention
- **Tables**: x_eoap_audit_trail
- **Script Includes**: EOAP_AuditLogger
- **ACLs**: Append-only, deny-by-default

**Component 5: Event-Driven Architecture**
- **Description**: Integrar com IAM, HRIS, SIEM via eventos
- **Integration Hub Spokes**: IAM, HRIS, SIEM
- **Tables**: x_eoap_event_processing
- **Script Includes**: EOAP_EventProcessor

**Component 6: CMDB Quality Management**
- **Description**: Gerenciar qualidade de CMDB
- **Script Includes**: EOAP_CMDBQualityService
- **Dashboards**: EOAP_CMDB_Quality

**Component 7: Access Reconciliation**
- **Description**: Reconciliar access governado vs technical diariamente
- **Scheduled Jobs**: EOAP_Job_Reconciliation
- **Tables**: x_eoap_staging_access_reconciliation

**Component 8: Exception Management**
- **Description**: Gerenciar exceções de acesso formais
- **Tables**: x_eoap_access_exception
- **Decision Tables**: x_eoap_dt_exception_approval_routing

### 4.3 Solution Architecture

**Solution Architecture**: Event-Driven Architecture com ServiceNow como plataforma central

**Data Flow**:
1. HRIS publica employee event (created, moved, terminated)
2. Integration Hub Spoke HRIS recebe event
3. EOAP_EventProcessor processa event
4. Flow Designer Flow executa (onboarding, move, offboarding)
5. Integration Hub Spoke IAM provision/deprovision access
6. SIEM recebe security event
7. Audit trail é gerado

---

## 5. ADR Catalog

### 5.1 ADR Summary

**Total ADRs**: 20

**ADR Categories**:
- Architecture: 5 ADRs
- Design: 5 ADRs
- Security: 5 ADRs
- Performance: 3 ADRs
- Compliance: 2 ADRs

### 5.2 Key ADRs

**ADR-001: Use Scoped Application**
- **Status**: Accepted
- **Context**: Decidir entre scoped application vs global application
- **Decision**: Scoped Application `x_eoap`
- **Rationale**: Isolamento, versionamento, governança

**ADR-002: Use Event-Driven Architecture**
- **Status**: Accepted
- **Context**: Decidir entre event-driven vs polling
- **Decision**: Event-Driven Architecture
- **Rationale**: Real-time, desacoplamento, escalabilidade

**ADR-003: Use Flow Designer for Workflows**
- **Status**: Accepted
- **Context**: Decidir entre Flow Designer vs Business Rules
- **Decision**: Flow Designer
- **Rationale**: Low-code, visual, manutenibilidade

**ADR-004: Use Integration Hub for Integrations**
- **Status**: Accepted
- **Context**: Decidir entre Integration Hub vs REST Messages
- **Decision**: Integration Hub
- **Rationale**: Standardização, reuso, monitoramento

**ADR-005: Use Decision Tables for Business Logic**
- **Status**: Accepted
- **Context**: Decidir entre Decision Tables vs Script Includes
- **Decision**: Decision Tables
- **Rationale**: Visibilidade, manutenibilidade, não-code

**ADR-006: ACL Deny-by-Default**
- **Status**: Accepted
- **Context**: Configurar ACLs
- **Decision**: ACL deny-by-default
- **Rationale**: Security by design

**ADR-007: MFA for Critical Roles**
- **Status**: Accepted
- **Context**: Configurar autenticação
- **Decision**: MFA para x_eoap_admin, x_eoap_risk_analyst
- **Rationale**: Security by design

**ADR-008: Append-Only Audit Trail**
- **Status**: Accepted
- **Context**: Configurar audit trail
- **Decision**: Append-only audit trail
- **Rationale**: Imutabilidade, compliance

**ADR-009: 7-Year Audit Trail Retention**
- **Status**: Accepted
- **Context**: Configurar retenção de audit trail
- **Decision**: 7-year retention
- **Rationale**: SOX compliance

**ADR-010: CSDM Compliance**
- **Status**: Accepted
- **Context**: Configurar CMDB
- **Decision**: CSDM compliance
- **Rationale**: ServiceNow best practice

---

## 6. Security Design Document

### 6.1 Security Overview

**Security Principles**:
- Security by Design
- Defense in Depth
- Least Privilege
- Zero Trust

### 6.2 Security Controls

**Control 1: Authentication**
- **Control**: OAuth 2.0 com MFA
- **Scope**: x_eoap_admin, x_eoap_risk_analyst
- **Implementation**: ServiceNow OAuth 2.0, MFA

**Control 2: Authorization**
- **Control**: ACL deny-by-default
- **Scope**: Todas as tabelas EOAP
- **Implementation**: ServiceNow ACLs

**Control 3: Encryption**
- **Control**: TLS 1.2+ para trânsito, encryption at-rest para dados
- **Scope**: Todas as comunicações, todas as tabelas
- **Implementation**: ServiceNow encryption

**Control 4: Audit Trail**
- **Control**: Append-only audit trail
- **Scope**: Todos os eventos críticos
- **Implementation**: x_eoap_audit_trail, ACLs

**Control 5: Input Validation**
- **Control**: Sanitização de input
- **Scope**: Todas as APIs, todos os forms
- **Implementation**: ServiceNow input validation

### 6.3 Security Compliance

**SOX Compliance**:
- Audit trail 7-year retention
- Imutabilidade de audit trail
- Segregação de duties

**ISO 27001 Compliance**:
- Security controls implementados
- Security review aprovado
- Penetration test completo

**LGPD Compliance**:
- Data minimization
- Data retention policy
- Data subject rights

---

## 7. Integration Design Document

### 7.1 Integration Overview

**Integration Pattern**: Event-Driven Architecture via Integration Hub

**Integrations**:
- IAM (provision/deprovision)
- HRIS (employee events)
- SIEM (security events)

### 7.2 Integration Details

**Integration 1: IAM**
- **Type**: REST API
- **Authentication**: OAuth 2.0
- **Endpoints**: POST /provision, POST /deprovision, GET /access
- **Spoke**: Integration Hub Spoke IAM
- **Error Handling**: Retry (3 tentativas, exponential backoff), DLQ

**Integration 2: HRIS**
- **Type**: REST API
- **Authentication**: OAuth 2.0
- **Endpoints**: GET /employee/{employee_id}, GET /events
- **Spoke**: Integration Hub Spoke HRIS
- **Error Handling**: Retry (3 tentativas, exponential backoff), DLQ

**Integration 3: SIEM**
- **Type**: REST API
- **Authentication**: OAuth 2.0
- **Endpoints**: POST /events
- **Spoke**: Integration Hub Spoke SIEM
- **Error Handling**: Retry (3 tentativas, exponential backoff), DLQ

---

## 8. Data Model Design

### 8.1 Data Model Overview

**Data Model**: Relational model com 7 custom tables

### 8.2 Data Model Diagram

```
x_eoap_user_access (user, application, access_type, status)
  └─ References: sys_user, cmdb_ci_business_app

x_eoap_access_exception (user, application, exception_type, status)
  └─ References: sys_user, cmdb_ci_business_app

x_eoap_audit_trail (entity_type, entity_sys_id, action, actor, timestamp)
  └─ References: sys_user

x_eoap_event_processing (event_type, event_data, status, correlation_id)
  └─ No references

x_eoap_risk_evidence (change_request, risk_factor, risk_weight, band)
  └─ References: change_request

x_eoap_staging_employee (employee_sys_id, event_type, event_data, processed)
  └─ No references

x_eoap_staging_access_reconciliation (user_sys_id, application_sys_id, drift_type)
  └─ References: sys_user, cmdb_ci_business_app
```

### 8.3 Data Model Relationships

**Relationship 1: x_eoap_user_access → sys_user**
- **Type**: Reference
- **Cardinality**: Many-to-One
- **Purpose**: Associar access a user

**Relationship 2: x_eoap_user_access → cmdb_ci_business_app**
- **Type**: Reference
- **Cardinality**: Many-to-One
- **Purpose**: Associar access a application

**Relationship 3: x_eoap_audit_trail → sys_user**
- **Type**: Reference
- **Cardinality**: Many-to-One
- **Purpose**: Associar audit trail a actor

---

## 9. ARB Questionnaire Responses

### 9.1 Questionnaire Responses

**Q1: Does the solution conform to ServiceNow best practices?**
- **Response**: Yes. A solução usa OOB components (CMDB, Event Management, Flow Designer), segue CSDM, e conforma-se com ADRs aprovados.

**Q2: Does the solution conform to CSDM?**
- **Response**: Yes. A solução usa cmdb_ci_business_app, cmdb_ci_service, e configura relacionamentos CSDM.

**Q3: Does the solution conform to security best practices?**
- **Response**: Yes. A solução implementa ACL deny-by-default, MFA para roles críticos, encryption at-rest e in-transito, e audit trail imutável.

**Q4: Does the solution conform to compliance requirements?**
- **Response**: Yes. A solução implementa audit trail 7-year retention (SOX), security controls (ISO 27001), e data minimization (LGPD).

**Q5: Is the solution scalable?**
- **Response**: Yes. A solução é escalável para 50K user_access (Ano 3), com performance targets definidos (offboarding SLA < 60s).

**Q6: Is the solution operable?**
- **Response**: Yes. A solução inclui operational model completo (support, incident management, problem management, monitoring, KPIs, SLAs).

**Q7: Are all ADRs accepted?**
- **Response**: Yes. Todos os 20 ADRs foram aceitos.

**Q8: Are all integrations tested?**
- **Response**: Yes. Todas as 3 integrações (IAM, HRIS, SIEM) foram testadas.

**Q9: Is the solution documented?**
- **Response**: Yes. A solução inclui ADD, SDD, Security Design, Integration Design, Data Model Design, Process Design, Reporting Design, Technical Specifications.

**Q10: Is the solution ready for ARB approval?**
- **Response**: Yes. A solução está pronta para ARB approval.

---

## 10. ARB Decision

### 10.1 ARB Decision Form

**ARB Decision**: [Pending]

**ARB Decision Date**: [2026-08-02]

**ARB Decision Maker**: [ARB Chair]

**ARB Decision Rationale**: [To be filled]

**ARB Conditions**: [To be filled if Approve with Conditions]

**ARB Follow-up Actions**: [To be filled if Approve with Conditions]

---

## 11. ARB Follow-up

### 11.1 Follow-up Actions

**Action 1**: [To be filled]

**Action 2**: [To be filled]

**Action 3**: [To be filled]

### 11.2 Follow-up Timeline

**Follow-up Timeline**: [To be filled]

---

## 12. ARB Package Summary

### 12.1 Package Contents

**Required Artefatos**:
- [x] Architecture Design Document (ADD)
- [x] Solution Design Document (SDD)
- [x] ADR Catalog
- [x] Security Design Document
- [x] Integration Design Document
- [x] Data Model Design
- [x] Process Design Document
- [x] Reporting Design Document
- [x] Technical Specifications
- [x] ARB Questionnaire Responses

**Optional Artefatos**:
- [x] Proof of Concept (POC) Results
- [x] Performance Test Results
- [x] Security Test Results

### 12.2 ARB Timeline

**Timeline**:
- **Submission**: 2026-07-19
- **Review**: 2026-07-19 - 2026-07-26
- **Questions**: 2026-07-26 - 2026-07-30
- **Responses**: 2026-07-30 - 2026-08-02
- **Decision**: 2026-08-02
- **Follow-up**: 2026-08-02 - 2026-08-09

**Total ARB Duration**: 3 semanas

---

*Architecture Review Board Package - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 03-Design*
*Total ADRs: 20*
*Total Integrations: 3*
*ARB Duration: 3 semanas*
