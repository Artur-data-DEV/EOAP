# Now Create Operational Model - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Operational Model |
| Now Create Phase | 07-Operate |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Process Owner | IT Operations Team |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Modelo Operacional Corporativo |

---

## 1. Operational Model Overview

### 1.1 Purpose

Este modelo operacional define como a solução EOAP será operada continuamente, incluindo suporte, incident management, problem management, monitoring, KPIs e SLAs.

### 1.2 Operational Principles

- **24/7 Availability**: Sistema disponível 24/7
- **Zero Downtime**: Zero downtime planejado (blue-green deployment)
- **Self-Service**: Auto-service para usuários finais
- **Proactive Monitoring**: Monitoramento proativo de performance e segurança
- **Continuous Improvement**: Melhoria contínua baseada em KPIs e feedback

### 1.3 Operational Scope

**In-Scope**:
- Employee lifecycle automation
- Access governance
- Change risk assessment
- Audit trail
- Event-driven architecture
- CMDB quality management
- Access reconciliation
- Exception management

**Out-of-Scope**:
- HRIS system operations
- IAM system operations
- SIEM system operations

---

## 2. Support Model

### 2.1 Support Tiers

**L1 Support (Service Desk)**:
- **Objective**: Primeira linha de suporte, triage e resolução de issues simples
- **Responsibilities**:
  - Receber e triar incidentes
  - Resolver issues simples (password reset, access request status)
  - Escalar issues complexos para L2
  - Documentar incidentes
- **Skills**: ServiceNow básico, comunicação, triage
- **Availability**: 24/7
- **SLA**: Response time < 30 minutes, Resolution time < 4 hours (P3), < 24 hours (P2)

**L2 Support (Application Support)**:
- **Objective**: Segunda linha de suporte, resolução de issues moderadamente complexos
- **Responsibilities**:
  - Investigar issues escalados por L1
  - Resolver issues moderadamente complexos (flow errors, integration issues)
  - Escalar issues complexos para L3
  - Documentar resoluções
- **Skills**: ServiceNow avançado, Flows, Decision Tables, Script Includes
- **Availability**: 24/7
- **SLA**: Response time < 1 hour, Resolution time < 8 hours (P2), < 24 hours (P1)

**L3 Support (Technical Support)**:
- **Objective**: Terceira linha de suporte, resolução de issues complexos e desenvolvimento
- **Responsibilities**:
  - Investigar issues escalados por L2
  - Resolver issues complexos (code bugs, performance issues)
  - Desenvolver fixes
  - Documentar resoluções e ADRs
- **Skills**: ServiceNow expert, JavaScript, Integration Hub, OAuth, REST APIs
- **Availability**: 24/7 (on-call)
- **SLA**: Response time < 4 hours, Resolution time < 24 hours (P1)

### 2.2 Support Escalation

**Escalation Matrix**:

| Priority | L1 Response | L1 Resolution | L2 Response | L2 Resolution | L3 Response | L3 Resolution |
| --- | --- | --- | --- | --- | --- | --- |
| P1 (Critical) | 15 min | Escalar 15 min | 15 min | Escalar 1 hour | 1 hour | 24 hours |
| P2 (High) | 30 min | Escalar 4 hours | 1 hour | Escalar 8 hours | 4 hours | 24 hours |
| P3 (Medium) | 30 min | 4 hours | 1 hour | 8 hours | 4 hours | 24 hours |
| P4 (Low) | 1 hour | 24 hours | 4 hours | 48 hours | 8 hours | 72 hours |

**Escalation Triggers**:
- L1 → L2: Issue não resolvido em 4 horas (P3), 1 hora (P2), 15 minutos (P1)
- L2 → L3: Issue não resolvido em 8 horas (P3), 8 horas (P2), 1 hora (P1)
- L3 → ServiceNow Architect: Issue não resolvido em 24 horas (P1)

### 2.3 Support Channels

**Support Channels**:
- **Service Portal**: Self-service para access requests, knowledge base
- **Email**: eoap-support@company.com
- **Phone**: +1-800-EOAP-SUPPORT (24/7)
- **Chat**: Service Portal chat (24/7)
- **Slack**: #eoap-support (24/7)

### 2.4 Support Resources

**Support Team Composition**:
- **L1 Support**: 4 FTE (24/7 coverage)
- **L2 Support**: 2 FTE (24/7 coverage)
- **L3 Support**: 2 FTE (on-call 24/7)
- **ServiceNow Architect**: 1 FTE (on-call 24/7)

**Support Team Training**:
- **L1 Training**: 2 semanas (ServiceNow básico, EOAP overview, triage)
- **L2 Training**: 4 semanas (ServiceNow avançado, Flows, Decision Tables, Script Includes)
- **L3 Training**: 8 semanas (ServiceNow expert, JavaScript, Integration Hub, OAuth, REST APIs)

---

## 3. Incident Management

### 3.1 Incident Definition

**Incident**: Evento não planejado que interrompe ou reduz a qualidade de serviço.

### 3.2 Incident Classification

**Priority Classification**:

| Priority | Definition | Example | SLA Response | SLA Resolution |
| --- | --- | --- | --- | --- |
| P1 (Critical) | Sistema não funcional, bloqueia operação completa | Offboarding não funciona, audit trail não funcional | 15 minutes | 24 hours |
| P2 (High) | Funcionalidade crítica não funciona | Onboarding não funciona, access governance não funciona | 30 minutes | 24 hours |
| P3 (Medium) | Funcionalidade não crítica não funciona | Dashboard não funciona, report não funciona | 30 minutes | 48 hours |
| P4 (Low) | Cosmético, não afeta funcionalidade | UI bug, typo | 1 hour | 72 hours |

### 3.3 Incident Lifecycle

**Incident Lifecycle**:
1. **Detection**: Incident detectado via monitoramento ou usuário
2. **Logging**: Incident logado em sistema de tracking
3. **Triage**: Incident triado (priority, severity, impact)
4. **Assignment**: Incident atribuído a L1/L2/L3
5. **Investigation**: Incident investigado
6. **Resolution**: Incident resolvido
7. **Verification**: Resolution verificada
8. **Closure**: Incident fechado

### 3.4 Incident Management Process

**Step 1: Detection**
- Monitoramento automático detecta incident
- Usuário reporta incident via support channel

**Step 2: Logging**
- L1 loga incident em sistema de tracking
- L1 atribui priority baseado em classification matrix

**Step 3: Triage**
- L1 tria incident (impact, urgency, severity)
- L1 determina se incident pode ser resolvido em L1

**Step 4: Assignment**
- Se L1 pode resolver: L1 atribui a si mesmo
- Se L1 não pode resolver: L1 escala para L2
- Se L2 não pode resolver: L2 escala para L3

**Step 5: Investigation**
- L2/L3 investiga incident
- L2/L3 identifica root cause
- L2/L3 desenvolve workaround ou fix

**Step 6: Resolution**
- L2/L3 aplica workaround ou fix
- L2/L3 valida resolution

**Step 7: Verification**
- L1/L2/L3 verifica resolution
- Usuário confirma resolution

**Step 8: Closure**
- L1 fecha incident
- L1 documenta lessons learned

### 3.5 Incident Metrics

**Incident Metrics**:
- **MTTR (Mean Time To Resolution)**: < 24 hours (P1), < 48 hours (P2)
- **MTTD (Mean Time To Detection)**: < 15 minutes (P1), < 30 minutes (P2)
- **MTTA (Mean Time To Assignment)**: < 15 minutes (P1), < 30 minutes (P2)
- **Incident Volume**: < 10 incidents/week
- **Critical Incident Rate**: < 1 incident/month
- **First Contact Resolution Rate**: > 80%

---

## 4. Problem Management

### 4.1 Problem Definition

**Problem**: Causa raiz de um ou mais incidentes recorrentes.

### 4.2 Problem Classification

**Priority Classification**:

| Priority | Definition | Example | SLA Resolution |
| --- | --- | --- | --- |
| P1 (Critical) | Causa raiz de incidentes críticos recorrentes | Offboarding falha recorrente | 2 weeks |
| P2 (High) | Causa raiz de incidentes high recorrentes | Onboarding falha recorrente | 4 weeks |
| P3 (Medium) | Causa raiz de incidentes medium recorrentes | Dashboard falha recorrente | 8 weeks |
| P4 (Low) | Causa raiz de incidentes low recorrentes | UI bug recorrente | 12 weeks |

### 4.3 Problem Lifecycle

**Problem Lifecycle**:
1. **Detection**: Problem detectado via incident analysis
2. **Logging**: Problem logado em sistema de tracking
3. **Investigation**: Problem investigado
4. **Root Cause Analysis**: Root cause identificada
5. **Solution Development**: Solução desenvolvida
6. **Solution Implementation**: Solução implementada
7. **Verification**: Solução verificada
8. **Closure**: Problem fechado

### 4.4 Problem Management Process

**Step 1: Detection**
- Incident analysis detecta pattern
- L2/L3 identifica problem

**Step 2: Logging**
- L2/L3 loga problem em sistema de tracking
- L2/L3 atribui priority baseado em classification matrix

**Step 3: Investigation**
- L2/L3 investiga problem
- L2/L3 analisa incidentes relacionados

**Step 4: Root Cause Analysis**
- L2/L3 executa root cause analysis (5 Whys, Fishbone)
- L2/L3 identifica root cause

**Step 5: Solution Development**
- L2/L3 desenvolve solução
- L2/L3 valida solução em DEV/TEST

**Step 6: Solution Implementation**
- L2/L3 implementa solução em PROD
- L2/L3 valida solução em PROD

**Step 7: Verification**
- L2/L3 verifica solução
- L2/L3 confirma não mais incidentes

**Step 8: Closure**
- L2/L3 fecha problem
- L2/L3 documenta lessons learned

### 4.5 Problem Metrics

**Problem Metrics**:
- **MTTR (Mean Time To Resolution)**: < 2 weeks (P1), < 4 weeks (P2)
- **Problem Volume**: < 5 problems/month
- **Critical Problem Rate**: < 1 problem/quarter
- **Recurrence Rate**: < 5% (incidentes recorrentes)

---

## 5. Monitoring Strategy

### 5.1 Monitoring Objectives

**Monitoring Objectives**:
- **Availability**: Monitorar disponibilidade do sistema (target: 99.9%)
- **Performance**: Monitorar performance do sistema (target: SLAs atendidos)
- **Security**: Monitorar eventos de segurança (target: 0 security incidents)
- **Compliance**: Monitorar compliance (target: 100% compliance)
- **Capacity**: Monitorar capacidade do sistema (target: < 80% utilização)

### 5.2 Monitoring Components

**Component 1: Application Monitoring**
- **Metrics**: Uptime, response time, error rate
- **Tool**: ServiceNow Event Management
- **Alert Thresholds**: Uptime < 99.9%, response time > 3s, error rate > 1%

**Component 2: Database Monitoring**
- **Metrics**: Query time, connection pool, table size
- **Tool**: ServiceNow Database Monitoring
- **Alert Thresholds**: Query time > 5s, connection pool > 80%, table size > 10M records

**Component 3: Integration Monitoring**
- **Metrics**: API response time, error rate, throughput
- **Tool**: ServiceNow Integration Hub Monitoring
- **Alert Thresholds**: Response time > 5s, error rate > 1%, throughput < 100 req/min

**Component 4: Security Monitoring**
- **Metrics**: Failed authentication, ACL violations, MFA failures
- **Tool**: ServiceNow Security Operations
- **Alert Thresholds**: Failed authentication > 10/hour, ACL violations > 0, MFA failures > 5/hour

**Component 5: Compliance Monitoring**
- **Metrics**: Audit trail completeness, CMDB quality, SOX compliance
- **Tool**: ServiceNow Compliance Management
- **Alert Thresholds**: Audit trail < 100%, CMDB quality < 95%, SOX compliance < 100%

**Component 6: Capacity Monitoring**
- **Metrics**: CPU, memory, disk, network
- **Tool**: ServiceNow Cloud Management
- **Alert Thresholds**: CPU > 80%, memory > 80%, disk > 80%, network > 80%

### 5.3 Monitoring Alerts

**Alert Types**:

| Alert Type | Severity | Trigger | Action |
| --- | --- | --- | --- |
| Application Down | Critical | Uptime < 99.9% | Page L3, create P1 incident |
| Performance Degradation | High | Response time > 3s | Page L3, create P2 incident |
| Error Rate High | High | Error rate > 1% | Page L3, create P2 incident |
| Integration Failure | High | API error rate > 1% | Page L3, create P2 incident |
| Security Incident | Critical | ACL violation > 0 | Page L3, create P1 incident |
| Compliance Violation | High | CMDB quality < 95% | Page L3, create P2 incident |
| Capacity Warning | Medium | CPU > 80% | Email L3, create P3 incident |

### 5.4 Monitoring Dashboards

**Dashboard 1: EOAP_Operational_Overview**
- **Widgets**: Uptime, Response Time, Error Rate, Incident Volume, KPIs
- **Refresh**: 5 minutes
- **Access**: x_eoap_admin, x_eoap_manager, x_eoap_risk_analyst

**Dashboard 2: EOAP_Performance**
- **Widgets**: Response Time (95th percentile), Throughput, Database Query Time, Integration Response Time
- **Refresh**: 1 minute
- **Access**: x_eoap_admin, x_eoap_manager

**Dashboard 3: EOAP_Security**
- **Widgets**: Failed Authentication, ACL Violations, MFA Failures, Security Incidents
- **Refresh**: 1 minute
- **Access**: x_eoap_admin, x_eoap_risk_analyst

---

## 6. KPIs (Key Performance Indicators)

### 6.1 KPI Definition

**KPIs**: Métricas quantitativas que medem o desempenho operacional da solução EOAP.

### 6.2 KPI Categories

**Category 1: Availability**
- **KPI 1.1**: System Uptime
  - **Definition**: Percentual de tempo que o sistema está disponível
  - **Target**: 99.9%
  - **Measurement**: ServiceNow Event Management
  - **Alert Threshold**: < 99.9%

**Category 2: Performance**
- **KPI 2.1**: Offboarding SLA
  - **Definition**: Percentual de offboardings completados em < 60s
  - **Target**: 95%
  - **Measurement**: Audit trail analysis
  - **Alert Threshold**: < 95%

- **KPI 2.2**: Risk Calculation SLA
  - **Definition**: Percentual de risk calculations completados em < 5s
  - **Target**: 95%
  - **Measurement**: Audit trail analysis
  - **Alert Threshold**: < 95%

- **KPI 2.3**: Event Processing SLA
  - **Definition**: Percentual de events processados em < 30s
  - **Target**: 95%
  - **Measurement**: Audit trail analysis
  - **Alert Threshold**: < 95%

**Category 3: Security**
- **KPI 3.1**: Failed Authentication Rate
  - **Definition**: Número de failed authentications por hora
  - **Target**: < 10/hour
  - **Measurement**: ServiceNow Security Operations
  - **Alert Threshold**: > 10/hour

- **KPI 3.2**: ACL Violation Rate
  - **Definition**: Número de ACL violations
  - **Target**: 0
  - **Measurement**: ServiceNow Security Operations
  - **Alert Threshold**: > 0

**Category 4: Compliance**
- **KPI 4.1**: Audit Trail Completeness
  - **Definition**: Percentual de eventos logados em audit trail
  - **Target**: 100%
  - **Measurement**: Audit trail analysis
  - **Alert Threshold**: < 100%

- **KPI 4.2**: CMDB Quality
  - **Definition**: Percentual de CMDB quality (completeness, accuracy, freshness)
  - **Target**: ≥ 95%
  - **Measurement**: CMDB quality report
  - **Alert Threshold**: < 95%

- **KPI 4.3**: SOX Compliance
  - **Definition**: Percentual de SOX compliance
  - **Target**: 100%
  - **Measurement**: Auditor review
  - **Alert Threshold**: < 100%

**Category 5: Support**
- **KPI 5.1**: MTTR (Mean Time To Resolution)
  - **Definition**: Tempo médio para resolver incidentes
  - **Target**: < 24 hours (P1), < 48 hours (P2)
  - **Measurement**: Incident tracking
  - **Alert Threshold**: > 24 hours (P1), > 48 hours (P2)

- **KPI 5.2**: First Contact Resolution Rate
  - **Definition**: Percentual de incidentes resolvidos em L1
  - **Target**: > 80%
  - **Measurement**: Incident tracking
  - **Alert Threshold**: < 80%

- **KPI 5.3**: Incident Volume
  - **Definition**: Número de incidentes por semana
  - **Target**: < 10/week
  - **Measurement**: Incident tracking
  - **Alert Threshold**: > 10/week

**Category 6: Capacity**
- **KPI 6.1**: CPU Utilization
  - **Definition**: Percentual de CPU utilizada
  - **Target**: < 80%
  - **Measurement**: ServiceNow Cloud Management
  - **Alert Threshold**: > 80%

- **KPI 6.2**: Memory Utilization
  - **Definition**: Percentual de memory utilizada
  - **Target**: < 80%
  - **Measurement**: ServiceNow Cloud Management
  - **Alert Threshold**: > 80%

- **KPI 6.3**: Disk Utilization
  - **Definition**: Percentual de disk utilizada
  - **Target**: < 80%
  - **Measurement**: ServiceNow Cloud Management
  - **Alert Threshold**: > 80%

### 6.3 KPI Dashboard

**KPI Dashboard**: EOAP_KPI_Dashboard

**Widgets**:
- System Uptime (99.9% target)
- Offboarding SLA (95% target)
- Risk Calculation SLA (95% target)
- Event Processing SLA (95% target)
- Failed Authentication Rate (< 10/hour target)
- ACL Violation Rate (0 target)
- Audit Trail Completeness (100% target)
- CMDB Quality (≥ 95% target)
- SOX Compliance (100% target)
- MTTR (< 24 hours P1 target)
- First Contact Resolution Rate (> 80% target)
- Incident Volume (< 10/week target)
- CPU Utilization (< 80% target)
- Memory Utilization (< 80% target)
- Disk Utilization (< 80% target)

**Refresh**: 5 minutes

**Access**: x_eoap_admin, x_eoap_manager, x_eoap_risk_analyst

---

## 7. SLAs (Service Level Agreements)

### 7.1 SLA Definition

**SLA**: Acordo de nível de serviço entre provedor de serviço e cliente.

### 7.2 SLA Categories

**Category 1: Availability SLA**
- **SLA 1.1**: System Availability
  - **Target**: 99.9% uptime
  - **Measurement**: Monthly
  - **Penalty**: N/A (internal SLA)

**Category 2: Performance SLA**
- **SLA 2.1**: Offboarding SLA
  - **Target**: 95% de offboardings completados em < 60s
  - **Measurement**: Monthly
  - **Penalty**: N/A (internal SLA)

- **SLA 2.2**: Risk Calculation SLA
  - **Target**: 95% de risk calculations completados em < 5s
  - **Measurement**: Monthly
  - **Penalty**: N/A (internal SLA)

- **SLA 2.3**: Event Processing SLA
  - **Target**: 95% de events processados em < 30s
  - **Measurement**: Monthly
  - **Penalty**: N/A (internal SLA)

**Category 3: Support SLA**
- **SLA 3.1**: Incident Response Time
  - **Target**: < 15 minutes (P1), < 30 minutes (P2), < 30 minutes (P3)
  - **Measurement**: Per incident
  - **Penalty**: N/A (internal SLA)

- **SLA 3.2**: Incident Resolution Time
  - **Target**: < 24 hours (P1), < 24 hours (P2), < 48 hours (P3)
  - **Measurement**: Per incident
  - **Penalty**: N/A (internal SLA)

**Category 4: Compliance SLA**
- **SLA 4.1**: Audit Trail Retention
  - **Target**: 7-year retention
  - **Measurement**: Quarterly
  - **Penalty**: N/A (internal SLA)

- **SLA 4.2**: CMDB Quality
  - **Target**: ≥ 95% quality
  - **Measurement**: Monthly
  - **Penalty**: N/A (internal SLA)

### 7.3 SLA Reporting

**SLA Reporting**:
- **Frequency**: Monthly
- **Report**: EOAP_SLA_Report
- **Distribution**: Product Owner, Process Owner, ServiceNow Architect, Technical Lead, L1, L2, L3
- **Review**: Monthly review meeting

---

## 8. Backup & Recovery

### 8.1 Backup Strategy

**Backup Strategy**: Daily incremental backup, weekly full backup

**Backup Schedule**:
- **Daily Incremental Backup**: 02:00 UTC
- **Weekly Full Backup**: Sunday 02:00 UTC
- **Retention**: 7 years (audit trail), 1 year (application data)

**Backup Components**:
- Application Scope `x_eoap`
- Custom Tables (x_eoap_*)
- Decision Tables
- Script Includes
- Flows
- Subflows
- REST APIs
- OAuth 2.0
- Integration Hub Spokes
- Scheduled Jobs
- Dashboards

### 8.2 Recovery Strategy

**Recovery Strategy**: Point-in-time recovery

**Recovery Time Objective (RTO)**: 4 horas

**Recovery Point Objective (RPO)**: 24 horas

**Recovery Procedures**:
1. Identificar ponto de recuperação
2. Restaurar backup
3. Validar restauração
4. Testar funcionalidade
5. Notificar stakeholders

### 8.3 Disaster Recovery

**Disaster Recovery Strategy**: Cold standby

**Disaster Recovery Site**: Alternate ServiceNow instance

**Disaster Recovery Activation**:
- **Trigger**: Primary site unavailable > 4 horas
- **Activation Time**: 24 horas
- **Validation**: Full system validation

---

## 9. Knowledge Management

### 9.1 Knowledge Base

**Knowledge Base**: EOAP Knowledge Base

**Knowledge Articles**:
- KB001: EOAP Overview
- KB002: Employee Onboarding
- KB003: Employee Move
- KB004: Employee Offboarding
- KB005: Access Request
- KB006: Access Approval
- KB007: Change Risk Assessment
- KB008: Audit Trail Query
- KB009: Common Issues
- KB010: Troubleshooting

### 9.2 Knowledge Management Process

**Knowledge Management Process**:
1. **Creation**: L2/L3 cria knowledge article
2. **Review**: ServiceNow Architect review
3. **Approval**: Process Owner approval
4. **Publication**: Knowledge article publicado
5. **Maintenance**: Knowledge article atualizado trimestralmente

### 9.3 Knowledge Metrics

**Knowledge Metrics**:
- **Knowledge Article Volume**: > 10 articles
- **Knowledge Article Usage**: > 100 views/month
- **Knowledge Article Rating**: > 4/5 stars
- **First Contact Resolution Rate**: > 80% (com knowledge base)

---

## 10. Continuous Improvement

### 10.1 Continuous Improvement Process

**Continuous Improvement Process**:
1. **KPI Review**: Mensal review de KPIs
2. **Gap Analysis**: Identificar gaps vs targets
3. **Improvement Initiatives**: Desenvolver improvement initiatives
4. **Implementation**: Implementar improvement initiatives
5. **Validation**: Validar improvement
6. **Closure**: Fechar improvement initiative

### 10.2 Improvement Initiatives

**Improvement Initiatives Examples**:
- **Initiative 1**: Otimizar offboarding SLA (target: < 60s → < 30s)
- **Initiative 2**: Reduzir incident volume (target: < 10/week → < 5/week)
- **Initiative 3**: Aumentar CMDB quality (target: ≥ 95% → ≥ 98%)
- **Initiative 4**: Melhorar first contact resolution rate (target: > 80% → > 90%)

### 10.3 Continuous Improvement Metrics

**Continuous Improvement Metrics**:
- **Improvement Initiatives Volume**: > 4 initiatives/year
- **Improvement Initiatives Success Rate**: > 80%
- **KPI Improvement Rate**: > 5% improvement/year

---

## 11. Operational Model Summary

### 11.1 Support Model Summary

| Tier | Availability | SLA Response | SLA Resolution |
| --- | --- | --- | --- |
| L1 Support | 24/7 | < 30 min (P3), < 30 min (P2), < 15 min (P1) | < 4h (P3), < 24h (P2), Escalar (P1) |
| L2 Support | 24/7 | < 1h (P3), < 1h (P2), < 15 min (P1) | < 8h (P3), < 24h (P2), Escalar (P1) |
| L3 Support | 24/7 (on-call) | < 4h (P3), < 4h (P2), < 1h (P1) | < 24h (P3), < 24h (P2), < 24h (P1) |

### 11.2 KPI Summary

| Category | KPI | Target |
| --- | --- | --- |
| Availability | System Uptime | 99.9% |
| Performance | Offboarding SLA | 95% |
| Performance | Risk Calculation SLA | 95% |
| Performance | Event Processing SLA | 95% |
| Security | Failed Authentication Rate | < 10/hour |
| Security | ACL Violation Rate | 0 |
| Compliance | Audit Trail Completeness | 100% |
| Compliance | CMDB Quality | ≥ 95% |
| Compliance | SOX Compliance | 100% |
| Support | MTTR (P1) | < 24 hours |
| Support | First Contact Resolution Rate | > 80% |
| Support | Incident Volume | < 10/week |
| Capacity | CPU Utilization | < 80% |
| Capacity | Memory Utilization | < 80% |
| Capacity | Disk Utilization | < 80% |

### 11.3 SLA Summary

| Category | SLA | Target |
| --- | --- | --- |
| Availability | System Availability | 99.9% uptime |
| Performance | Offboarding SLA | 95% < 60s |
| Performance | Risk Calculation SLA | 95% < 5s |
| Performance | Event Processing SLA | 95% < 30s |
| Support | Incident Response Time (P1) | < 15 minutes |
| Support | Incident Resolution Time (P1) | < 24 hours |
| Compliance | Audit Trail Retention | 7 years |
| Compliance | CMDB Quality | ≥ 95% |

---

*Operational Model - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 07-Operate*
*Support Tiers: 3 (L1, L2, L3)*
*KPIs: 15*
*SLAs: 8*
