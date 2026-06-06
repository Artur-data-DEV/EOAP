# EOAP Monitoring Strategy

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Monitoring Strategy |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Monitoramento Corporativo |

> **Escopo deste documento**: Estratégia de monitoramento da EOAP. Inclui SLOs, dashboards, alerting e métricas operacionais. Para procedimentos operacionais, ver Runbook.

---

## 1. Monitoring Overview

### 1.1 Monitoring Pillars

| Pilar | Objetivo | Métricas |
| --- | --- | --- |
| **Availability** | Sistema disponível | Uptime, Error rate |
| **Performance** | Resposta dentro de SLO | Latency, Throughput |
| **Functional** | Flows funcionando | Success rate, Failure rate |
| **Security** | Sem incidentes de segurança | Failed auth, ACL violations |
| **Compliance** | CMDB quality, Audit trail | Completeness, Retention |

### 1.2 SLOs

| SLO | Target | Measurement | Alert Threshold |
| --- | --- | --- | --- |
| Offboarding revogação | < 60s | 95th percentile | > 90s |
| Change risk calculation | < 5s | 95th percentile | > 7s |
| Event processing | < 30s | 95th percentile | > 45s |
| Formulário load time | < 3s | 95th percentile | > 4s |
| Audit trail write | < 1s | 99th percentile | > 2s |
| CMDB quality | ≥ 95% | Daily average | < 90% |
| Event processing success | ≥ 99% | Daily average | < 95% |
| Offboarding success | ≥ 99% | Daily average | < 95% |

---

## 2. Dashboards

### 2.1 EOAP_Operational_Overview

**Objetivo**: Visão geral operacional em tempo real

**Widgets**:

#### Widget 1: User Access by Status
- **Type**: Donut chart
- **Source**: x_eoap_user_access
- **Group by**: status
- **Time range**: Real-time
- **Alert**: Se revoked > 10% do total

#### Widget 2: Access by Application
- **Type**: Bar chart
- **Source**: x_eoap_user_access
- **Group by**: application
- **Time range**: 7 dias
- **Alert**: Se application > 1000 acessos

#### Widget 3: Risk Band Distribution
- **Type**: Donut chart
- **Source**: change_request
- **Group by**: x_eoap_risk_band
- **Time range**: 7 dias
- **Alert**: Se Critical > 20%

#### Widget 4: Event Processing Status
- **Type**: Scorecard
- **Source**: x_eoap_event_processing
- **Metric**: % processed (última hora)
- **Target**: ≥ 99%
- **Alert**: Se < 95%

#### Widget 5: CMDB Completeness Rate
- **Type**: Scorecard
- **Source**: CMDB Quality Report
- **Metric**: % complete
- **Target**: ≥ 95%
- **Alert**: Se < 90%

#### Widget 6: Audit Trail Volume (7 dias)
- **Type**: Line chart
- **Source**: x_eoap_audit_trail
- **Time range**: 7 dias
- **Alert**: Se volume > 100K registros/dia

### 2.2 EOAP_Performance_Overview

**Objetivo**: Monitorar performance e SLOs

**Widgets**:

#### Widget 1: Offboarding Latency
- **Type**: Line chart
- **Metric**: 95th percentile
- **Target**: < 60s
- **Alert**: Se > 90s

#### Widget 2: Risk Calculation Latency
- **Type**: Line chart
- **Metric**: 95th percentile
- **Target**: < 5s
- **Alert**: Se > 7s

#### Widget 3: Event Processing Latency
- **Type**: Line chart
- **Metric**: 95th percentile
- **Target**: < 30s
- **Alert**: Se > 45s

#### Widget 4: Form Load Time
- **Type**: Line chart
- **Metric**: 95th percentile
- **Target**: < 3s
- **Alert**: Se > 4s

### 2.3 EOAP_Security_Overview

**Objetivo**: Monitorar segurança e compliance

**Widgets**:

#### Widget 1: ACL Violations
- **Type**: Scorecard
- **Metric**: Count (última hora)
- **Target**: 0
- **Alert**: Se > 0

#### Widget 2: Failed Authentication
- **Type**: Scorecard
- **Metric**: Count (última hora)
- **Target**: < 10
- **Alert**: Se > 50

#### Widget 3: Audit Trail Integrity
- **Type**: Scorecard
- **Metric**: % append-only
- **Target**: 100%
- **Alert**: Se < 100%

#### Widget 4: MFA Compliance
- **Type**: Scorecard
- **Metric**: % users com MFA
- **Target**: 100% (admin, risk_analyst)
- **Alert**: Se < 100%

---

## 3. Alerting

### 3.1 Alert Rules

| Alert | Condition | Severity | Recipients | Escalation |
| --- | --- | --- | --- | --- |
| EOAP_Offboarding_Failed | Offboarding > 60s | P1 | x_eoap_admin, Platform Owners | 15 min → CIO |
| EOAP_Event_Processing_Failed | % processed < 95% | P2 | x_eoap_admin, Platform Owners | 1 hour → CIO |
| EOAP_CMDB_Quality_Failed | CMDB quality < 90% | P2 | x_eoap_cmdb_manager, Platform Owners | 4 hours → CTO |
| EOAP_DLQ_High | DLQ > 100 | P1 | x_eoap_admin, Platform Owners | 15 min → CIO |
| EOAP_ACL_Violation | ACL violation detected | P1 | x_eoap_admin, x_eoap_auditor, CISO | 15 min → CISO |
| EOAP_Performance_Degraded | Latency > 2× SLO | P2 | x_eoap_admin, Platform Owners | 1 hour → CTO |
| EOAP_Integration_Failed | Integration down | P2 | x_eoap_admin, Platform Owners | 1 hour → CTO |

### 3.2 Alert Channels

| Channel | Uso | Configuration |
| --- | --- | --- |
| Email | Todos os alerts | Configurar recipients por alert |
| In-App | P2, P3, P4 | Notificações ServiceNow |
| SMS | P1 apenas | Configurar para on-call |
| PagerDuty | P1 apenas | Integração PagerDuty |
| Slack | P2, P3 | Canal #eoap-ops |

### 3.3 Alert Response

#### P1 Alerts (Critical)

**Response Time**: 15 min

**Actions**:
1. Acknowledge alert imediatamente
2. Investigar root cause
3. Implementar workaround (se disponível)
4. Escalar se não resolvido em 30 min
5. Documentar incidente

#### P2 Alerts (High)

**Response Time**: 1 hour

**Actions**:
1. Acknowledge alert
2. Investigar durante business hours
3. Implementar fix
4. Escalar se não resolvido em 4 hours
5. Documentar incidente

#### P3 Alerts (Medium)

**Response Time**: 4 hours

**Actions**:
1. Acknowledge alert
2. Investigar durante business hours
3. Implementar fix
4. Escalar se não resolvido em 24 hours

#### P4 Alerts (Low)

**Response Time**: 24 hours

**Actions**:
1. Acknowledge alert
2. Investigar quando disponível
3. Implementar fix
4. Escalar se não resolvido em 72 hours

---

## 4. Metrics Collection

### 4.1 Business Metrics

| Métrica | Source | Frequency | Retention |
| --- | --- | --- | --- |
| User Access Count | x_eoap_user_access | Real-time | 365 dias |
| Access by Status | x_eoap_user_access | Real-time | 365 dias |
| Access by Application | x_eoap_user_access | Real-time | 365 dias |
| Risk Band Distribution | change_request | Daily | 365 dias |
| CMDB Quality | CMDB Quality Report | Daily | 365 dias |
| Audit Trail Volume | x_eoap_audit_trail | Daily | 365 dias |

### 4.2 Technical Metrics

| Métrica | Source | Frequency | Retention |
| --- | --- | --- | --- |
| Offboarding Latency | EOAP_Flow_Employee_Offboarding | Real-time | 90 dias |
| Risk Calculation Latency | EOAP_Flow_Change_Risk_Assessment | Real-time | 90 dias |
| Event Processing Latency | x_eoap_event_processing | Real-time | 90 dias |
| Form Load Time | ServiceNow Performance | Real-time | 90 dias |
| Event Processing Success Rate | x_eoap_event_processing | Hourly | 90 dias |
| Integration Response Time | Connection Aliases | Real-time | 90 dias |
| Database Query Time | ServiceNow Performance | Real-time | 90 dias |

### 4.3 Security Metrics

| Métrica | Source | Frequency | Retention |
| --- | --- | --- | --- |
| ACL Violations | System Log | Real-time | 365 dias |
| Failed Authentication | System Log | Real-time | 365 dias |
| MFA Compliance | User Table | Daily | 365 dias |
| Audit Trail Integrity | x_eoap_audit_trail | Daily | 365 dias |
| OAuth Token Expiry | OAuth Log | Daily | 90 dias |

---

## 5. Log Management

### 5.1 Logging Strategy

**Pattern**: `[EOAP][Module][Entity][Correlation_ID][Outcome]`

**Examples**:
- `[EOAP][Offboarding][user_123][corr_456][SUCCESS]`
- `[EOAP][RiskEngine][change_789][corr_456][FAILED]`
- `[EOAP][EventProcessor][event_abc][corr_def][RETRY]`

### 5.2 Log Levels

| Level | Uso | Examples |
| --- | --- | --- |
| ERROR | Erros que requerem intervenção | Integration failed, DLQ |
| WARN | Situações anormais mas não críticas | Retry, Performance degradation |
| INFO | Eventos normais operacionais | Flow started, Access granted |
| DEBUG | Detalhes para debugging | Variable values, Query details |

### 5.3 Log Retention

| Log Type | Retention | Archive |
| --- | --- | --- |
| Application logs | 30 dias | 1 ano |
| System logs | 30 dias | 1 ano |
| Audit trail | 7 anos (SOX) | Permanente |
| Security logs | 1 ano | 7 anos |

---

## 6. Capacity Planning

### 6.1 Capacity Projections

| Ano | User Access | Audit Trail | Events/Day |
| --- | --- | --- | --- |
| Ano 1 | 10K | 500K | 5K |
| Ano 3 | 50K | 2.5M | 25K |
| Ano 5 | 150K | 7.5M | 75K |

### 6.2 Capacity Gates

| Gate | Trigger | Action |
| --- | --- | --- |
| Gate 1 | User Access > 8K | Review capacity |
| Gate 2 | Audit Trail > 400K | Review archiving |
| Gate 3 | Events/Day > 4K | Review event processing |
| Gate 4 | Latency > 2× SLO | Review performance |

### 6.3 Capacity Review Schedule

- **Monthly**: Review capacity vs projections
- **Quarterly**: Load test para validar capacidade
- **Annually**: Revisar projections 5 anos

---

## 7. Synthetic Monitoring

### 7.1 Synthetic Tests

| Test | Frequency | Target | Alert |
| --- | --- | --- | --- |
| EOAP_Flow_Employee_Onboarding | Hourly | Success | P2 se falhar |
| EOAP_Flow_Employee_Offboarding | Hourly | Success + < 60s | P1 se falhar ou > 90s |
| EOAP_Flow_Change_Risk_Assessment | Hourly | Success + < 5s | P2 se falhar ou > 7s |
| API REST /access/{sys_id} | Hourly | Success + < 1s | P2 se falhar ou > 2s |
| CMDB Quality Report | Daily | ≥ 95% | P2 se < 90% |

### 7.2 Synthetic Test Execution

**Tool**: ServiceNow ATF ou external synthetic monitoring

**Actions**:
1. Executar testes conforme schedule
2. Coletar métricas de performance
3. Comparar com SLOs
4. Alertar se threshold excedido
5. Investigar root cause

---

## 8. Reporting

### 8.1 Daily Report

**Recipients**: x_eoap_admin, Platform Owners

**Conteúdo**:
- SLO compliance (últimas 24h)
- Incident count por severidade
- DLQ count
- CMDB quality
- Event processing success rate

### 8.2 Weekly Report

**Recipients**: Platform Owners, CTO

**Conteúdo**:
- SLO trends (última semana)
- Incident summary
- Capacity utilization
- Performance trends
- Security incidents

### 8.3 Monthly Report

**Recipients**: CIO, CTO, CISO

**Conteúdo**:
- SLO compliance mensal
- Incident summary mensal
- Capacity vs projections
- Performance summary
- Security summary
- Compliance status
- Recommendations

---

*Monitoring Strategy - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
