# 01-Initiate - Requirements Gathering v1.0

| Atributo | Valor |
| --- | --- |
| Documento | Requirements Gathering |
| Now Create Phase | 01-Initiate |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Product Owner | Enterprise Architecture Team |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Requisitos Corporativo |

---

## 1. Requirements Overview

### 1.1 Requirements Categories

- **Functional Requirements**: O que o sistema deve fazer
- **Non-Functional Requirements**: Como o sistema deve se comportar
- **Compliance Requirements**: Requisitos de compliance regulatório
- **Integration Requirements**: Requisitos de integração com sistemas externos
- **Security Requirements**: Requisitos de segurança
- **Usability Requirements**: Requisitos de usabilidade

### 1.2 Requirements Prioritization

| Priority | Definition |
| --- | --- |
| **P0 - Critical** | Must-have para go-live |
| **P1 - High** | Should-have para go-live |
| **P2 - Medium** | Nice-to-have, pode ser postergado |
| **P3 - Low** | Futuro, out-of-scope |

---

## 2. Functional Requirements

### 2.1 Employee Lifecycle (P0)

#### FR-001: Onboarding Automation

**Priority**: P0

**Description**: Sistema deve automatizar onboarding de novos funcionários

**Acceptance Criteria**:
- **Given**: Novo funcionário criado em HRIS
- **When**: Event `eoap.employee.created` é recebido
- **Then**:
  - Sistema identifica default access profiles
  - Sistema solicita aprovação do manager (se necessário)
  - Sistema concede access aprovado
  - Sistema publica evento `eoap.access.granted`
  - Sistema loga audit trail
  - Sistema notifica manager

**Dependencies**: HRIS integration, Decision Tables, Flows

---

#### FR-002: Move Automation

**Priority**: P0

**Description**: Sistema deve automatizar mudança de funcionário (departamento, location, role)

**Acceptance Criteria**:
- **Given**: Funcionário mudou em HRIS
- **When**: Event `eoap.employee.moved` é recebido
- **Then**:
  - Sistema identifica access diff (old vs new)
  - Sistema revoga access não mais necessário
  - Sistema concede access novo necessário
  - Sistema mantém access comum
  - Sistema loga audit trail
  - Sistema notifica manager

**Dependencies**: HRIS integration, Decision Tables, Flows

---

#### FR-003: Offboarding Automation

**Priority**: P0

**Description**: Sistema deve automatizar offboarding de funcionários

**Acceptance Criteria**:
- **Given**: Funcionário terminado em HRIS
- **When**: Event `eoap.employee.terminated` é recebido
- **Then**:
  - Sistema identifica todos os acessos ativos
  - Sistema revoga todos os acessos
  - Sistema deprovisiona em IAM
  - Sistema publica evento `eoap.access.revoked`
  - Sistema loga audit trail
  - Sistema notifica manager
  - SLA < 60s

**Dependencies**: HRIS integration, IAM integration, Flows

---

### 2.2 Access Governance (P0)

#### FR-004: Access Request

**Priority**: P0

**Description**: Sistema deve permitir solicitação de acesso via Service Catalog

**Acceptance Criteria**:
- **Given**: Usuário solicita acesso via Service Catalog
- **When**: Request é submetido
- **Then**:
  - Sistema valida request
  - Sistema calcula risco de acesso
  - Sistema roteia para aprovação (se necessário)
  - Sistema concede access aprovado
  - Sistema notifica solicitante
  - Sistema loga audit trail

**Dependencies**: Service Catalog, Decision Tables, Flows

---

#### FR-005: Access Approval

**Priority**: P0

**Description**: Sistema deve suportar workflow de aprovação de acesso

**Acceptance Criteria**:
- **Given**: Access request requer aprovação
- **When**: Request é submetido
- **Then**:
  - Sistema identifica approver (Access Owner)
  - Sistema envia notificação de aprovação
  - Sistema permite aprovação/rejeição
  - Sistema processa aprovação (concede access)
  - Sistema processa rejeição (notifica solicitante)
  - Sistema loga audit trail

**Dependencies**: Service Catalog, Flows, Notifications

---

#### FR-006: Access Exception

**Priority**: P1

**Description**: Sistema deve suportar exceções de acesso formais

**Acceptance Criteria**:
- **Given**: Usuário solicita exceção de acesso
- **When**: Exception request é submetida
- **Then**:
  - Sistema valida justificativa
  - Sistema solicita compensating control
  - Sistema solicita aprovação (nível elevado)
  - Sistema define expiração automática
  - Sistema loga audit trail
  - Sistema agenda review trimestral

**Dependencies**: Service Catalog, Flows, Scheduled Jobs

---

### 2.3 Change Risk (P0)

#### FR-007: Risk Calculation

**Priority**: P0

**Description**: Sistema deve calcular risco de mudança de forma objetiva

**Acceptance Criteria**:
- **Given**: Change request é criado
- **When**: Change é submetido
- **Then**:
  - Sistema consulta CMDB (application, service)
  - Sistema aplica Decision Table de pesos
  - Sistema agrega risk score
  - Sistema aplica Decision Table de banding
  - Sistema armazena risk evidence
  - Sistema exibe risk band na change
  - SLA < 5s

**Dependencies**: CMDB, Decision Tables, Script Includes

---

#### FR-008: Risk Banding

**Priority**: P0

**Description**: Sistema deve bandir risco em Low, Medium, High, Critical, Unknown

**Acceptance Criteria**:
- **Given**: Risk score é calculado
- **When**: Score é 0-100
- **Then**:
  - Score 0-25 → Low
  - Score 26-50 → Medium
  - Score 51-75 → High
  - Score 76-100 → Critical
  - CMDB unavailable → Unknown

**Dependencies**: Decision Tables

---

### 2.4 Audit Trail (P0)

#### FR-009: Audit Logging

**Priority**: P0

**Description**: Sistema deve logar todos os eventos críticos em audit trail

**Acceptance Criteria**:
- **Given**: Event crítico ocorre (access granted, access revoked, risk calculated)
- **When**: Event ocorre
- **Then**:
  - Sistema loga event_type
  - Sistema loga entity_type e entity_sys_id
  - Sistema loga action
  - Sistema loga actor
  - Sistema loga timestamp
  - Sistema loga correlation_id
  - Sistema loga payload_summary
  - Sistema loga payload_details (JSON)
  - Audit trail é append-only
  - Audit trail é imutável

**Dependencies**: Script Includes, ACLs

---

#### FR-010: Audit Retention

**Priority**: P0

**Description**: Sistema deve reter audit trail por 7 anos (SOX)

**Acceptance Criteria**:
- **Given**: Audit trail é criado
- **When**: 7 anos passam
- **Then**:
  - Registro é arquivado
  - Registro permanece acessível
  - Registro não é deletado

**Dependencies**: Scheduled Jobs, Archiving

---

### 2.5 Reconciliation (P0)

#### FR-011: Daily Reconciliation

**Priority**: P0

**Description**: Sistema deve reconciliar access governado vs technical diariamente

**Acceptance Criteria**:
- **Given**: Reconciliation job executa diariamente
- **When**: Job executa
- **Then**:
  - Sistema consulta access governado (x_eoap_user_access)
  - Sistema consulta access technical (IAM)
  - Sistema identifica drift (orphan, missing, mismatch)
  - Sistema popula staging table
  - Sistema notifica Access Owners
  - Sistema gera report

**Dependencies**: IAM integration, Scheduled Jobs

---

#### FR-012: Drift Detection

**Priority**: P0

**Description**: Sistema deve detectar 3 tipos de drift

**Acceptance Criteria**:
- **Given**: Reconciliation executa
- **When**: Drift é identificado
- **Then**:
  - Orphan access: access em governado mas não em IAM
  - Missing access: access em IAM mas não em governado
  - Mismatch: access diferente entre governado e IAM

**Dependencies**: IAM integration, Scheduled Jobs

---

### 2.6 CMDB Quality (P1)

#### FR-013: CMDB Completeness

**Priority**: P1

**Description**: Sistema deve validar completude de CMDB

**Acceptance Criteria**:
- **Given**: CMDB Quality Report executa
- **When**: Report executa
- **Then**:
  - Sistema verifica x_eoap_access_owner preenchido
  - Sistema verifica x_eoap_data_classification preenchido
  - Sistema verifica x_eoap_access_criticality preenchido
  - Sistema calcula completeness rate
  - Sistema alerta se completeness < 95%

**Dependencies**: CMDB, Scheduled Jobs

---

#### FR-014: CMDB Quality Gate

**Priority**: P1

**Description**: Sistema deve bloquear operações críticas se CMDB quality < 95%

**Acceptance Criteria**:
- **Given**: Operação crítica é executada (access request, risk calculation)
- **When**: CMDB quality < 95%
- **Then**:
  - Sistema bloqueia operação
  - Sistema alerta CMDB Manager
  - Sistema sugere correção

**Dependencies**: CMDB, Decision Tables

---

## 3. Non-Functional Requirements

### 3.1 Performance (P0)

#### NFR-001: Offboarding SLA

**Priority**: P0

**Description**: Offboarding deve completar em < 60s

**Metric**: 95th percentile

**Target**: < 60s

**Measurement**: ATF test

---

#### NFR-002: Risk Calculation SLA

**Priority**: P0

**Description**: Risk calculation deve completar em < 5s

**Metric**: 95th percentile

**Target**: < 5s

**Measurement**: ATF test

---

#### NFR-003: Event Processing SLA

**Priority**: P0

**Description**: Event processing deve completar em < 30s

**Metric**: 95th percentile

**Target**: < 30s

**Measurement**: ATF test

---

#### NFR-004: Form Load Time

**Priority**: P1

**Description**: Form load deve completar em < 3s

**Metric**: 95th percentile

**Target**: < 3s

**Measurement**: ATF test

---

### 3.2 Availability (P0)

#### NFR-005: Application Availability

**Priority**: P0

**Description**: EOAP application deve ter 99.5% uptime

**Metric**: Monthly

**Target**: 99.5%

**Measurement**: Monitoring

---

#### NFR-006: API Availability

**Priority**: P0

**Description**: REST API deve ter 99.5% uptime

**Metric**: Monthly

**Target**: 99.5%

**Measurement**: Monitoring

---

#### NFR-007: Integration Availability

**Priority**: P1

**Description**: Integrações (IAM, HRIS, SIEM) devem ter 99% uptime

**Metric**: Monthly

**Target**: 99%

**Measurement**: Monitoring

---

### 3.3 Scalability (P1)

#### NFR-008: Capacity Ano 1

**Priority**: P1

**Description**: Sistema deve suportar 10K user_access Ano 1

**Target**: 10K user_access

**Measurement**: Load test

---

#### NFR-009: Capacity Ano 3

**Priority**: P1

**Description**: Sistema deve suportar 50K user_access Ano 3

**Target**: 50K user_access

**Measurement**: Load test

---

#### NFR-010: Capacity Ano 5

**Priority**: P1

**Description**: Sistema deve suportar 150K user_access Ano 5

**Target**: 150K user_access

**Measurement**: Load test

---

### 3.4 Security (P0)

#### NFR-011: Failed Authentication

**Priority**: P0

**Description**: Failed authentication deve ser < 10/hour

**Metric**: Hourly

**Target**: < 10/hour

**Measurement**: Monitoring

---

#### NFR-012: ACL Violations

**Priority**: P0

**Description**: ACL violations deve ser 0

**Metric**: Hourly

**Target**: 0

**Measurement**: Monitoring

---

#### NFR-013: MFA Compliance

**Priority**: P0

**Description**: MFA deve ser 100% para x_eoap_admin, x_eoap_risk_analyst (PROD)

**Metric**: Daily

**Target**: 100%

**Measurement**: Audit

---

### 3.5 Maintainability (P1)

#### NFR-014: Code Coverage

**Priority**: P1

**Description**: Code coverage deve ser ≥ 80%

**Metric**: Release

**Target**: ≥ 80%

**Measurement**: ATF

---

#### NFR-015: ATF Pass Rate

**Priority**: P0

**Description**: ATF pass rate deve ser 100%

**Metric**: Release

**Target**: 100%

**Measurement**: ATF

---

## 4. Compliance Requirements

### 4.1 SOX (P0)

#### CR-001: Audit Trail Retention

**Priority**: P0

**Description**: Audit trail deve ser retido por 7 anos

**Requirement**: SOX Section 404

**Target**: 7 anos

---

#### CR-002: Audit Trail Immutability

**Priority**: P0

**Description**: Audit trail deve ser imutável (append-only)

**Requirement**: SOX Section 404

**Target**: Imutável

---

#### CR-003: Access Governance

**Priority**: P0

**Description**: Access deve ser governado com aprovação

**Requirement**: SOX Section 404

**Target**: Governado

---

### 4.2 ISO 27001 (P0)

#### CR-004: Access Control

**Priority**: P0

**Description**: Access control deve seguir least privilege

**Requirement**: ISO 27001 A.9

**Target**: Least privilege

---

#### CR-005: Segregation of Duties

**Priority**: P0

**Description**: SoD deve ser enforced

**Requirement**: ISO 27001 A.12

**Target**: SoD enforced

---

### 4.3 LGPD (P0)

#### CR-006: Data Classification

**Priority**: P0

**Description**: Dados devem ser classificados (Public, Internal, Confidential, Restricted)

**Requirement**: LGPD Art. 39

**Target**: Classificados

---

#### CR-007: Data Retention

**Priority**: P0

**Description**: Dados pessoais não devem ser auto-purged

**Requirement**: LGPD Art. 17

**Target**: Sem auto-purge

---

## 5. Integration Requirements

### 5.1 IAM Integration (P0)

#### IR-001: Provision

**Priority**: P0

**Description**: Sistema deve provisionar access em IAM

**Protocol**: REST API

**Authentication**: OAuth 2.0

**SLA**: < 5s

---

#### IR-002: Deprovision

**Priority**: P0

**Description**: Sistema deve deprovision access em IAM

**Protocol**: REST API

**Authentication**: OAuth 2.0

**SLA**: < 5s

---

#### IR-003: Reconciliation

**Priority**: P0

**Description**: Sistema deve reconciliar access com IAM

**Protocol**: REST API

**Authentication**: OAuth 2.0

**Frequency**: Diário

---

### 5.2 HRIS Integration (P0)

#### IR-004: Employee Events

**Priority**: P0

**Description**: Sistema deve receber eventos de employee do HRIS

**Protocol**: Integration Hub

**Events**: created, moved, terminated

**SLA**: < 10s

---

### 5.3 SIEM Integration (P1)

#### IR-005: Security Events

**Priority**: P1

**Description**: Sistema deve publicar eventos de segurança para SIEM

**Protocol**: REST API

**Events**: access granted, access revoked, risk critical

**SLA**: < 5s

---

## 6. Security Requirements

### 6.1 Authentication (P0)

#### SR-001: OAuth 2.0

**Priority**: P0

**Description**: API REST deve usar OAuth 2.0

**Grant Type**: Client Credentials

**Token Lifetime**: 1 hora

**Refresh Token**: 24 horas

---

### 6.2 Authorization (P0)

#### SR-002: RBAC

**Priority**: P0

**Description**: Sistema deve usar RBAC deny-by-default

**Roles**: 7 roles (x_eoap_admin, x_eoap_cmdb_manager, x_eoap_access_owner, x_eoap_change_manager, x_eoap_risk_analyst, x_eoap_auditor, x_eoap_manager)

---

#### SR-003: ACL

**Priority**: P0

**Description**: Sistema deve usar ACL por tabela e operação

**Principle**: Deny-by-default

---

### 6.3 Encryption (P0)

#### SR-004: At Rest

**Priority**: P0

**Description**: Dados em repouso devem ser criptografados

**Algorithm**: AES-256

---

#### SR-005: In Transit

**Priority**: P0

**Description**: Dados em trânsito devem ser criptografados

**Protocol**: TLS 1.2+

---

## 7. Usability Requirements

### 7.1 Form Completion (P1)

#### UR-001: Access Request Form

**Priority**: P1

**Description**: Form de access request deve completar em < 2 min

**Target**: < 2 min

---

### 7.2 Error Rate (P1)

#### UR-002: User Errors

**Priority**: P1

**Description**: Erros de usuário devem ser < 5%

**Target**: < 5%

---

### 7.3 User Satisfaction (P2)

#### UR-003: CSAT

**Priority**: P2

**Description**: CSAT deve ser ≥ 4.0/5.0

**Target**: ≥ 4.0/5.0

---

## 8. Requirements Traceability

### 8.1 Requirements to Design

| Requirement | Design Document | Component |
| --- | --- | --- |
| FR-001 | ADD, SDD | EOAP_Flow_Employee_Onboarding |
| FR-002 | ADD, SDD | EOAP_Flow_Employee_Move |
| FR-003 | ADD, SDD | EOAP_Flow_Employee_Offboarding |
| FR-004 | ADD, SDD | Service Catalog, Flows |
| FR-007 | ADD, SDD | EOAP_RiskEngine, Decision Tables |
| FR-009 | ADD, SDD | EOAP_AuditLogger, x_eoap_audit_trail |
| FR-011 | ADD, SDD | Scheduled Job, IAM integration |

### 8.2 Requirements to Test

| Requirement | Test Suite | Test Case |
| --- | --- | --- |
| FR-001 | EOAP_ATF_Employee_Lifecycle | Onboarding happy path |
| FR-002 | EOAP_ATF_Employee_Lifecycle | Move happy path |
| FR-003 | EOAP_ATF_Employee_Lifecycle | Offboarding happy path |
| FR-007 | EOAP_ATF_Change_Risk | Risk calculation |
| NFR-001 | EOAP_ATF_Employee_Lifecycle | Offboarding SLA |
| NFR-002 | EOAP_ATF_Change_Risk | Risk calculation SLA |

---

## 9. Requirements Approval

### 9.1 Sign-Off

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Product Owner | [Name] | [Signature] | [Date] |
| Process Owner | [Name] | [Signature] | [Date] |
| ServiceNow Architect | [Name] | [Signature] | [Date] |
| Security Team | [Name] | [Signature] | [Date] |
| Compliance Team | [Name] | [Signature] | [Date] |

---

*Requirements Gathering - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 01-Initiate*
*Total Requirements: 40*
*P0: 30, P1: 8, P2: 2*
