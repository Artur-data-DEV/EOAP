# EOAP Audit Model

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Audit Model |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Auditoria Corporativo |

> **Escopo deste documento**: Modelo de auditoria da EOAP. Inclui audit trail, logging, monitoring e procedimentos de auditoria. Para segurança detalhada, ver Security_Model.md. Para compliance, ver Compliance.md.

---

## 1. Audit Overview

### 1.1 Audit Philosophy

**Princípios**:
- **Audit by Default**: Tudo auditado por default
- **Immutable Audit Trail**: Audit trail imutável
- **Complete Coverage**: 100% de cobertura de eventos
- **Traceability**: Correlation ID end-to-end
- **Retention**: Retenção 7 anos (SOX)

### 1.2 Audit Scope

| Área | Escopo | Cobertura |
| --- | --- | --- |
| Access Governance | Request, approve, revoke, recertify | 100% |
| Employee Lifecycle | Onboarding, move, offboarding | 100% |
| Change Risk | Risk calculation, banding | 100% |
| CMDB Quality | Quality gates, completeness | 100% |
| Event Processing | Event receipt, processing, DLQ | 100% |
| Security | ACL violations, SoD violations | 100% |

---

## 2. Audit Trail

### 2.1 Audit Trail Design

**Tabela**: x_eoap_audit_trail

**Campos**:
- event_type (String)
- entity_type (String)
- entity_sys_id (String)
- action (String)
- actor (Reference: sys_user)
- timestamp (DateTime)
- payload_summary (String)
- payload_details (JSON)
- correlation_id (String)
- source (String)

**Características**:
- Append-only: Sem update ou delete
- Imutável: Registros nunca modificados
- Retenção: 7 anos (SOX)
- Indexado: Para queries eficientes

### 2.2 Audit Events

| Event Type | Entity Type | Action | Trigger |
| --- | --- | --- | --- |
| access_requested | x_eoap_user_access | create | EOAP_Flow_Access_Request |
| access_approved | x_eoap_user_access | update | Approval |
| access_rejected | x_eoap_user_access | update | Approval |
| access_granted | x_eoap_user_access | update | EOAP_Subflow_Grant_Access_Profile |
| access_revoked | x_eoap_user_access | update | EOAP_Flow_Employee_Offboarding |
| access_expired | x_eoap_user_access | update | Scheduled job |
| employee_onboarded | sys_user | create | EOAP_Flow_Employee_Onboarding |
| employee_moved | sys_user | update | EOAP_Flow_Employee_Move |
| employee_offboarded | sys_user | update | EOAP_Flow_Employee_Offboarding |
| risk_calculated | change_request | update | EOAP_Flow_Change_Risk_Assessment |
| cmdb_quality_failed | cmdb_ci_business_app | read | CMDB Quality Report |
| event_processed | x_eoap_event_processing | update | EOAP_EventProcessor |
| event_failed | x_eoap_event_processing | update | EOAP_EventProcessor |
| acl_violation | N/A | read | System ACL |
| sod_violation | N/A | read | SoD validation |

### 2.3 Audit Trail Integrity

**Proteção**:
- ACL: create via EOAP_AuditLogger only
- ACL: read via x_eoap_admin, x_eoap_auditor only
- ACL: write none (append-only)
- ACL: delete none (imutável)
- Field ACL: payload_summary via x_eoap_admin, x_eoap_auditor only

**Validação**:
- Hash SHA-256 para cada registro
- Digital signature para eventos críticos
- Verificação periódica de integridade

---

## 3. Logging Strategy

### 3.1 Logging Pattern

**Pattern**: `[EOAP][Module][Entity][Correlation_ID][Outcome]`

**Examples**:
- `[EOAP][Offboarding][user_123][corr_456][SUCCESS]`
- `[EOAP][RiskEngine][change_789][corr_456][FAILED]`
- `[EOAP][EventProcessor][event_abc][corr_def][RETRY]`

### 3.2 Log Levels

| Level | Uso | Examples |
| --- | --- | --- |
| ERROR | Erros que requerem intervenção | Integration failed, DLQ |
| WARN | Situações anormais mas não críticas | Retry, Performance degradation |
| INFO | Eventos normais operacionais | Flow started, Access granted |
| DEBUG | Detalhes para debugging | Variable values, Query details |

### 3.3 Log Retention

| Log Type | Retenção | Archive |
| --- | --- | --- |
| Application logs | 30 dias | 1 ano |
| System logs | 30 dias | 1 ano |
| Audit trail | 7 anos (SOX) | Permanente |
| Security logs | 1 ano | 7 anos |

---

## 4. Correlation ID

### 4.1 Correlation ID Strategy

**Propósito**: Trace end-to-end de operações

**Geração**:
- Gerado no início de cada flow
- Propagado para todos os subflows
- Propagado para integrações
- Propagado para audit trail

**Formato**: UUID v4

**Exemplo**: `550e8400-e29b-41d4-a716-446655440000`

### 4.2 Correlation ID Propagation

**Flow**: Onboarding
```
Event eoap.employee.created
  → Generate correlation_id
  → EOAP_Flow_Employee_Onboarding (corr_456)
    → EOAP_Subflow_Grant_Access_Profile (corr_456)
      → IAM provision (corr_456)
    → EOAP_Subflow_Log_Audit (corr_456)
      → x_eoap_audit_trail (corr_456)
```

### 4.3 Correlation ID Query

**Query**:
```
SELECT * FROM x_eoap_audit_trail
WHERE correlation_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY timestamp ASC
```

**Resultado**: Timeline completa da operação

---

## 5. Audit Queries

### 5.1 Common Queries

#### Query 1: Audit Trail por Usuário

```sql
SELECT * FROM x_eoap_audit_trail
WHERE actor = 'user_sys_id'
ORDER BY timestamp DESC
LIMIT 100
```

#### Query 2: Audit Trail por Entidade

```sql
SELECT * FROM x_eoap_audit_trail
WHERE entity_type = 'x_eoap_user_access'
AND entity_sys_id = 'access_sys_id'
ORDER BY timestamp ASC
```

#### Query 3: Audit Trail por Event Type

```sql
SELECT * FROM x_eoap_audit_trail
WHERE event_type = 'access_revoked'
ORDER BY timestamp DESC
LIMIT 100
```

#### Query 4: Audit Trail por Correlation ID

```sql
SELECT * FROM x_eoap_audit_trail
WHERE correlation_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY timestamp ASC
```

#### Query 5: Audit Trail por Período

```sql
SELECT * FROM x_eoap_audit_trail
WHERE timestamp >= '2026-01-01'
AND timestamp < '2026-02-01'
ORDER BY timestamp ASC
```

### 5.2 Audit Reports

**Report 1: Access Activity (Última Semana)**
- Access requests
- Access approvals
- Access revocations
- Access expirations

**Report 2: Employee Lifecycle (Última Semana)**
- Onboardings
- Moves
- Offboardings

**Report 3: Change Risk (Última Semana)**
- Risk calculations
- Risk bands
- High/Critical changes

**Report 4: Security Events (Última Semana)**
- ACL violations
- SoD violations
- Failed authentications

**Report 5: CMDB Quality (Última Semana)**
- Quality gates
- Completeness rate
- Accuracy rate

---

## 6. Audit Procedures

### 6.1 Internal Audit

**Frequência**: Trimestral

**Responsável**: x_eoap_auditor

**Escopo**:
- Review de audit trail
- Review de logs
- Review de compliance
- Review de security
- Identificação de gaps

**Deliverables**:
- Audit report
- Gap analysis
- Recommendations
- Status report

### 6.2 External Audit

**Frequência**: Anual

**Responsável**: Third-party auditor

**Escopo**:
- SOX compliance
- ISO 27001 compliance
- LGPD compliance
- Security assessment
- Risk assessment

**Deliverables**:
- Audit report
- Findings
- Recommendations
- Certification (se aplicável)

### 6.3 Ad-Hoc Audit

**Trigger**: Incident, mudança major, solicitação

**Responsável**: x_eoap_auditor

**Escopo**: Definido por trigger

**Deliverables**:
- Audit report
- Findings
- Recommendations

---

## 7. Audit Evidence

### 7.1 Evidence Collection

**Tipos de Evidência**:
- Audit trail records
- Log records
- Configuration records
- Change records
- Incident records
- Training records

**Retenção**:
- Audit trail: 7 anos (SOX)
- Logs: 1 ano
- Configuration: 7 anos
- Change records: 7 anos
- Incident records: 7 anos
- Training records: 7 anos

### 7.2 Evidence Preservation

**Proteção**:
- Read-only access
- Imutável storage
- Encryption at rest
- Encryption in transit
- Access logging

**Backup**:
- Diário para audit trail
- Semanal para logs
- Mensal para configuração

---

## 8. Audit Findings

### 8.1 Finding Classification

| Severidade | Critérios | Response Time |
| --- | --- | --- |
| Critical | Violação SOX/ISO 27001/LGPD crítico | 24 hours |
| High | Violação não crítica mas significativa | 1 week |
| Medium | Violação menor | 1 month |
| Low | Process gap | 3 months |

### 8.2 Finding Resolution

**Step 1 - Assessment**:
- Classificar severidade
- Determinar impacto
- Identificar root cause

**Step 2 - Remediation**:
- Implementar fix
- Validar fix
- Documentar fix

**Step 3 - Prevention**:
- Root cause analysis
- Implementar controle preventivo
- Atualizar processo

**Step 4 - Verification**:
- Verificar resolução
- Validar prevenção
- Documentar lessons learned

---

## 9. Audit Reporting

### 9.1 Reports

**Daily Report**:
- Audit trail volume
- Log volume
- Security events (se houver)

**Weekly Report**:
- Audit trail trends
- Log trends
- Security trends
- Non-compliance alerts (se houver)

**Monthly Report**:
- Audit trail summary
- Log summary
- Security summary
- Compliance summary
- Recommendations

**Quarterly Report**:
- Internal audit results
- Gap analysis
- Remediation progress
- Status report

**Annual Report**:
- External audit results
- Compliance status anual
- Security status anual
- Recommendations anuais

---

## 10. Audit Tools

### 10.1 ServiceNow Native Tools

**Tools**:
- Audit Trail (x_eoap_audit_trail)
- System Logs
- Performance Analytics
- Reports

### 10.2 External Tools

**Tools**:
- SIEM (Security Information and Event Management)
- Log aggregation
- Alerting
- Dashboard

---

## 11. Audit Best Practices

### 11.1 Audit Trail

**Práticas**:
- 100% de cobertura de eventos
- Correlation ID em todos os eventos
- Payload detalhado para investigação
- Indexação para queries eficientes

### 11.2 Logging

**Práticas**:
- Logging pattern consistente
- Log levels apropriados
- Não logar dados sensíveis (PII)
- Log correlation ID

### 11.3 Monitoring

**Práticas**:
- Dashboards para audit metrics
- Alerting para anomalias
- Review regular de logs
- Review regular de audit trail

---

## 12. Audit Training

### 12.1 Training Requirements

| Role | Training | Frequência |
| --- | --- | --- |
| x_eoap_auditor | Audit techniques, SOX, ISO 27001, LGPD | Onboarding + Annual |
| x_eoap_admin | Audit awareness | Onboarding + Annual |
| Todos os usuários | Audit awareness | Onboarding + Annual |

### 12.2 Training Content

**Audit Techniques** (2 horas):
- Audit trail query
- Log analysis
- Evidence collection
- Report generation

**SOX Audit** (2 horas):
- SOX requirements
- Internal controls
- Audit preparation
- Documentation

**ISO 27001 Audit** (2 horas):
- ISO 27001 clauses
- Security controls
- Risk management
- Incident response

**LGPD Audit** (2 horas):
- LGPD principles
- Data rights
- Consent management
- Data breach response

---

*Audit Model - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
