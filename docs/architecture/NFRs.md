# EOAP Non-Functional Requirements (NFRs)

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Non-Functional Requirements |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de NFRs Corporativo |

> **Escopo deste documento**: NFRs explícitos da EOAP. Inclui metas de performance, availability, scalability, security e compliance.

---

## 1. Performance

### 1.1 Performance Targets

| Métrica | Target | Measurement | Alert Threshold |
| --- | --- | --- | --- |
| Offboarding Revogação | < 60s | 95th percentile | > 90s |
| Change Risk Calculation | < 5s | 95th percentile | > 7s |
| Event Processing | < 30s | 95th percentile | > 45s |
| Form Load Time | < 3s | 95th percentile | > 4s |
| Audit Trail Write | < 1s | 99th percentile | > 2s |
| API Response Time | < 1s | 95th percentile | > 2s |
| Decision Table Execution | < 2s | 95th percentile | > 3s |
| Flow Execution (onboarding) | < 30s | 95th percentile | > 45s |
| Flow Execution (offboarding) | < 60s | 95th percentile | > 90s |
| Reconciliation Job | < 15 min | 95th percentile | > 20 min |

### 1.2 Performance Testing

**Load Test**:
- Volume: 10× volume atual
- Duration: 1 hora
- Métricas: Latency, throughput, error rate

**Stress Test**:
- Volume: 50× volume atual
- Duration: 30 min
- Métricas: Breakpoint, degradation

**Capacity Test**:
- Volume: Projeção Ano 1 (10K user_access)
- Volume: Projeção Ano 3 (50K user_access)
- Volume: Projeção Ano 5 (150K user_access)

---

## 2. Availability

### 2.1 Availability Targets

| Componente | Target | Measurement | Maintenance Window |
| --- | --- | --- | --- |
| EOAP Application | 99.5% uptime | Monthly | 4 hours/mês |
| API REST | 99.5% uptime | Monthly | 4 hours/mês |
| Integration (IAM) | 99% uptime | Monthly | 8 horas/mês |
| Integration (HRIS) | 99% uptime | Monthly | 8 horas/mês |
| Integration (SIEM) | 99% uptime | Monthly | 8 horas/mês |
| CMDB | 99.9% uptime | Monthly | 2 horas/mês |

### 2.2 SLA Breach

**Definition**: SLA breach quando target não atingido por 30 dias consecutivos.

**Escalation**:
- SLA breach → Escalar para Platform Owners
- SLA breach persistente → Escalar para CTO

---

## 3. Scalability

### 3.1 Scalability Targets

| Horizonte | User Access | Audit Trail | Events/Day | Capacity Gate |
| --- | --- | --- | --- | --- |
| Ano 1 | 10K | 500K | 5K | Gate 1 |
| Ano 3 | 50K | 2.5M | 25K | Gate 2 |
| Ano 5 | 150K | 7.5M | 75K | Gate 3 |

### 3.2 Capacity Gates

| Gate | Trigger | Action |
| --- | --- | --- |
| Gate 1 | User Access > 8K | Review capacity |
| Gate 2 | Audit Trail > 400K | Review archiving |
| Gate 3 | Events/Day > 4K | Review event processing |
| Gate 4 | Latency > 2× SLO | Review performance |

### 3.3 Scalability Strategy

**Vertical Scaling**:
- Aumentar capacidade de ServiceNow instance
- Otimizar database queries
- Adicionar índices

**Horizontal Scaling**:
- Archiving ativo para audit trail
- Archiving passivo para user access
- Event processing distribuído

---

## 4. Security

### 4.1 Security Targets

| Métrica | Target | Measurement | Alert Threshold |
| --- | --- | --- | --- |
| Failed Authentication | < 10/hour | Hourly | > 50/hour |
| ACL Violations | 0 | Hourly | > 0 |
| SoD Violations | 0 | Hourly | > 0 |
| MFA Compliance | 100% (admin, risk_analyst) | Daily | < 100% |
| OAuth Token Expiry | < 1% expired | Daily | > 5% expired |
| Vulnerability Scan | 0 critical | Quarterly | > 0 critical |

### 4.2 Security Controls

**Authentication**:
- OAuth 2.0 com client credentials
- MFA obrigatório para x_eoap_admin, x_eoap_risk_analyst (PROD)
- Token lifetime: 1 hora
- Refresh token: 24 horas

**Authorization**:
- RBAC deny-by-default
- ACL por tabela e operação
- Field ACL para dados sensíveis
- SoD enforcement

**Encryption**:
- At rest: AES-256
- In transit: TLS 1.2+
- Backup: AES-256

---

## 5. Compliance

### 5.1 Compliance Targets

| Regulamento | Target | Measurement | Status |
| --- | --- | --- | --- |
| SOX | 100% compliant | Quarterly | ✅ Compliant |
| ISO 27001 | 100% compliant | Quarterly | ✅ Compliant |
| LGPD | 100% compliant | Quarterly | ✅ Compliant |

### 5.2 Compliance Metrics

| Métrica | Target | Measurement |
| --- | --- | --- |
| Audit Trail Retention | 7 anos | Continuous |
| Data Classification Coverage | 100% | Quarterly |
| Access Recertification Rate | 100% | Quarterly |
| CMDB Quality | ≥ 95% | Daily |
| ADR Coverage | 100% | Continuous |

---

## 6. Reliability

### 6.1 Reliability Targets

| Métrica | Target | Measurement |
| --- | --- | --- |
| Offboarding Success Rate | ≥ 99% | Daily |
| Event Processing Success Rate | ≥ 99% | Daily |
| Change Risk Calculation Success Rate | ≥ 99% | Daily |
| MTTR (Mean Time To Recovery) | < 4 hours | Monthly |
| MTBF (Mean Time Between Failures) | > 30 dias | Monthly |

### 6.2 Disaster Recovery

**RPO (Recovery Point Objective)**:
- Audit Trail: 1 hora
- User Access: 24 horas
- Configuration: 24 horas

**RTO (Recovery Time Objective)**:
- Critical flows (offboarding): 4 horas
- Non-critical flows: 24 horas
- Full system: 48 horas

**Backup Strategy**:
- Database backup: Diário às 00:00 UTC
- Application export: Semanal
- Configuration export: Após cada mudança

---

## 7. Usability

### 7.1 Usability Targets

| Métrica | Target | Measurement |
| --- | --- | --- |
| Form Completion Time | < 2 min | Monthly |
| Error Rate (user errors) | < 5% | Monthly |
| User Satisfaction (CSAT) | ≥ 4.0/5.0 | Quarterly |
| Training Completion Rate | 100% | Quarterly |

### 7.2 Usability Metrics

**Form Completion Time**:
- Access Request: < 2 min
- Access Exception: < 3 min
- Recertification: < 1 min

**Error Rate**:
- Form validation errors: < 5%
- Flow errors: < 1%
- Integration errors: < 1%

---

## 8. Maintainability

### 8.1 Maintainability Targets

| Métrica | Target | Measurement |
| --- | --- | --- |
| Code Coverage | ≥ 80% | Release |
| Critical Code Coverage | 100% | Release |
| ATF Pass Rate | 100% | Release |
| Documentation Coverage | 100% | Continuous |
| ADR Coverage | 100% | Continuous |

### 8.2 Maintainability Metrics

**Code Coverage**:
- Script Includes: ≥ 80%
- Business Rules: 100%
- Decision Tables: 100%

**ATF Pass Rate**:
- Unit tests: 100%
- Integration tests: 100%
- E2E tests: 100%
- Security tests: 100%

---

## 9. Interoperability

### 9.1 Interoperability Targets

| Integração | Availability | Latency | Error Rate |
| --- | --- | --- | --- |
| IAM | 99% | < 5s | < 1% |
| HRIS | 99% | < 10s | < 1% |
| SIEM | 99% | < 5s | < 1% |

### 9.2 Integration SLAs

**IAM**:
- Provision: < 5s
- Deprovision: < 5s
- Availability: 99%

**HRIS**:
- Employee sync: < 10s
- Availability: 99%

**SIEM**:
- Alert delivery: < 5s
- Availability: 99%

---

## 10. Data Integrity

### 10.1 Data Integrity Targets

| Métrica | Target | Measurement |
| --- | --- | --- |
| Data Accuracy | ≥ 99% | Monthly |
| Data Consistency | ≥ 99% | Monthly |
| Data Completeness | ≥ 95% | Monthly |
| Data Freshness | 100% (últimos 30 dias) | Monthly |

### 10.2 Data Integrity Metrics

**CMDB Quality**:
- Completeness: ≥ 95%
- Accuracy: ≥ 95%
- Freshness: 100% (últimos 30 dias)

**User Access**:
- Accuracy: ≥ 99% (vs IAM)
- Consistency: ≥ 99% (vs IAM)

---

## 11. Monitoring

### 11.1 Monitoring Targets

| Métrica | Target | Measurement |
| --- | --- | --- |
| Alert Response Time (P1) | < 15 min | Continuous |
| Alert Response Time (P2) | < 1 hour | Continuous |
| Dashboard Refresh Rate | Real-time | Continuous |
| Log Retention | 30 dias | Continuous |

---

## 12. Capacity Planning

### 12.1 Capacity Projections

| Ano | User Access | Audit Trail | Events/Day | Storage Required |
| --- | --- | --- | --- | --- |
| Ano 1 | 10K | 500K | 5K | ~50 GB |
| Ano 3 | 50K | 2.5M | 25K | ~250 GB |
| Ano 5 | 150K | 7.5M | 75K | ~750 GB |

### 12.2 Capacity Review Schedule

- **Monthly**: Review capacity vs projections
- **Quarterly**: Load test para validar capacidade
- **Annually**: Revisar projections 5 anos

---

*Non-Functional Requirements - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
