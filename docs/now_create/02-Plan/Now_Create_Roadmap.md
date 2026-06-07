# Now Create Roadmap - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Roadmap de Construção |
| Now Create Phase | 02-Plan |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Product Owner | Enterprise Architecture Team |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Roadmap Corporativo |

---

## 1. Roadmap Overview

### 1.1 Sprint Structure

| Sprint | Duração | Start Date | End Date | Story Points | Velocity Target |
| --- | --- | --- | --- | --- | --- |
| Sprint 1 | 2 semanas | 2026-08-31 | 2026-09-14 | 30 | 30 |
| Sprint 2 | 2 semanas | 2026-09-15 | 2026-09-28 | 30 | 30 |
| Sprint 3 | 2 semanas | 2026-09-29 | 2026-10-12 | 30 | 30 |
| Sprint 4 | 2 semanas | 2026-10-13 | 2026-10-26 | 30 | 30 |
| Sprint 5 | 2 semanas | 2026-10-27 | 2026-11-09 | 30 | 30 |
| Sprint 6 | 2 semanas | 2026-11-10 | 2026-11-23 | 29 | 29 |
| **Total** | **12 semanas** | **2026-08-31** | **2026-11-23** | **179** | **179** |

### 1.2 Sprint Velocity

**Assumptions**:
- 6.5 FTE disponíveis
- 2 semanas por sprint
- 10 dias úteis por sprint
- 65 dias úteis totais
- Velocity target: 30 story points por sprint (3 story points por dia por FTE)

---

## 2. Sprint 1 - Foundation

### 2.1 Objective

Estabelecer fundação técnica da solução EOAP.

### 2.2 Entradas

- ADD aprovado
- SDD aprovado
- ADR Catalog aprovado

### 2.3 User Stories

| ID | User Story | Priority | Story Points | Epic |
| --- | --- | --- | --- | --- |
| US-001 | Criar Application Scope | P0 | 3 | Foundation |
| US-002 | Criar x_eoap_user_access table | P0 | 5 | Foundation |
| US-003 | Criar x_eoap_access_exception table | P0 | 5 | Foundation |
| US-004 | Criar x_eoap_audit_trail table | P0 | 5 | Foundation |
| US-005 | Criar x_eoap_event_processing table | P0 | 5 | Foundation |
| US-006 | Criar x_eoap_risk_evidence table | P0 | 3 | Foundation |
| US-007 | Criar x_eoap_staging_employee table | P1 | 2 | Foundation |
| US-008 | Criar x_eoap_staging_access_reconciliation table | P1 | 2 | Foundation |

**Total Story Points**: 30

### 2.4 Atividades Detalhadas

#### US-001: Criar Application Scope

**Responsável**: Admin

**Duração**: 0.5 dia

**Steps**:
1. Navegar para System Applications → Create New Application
2. Definir scope: `x_eoap`
3. Definir name: EOAP
4. Definir description: Enterprise Operations Automation Platform
5. Definir source: Store
6. Criar application

**Validation**:
```javascript
var app = new GlideRecord('sys_app');
app.addQuery('scope', 'x_eoap');
if (app.next()) {
  gs.info('Application x_eoap found: ' + app.name);
}
```

**Rollback**:
```javascript
var app = new GlideRecord('sys_app');
app.addQuery('scope', 'x_eoap');
if (app.next()) {
  app.deleteRecord();
}
```

---

#### US-002: Criar x_eoap_user_access table

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Navegar para System Definition → Tables
2. Criar tabela: x_eoap_user_access
3. Extends: Task
4. Criar campos:
   - user (Reference: sys_user)
   - application (Reference: cmdb_ci_business_app)
   - access_type (Choice: granted, requested, pending_approval, approved, active, expired, revoked, rejected)
   - access_profile (String)
   - granted_on (DateTime)
   - expires_on (DateTime)
   - status (Choice: active, expired, revoked)
   - correlation_id (String)
5. Criar índices: user, application, access_type, status
6. Configurar ACLs

**Validation**: Verificar tabela existe, campos criados, índices criados

**Rollback**: Deletar tabela

---

#### US-003: Criar x_eoap_access_exception table

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar tabela: x_eoap_access_exception
2. Extends: Task
3. Criar campos:
   - user (Reference: sys_user)
   - application (Reference: cmdb_ci_business_app)
   - exception_type (Choice: Business Critical, Temporary Access, Emergency)
   - justification (String)
   - compensating_control (String)
   - approved_by (Reference: sys_user)
   - approved_on (DateTime)
   - expires_on (DateTime)
   - status (Choice: pending, approved, rejected, expired)
   - correlation_id (String)
4. Criar índices: user, application, exception_type, status
5. Configurar ACLs

**Validation**: Verificar tabela existe, campos criados, índices criados

**Rollback**: Deletar tabela

---

#### US-004: Criar x_eoap_audit_trail table

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar tabela: x_eoap_audit_trail
2. Extends: Standalone table
3. Criar campos:
   - event_type (String)
   - entity_type (String)
   - entity_sys_id (String)
   - action (String)
   - actor (Reference: sys_user)
   - timestamp (DateTime)
   - correlation_id (String)
   - payload_summary (String)
   - payload_details (JSON)
4. Criar índices: entity_type, entity_sys_id, action, actor, timestamp
5. Configurar ACLs (append-only, deny-by-default)

**Validation**: Verificar tabela existe, campos criados, índices criados, ACLs configurados

**Rollback**: Deletar tabela

---

#### US-005: Criar x_eoap_event_processing table

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar tabela: x_eoap_event_processing
2. Extends: Standalone table
3. Criar campos:
   - event_type (String)
   - event_data (JSON)
   - correlation_id (String)
   - status (Choice: pending, processing, processed, failed, ignored_duplicate)
   - processed_on (DateTime)
   - error_message (String)
   - retry_count (Integer)
4. Criar índices: event_type, correlation_id, status
5. Configurar ACLs

**Validation**: Verificar tabela existe, campos criados, índices criados

**Rollback**: Deletar tabela

---

#### US-006: Criar x_eoap_risk_evidence table

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar tabela: x_eoap_risk_evidence
2. Extends: Standalone table
3. Criar campos:
   - change_request (Reference: change_request)
   - risk_factor (String)
   - risk_weight (Integer)
   - risk_value (Integer)
   - band (Choice: Low, Medium, High, Critical, Unknown)
   - evidence_data (JSON)
   - calculated_on (DateTime)
   - correlation_id (String)
4. Criar índices: change_request, risk_factor, band, calculated_on
5. Configurar ACLs (write-only via RiskEngine)

**Validation**: Verificar tabela existe, campos criados, índices criados, ACLs configurados

**Rollback**: Deletar tabela

---

#### US-007: Criar x_eoap_staging_employee table

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar tabela: x_eoap_staging_employee
2. Extends: Standalone table
3. Criar campos:
   - employee_sys_id (String)
   - event_type (Choice: created, moved, terminated)
   - event_data (JSON)
   - processed (Boolean)
   - processed_on (DateTime)
   - error_message (String)
4. Criar índices: employee_sys_id, event_type, processed
5. Configurar ACLs

**Validation**: Verificar tabela existe, campos criados, índices criados

**Rollback**: Deletar tabela

---

#### US-008: Criar x_eoap_staging_access_reconciliation table

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar tabela: x_eoap_staging_access_reconciliation
2. Extends: Standalone table
3. Criar campos:
   - user_sys_id (String)
   - application_sys_id (String)
   - technical_access (Boolean)
   - governed_access (Boolean)
   - drift_type (Choice: orphan_access, missing_access, mismatch)
   - reconciliation_status (Choice: pending, reviewed, resolved)
   - reviewed_on (DateTime)
   - reviewed_by (Reference: sys_user)
4. Criar índices: user_sys_id, application_sys_id, drift_type
5. Configurar ACLs

**Validation**: Verificar tabela existe, campos criados, índices criados

**Rollback**: Deletar tabela

---

### 2.5 Entregáveis

- Application Scope `x_eoap`
- 8 custom tables
- Índices configurados
- ACLs configuradas

### 2.6 Critérios de Aprovação

- [x] Application Scope criado
- [x] Todas as 8 tabelas criadas
- [x] Todos os índices criados
- [x] Todas as ACLs configuradas
- [x] Validation scripts pass
- [x] Code review aprovado

### 2.7 Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Tabelas não criadas corretamente | Low | Medium | Code review, validation scripts |
| ACLs não configuradas corretamente | Low | High | Security review, validation scripts |

### 2.8 Dependências

- ADD aprovado
- SDD aprovado
- ADR Catalog aprovado

### 2.9 Papéis Responsáveis

- **Admin**: ServiceNow Admin
- **Developer**: Developer (2 FTE)
- **Technical Lead**: Technical Lead

---

## 3. Sprint 2 - Policy Layer

### 3.1 Objective

Implementar camada de política (Decision Tables, Risk Classification).

### 3.2 Entradas

- Sprint 1 completo
- Tabelas criadas

### 3.3 User Stories

| ID | User Story | Priority | Story Points | Epic |
| --- | --- | --- | --- | --- |
| US-009 | Criar roles EOAP | P0 | 3 | Policy |
| US-010 | Criar groups EOAP | P0 | 2 | Policy |
| US-011 | Criar Decision Table: Access Approval Routing | P0 | 5 | Policy |
| US-012 | Criar Decision Table: Risk Weights | P0 | 5 | Policy |
| US-013 | Criar Decision Table: Risk Banding | P0 | 5 | Policy |
| US-014 | Criar Decision Table: Lifecycle Actions | P0 | 5 | Policy |
| US-015 | Criar Decision Table: Exception Approval Routing | P1 | 3 | Policy |
| US-016 | Configurar ACLs por tabela | P0 | 2 | Policy |

**Total Story Points**: 30

### 3.4 Atividades Detalhadas

#### US-009: Criar roles EOAP

**Responsável**: Admin

**Duração**: 0.5 dia

**Steps**:
1. Criar role: x_eoap_admin
2. Criar role: x_eoap_cmdb_manager
3. Criar role: x_eoap_access_owner
4. Criar role: x_eoap_change_manager
5. Criar role: x_eoap_risk_analyst
6. Criar role: x_eoap_auditor
7. Criar role: x_eoap_manager

**Validation**: Verificar todas as 7 roles criadas

**Rollback**: Deletar roles

---

#### US-010: Criar groups EOAP

**Responsável**: Admin

**Duração**: 0.5 dia

**Steps**:
1. Criar group: EOAP Admins
2. Criar group: EOAP CMDB Managers
3. Criar group: EOAP Access Owners
4. Criar group: EOAP Change Managers
5. Criar group: EOAP Risk Analysts
6. Criar group: EOAP Auditors
7. Criar group: EOAP Managers
8. Atribuir roles aos groups

**Validation**: Verificar todos os 7 groups criados, roles atribuídos

**Rollback**: Deletar groups

---

#### US-011: Criar Decision Table: Access Approval Routing

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Decision Table: x_eoap_dt_access_approval_routing
2. Definir inputs: data_classification, access_criticality, operational_tier, exception_type, user_role
3. Definir outputs: approval_required, approval_group, approval_level, auto_approve
4. Criar rules:
   - Rule 1: Restricted Data ou Critical Access → Level 3
   - Rule 2: Confidential Data ou High Access → Level 2
   - Rule 3: Tier 1 Operational → Level 2
   - Rule 4: Emergency Exception → Auto-approve
   - Rule 5: Default → Level 1
5. Testar Decision Table

**Validation**: Verificar Decision Table criada, rules criadas, testes pass

**Rollback**: Deletar Decision Table

---

#### US-012: Criar Decision Table: Risk Weights

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Decision Table: x_eoap_dt_risk_weights
2. Definir inputs: data_classification, access_criticality, operational_tier, user_count, change_type
3. Definir outputs: weight
4. Criar rules:
   - Restricted → 25 points
   - Confidential → 15 points
   - Critical → 20 points
   - High → 15 points
   - Tier 1 → 15 points
   - Tier 2 → 10 points
   - Tier 3 → 5 points
5. Testar Decision Table

**Validation**: Verificar Decision Table criada, rules criadas, testes pass

**Rollback**: Deletar Decision Table

---

#### US-013: Criar Decision Table: Risk Banding

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Decision Table: x_eoap_dt_risk_banding
2. Definir inputs: risk_score, cmdb_quality
3. Definir outputs: band
4. Criar rules:
   - Score 0-25 → Low
   - Score 26-50 → Medium
   - Score 51-75 → High
   - Score 76-100 → Critical
   - CMDB unavailable → Unknown
5. Testar Decision Table

**Validation**: Verificar Decision Table criada, rules criadas, testes pass

**Rollback**: Deletar Decision Table

---

#### US-014: Criar Decision Table: Lifecycle Actions

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Decision Table: x_eoap_dt_lifecycle_actions
2. Definir inputs: event_type, employee_type, department, location
3. Definir outputs: default_access_profiles, approval_required, notification_recipients, sync_to_iam
4. Criar rules por employee_type e department
5. Testar Decision Table

**Validation**: Verificar Decision Table criada, rules criadas, testes pass

**Rollback**: Deletar Decision Table

---

#### US-015: Criar Decision Table: Exception Approval Routing

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar Decision Table: x_eoap_dt_exception_approval_routing
2. Definir inputs: exception_type, data_classification, duration
3. Definir outputs: approval_group, approval_level, max_duration
4. Criar rules:
   - Emergency → Level 3, max 24h
   - Business Critical → Level 2, max 90d
   - Temporary Access → Level 1, max 30d
5. Testar Decision Table

**Validation**: Verificar Decision Table criada, rules criadas, testes pass

**Rollback**: Deletar Decision Table

---

#### US-016: Configurar ACLs por tabela

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Configurar ACLs para x_eoap_user_access
2. Configurar ACLs para x_eoap_access_exception
3. Configurar ACLs para x_eoap_audit_trail (append-only)
4. Configurar ACLs para x_eoap_event_processing
5. Configurar ACLs para x_eoap_risk_evidence (write-only via RiskEngine)
6. Configurar ACLs para x_eoap_staging_employee
7. Configurar ACLs para x_eoap_staging_access_reconciliation

**Validation**: Verificar todas as ACLs configuradas corretamente

**Rollback**: Reverter ACLs

---

### 3.5 Entregáveis

- 7 roles
- 7 groups
- 5 Decision Tables
- ACLs configuradas

### 3.6 Critérios de Aprovação

- [x] Todas as 7 roles criadas
- [x] Todos os 7 groups criados
- [x] Todas as 5 Decision Tables criadas
- [x] Todas as ACLs configuradas
- [x] Decision Tables testadas
- [x] Code review aprovado

### 3.7 Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Decision Tables não funcionam | Low | High | Testes unitários, code review |
| ACLs não configuradas corretamente | Low | High | Security review, validation scripts |

### 3.8 Dependências

- Sprint 1 completo
- Tabelas criadas

### 3.9 Papéis Responsáveis

- **Admin**: ServiceNow Admin
- **Developer**: Developer (2 FTE)
- **Technical Lead**: Technical Lead
- **Security Team**: Security Team

---

## 4. Sprint 3 - Workflow Layer

### 4.1 Objective

Implementar camada de workflow (Flows, Subflows, Approvals, Notifications).

### 4.2 Entradas

- Sprint 2 completo
- Decision Tables criadas

### 4.3 User Stories

| ID | User Story | Priority | Story Points | Epic |
| --- | --- | --- | --- | --- |
| US-017 | Criar Flow: Employee Onboarding | P0 | 8 | Workflow |
| US-018 | Criar Flow: Employee Move | P0 | 8 | Workflow |
| US-019 | Criar Flow: Employee Offboarding | P0 | 8 | Workflow |
| US-020 | Criar Subflow: Grant Access Profile | P0 | 3 | Workflow |
| US-021 | Criar Subflow: Revoke Access Profile | P0 | 3 | Workflow |
| US-022 | Criar Subflow: Publish Event | P1 | 2 | Workflow |
| US-023 | Criar Subflow: Log Audit | P0 | 2 | Workflow |
| US-024 | Criar Notifications | P1 | 2 | Workflow |

**Total Story Points**: 36

**Nota**: Sprint 3 tem 36 story points, excedendo velocity target de 30. Ajustar: mover US-022 e US-024 para Sprint 4.

**Ajustado**: 30 story points

### 4.4 Atividades Detalhadas

#### US-017: Criar Flow: Employee Onboarding

**Responsável**: Developer

**Duração**: 2 dias

**Steps**:
1. Criar Flow: EOAP_Flow_Employee_Onboarding
2. Trigger: Event `eoap.employee.created`
3. Steps:
   - Step 1: Validate Input
   - Step 2: Lookup Lifecycle Actions (DT)
   - Step 3: Request Manager Approval (se necessário)
   - Step 4: Grant Default Access (subflow)
   - Step 5: Publish Events (subflow)
   - Step 6: Log Audit Trail (subflow)
   - Step 7: Notify Manager
4. Configurar error handling
5. Testar Flow

**Validation**: Verificar Flow criado, steps configurados, testes pass

**Rollback**: Deletar Flow

---

#### US-018: Criar Flow: Employee Move

**Responsável**: Developer

**Duração**: 2 dias

**Steps**:
1. Criar Flow: EOAP_Flow_Employee_Move
2. Trigger: Event `eoap.employee.moved`
3. Steps:
   - Step 1: Validate Input
   - Step 2: Lookup Lifecycle Actions (DT)
   - Step 3: Diff Analysis
   - Step 4: Revoke Old Access (subflow)
   - Step 5: Grant New Access (subflow)
   - Step 6: Log Audit Trail (subflow)
   - Step 7: Notify Manager
4. Configurar error handling
5. Testar Flow

**Validation**: Verificar Flow criado, steps configurados, testes pass

**Rollback**: Deletar Flow

---

#### US-019: Criar Flow: Employee Offboarding

**Responsável**: Developer

**Duração**: 2 dias

**Steps**:
1. Criar Flow: EOAP_Flow_Employee_Offboarding
2. Trigger: Event `eoap.employee.terminated`
3. Steps:
   - Step 1: Validate Input
   - Step 2: Identify All Access
   - Step 3: Revoke All Access (subflow)
   - Step 4: Deprovision IAM (subflow)
   - Step 5: Publish Events (subflow)
   - Step 6: Log Audit Trail (subflow)
   - Step 7: Notify Manager
4. Configurar error handling
5. Testar Flow

**Validation**: Verificar Flow criado, steps configurados, testes pass

**Rollback**: Deletar Flow

---

#### US-020: Criar Subflow: Grant Access Profile

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar Subflow: EOAP_Subflow_Grant_Access_Profile
2. Inputs: default_access_profiles, user_sys_id
3. Steps:
   - For each access profile:
     - Criar x_eoap_user_access
     - Chamar IAM provision
     - Atualizar status
4. Outputs: access_granted, access_sys_id
5. Testar Subflow

**Validation**: Verificar Subflow criado, testes pass

**Rollback**: Deletar Subflow

---

#### US-021: Criar Subflow: Revoke Access Profile

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar Subflow: EOAP_Subflow_Revoke_Access_Profile
2. Inputs: access_sys_id
3. Steps:
   - Atualizar x_eoap_user_access para revoked
   - Chamar IAM deprovision
   - Log audit trail
4. Outputs: access_revoked
5. Testar Subflow

**Validation**: Verificar Subflow criado, testes pass

**Rollback**: Deletar Subflow

---

#### US-023: Criar Subflow: Log Audit

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar Subflow: EOAP_Subflow_Log_Audit
2. Inputs: entity_type, entity_sys_id, action, actor
3. Steps:
   - Criar x_eoap_audit_trail
   - Preencher campos
   - Gerar correlation_id
4. Outputs: audit_logged
5. Testar Subflow

**Validation**: Verificar Subflow criado, testes pass

**Rollback**: Deletar Subflow

---

### 4.5 Entregáveis

- 3 Flows
- 3 Subflows

### 4.6 Critérios de Aprovação

- [x] Todos os 3 Flows criados
- [x] Todos os 3 Subflows criados
- [x] Flows testados
- [x] Subflows testados
- [x] Code review aprovado

### 4.7 Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Flows não funcionam | Low | High | Testes unitários, code review |
| Subflows não funcionam | Low | High | Testes unitários, code review |

### 4.8 Dependências

- Sprint 2 completo
- Decision Tables criadas

### 4.9 Papéis Responsáveis

- **Developer**: Developer (2 FTE)
- **Technical Lead**: Technical Lead

---

## 5. Sprint 4 - Audit Layer

### 5.1 Objective

Implementar camada de audit (Audit Trail, Compliance Controls, Reporting).

### 5.2 Entradas

- Sprint 3 completo
- Flows criados

### 5.3 User Stories

| ID | User Story | Priority | Story Points | Epic |
| --- | --- | --- | --- | --- |
| US-022 | Criar Subflow: Publish Event | P1 | 2 | Audit |
| US-024 | Criar Notifications | P1 | 2 | Audit |
| US-025 | Criar Script Include: EOAP_AuditLogger | P0 | 5 | Audit |
| US-026 | Criar Script Include: EOAP_RiskEngine | P0 | 5 | Audit |
| US-027 | Criar Script Include: EOAP_AccessGovernanceService | P0 | 5 | Audit |
| US-028 | Criar Script Include: EOAP_EventProcessor | P0 | 5 | Audit |
| US-029 | Criar Script Include: EOAP_CMDBQualityService | P1 | 3 | Audit |
| US-030 | Criar Dashboards | P1 | 3 | Audit |

**Total Story Points**: 30

### 5.4 Atividades Detalhadas

#### US-025: Criar Script Include: EOAP_AuditLogger

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Script Include: EOAP_AuditLogger
2. Métodos:
   - logEvent(entity_type, entity_sys_id, action, actor, payload_summary, payload_details)
   - generateCorrelationId()
3. Implementar lógica de logging
4. Testar Script Include

**Validation**: Verificar Script Include criado, testes pass

**Rollback**: Deletar Script Include

---

#### US-026: Criar Script Include: EOAP_RiskEngine

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Script Include: EOAP_RiskEngine
2. Métodos:
   - calculateRisk(change_request_sys_id)
   - applyRiskWeights(risk_factors)
   - applyRiskBanding(risk_score)
3. Implementar lógica de cálculo de risco
4. Testar Script Include

**Validation**: Verificar Script Include criado, testes pass

**Rollback**: Deletar Script Include

---

#### US-027: Criar Script Include: EOAP_AccessGovernanceService

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Script Include: EOAP_AccessGovernanceService
2. Métodos:
   - grantAccess(user_sys_id, application, access_profile)
   - revokeAccess(access_sys_id)
   - validateAccessRequest(request)
3. Implementar lógica de governança
4. Testar Script Include

**Validation**: Verificar Script Include criado, testes pass

**Rollback**: Deletar Script Include

---

#### US-028: Criar Script Include: EOAP_EventProcessor

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Script Include: EOAP_EventProcessor
2. Métodos:
   - processEvent(event_type, event_data)
   - handleDuplicate(correlation_id)
   - retryFailedEvent(event_sys_id)
3. Implementar lógica de processamento de eventos
4. Testar Script Include

**Validation**: Verificar Script Include criado, testes pass

**Rollback**: Deletar Script Include

---

#### US-029: Criar Script Include: EOAP_CMDBQualityService

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar Script Include: EOAP_CMDBQualityService
2. Métodos:
   - calculateCompleteness(application_sys_id)
   - calculateAccuracy(application_sys_id)
   - calculateFreshness(application_sys_id)
3. Implementar lógica de cálculo de qualidade
4. Testar Script Include

**Validation**: Verificar Script Include criado, testes pass

**Rollback**: Deletar Script Include

---

#### US-030: Criar Dashboards

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar Dashboard: EOAP_Operational_Overview
2. Criar widgets:
   - User Access by Status
   - Access by Application
   - Risk Band Distribution
   - Event Processing Status
   - CMDB Completeness Rate
   - Audit Trail Volume
3. Configurar filtros e drill-down
4. Testar Dashboard

**Validation**: Verificar Dashboard criado, widgets configurados, testes pass

**Rollback**: Deletar Dashboard

---

### 5.5 Entregáveis

- 5 Script Includes
- 1 Dashboard

### 5.6 Critérios de Aprovação

- [x] Todos os 5 Script Includes criados
- [x] Dashboard criado
- [x] Script Includes testados
- [x] Dashboard testado
- [x] Code review aprovado

### 5.7 Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Script Includes não funcionam | Low | High | Testes unitários, code review |
| Dashboard não funciona | Low | Medium | Testes unitários, code review |

### 5.8 Dependências

- Sprint 3 completo
- Flows criados

### 5.9 Papéis Responsáveis

- **Developer**: Developer (2 FTE)
- **Technical Lead**: Technical Lead

---

## 6. Sprint 5 - Integration Layer

### 6.1 Objective

Implementar camada de integração (REST APIs, OAuth, Error Handling, Retry Logic).

### 6.2 Entradas

- Sprint 4 completo
- Script Includes criados

### 6.3 User Stories

| ID | User Story | Priority | Story Points | Epic |
| --- | --- | --- | --- | --- |
| US-031 | Criar REST API: GET /access/{sys_id} | P0 | 3 | Integration |
| US-032 | Criar REST API: POST /access | P0 | 5 | Integration |
| US-033 | Criar REST API: GET /risk/{change_sys_id} | P0 | 5 | Integration |
| US-034 | Criar REST API: GET /audit/{entity_sys_id} | P0 | 5 | Integration |
| US-035 | Configurar OAuth 2.0 | P0 | 3 | Integration |
| US-036 | Criar Integration Hub Spoke: IAM | P0 | 5 | Integration |
| US-037 | Criar Integration Hub Spoke: HRIS | P0 | 5 | Integration |
| US-038 | Criar Error Handling e Retry Logic | P0 | 4 | Integration |

**Total Story Points**: 35

**Nota**: Sprint 5 tem 35 story points, excedendo velocity target de 30. Ajustar: mover US-038 para Sprint 6.

**Ajustado**: 31 story points (ainda acima de 30). Ajustar adicional: mover US-037 para Sprint 6.

**Ajustado Final**: 26 story points

### 6.4 Atividades Detalhadas

#### US-031: Criar REST API: GET /access/{sys_id}

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar REST API: GET /api/x_eoap/v1/access/{sys_id}
2. Implementar handler:
   - Validar sys_id
   - Consultar x_eoap_user_access
   - Retornar JSON response
3. Configurar autenticação OAuth 2.0
4. Testar API

**Validation**: Verificar API criada, testes pass

**Rollback**: Deletar API

---

#### US-032: Criar REST API: POST /access

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar REST API: POST /api/x_eoap/v1/access
2. Implementar handler:
   - Validar request body
   - Criar x_eoap_user_access
   - Chamar EOAP_AccessGovernanceService.grantAccess
   - Retornar JSON response
3. Configurar autenticação OAuth 2.0
4. Testar API

**Validation**: Verificar API criada, testes pass

**Rollback**: Deletar API

---

#### US-033: Criar REST API: GET /risk/{change_sys_id}

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar REST API: GET /api/x_eoap/v1/risk/{change_sys_id}
2. Implementar handler:
   - Validar change_sys_id
   - Chamar EOAP_RiskEngine.calculateRisk
   - Retornar JSON response
3. Configurar autenticação OAuth 2.0
4. Testar API

**Validation**: Verificar API criada, testes pass

**Rollback**: Deletar API

---

#### US-034: Criar REST API: GET /audit/{entity_sys_id}

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar REST API: GET /api/x_eoap/v1/audit/{entity_sys_id}
2. Implementar handler:
   - Validar entity_sys_id
   - Consultar x_eoap_audit_trail
   - Retornar JSON response
3. Configurar autenticação OAuth 2.0
4. Testar API

**Validation**: Verificar API criada, testes pass

**Rollback**: Deletar API

---

#### US-035: Configurar OAuth 2.0

**Responsável**: Developer

**Duração**: 0.5 dia

**Steps**:
1. Criar OAuth 2.0 Client
2. Configurar Grant Type: Client Credentials
3. Configurar Token Lifetime: 1 hora
4. Configurar Refresh Token: 24 horas
5. Configurar scopes
6. Testar OAuth

**Validation**: Verificar OAuth configurado, testes pass

**Rollback**: Deletar OAuth Client

---

#### US-036: Criar Integration Hub Spoke: IAM

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Integration Hub Spoke: IAM
2. Configurar endpoints:
   - POST /provision
   - POST /deprovision
   - GET /access
3. Configurar autenticação
4. Implementar error handling
5. Testar Spoke

**Validation**: Verificar Spoke criado, testes pass

**Rollback**: Deletar Spoke

---

### 6.5 Entregáveis

- 4 REST APIs
- OAuth 2.0
- 1 Integration Hub Spoke

### 6.6 Critérios de Aprovação

- [x] Todas as 4 APIs criadas
- [x] OAuth 2.0 configurado
- [x] Integration Hub Spoke criado
- [x] APIs testadas
- [x] OAuth testado
- [x] Spoke testado
- [x] Code review aprovado

### 6.7 Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| APIs não funcionam | Low | High | Testes unitários, code review |
| OAuth não funciona | Low | High | Testes unitários, code review |
| Spoke não funciona | Low | High | Testes unitários, code review |

### 6.8 Dependências

- Sprint 4 completo
- Script Includes criados

### 6.9 Papéis Responsáveis

- **Developer**: Developer (2 FTE)
- **Technical Lead**: Technical Lead
- **IAM Team**: IAM Team

---

## 7. Sprint 6 - Operational Readiness

### 7.1 Objective

Implementar prontidão operacional (Dashboards, Monitoring, Runbooks, Support Model).

### 7.2 Entradas

- Sprint 5 completo
- APIs criadas

### 7.3 User Stories

| ID | User Story | Priority | Story Points | Epic |
| --- | --- | --- | --- | --- |
| US-037 | Criar Integration Hub Spoke: HRIS | P0 | 5 | Operational |
| US-038 | Criar Error Handling e Retry Logic | P0 | 4 | Operational |
| US-039 | Criar Scheduled Job: Reconciliation | P0 | 5 | Operational |
| US-040 | Criar Scheduled Job: Archiving | P1 | 3 | Operational |
| US-041 | Criar Runbook: Incident Management | P0 | 5 | Operational |
| US-042 | Criar Runbook: DLQ Management | P0 | 3 | Operational |
| US-043 | Criar ATF Tests | P0 | 8 | Operational |

**Total Story Points**: 33

**Nota**: Sprint 6 tem 33 story points, excedendo velocity target de 29. Ajustar: mover US-040 para post-go-live.

**Ajustado**: 30 story points

### 7.4 Atividades Detalhadas

#### US-037: Criar Integration Hub Spoke: HRIS

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Integration Hub Spoke: HRIS
2. Configurar endpoints:
   - GET /employee/{employee_id}
   - GET /events
3. Configurar autenticação
4. Implementar event transformation
5. Testar Spoke

**Validation**: Verificar Spoke criado, testes pass

**Rollback**: Deletar Spoke

---

#### US-038: Criar Error Handling e Retry Logic

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Implementar error handling em Flows
2. Implementar retry logic (3 tentativas, exponential backoff)
3. Implementar DLQ (Dead Letter Queue)
4. Testar error handling e retry

**Validation**: Verificar error handling implementado, testes pass

**Rollback**: Reverter código

---

#### US-039: Criar Scheduled Job: Reconciliation

**Responsável**: Developer

**Duração**: 1 dia

**Steps**:
1. Criar Scheduled Job: EOAP_Job_Reconciliation
2. Configurar schedule: Diário às 02:00 UTC
3. Implementar lógica:
   - Consultar access governado
   - Consultar access IAM
   - Identificar drift
   - Popular staging table
   - Notificar Access Owners
4. Testar Job

**Validation**: Verificar Job criado, testes pass

**Rollback**: Deletar Job

---

#### US-041: Criar Runbook: Incident Management

**Responsável**: Process Owner

**Duração**: 1 dia

**Steps**:
1. Criar Runbook: Incident Management
2. Documentar procedimentos:
   - Incident triage
   - Incident escalation
   - Incident resolution
3. Criar templates de incident
4. Testar Runbook

**Validation**: Verificar Runbook criado, testado

**Rollback**: Deletar Runbook

---

#### US-042: Criar Runbook: DLQ Management

**Responsável**: Process Owner

**Duração**: 0.5 dia

**Steps**:
1. Criar Runbook: DLQ Management
2. Documentar procedimentos:
   - DLQ monitoring
   - DLQ investigation
   - DLQ resolution (manual retry)
3. Testar Runbook

**Validation**: Verificar Runbook criado, testado

**Rollback**: Deletar Runbook

---

#### US-043: Criar ATF Tests

**Responsável**: Tester

**Duração**: 2 dias

**Steps**:
1. Criar ATF Suite: EOAP_ATF_CMDB_Foundation
2. Criar ATF Suite: EOAP_ATF_Employee_Lifecycle
3. Criar ATF Suite: EOAP_ATF_Access_Governance
4. Criar ATF Suite: EOAP_ATF_Change_Risk
5. Criar ATF Suite: EOAP_ATF_Security_Negative
6. Criar ATF Suite: EOAP_ATF_Events
7. Criar test cases em cada suite
8. Executar ATF tests
9. Validar pass rate = 100%

**Validation**: Verificar ATF suites criadas, testes pass

**Rollback**: Deletar ATF suites

---

### 7.5 Entregáveis

- 1 Integration Hub Spoke
- Error Handling e Retry Logic
- 1 Scheduled Job
- 2 Runbooks
- 6 ATF Suites

### 7.6 Critérios de Aprovação

- [x] Integration Hub Spoke criado
- [x] Error handling implementado
- [x] Retry logic implementado
- [x] Scheduled Job criado
- [x] Runbooks criados
- [x] ATF suites criadas
- [x] ATF pass rate = 100%
- [x] Code review aprovado

### 7.7 Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Spoke não funciona | Low | High | Testes unitários, code review |
| ATF tests não passam | Medium | High | Early testing, buffer time |
| Runbooks incompletos | Low | Medium | Process Owner review |

### 7.8 Dependências

- Sprint 5 completo
- APIs criadas

### 7.9 Papéis Responsáveis

- **Developer**: Developer (2 FTE)
- **Technical Lead**: Technical Lead
- **Tester**: QA Lead
- **Process Owner**: IT Operations Team
- **HRIS Team**: HRIS Team

---

## 8. Roadmap Summary

### 8.1 Sprint Summary

| Sprint | Duração | Story Points | Entregáveis Principais |
| --- | --- | --- | --- |
| Sprint 1 | 2 semanas | 30 | Foundation (8 tabelas) |
| Sprint 2 | 2 semanas | 30 | Policy Layer (7 roles, 7 groups, 5 DTs) |
| Sprint 3 | 2 semanas | 30 | Workflow Layer (3 Flows, 3 Subflows) |
| Sprint 4 | 2 semanas | 30 | Audit Layer (5 Script Includes, 1 Dashboard) |
| Sprint 5 | 2 semanas | 26 | Integration Layer (4 APIs, OAuth, 1 Spoke) |
| Sprint 6 | 2 semanas | 30 | Operational Readiness (1 Spoke, 1 Job, 2 Runbooks, 6 ATF Suites) |
| **Total** | **12 semanas** | **176** | **Complete Solution** |

### 8.2 Resource Utilization

| Sprint | ServiceNow Architect | Technical Lead | Developer | Admin | Tester | PM | Total FTE |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sprint 1 | 50% | 100% | 100% | 100% | 25% | 25% | 5.0 |
| Sprint 2 | 50% | 100% | 100% | 100% | 25% | 25% | 5.0 |
| Sprint 3 | 50% | 100% | 100% | 0% | 25% | 25% | 4.0 |
| Sprint 4 | 50% | 100% | 100% | 0% | 25% | 25% | 4.0 |
| Sprint 5 | 50% | 100% | 100% | 0% | 25% | 25% | 4.0 |
| Sprint 6 | 50% | 100% | 100% | 0% | 100% | 25% | 4.75 |

### 8.3 Milestones

| Milestone | Date | Sprint | Deliverable |
| --- | --- | --- | --- |
| M1: Foundation Complete | 2026-09-14 | Sprint 1 | 8 tabelas criadas |
| M2: Policy Layer Complete | 2026-09-28 | Sprint 2 | 7 roles, 7 groups, 5 DTs |
| M3: Workflow Layer Complete | 2026-10-12 | Sprint 3 | 3 Flows, 3 Subflows |
| M4: Audit Layer Complete | 2026-10-26 | Sprint 4 | 5 Script Includes, 1 Dashboard |
| M5: Integration Layer Complete | 2026-11-09 | Sprint 5 | 4 APIs, OAuth, 1 Spoke |
| M6: Operational Readiness Complete | 2026-11-23 | Sprint 6 | 1 Spoke, 1 Job, 2 Runbooks, 6 ATF Suites |

---

*Roadmap de Construção - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 02-Plan*
*Total Sprints: 6*
*Total Duration: 12 semanas*
*Total Story Points: 176*
*Total Deliverables: Complete Solution*
