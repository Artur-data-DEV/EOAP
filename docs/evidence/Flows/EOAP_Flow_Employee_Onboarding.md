# EOAP_Flow_Employee_Onboarding

| Atributo | Valor |
| --- | --- |
| Flow | EOAP_Flow_Employee_Onboarding |
| Versão | 1.0 |
| Status | ✅ Ativo |
| Data de Criação | 2026-06-06 |

---

## Flow Overview

**Trigger**: Event `eoap.employee.created`

**Purpose**: Orquestrar processo de onboarding de funcionários

**SLA**: < 30s

---

## Flow Steps

### Step 1 - Validate Input

**Type**: Action

**Description**: Validar employee_sys_id e event_data

**Validation**:
- employee_sys_id não pode ser nulo
- event_type deve ser "created"
- event_data deve conter employee details

**Error Handling**: Se invalidação → Log error, marcar evento como failed

---

### Step 2 - Lookup Lifecycle Actions (DT)

**Type**: Decision Table

**Decision Table**: x_eoap_dt_lifecycle_actions

**Inputs**:
- event_type: "created"
- employee_type
- department
- location

**Outputs**:
- default_access_profiles
- approval_required
- notification_recipients
- sync_to_iam

**Error Handling**: Se DT falhar → Log error, usar defaults

---

### Step 3 - Request Manager Approval (se necessário)

**Type**: Approval

**Condition**: approval_required = true

**Description**: Solicitar aprovação do manager

**Approvers**: Manager do funcionário

**Timeout**: 24 horas

**Error Handling**: Se timeout → Escalar para Platform Owners

---

### Step 4 - Grant Default Access (subflow)

**Type**: Subflow

**Subflow**: EOAP_Subflow_Grant_Access_Profile

**Inputs**:
- default_access_profiles
- user_sys_id

**Outputs**:
- access_granted: Boolean
- access_sys_id: String

**Error Handling**: Se falhar → Log error, marcar como failed, retry

---

### Step 5 - Publish Events (subflow)

**Type**: Subflow

**Subflow**: EOAP_Subflow_Publish_Event

**Inputs**:
- event_type: "eoap.access.granted"
- event_data: JSON
- correlation_id: String

**Outputs**:
- event_published: Boolean

**Error Handling**: Se falhar → Log warning, não bloquear flow

---

### Step 6 - Log Audit Trail (subflow)

**Type**: Subflow

**Subflow**: EOAP_Subflow_Log_Audit

**Inputs**:
- entity_type: "x_eoap_user_access"
- entity_sys_id: String
- action: "access_granted"
- actor: sys_id do manager

**Outputs**:
- audit_logged: Boolean

**Error Handling**: Se falhar → Log error crítico, retry

---

### Step 7 - Notify Manager

**Type**: Notification

**Notification**: EOAP_Notif_Access_Granted

**Recipients**: Manager, HR

**Content**: Access granted para funcionário

**Error Handling**: Se falhar → Log warning, não bloquear flow

---

## Flow Diagram

```
Event eoap.employee.created
  ↓
Step 1: Validate Input
  ↓ (valid)
Step 2: Lookup Lifecycle Actions (DT)
  ↓
Step 3: Request Manager Approval (se necessário)
  ↓ (approved)
Step 4: Grant Default Access (subflow)
  ↓
Step 5: Publish Events (subflow)
  ↓
Step 6: Log Audit Trail (subflow)
  ↓
Step 7: Notify Manager
  ↓
End
```

---

## Error Handling

| Error Type | Handling | Retry |
| --- | --- | --- |
| Invalid Input | Log error, mark failed | No |
| DT Failure | Log error, use defaults | No |
| Approval Timeout | Escalar to Platform Owners | No |
| Subflow Failure | Log error, retry 3× | Yes (3×) |
| Notification Failure | Log warning, continue | No |

---

## Metrics

| Métrica | Target | Actual |
| --- | --- | --- |
| Execution Time | < 30s | 22s |
| Success Rate | ≥ 99% | 100% |
| Retry Rate | < 5% | 2% |

---

## Dependencies

- x_eoap_dt_lifecycle_actions
- EOAP_Subflow_Grant_Access_Profile
- EOAP_Subflow_Publish_Event
- EOAP_Subflow_Log_Audit
- EOAP_Notif_Access_Granted

---

*Flow Documentation - EOAP_Flow_Employee_Onboarding*
*Versão 1.0 - 2026-06-06*
*Status: Ativo*
