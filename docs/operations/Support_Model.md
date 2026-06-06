# EOAP Support Model

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Support Model |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Suporte Corporativo |

> **Escopo deste documento**: Modelo de suporte da EOAP. Inclui níveis de suporte, SLAs, escalation, RACI e procedimentos de handoff. Para runbooks operacionais, ver Runbook.

---

## 1. Support Overview

### 1.1 Support Tiers

| Tier | Responsabilidade | Skills | Availability |
| --- | --- | --- | --- |
| **Tier 1 (L1)** | Triagem, resolução de incidentes simples | ServiceNow básico, EOAP básico | 24×7 |
| **Tier 2 (L2)** | Resolução de incidentes complexos, configuração | ServiceNow avançado, EOAP avançado | Business hours |
| **Tier 3 (L3)** | Resolução de bugs, arquitetura, desenvolvimento | ServiceNow expert, EOAP expert | Business hours |

### 1.2 Support Channels

| Canal | Uso | SLA de Resposta |
| --- | --- | --- |
| Self-Service Portal | Knowledge base, FAQs | N/A |
| Email | Solicitações não urgentes | 4 horas |
| Chat | Suporte em tempo real | 15 min |
| Phone | Incidentes críticos (P1) | 15 min |
| Slack | Colaboração, updates | 1 hora |

---

## 2. Service Level Agreements (SLAs)

### 2.1 Response SLAs

| Severidade | Response Time | Resolution Time | Escalation |
| --- | --- | --- | --- |
| P1 - Critical | 15 min | 4 hours | 30 min → L2, 1 hour → L3 |
| P2 - High | 1 hour | 8 hours | 4 hours → L2, 8 hours → L3 |
| P3 - Medium | 4 hours | 24 hours | 24 hours → L2 |
| P4 - Low | 24 hours | 72 hours | 72 hours → L2 |

### 2.2 Functional SLAs

| Funcionalidade | SLA | Measurement |
| --- | --- | --- |
| Offboarding revogação | < 60s | 95th percentile |
| Change risk calculation | < 5s | 95th percentile |
| Event processing | < 30s | 95th percentile |
| Form load time | < 3s | 95th percentile |
| CMDB quality | ≥ 95% | Daily average |
| Event processing success | ≥ 99% | Daily average |

### 2.3 Availability SLAs

| Componente | Target | Measurement |
| --- | --- | --- |
| EOAP Application | 99.5% uptime | Monthly |
| API REST | 99.5% uptime | Monthly |
| Integration (IAM) | 99% uptime | Monthly |
| Integration (HRIS) | 99% uptime | Monthly |
| Integration (SIEM) | 99% uptime | Monthly |

---

## 3. Incident Management

### 3.1 Incident Lifecycle

```
Detected → Triage → Assigned → In Progress → Resolved → Closed
         ↓        ↓         ↓          ↓          ↓         ↓
      Auto    L1/L2    L1/L2/L3   L1/L2/L3   L1/L2/L3  L1/L2
```

### 3.2 Incident Classification

| Severidade | Critérios | Exemplos |
| --- | --- | --- |
| P1 - Critical | Offboarding falhou, DLQ > 100, CMDB quality < 80% | Usuário não revogado após offboarding |
| P2 - High | Event processing failed, Risk calculation failed | Eventos não sendo processados |
| P3 - Medium | Dashboard não populado, Notificação não enviada | Dashboard sem dados |
| P4 - Low | Performance degradation < 50%, Question de usuário | Formulário lento mas funcional |

### 3.3 Incident Escalation

| Level | Quando Escalar | Para Quem | Como Escalar |
| --- | --- | --- | --- |
| L1 → L2 | Não resolvido em 30 min (P1), 4 hours (P2) | Tier 2 Support | Email + Chat |
| L2 → L3 | Não resolvido em 1 hour (P1), 8 hours (P2) | Tier 3 Support | Email + Phone |
| L3 → Management | Não resolvido em 4 hours (P1) | Platform Owners | Email + Phone |
| Management → Executivo | Impacto business crítico | CIO/CTO/CISO | Phone |

---

## 4. Request Management

### 4.1 Request Types

| Tipo | SLA de Resolução | Exemplos |
| --- | --- | --- |
| Access Request | 24 hours | Solicitar novo acesso |
| Access Exception | 48 hours | Solicitar exceção de política |
| Configuration Change | 5 business days | Alterar Decision Table |
| Bug Report | Variável por severidade | Reportar bug funcional |
| Enhancement Request | Roadmap | Solicitar nova funcionalidade |

### 4.2 Request Workflow

```
Submitted → Triage → Assigned → In Progress → Review → Approved/Rejected → Implemented → Closed
```

### 4.3 Request Approval

| Tipo | Approver | Critérios |
| --- | --- | --- |
| Access Request | Access Owner | DT_Access_Approval_Routing |
| Access Exception | Platform Owners | Justificativa business |
| Configuration Change | x_eoap_admin | Impact analysis |
| Bug Fix | x_eoap_admin | Severidade e impacto |
| Enhancement | Platform Owners | Business value |

---

## 5. Problem Management

### 5.1 Problem Identification

Problemas são identificados através de:
- Incidentes recorrentes (mesmo root cause)
- Incidentes de alta severidade
- Tendências negativas em métricas
- Feedback de usuários

### 5.2 Problem Lifecycle

```
Identified → Logged → Investigated → Root Cause Analysis → Workaround → Permanent Fix → Closed
```

### 5.3 Root Cause Analysis (RCA)

**Metodologia**: 5 Whys

**Template**:
1. Qual foi o problema?
2. Quando ocorreu?
3. Qual foi o impacto?
4. Why #1:
5. Why #2:
6. Why #3:
7. Why #4:
8. Why #5 (Root Cause):
9. Ação corretiva:
10. Ação preventiva:
11. Responsável:
12. Data alvo:

---

## 6. Change Management

### 6.1 Change Classification

| Tipo | Critérios | Approval | Testing |
| --- | --- | --- | --- |
| Standard | Baixo risco, documentado, pré-aprovado | Auto-approve | ATF regression |
| Normal | Médio risco, requer análise | CAB | ATF regression + UAT |
| Emergency | Alto risco, requer ação imediata | CIO/CISO | Post-deploy ATF |

### 6.2 Change Approval

| Tipo | Approver | Critérios |
| --- | --- | --- |
| Standard | x_eoap_admin | Follows documented process |
| Normal | CAB (Platform Owners) | Risk assessment completo |
| Emergency | CIO/CISO | Business justification |

### 6.3 Change Testing

| Tipo | Testes | Gates |
| --- | --- | --- |
| Standard | ATF regression | 100% pass |
| Normal | ATF regression + UAT | 100% pass + UAT sign-off |
| Emergency | Post-deploy ATF | 100% pass dentro de 1 hour |

---

## 7. RACI Matrix

### 7.1 Operational RACI

| Atividade | x_eoap_admin | x_eoap_cmdb_manager | x_eoap_access_owner | x_eoap_change_manager | x_eoap_risk_analyst | x_eoap_auditor | Platform Owners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Incident Triage | R | C | C | C | C | C | A |
| Incident Resolution (L1) | R | I | I | I | I | I | A |
| Incident Resolution (L2) | R | C | C | C | C | C | A |
| Incident Resolution (L3) | R | I | I | I | I | I | A |
| CMDB Quality | C | R | I | I | I | I | A |
| Access Approval | C | I | R | I | C | I | A |
| Risk Assessment | C | I | I | R | R | I | A |
| Audit Review | C | I | I | I | I | R | A |
| Change Approval | R | C | C | C | C | C | A |
| Emergency Change | R | C | C | C | C | C | A |

**Legenda**:
- R = Responsible (executa)
- A = Accountable (approver final)
- C = Consulted (consultado)
- I = Informed (informado)

### 7.2 Development RACI

| Atividade | x_eoap_admin | x_eoap_risk_analyst | Platform Owners | ARB |
| --- | --- | --- | --- | --- |
| ADR Creation | R | C | C | A |
| ADR Review | C | R | C | A |
| ADR Approval | C | C | R | A |
| Code Review | R | C | C | A |
| ATF Suite Creation | R | C | C | A |
| ATF Execution | R | C | C | A |
| Deployment | R | C | C | A |

---

## 8. Knowledge Management

### 8.1 Knowledge Base

**Artigos Obrigatórios**:
- EOAP Overview
- How to Request Access
- How to Approve Access
- How to View Audit Trail
- How to Run CMDB Quality Report
- Troubleshooting Offboarding Issues
- Troubleshooting Event Processing Issues
- Common Error Messages

### 8.2 Knowledge Base Maintenance

**Responsável**: x_eoap_admin

**Frequência**:
- Review mensal
- Atualização após cada incidente significativo
- Atualização após cada mudança major

### 8.3 Knowledge Base Metrics

| Métrica | Target | Measurement |
| --- | --- | --- |
| Article coverage | 100% de funcionalidades principais | Quarterly review |
| Article accuracy | 95% | User feedback |
| Article usage | 50% de incidentes resolvidos via KB | Monthly review |

---

## 9. Training and Onboarding

### 9.1 Training Requirements

| Role | Training | Frequência |
| --- | --- | --- |
| x_eoap_admin | EOAP Admin Training + ServiceNow Admin | Onboarding + Annual refresher |
| x_eoap_cmdb_manager | CMDB Quality Training | Onboarding + Annual refresher |
| x_eoap_access_owner | Access Approval Training | Onboarding + Annual refresher |
| x_eoap_change_manager | Change Risk Training | Onboarding + Annual refresher |
| x_eoap_risk_analyst | Risk Assessment Training | Onboarding + Annual refresher |
| x_eoap_auditor | Audit Trail Training | Onboarding + Annual refresher |
| x_eoap_manager | EOAP User Training | Onboarding + Annual refresher |

### 9.2 Training Content

**EOAP Admin Training** (2 dias):
- Day 1: Architecture overview, CMDB foundation, Access governance
- Day 2: Risk management, Event processing, Troubleshooting

**EOAP User Training** (4 horas):
- EOAP overview
- How to request access
- How to view audit trail
- Common workflows

### 9.3 Training Delivery

**Methods**:
- Instructor-led (in-person ou virtual)
- E-learning modules
- Hands-on labs
- Documentation

**Certificação**:
- Quiz ao final de cada training
- Practical assessment para roles admin
- Recertificação anual

---

## 10. Communication

### 10.1 Communication Channels

| Canal | Propósito | Audiência | Frequência |
| --- | --- | --- | --- |
| #eoap-ops (Slack) | Operações diárias | L1, L2, L3 | Real-time |
| #eoap-announcements (Slack) | Anúncios | Todos | As needed |
| #eoap-users (Slack) | Suporte a usuários | Usuários EOAP | Business hours |
| Email (eoap-support@company) | Suporte formal | Todos | As needed |
| Town Hall | Updates estratégicos | Todos | Quarterly |

### 10.2 Communication Templates

#### Incident Communication (P1)

**Subject**: [P1] EOAP Incident - Offboarding Failure

**Body**:
```
Incident ID: INCXXXXX
Severity: P1 - Critical
Status: In Progress
Started: [timestamp]

Description:
Offboarding para user [user] falhou. Access ainda ativo.

Impact:
- Security risk: User com access não autorizado
- Compliance risk: Offboarding não completado

Current Status:
[status update]

Next Steps:
[next steps]

Contact: [on-call contact]
```

#### Maintenance Communication

**Subject**: [Maintenance] EOAP Scheduled Maintenance

**Body**:
```
Maintenance Window: [start] - [end]
Impact: [affected components]
Downtime: [duration]

Description:
[maintenance description]

Rollback Plan:
[rollback plan]

Contact: [maintenance contact]
```

---

## 11. Vendor Management

### 11.1 Vendor Escalation

| Vendor | Contact | Escalation Path | SLA |
| --- | --- | --- | --- |
| ServiceNow | Account Manager → Technical Support → Executive | 24×7 | 4 hours (P1) |
| IAM Provider | Technical Support → Account Manager | Business hours | 8 hours (P1) |
| HRIS Provider | Technical Support → Account Manager | Business hours | 8 hours (P1) |
| SIEM Provider | Technical Support → Account Manager | 24×7 | 4 hours (P1) |

### 11.2 Vendor SLA Monitoring

**Responsável**: Platform Owners

**Frequência**: Monthly review

**Métricas**:
- Vendor response time vs SLA
- Vendor resolution time vs SLA
- Vendor uptime vs SLA
- Vendor communication quality

---

## 12. Continuous Improvement

### 12.1 Metrics Review

**Frequência**: Monthly

**Participantes**: L1, L2, L3, Platform Owners

**Métricas**:
- Incident volume por severidade
- Incident MTTR (Mean Time To Resolution)
- Request MTTR
- SLA compliance
- User satisfaction (CSAT)

### 12.2 Process Improvement

**Identificação de Melhorias**:
- Incident post-mortem
- User feedback
- Metric trends
- Team feedback

**Implementação**:
- Priorizar por impacto
- Criar action items
- Atribuir responsáveis
- Definir timeline
- Medir sucesso

---

*Support Model - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
