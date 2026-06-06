# EOAP Test Strategy

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Test Strategy |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Teste Corporativo |

> **Escopo deste documento**: Estratégia de teste da EOAP. Inclui tipos de teste, abordagem de teste, cobertura e gates de qualidade. Para detalhes ATF, ver ATF_Strategy.

---

## 1. Test Overview

### 1.1 Testing Philosophy

**Princípios**:
- **Test-First**: Testes escritos antes de implementação
- **Automated First**: Preferir testes automatizados sobre manuais
- **Shift Left**: Testar o mais cedo possível no ciclo de desenvolvimento
- **Coverage**: 100% de cobertura de código crítico
- **Regression**: Testes de regressão para todas as mudanças

### 1.2 Test Pyramid

```
        /\
       /  \      E2E Tests (5%)
      /____\
     /      \    Integration Tests (25%)
    /________\
   /          \  Unit Tests (70%)
  /____________\
```

### 1.3 Test Types

| Tipo | Propósito | Ferramenta | Frequência |
| --- | --- | --- | --- |
| Unit Test | Validar lógica isolada | ATF | Cada commit |
| Integration Test | Validar integração entre componentes | ATF | Cada commit |
| E2E Test | Validar fluxos completos | ATF | Cada release |
| Performance Test | Validar SLOs | Performance Analytics | Cada release |
| Security Test | Validar segurança | ATF + Manual | Cada release |
| Compliance Test | Validar compliance | Manual | Quarterly |

---

## 2. Unit Testing

### 2.1 Unit Test Scope

**Componentes**:
- Script Includes
- Business Rules
- Decision Tables
- API Scripts

**Critérios**:
- 100% de cobertura para Script Includes críticos
- 80% de cobertura para Script Includes não críticos
- 100% de cobertura para Business Rules
- 100% de cobertura para Decision Tables

### 2.2 Unit Test Examples

#### Script Include: EOAP_RiskEngine

```javascript
// Test: Calculate Risk Score
Given: Change request com CMDB quality = High, Service criticality = Critical
When: EOAP_RiskEngine.calculateRisk(change_sys_id)
Then: Risk score = 65, Risk band = High

// Test: CMDB Unknown
Given: Change request sem CMDB data
When: EOAP_RiskEngine.calculateRisk(change_sys_id)
Then: Risk band = Unknown
```

#### Decision Table: x_eoap_dt_access_approval_routing

```
// Test: Restricted Data
Given: data_classification = Restricted
When: x_eoap_dt_access_approval_routing
Then: approval_required = true, approval_level = Level 3

// Test: Emergency Exception
Given: exception_type = Emergency
When: x_eoap_dt_access_approval_routing
Then: auto_approve = true, approval_required = false
```

### 2.3 Unit Test Execution

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate
- Coverage ≥ threshold
- No test skipped sem justificativa

---

## 3. Integration Testing

### 3.1 Integration Test Scope

**Integrações**:
- EOAP ↔ CMDB
- EOAP ↔ Change Management
- EOAP ↔ IAM (mock em PDI)
- EOAP ↔ HRIS (mock em PDI)
- EOAP ↔ SIEM (mock em PDI)

**Critérios**:
- 100% de cobertura de integrações críticas
- 80% de cobertura de integrações não críticas

### 3.2 Integration Test Examples

#### EOAP ↔ CMDB

```
// Test: Access Owner populated
Given: cmdb_ci_business_app com x_eoap_access_owner preenchido
When: EOAP consulta CMDB
Then: Access owner retornado corretamente

// Test: CMDB Quality Gate
Given: CMDB quality < 95%
When: EOAP_Flow_Change_Risk_Assessment
Then: Risk band = Unknown
```

#### EOAP ↔ IAM

```
// Test: Provision Access
Given: User access approved
When: EOAP chama IAM provision
Then: Access provisionado em IAM

// Test: Deprovision Access
Given: User offboarding
When: EOAP chama IAM deprovision
Then: Access revogado em IAM
```

### 3.3 Integration Test Execution

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate
- No integration timeout
- Mock services funcionando

---

## 4. End-to-End Testing

### 4.1 E2E Test Scope

**Flows**:
- Employee Onboarding completo
- Employee Move completo
- Employee Offboarding completo
- Access Request completo
- Change Risk Assessment completo

**Critérios**:
- 100% de cobertura de flows críticos
- 80% de cobertura de flows não críticos

### 4.2 E2E Test Examples

#### Employee Onboarding

```
Scenario: Onboarding de novo funcionário
Given: Novo funcionário criado em HRIS
When: Event eoap.employee.created recebido
Then:
  - Lifecycle actions lookup executado
  - Default access concedido
  - Audit trail gerado
  - Manager notificado
  - Event eoap.access.granted publicado
```

#### Employee Offboarding

```
Scenario: Offboarding de funcionário
Given: Funcionário terminado em HRIS
When: Event eoap.employee.terminated recebido
Then:
  - Todos os acessos listados
  - Todos os acessos revogados (< 60s)
  - IAM deprovisionado
  - Audit trail gerado
  - Manager notificado
```

### 4.3 E2E Test Execution

**Schedule**: Cada release

**Gates**:
- 100% pass rate
- SLOs atendidos
- No data leak

---

## 5. Performance Testing

### 5.1 Performance Test Scope

**Métricas**:
- Offboarding latency (< 60s)
- Risk calculation latency (< 5s)
- Event processing latency (< 30s)
- Form load time (< 3s)

**Critérios**:
- 95th percentile ≤ SLO
- 99th percentile ≤ 2× SLO

### 5.2 Performance Test Execution

**Schedule**: Cada release

**Load Test**:
- Volume: 10× volume atual
- Duration: 1 hora
- Métricas: Latency, throughput, error rate

**Stress Test**:
- Volume: 50× volume atual
- Duration: 30 min
- Métricas: Breakpoint, degradation

**Gates**:
- 95th percentile ≤ SLO
- No degradation > 50%
- Error rate < 1%

---

## 6. Security Testing

### 6.1 Security Test Scope

**Áreas**:
- ACLs (deny-by-default)
- Field ACLs
- SoD (Segregation of Duties)
- OAuth 2.0
- MFA
- Audit trail integrity

### 6.2 Security Test Examples

#### ACL Testing

```
// Test: Deny by default
Given: Usuário sem role EOAP
When: Tentar acessar x_eoap_user_access
Then: Acesso negado

// Test: Field ACL
Given: x_eoap_access_owner
When: Tentar modificar risk_rating
Then: Modificação bloqueada
```

#### SoD Testing

```
// Test: Requester cannot approve own request
Given: Usuário solicita access
When: Usuário tenta aprovar próprio request
Then: Aprovação bloqueada
```

### 6.3 Security Test Execution

**Schedule**: Cada release

**Gates**:
- 100% pass rate
- No security vulnerability
- STRIDE controls validados

---

## 7. Compliance Testing

### 7.1 Compliance Test Scope

**Regulamentos**:
- SOX (Sarbanes-Oxley)
- ISO 27001
- LGPD

**Critérios**:
- Audit trail retenção 7 anos
- Audit trail imutável
- Data classification aplicada
- Access recertification

### 7.2 Compliance Test Execution

**Schedule**: Quarterly

**Gates**:
- 100% compliance
- No finding crítico

---

## 8. Test Coverage

### 8.1 Coverage Targets

| Tipo | Target | Current | Gap |
| --- | --- | --- | --- |
| Code Coverage | 80% | TBD | TBD |
| Critical Code Coverage | 100% | TBD | TBD |
| Flow Coverage | 100% | TBD | TBD |
| Integration Coverage | 80% | TBD | TBD |
| Security Coverage | 100% | TBD | TBD |

### 8.2 Coverage Measurement

**Ferramenta**: ServiceNow ATF Coverage Report

**Frequência**: Cada release

**Report**:
- Coverage por módulo
- Coverage por tipo de teste
- Gap analysis
- Action items

---

## 9. Test Data Management

### 9.1 Test Data Strategy

**Princípios**:
- Data synthetic ou anonymized
- Data representativo de produção
- Data versionado
- Data isolado por ambiente

### 9.2 Test Data Sets

| Data Set | Uso | Volume | Refresh |
| --- | --- | --- | --- |
| Synthetic Users | Unit tests | 100 users | Weekly |
| Synthetic Applications | Unit tests | 50 apps | Weekly |
| Synthetic Change Requests | Integration tests | 100 changes | Weekly |
| Anonymized Production | E2E tests | 1000 users | Monthly |

### 9.3 Test Data Privacy

**Requisitos**:
- No PII em test data
- No production data em test
- Data anonymization validada
- Data retention: 30 dias

---

## 10. Test Environment

### 10.1 Environments

| Ambiente | Propósito | Data | Availability |
| --- | --- | --- | --- |
| PDI | Desenvolvimento e teste | Synthetic | 24×7 |
| QA | Teste de release | Anonymized | Business hours |
| UAT | User acceptance testing | Anonymized | Business hours |
| PROD | Produção | Real | 24×7 |

### 10.2 Environment Configuration

**PDI**:
- Mock integrations (IAM, HRIS, SIEM)
- CMDB quality = 100%
- Performance = não crítico

**QA**:
- Mock integrations (IAM, HRIS, SIEM)
- CMDB quality = 95%
- Performance = crítico

**UAT**:
- Mock integrations (IAM, HRIS, SIEM)
- CMDB quality = 95%
- Performance = crítico
- Business users

**PROD**:
- Integrações reais
- CMDB quality ≥ 95%
- Performance = crítico
- Real users

---

## 11. Test Gates

### 11.1 Development Gates

| Gate | Critério | Responsável |
| --- | --- | --- |
| Code Review | Peer approval | x_eoap_admin |
| Unit Tests | 100% pass | x_eoap_admin |
| Integration Tests | 100% pass | x_eoap_admin |
| Coverage | ≥ threshold | x_eoap_admin |
| Security Review | No vulnerabilities | x_eoap_auditor |

### 11.2 Release Gates

| Gate | Critério | Responsável |
| --- | --- | --- |
| ATF Regression | 100% pass | x_eoap_admin |
| E2E Tests | 100% pass | x_eoap_admin |
| Performance Tests | SLOs atendidos | x_eoap_admin |
| Security Tests | 100% pass | x_eoap_auditor |
| Compliance Tests | 100% pass | x_eoap_auditor |
| ARB Approval | ADRs fechados | Platform Owners |

---

## 12. Test Automation

### 12.1 Automation Strategy

**Ferramenta**: ServiceNow ATF

**CI/CD Integration**:
- Trigger: Cada commit
- Execução: Unit + Integration tests
- Feedback: Immediate

**Release Automation**:
- Trigger: Cada release
- Execução: Full test suite
- Feedback: Pre-release

### 12.2 Automation Coverage

| Tipo | Automatizado | Manual | Total |
| --- | --- | --- | --- |
| Unit Tests | 100% | 0% | 100% |
| Integration Tests | 90% | 10% | 100% |
| E2E Tests | 80% | 20% | 100% |
| Performance Tests | 100% | 0% | 100% |
| Security Tests | 90% | 10% | 100% |
| Compliance Tests | 50% | 50% | 100% |

---

## 13. Defect Management

### 13.1 Defect Classification

| Severidade | Critérios | SLA de Resolução |
| --- | --- | --- |
| Critical | Sistema inoperacional, security breach | 24 hours |
| High | Funcionalidade crítica falhando | 3 days |
| Medium | Funcionalidade não crítica falhando | 1 week |
| Low | Cosmético, UX issue | 2 weeks |

### 13.2 Defect Lifecycle

```
Reported → Triaged → Assigned → In Progress → Fixed → Verified → Closed
```

### 13.3 Defect Metrics

| Métrica | Target | Measurement |
| --- | --- | --- |
| Defect Density | < 5 defects/KLOC | Per release |
| Critical Defects | 0 em PROD | Continuous |
| Defect MTTR | < 3 days | Monthly average |
| Defect Reopen Rate | < 5% | Monthly average |

---

## 14. Test Reporting

### 14.1 Test Reports

**Daily Report**:
- Test execution status
- Pass rate
- Failures (se houver)

**Weekly Report**:
- Test coverage trends
- Defect trends
- Performance trends

**Release Report**:
- Full test suite results
- Coverage metrics
- Performance metrics
- Security metrics
- Compliance metrics
- Go/No-Go recommendation

### 14.2 Test Metrics Dashboard

**Widgets**:
- Test pass rate (última semana)
- Test coverage (última semana)
- Defect count por severidade
- Performance vs SLOs
- Security test status

---

*Test Strategy - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
