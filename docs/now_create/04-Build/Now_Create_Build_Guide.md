# Now Create Build Guide - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Build Guide |
| Now Create Phase | 04-Build |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Technical Lead | Technical Lead |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Build Corporativo |

---

## 1. Build Guide Overview

### 1.1 Purpose

Este guia fornece instruções passo a passo para construir cada componente da solução EOAP.

### 1.2 Build Principles

- **OOB First**: Usar funcionalidades OOB sempre que possível
- **ADR Compliance**: Seguir todos os ADRs aprovados
- **Validation**: Validar cada componente após construção
- **Rollback**: Documentar rollback procedures
- **Code Review**: Code review obrigatório antes de merge

### 1.3 Build Sequence

1. Application Scope
2. Tables & Fields
3. Roles & Groups
4. ACLs
5. Decision Tables
6. Script Includes
7. Flows
8. Subflows
9. Notifications
10. REST APIs
11. Integration Hub Spokes
12. Scheduled Jobs

---

## 2. Component 1: Application Scope

### 2.1 Objetivo

Criar scoped application `x_eoap` para EOAP.

### 2.2 Configuração

**Location**: System Applications → Create New Application

**Steps**:
1. Navegar para System Applications → Create New Application
2. Preencher campos:
   - Name: EOAP
   - ID: x_eoap
   - Description: Enterprise Operations Automation Platform
   - Source: Store
   - Category: Custom Application
3. Clicar em Submit

### 2.3 Tabelas

N/A (serão criadas separadamente)

### 2.4 Campos

N/A (serão criados separadamente)

### 2.5 ACLs

N/A (serão configuradas separadamente)

### 2.6 Roles

N/A (serão criados separadamente)

### 2.7 Flows

N/A (serão criados separadamente)

### 2.8 Decision Tables

N/A (serão criadas separadamente)

### 2.9 Script Includes

N/A (serão criados separadamente)

### 2.10 Testes

**Validation Script**:
```javascript
// Background Scripts
var app = new GlideRecord('sys_app');
app.addQuery('scope', 'x_eoap');
if (app.next()) {
  gs.info('Application x_eoap found: ' + app.name + ', Active: ' + app.active);
} else {
  gs.error('Application x_eoap not found');
}
```

**Expected Output**:
```
Application x_eoap found: EOAP, Active: true
```

### 2.11 Rollback

**Rollback Script**:
```javascript
// Background Scripts
var app = new GlideRecord('sys_app');
app.addQuery('scope', 'x_eoap');
if (app.next()) {
  app.deleteRecord();
  gs.info('Application x_eoap deleted');
}
```

---

## 3. Component 2: x_eoap_user_access Table

### 3.1 Objetivo

Criar tabela de registry de acesso governado.

### 3.2 Configuração

**Location**: System Definition → Tables → New

**Steps**:
1. Navegar para System Definition → Tables → New
2. Preencher campos:
   - Label: User Access
   - Name: x_eoap_user_access
   - Extends: Task
   - Create module: true
3. Clicar em Submit

### 3.3 Tabelas

- Table: x_eoap_user_access
- Extends: Task

### 3.4 Campos

**Field 1: user**
- Type: Reference
- Reference: sys_user
- Label: User
- Mandatory: true

**Field 2: application**
- Type: Reference
- Reference: cmdb_ci_business_app
- Label: Application
- Mandatory: true

**Field 3: access_type**
- Type: Choice
- Label: Access Type
- Choices: granted, requested, pending_approval, approved, active, expired, revoked, rejected
- Default: granted

**Field 4: access_profile**
- Type: String
- Label: Access Profile
- Max length: 100

**Field 5: granted_on**
- Type: DateTime
- Label: Granted On

**Field 6: expires_on**
- Type: DateTime
- Label: Expires On

**Field 7: status**
- Type: Choice
- Label: Status
- Choices: active, expired, revoked
- Default: active

**Field 8: correlation_id**
- Type: String
- Label: Correlation ID
- Max length: 50

### 3.5 ACLs

**Create**: x_eoap_admin, x_eoap_manager

**Read**: x_eoap_admin, x_eoap_manager, x_eoap_access_owner, x_eoap_auditor

**Write**: x_eoap_admin, x_eoap_manager

**Delete**: x_eoap_admin

### 3.6 Roles

N/A (roles são criados separadamente)

### 3.7 Flows

N/A (flows são criados separadamente)

### 3.8 Decision Tables

N/A (Decision Tables são criadas separadamente)

### 3.9 Script Includes

N/A (Script Includes são criados separadamente)

### 3.10 Testes

**Validation Script**:
```javascript
// Background Scripts
var table = new GlideRecord('sys_db_object');
table.addQuery('name', 'x_eoap_user_access');
if (table.next()) {
  gs.info('Table x_eoap_user_access found');
} else {
  gs.error('Table x_eoap_user_access not found');
}

var dict = new GlideRecord('sys_dictionary');
dict.addQuery('name', 'x_eoap_user_access');
dict.addQuery('element_name', 'IN', 'user,application,access_type,status');
dict.query();
var fieldCount = dict.getRowCount();
gs.info('Critical fields count: ' + fieldCount);
if (fieldCount === 4) {
  gs.info('All critical fields present');
} else {
  gs.error('Expected 4 critical fields, found ' + fieldCount);
}
```

**Expected Output**:
```
Table x_eoap_user_access found
Critical fields count: 4
All critical fields present
```

### 3.11 Rollback

**Rollback Script**:
```javascript
// Background Scripts
var table = new GlideRecord('sys_db_object');
table.addQuery('name', 'x_eoap_user_access');
if (table.next()) {
  table.deleteRecord();
  gs.info('Table x_eoap_user_access deleted');
}
```

---

## 4. Component 3: x_eoap_audit_trail Table

### 4.1 Objetivo

Criar tabela de audit trail imutável.

### 4.2 Configuração

**Location**: System Definition → Tables → New

**Steps**:
1. Navegar para System Definition → Tables → New
2. Preencher campos:
   - Label: Audit Trail
   - Name: x_eoap_audit_trail
   - Extends: Standalone table
   - Create module: true
3. Clicar em Submit

### 4.3 Tabelas

- Table: x_eoap_audit_trail
- Extends: Standalone table

### 4.4 Campos

**Field 1: event_type**
- Type: String
- Label: Event Type
- Max length: 100
- Mandatory: true

**Field 2: entity_type**
- Type: String
- Label: Entity Type
- Max length: 100
- Mandatory: true

**Field 3: entity_sys_id**
- Type: String
- Label: Entity Sys ID
- Max length: 32
- Mandatory: true

**Field 4: action**
- Type: String
- Label: Action
- Max length: 100
- Mandatory: true

**Field 5: actor**
- Type: Reference
- Reference: sys_user
- Label: Actor
- Mandatory: true

**Field 6: timestamp**
- Type: DateTime
- Label: Timestamp
- Mandatory: true
- Default: Current time

**Field 7: correlation_id**
- Type: String
- Label: Correlation ID
- Max length: 50
- Mandatory: true

**Field 8: payload_summary**
- Type: String
- Label: Payload Summary
- Max length: 500

**Field 9: payload_details**
- Type: JSON
- Label: Payload Details

### 4.5 ACLs

**Create**: EOAP_AuditLogger (script include only)

**Read**: x_eoap_admin, x_eoap_auditor

**Write**: EOAP_AuditLogger (script include only)

**Delete**: none (append-only)

### 4.6 Roles

N/A (roles são criados separadamente)

### 4.7 Flows

N/A (flows são criados separadamente)

### 4.8 Decision Tables

N/A (Decision Tables são criadas separadamente)

### 4.9 Script Includes

N/A (Script Includes são criados separadamente)

### 4.10 Testes

**Validation Script**:
```javascript
// Background Scripts
var table = new GlideRecord('sys_db_object');
table.addQuery('name', 'x_eoap_audit_trail');
if (table.next()) {
  gs.info('Table x_eoap_audit_trail found');
} else {
  gs.error('Table x_eoap_audit_trail not found');
}

var acl = new GlideRecord('sys_security_acl');
acl.addQuery('name', 'x_eoap_audit_trail');
acl.addQuery('operation', 'delete');
acl.query();
var aclCount = acl.getRowCount();
gs.info('Delete ACLs count: ' + aclCount);
if (aclCount === 0) {
  gs.info('Append-only configured (no delete ACL)');
} else {
  gs.error('Expected 0 delete ACLs, found ' + aclCount);
}
```

**Expected Output**:
```
Table x_eoap_audit_trail found
Delete ACLs count: 0
Append-only configured (no delete ACL)
```

### 4.11 Rollback

**Rollback Script**:
```javascript
// Background Scripts
var table = new GlideRecord('sys_db_object');
table.addQuery('name', 'x_eoap_audit_trail');
if (table.next()) {
  table.deleteRecord();
  gs.info('Table x_eoap_audit_trail deleted');
}
```

---

## 5. Component 4: Roles

### 5.1 Objetivo

Criar roles EOAP com segregação de responsabilidades.

### 5.2 Configuração

**Location**: User Administration → Roles → New

### 5.3 Tabelas

N/A

### 5.4 Campos

N/A

### 5.5 ACLs

N/A (ACLs são configuradas separadamente)

### 5.6 Roles

**Role 1: x_eoap_admin**
- Label: EOAP Admin
- Description: Full administrative access to EOAP

**Role 2: x_eoap_cmdb_manager**
- Label: EOAP CMDB Manager
- Description: Manages CMDB quality and completeness

**Role 3: x_eoap_access_owner**
- Label: EOAP Access Owner
- Description: Approves access requests for applications

**Role 4: x_eoap_change_manager**
- Label: EOAP Change Manager
- Description: Reviews change risk assessments

**Role 5: x_eoap_risk_analyst**
- Label: EOAP Risk Analyst
- Description: Analyzes risk and configures risk weights

**Role 6: x_eoap_auditor**
- Label: EOAP Auditor
- Description: Read-only access to audit trail

**Role 7: x_eoap_manager**
- Label: EOAP Manager
- Description: Operational management of EOAP

### 5.7 Flows

N/A

### 5.8 Decision Tables

N/A

### 5.9 Script Includes

N/A

### 5.10 Testes

**Validation Script**:
```javascript
// Background Scripts
var roles = ['x_eoap_admin', 'x_eoap_cmdb_manager', 'x_eoap_access_owner', 'x_eoap_change_manager', 'x_eoap_risk_analyst', 'x_eoap_auditor', 'x_eoap_manager'];
var role = new GlideRecord('sys_user_role');
for (var i = 0; i < roles.length; i++) {
  role.addQuery('name', roles[i]);
  if (role.next()) {
    gs.info('Role ' + roles[i] + ' found');
  } else {
    gs.error('Role ' + roles[i] + ' not found');
  }
}
```

**Expected Output**:
```
Role x_eoap_admin found
Role x_eoap_cmdb_manager found
Role x_eoap_access_owner found
Role x_eoap_change_manager found
Role x_eoap_risk_analyst found
Role x_eoap_auditor found
Role x_eoap_manager found
```

### 5.11 Rollback

**Rollback Script**:
```javascript
// Background Scripts
var roles = ['x_eoap_admin', 'x_eoap_cmdb_manager', 'x_eoap_access_owner', 'x_eoap_change_manager', 'x_eoap_risk_analyst', 'x_eoap_auditor', 'x_eoap_manager'];
var role = new GlideRecord('sys_user_role');
for (var i = 0; i < roles.length; i++) {
  role.addQuery('name', roles[i]);
  if (role.next()) {
    role.deleteRecord();
    gs.info('Role ' + roles[i] + ' deleted');
  }
}
```

---

## 6. Component 5: Decision Table - Access Approval Routing

### 6.1 Objetivo

Criar Decision Table para roteamento de aprovação de acesso.

### 6.2 Configuração

**Location**: Decision Tables → New

### 6.3 Tabelas

N/A

### 6.4 Campos

**Inputs**:
- data_classification (Choice: Public, Internal, Confidential, Restricted)
- access_criticality (Choice: Low, Medium, High, Critical)
- operational_tier (Choice: Tier 1, Tier 2, Tier 3)
- exception_type (Choice: Business Critical, Temporary Access, Emergency)
- user_role (String)

**Outputs**:
- approval_required (Boolean)
- approval_group (Reference: group)
- approval_level (Choice: Level 1, Level 2, Level 3)
- auto_approve (Boolean)

### 6.5 ACLs

**Read**: x_eoap_admin, x_eoap_risk_analyst

**Write**: x_eoap_admin, x_eoap_risk_analyst

### 6.6 Roles

N/A

### 6.7 Flows

N/A

### 6.8 Decision Tables

- Decision Table: x_eoap_dt_access_approval_routing

### 6.9 Script Includes

N/A

### 6.10 Testes

**Test Case 1**: Restricted Data
- Input: data_classification = Restricted
- Expected: approval_required = true, approval_level = Level 3

**Test Case 2**: Emergency Exception
- Input: exception_type = Emergency
- Expected: approval_required = false, auto_approve = true

**Test Case 3**: Default
- Input: data_classification = Internal, access_criticality = Low
- Expected: approval_required = true, approval_level = Level 1

### 6.11 Rollback

**Rollback**: Deletar Decision Table

---

## 7. Component 6: Script Include - EOAP_AuditLogger

### 7.1 Objetivo

Criar Script Include para logging de audit trail.

### 7.2 Configuração

**Location**: System Definition → Script Includes → New

### 7.3 Tabelas

- x_eoap_audit_trail

### 7.4 Campos

N/A

### 7.5 ACLs

N/A (ACLs são configuradas na tabela)

### 7.6 Roles

N/A

### 7.7 Flows

N/A

### 7.8 Decision Tables

N/A

### 7.9 Script Includes

**Script Include**: EOAP_AuditLogger

**Methods**:
```javascript
var EOAP_AuditLogger = Class.create();
EOAP_AuditLogger.prototype = {
  initialize: function() {},
  
  logEvent: function(entity_type, entity_sys_id, action, actor, payload_summary, payload_details) {
    var audit = new GlideRecord('x_eoap_audit_trail');
    audit.event_type = this._getEventType(action);
    audit.entity_type = entity_type;
    audit.entity_sys_id = entity_sys_id;
    audit.action = action;
    audit.actor = actor;
    audit.timestamp = new GlideDateTime();
    audit.correlation_id = this._generateCorrelationId();
    audit.payload_summary = payload_summary;
    audit.payload_details = JSON.stringify(payload_details);
    audit.insert();
    gs.info('Audit logged: ' + entity_type + ' - ' + action);
  },
  
  _getEventType: function(action) {
    // Map action to event type
    if (action === 'access_granted') return 'eoap.access.granted';
    if (action === 'access_revoked') return 'eoap.access.revoked';
    if (action === 'risk_calculated') return 'eoap.risk.calculated';
    return 'eoap.unknown';
  },
  
  _generateCorrelationId: function() {
    return gs.generateGUID();
  },
  
  type: 'EOAP_AuditLogger'
};
```

### 7.10 Testes

**Test Script**:
```javascript
// Background Scripts
var logger = new EOAP_AuditLogger();
logger.logEvent('x_eoap_user_access', 'abc123', 'access_granted', 'admin', 'Access granted for user', {user: 'john.doe', application: 'CRM'});
gs.info('Audit logger test complete');
```

**Expected Output**:
```
Audit logged: x_eoap_user_access - access_granted
Audit logger test complete
```

### 7.11 Rollback

**Rollback**: Deletar Script Include

---

## 8. Component 7: Flow - Employee Onboarding

### 8.1 Objetivo

Criar Flow para automação de onboarding.

### 8.2 Configuração

**Location**: Process Automation → Flow Designer → New

### 8.3 Tabelas

- x_eoap_user_access
- x_eoap_audit_trail
- x_eoap_event_processing

### 8.4 Campos

N/A

### 8.5 ACLs

N/A (ACLs são configuradas nas tabelas)

### 8.6 Roles

N/A

### 8.7 Flows

**Flow**: EOAP_Flow_Employee_Onboarding

**Trigger**: Event `eoap.employee.created`

**Steps**:
1. **Validate Input**
   - Validar employee_sys_id
   - Validar event_data
   - Validar event_type = "created"

2. **Lookup Lifecycle Actions (DT)**
   - Chamar Decision Table: x_eoap_dt_lifecycle_actions
   - Inputs: event_type, employee_type, department, location
   - Outputs: default_access_profiles, approval_required, notification_recipients, sync_to_iam

3. **Request Manager Approval (se necessário)**
   - Se approval_required = true
   - Enviar notificação para manager
   - Aguardar aprovação (timeout: 24 horas)

4. **Grant Default Access (subflow)**
   - Chamar Subflow: EOAP_Subflow_Grant_Access_Profile
   - Inputs: default_access_profiles, user_sys_id
   - Outputs: access_granted, access_sys_id

5. **Publish Events (subflow)**
   - Chamar Subflow: EOAP_Subflow_Publish_Event
   - Inputs: event_type = "eoap.access.granted", event_data, correlation_id
   - Outputs: event_published

6. **Log Audit Trail (subflow)**
   - Chamar Subflow: EOAP_Subflow_Log_Audit
   - Inputs: entity_type = "x_eoap_user_access", entity_sys_id, action = "access_granted", actor
   - Outputs: audit_logged

7. **Notify Manager**
   - Enviar notificação para manager
   - Conteúdo: Access granted para funcionário

### 8.8 Decision Tables

- x_eoap_dt_lifecycle_actions

### 8.9 Script Includes

- EOAP_AuditLogger
- EOAP_AccessGovernanceService

### 8.10 Testes

**Test Case**: Onboarding Happy Path
- Given: Novo funcionário criado em HRIS
- When: Event `eoap.employee.created` é recebido
- Then:
  - Default access concedido
  - Audit trail gerado
  - Manager notificado
  - SLA < 30s

### 8.11 Rollback

**Rollback**: Deletar Flow

---

## 9. Component 8: REST API - GET /access/{sys_id}

### 9.1 Objetivo

Criar REST API endpoint para consultar access por sys_id.

### 9.2 Configuração

**Location**: System Web Services → REST → New

### 9.3 Tabelas

- x_eoap_user_access

### 9.4 Campos

N/A

### 9.5 ACLs

**Read**: OAuth 2.0 authenticated users

### 9.6 Roles

N/A

### 9.7 Flows

N/A

### 9.8 Decision Tables

N/A

### 9.9 Script Includes

N/A

### 9.10 Testes

**Test Script (cURL)**:
```bash
curl -X GET \
  https://instance.service-now.com/api/x_eoap/v1/access/abc123 \
  -H "Authorization: Bearer {token}"
```

**Expected Response**:
```json
{
  "sys_id": "abc123",
  "user": "john.doe",
  "application": "CRM",
  "access_type": "active",
  "granted_on": "2026-06-06T10:00:00Z",
  "status": "active"
}
```

### 9.11 Rollback

**Rollback**: Deletar REST API

---

## 10. Component 9: Integration Hub Spoke - IAM

### 10.1 Objetivo

Criar Integration Hub Spoke para integração com IAM.

### 10.2 Configuração

**Location**: IntegrationHub → Spokes → New

### 10.3 Tabelas

N/A

### 10.4 Campos

N/A

### 10.5 ACLs

N/A

### 10.6 Roles

N/A

### 10.7 Flows

N/A

### 10.8 Decision Tables

N/A

### 10.9 Script Includes

N/A (spoke usa Integration Hub framework)

### 10.10 Testes

**Test Case**: IAM Provision
- Given: Access foi aprovado
- When: Provision é executado
- Then:
  - IAM REST API é chamado
  - Access é provisionado em IAM
  - Confirmação é recebida

### 10.11 Rollback

**Rollback**: Deletar Spoke

---

## 11. Component 10: Scheduled Job - Reconciliation

### 11.1 Objetivo

Criar Scheduled Job para reconciliação diária.

### 11.2 Configuração

**Location**: System Scheduler → Scheduled Jobs → New

### 11.3 Tabelas

- x_eoap_user_access
- x_eoap_staging_access_reconciliation

### 11.4 Campos

N/A

### 11.5 ACLs

N/A

### 11.6 Roles

N/A

### 11.7 Flows

N/A

### 11.8 Decision Tables

N/A

### 11.9 Script Includes

- EOAP_AccessGovernanceService

### 11.10 Testes

**Test Script**:
```javascript
// Background Scripts
var job = new GlideRecord('sys_job');
job.addQuery('name', 'EOAP_Job_Reconciliation');
if (job.next()) {
  gs.info('Job EOAP_Job_Reconciliation found');
} else {
  gs.error('Job EOAP_Job_Reconciliation not found');
}
```

**Expected Output**:
```
Job EOAP_Job_Reconciliation found
```

### 11.11 Rollback

**Rollback**: Deletar Scheduled Job

---

## 12. Build Summary

### 12.1 Component Summary

| Component | Tipo | Prioridade | Sprint | Status |
| --- | --- | --- | --- | --- |
| Application Scope | Application | P0 | Sprint 1 | Pending |
| x_eoap_user_access | Table | P0 | Sprint 1 | Pending |
| x_eoap_audit_trail | Table | P0 | Sprint 1 | Pending |
| Roles | Role | P0 | Sprint 2 | Pending |
| Decision Table: Access Approval Routing | Decision Table | P0 | Sprint 2 | Pending |
| Script Include: EOAP_AuditLogger | Script Include | P0 | Sprint 4 | Pending |
| Flow: Employee Onboarding | Flow | P0 | Sprint 3 | Pending |
| REST API: GET /access/{sys_id} | REST API | P0 | Sprint 5 | Pending |
| Integration Hub Spoke: IAM | Integration | P0 | Sprint 5 | Pending |
| Scheduled Job: Reconciliation | Scheduled Job | P0 | Sprint 6 | Pending |

### 12.2 Build Checklist

Para cada componente:

- [ ] Configuração completa
- [ ] Tabelas criadas
- [ ] Campos criados
- [ ] ACLs configuradas
- [ ] Roles atribuídos
- [ ] Flows criados
- [ ] Decision Tables criadas
- [ ] Script Includes criados
- [ ] Testes executados
- [ ] Validation scripts pass
- [ ] Code review aprovado
- [ ] Rollback documentado

---

*Build Guide - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 04-Build*
*Total Components: 10*
