# EOAP ATF Strategy

| Atributo | Valor |
| --- | --- |
| Documento | EOAP ATF Strategy |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Teste Corporativo |

> **Escopo deste documento**: Estratégia detalhada de ATF (Automated Test Framework) da EOAP. Inclui 6 suites ATF com testes específicos, configuração e execução. Para estratégia geral de teste, ver Test_Strategy.

---

## 1. ATF Overview

### 1.1 ATF Philosophy

**Princípios**:
- **Automated First**: Preferir testes ATF sobre testes manuais
- **Regression**: Testes de regressão para todas as mudanças
- **Coverage**: 100% de cobertura de funcionalidades críticas
- **Speed**: Testes devem executar em < 10 minutos
- **Maintainability**: Testes fáceis de manter e atualizar

### 1.2 ATF Suites

| Suite | Propósito | Testes | Execução |
| --- | --- | --- | --- |
| EOAP_ATF_CMDB_Foundation | Validar qualidade CMDB | 5 testes | Cada commit |
| EOAP_ATF_Employee_Lifecycle | Validar lifecycle de employee | 8 testes | Cada commit |
| EOAP_ATF_Access_Governance | Validar governança de acesso | 10 testes | Cada commit |
| EOAP_ATF_Change_Risk | Validar cálculo de risco | 6 testes | Cada commit |
| EOAP_ATF_Security_Negative | Validar segurança (negativos) | 8 testes | Cada commit |
| EOAP_ATF_Events | Validar processamento de eventos | 6 testes | Cada commit |

**Total**: 43 testes automatizados

---

## 2. Suite: EOAP_ATF_CMDB_Foundation

### 2.1 Objetivo

Validar qualidade CMDB e campos EOAP preenchidos.

### 2.2 Testes

#### Test 1: CMDB Completeness - Business App

**Given**: cmdb_ci_business_app existe
**When**: Verificar campos EOAP
**Then**:
- x_eoap_access_owner preenchido
- x_eoap_data_classification preenchido
- x_eoap_access_criticality preenchido
- x_eoap_operational_tier preenchido

#### Test 2: CMDB Completeness - Service

**Given**: cmdb_ci_service_discovered existe
**When**: Verificar campos EOAP
**Then**:
- x_eoap_access_owner preenchido
- x_eoap_data_classification preenchido

#### Test 3: CSDM Relationships

**Given**: cmdb_ci_business_app existe
**When**: Verificar relações CSDM
**Then**:
- Relação com cmdb_ci_service_discovered configurada
- Relação com cmdb_ci_business_service configurada
- Hierarquia correta

#### Test 4: CMDB Quality Gate

**Given**: CMDB quality < 95%
**When**: EOAP_Flow_Change_Risk_Assessment executado
**Then**: Risk band = Unknown

#### Test 5: CMDB Quality Report

**Given**: CMDB Quality Report executado
**When**: Verificar output
**Then**:
- Completeness rate calculado
- Accuracy rate calculado
- Freshness rate calculado

### 2.3 Configuração

**Application**: EOAP

**Test User**: eoap_cmdb_manager_user

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate
- CMDB quality ≥ 95%

---

## 3. Suite: EOAP_ATF_Employee_Lifecycle

### 3.1 Objetivo

Validar flows de onboarding, move e offboarding.

### 3.2 Testes

#### Test 1: Onboarding - Happy Path

**Given**: Novo funcionário criado em HRIS
**When**: Event eoap.employee.created recebido
**Then**:
- EOAP_Flow_Employee_Onboarding executado
- Default access concedido
- Audit trail gerado
- Manager notificado
- Event eoap.access.granted publicado

#### Test 2: Onboarding - Idempotency

**Given**: Event eoap.employee.created duplicado
**When**: Event recebido pela segunda vez
**Then**:
- Event ignorado (ignored_duplicate)
- Access não duplicado
- Audit trail não duplicado

#### Test 3: Move - Happy Path

**Given**: Funcionário mudou de departamento
**When**: Event eoap.employee.moved recebido
**Then**:
- EOAP_Flow_Employee_Move executado
- Old access revogado
- New access concedido
- Audit trail gerado

#### Test 4: Move - Diff Analysis

**Given**: Funcionário mudou de departamento
**When**: Diff analysis executado
**Then**:
- Apenas access diferente revogado
- Apenas access diferente concedido
- Access comum mantido

#### Test 5: Offboarding - Happy Path

**Given**: Funcionário terminado
**When**: Event eoap.employee.terminated recebido
**Then**:
- EOAP_Flow_Employee_Offboarding executado
- Todos os acessos revogados
- IAM deprovisionado
- Audit trail gerado
- SLA < 60s

#### Test 6: Offboarding - SLA

**Given**: Funcionário com 10 acessos terminado
**When**: EOAP_Flow_Employee_Offboarding executado
**Then**: Tempo total < 60s

#### Test 7: Offboarding - IAM Integration

**Given**: Funcionário terminado
**When**: IAM deprovision chamado
**Then**: Access revogado em IAM

#### Test 8: Offboarding - Failure Handling

**Given**: IAM offline durante offboarding
**When**: EOAP_Flow_Employee_Offboarding executado
**Then**:
- Event em DLQ
- Retry automático
- Manual retry após IAM recovery

### 3.3 Configuração

**Application**: EOAP

**Test User**: eoap_admin_user

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate
- SLAs atendidos

---

## 4. Suite: EOAP_ATF_Access_Governance

### 4.1 Objetivo

Validar governança de acesso (request, approve, reject, exception, recertification).

### 4.2 Testes

#### Test 1: Access Request - Happy Path

**Given**: Usuário solicita access
**When**: EOAP_Flow_Access_Request executado
**Then**:
- Request criado
- Approval routing executado
- Se aprovado → Access concedido
- Audit trail gerado

#### Test 2: Access Request - Approval Routing

**Given**: Usuário solicita access para Restricted data
**When**: DT_Access_Approval_Routing executado
**Then**:
- approval_required = true
- approval_level = Level 3
- Grupo correto atribuído

#### Test 3: Access Request - Rejection

**Given**: Access request rejeitado
**When**: EOAP_Flow_Access_Request executado
**Then**:
- Access não concedido
- Usuário notificado
- Audit trail gerado

#### Test 4: Access Request - Emergency Exception

**Given**: Usuário solicita emergency access
**When**: DT_Access_Approval_Routing executado
**Then**:
- auto_approve = true
- approval_required = false
- Access concedido imediatamente

#### Test 5: Access Exception - Request

**Given**: Usuário solicita exception
**When**: Exception request criado
**Then**:
- Justificativa requerida
- Approval requerido
- Valid_to configurado

#### Test 6: Access Exception - Approval

**Given**: Exception request aprovado
**When**: Exception ativa
**Then**:
- Access concedido
- Valid_from configurado
- Valid_to configurado
- Review_required configurado

#### Test 7: Access Exception - Expiration

**Given**: Exception expirada
**When**: Scheduled job executado
**Then**:
- Status = expired
- Access revogado
- Usuário notificado

#### Test 8: Recertification - Trigger

**Given**: Access expirando em 30 dias
**When**: Recertification job executado
**Then**:
- Notificação enviada
- Task criada
- Deadline configurado

#### Test 9: Recertification - Approval

**Given**: Recertification task aprovada
**When**: Task completado
**Then**:
- valid_to estendido
- Audit trail gerado

#### Test 10: Recertification - Rejection

**Given**: Recertification task rejeitada
**When**: Task completado
**Then**:
- Access revogado
- Audit trail gerado

### 4.3 Configuração

**Application**: EOAP

**Test User**: eoap_access_owner_user

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate

---

## 5. Suite: EOAP_ATF_Change_Risk

### 5.1 Objetivo

Validar cálculo de risco de mudança.

### 5.2 Testes

#### Test 1: Risk Calculation - Happy Path

**Given**: Change request criado
**When**: EOAP_Flow_Change_Risk_Assessment executado
**Then**:
- Risk score calculado
- Risk band determinado
- x_eoap_risk_score preenchido
- x_eoap_risk_band preenchido
- x_eoap_risk_explanation preenchido

#### Test 2: Risk Calculation - CMDB High Quality

**Given**: CMDB quality = High
**When**: EOAP_RiskEngine executado
**Then**: Weight = 30

#### Test 3: Risk Calculation - CMDB Critical Quality

**Given**: CMDB quality = Critical
**When**: EOAP_RiskEngine executado
**Then**: Weight = 40

#### Test 4: Risk Calculation - CMDB Unknown

**Given**: CMDB data ausente
**When**: EOAP_RiskEngine executado
**Then**: Risk band = Unknown

#### Test 5: Risk Calculation - Emergency Change

**Given**: Emergency change
**When**: EOAP_RiskEngine executado
**Then**: Weight = 30

#### Test 6: Risk Calculation - Performance

**Given**: Change request com 10 fatores de risco
**When**: EOAP_Flow_Change_Risk_Assessment executado
**Then**: Tempo total < 5s

### 5.3 Configuração

**Application**: EOAP

**Test User**: eoap_change_manager_user

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate
- Performance < 5s

---

## 6. Suite: EOAP_ATF_Security_Negative

### 6.1 Objetivo

Validar segurança através de testes negativos (o que não deve funcionar).

### 6.2 Testes

#### Test 1: ACL - Deny by Default

**Given**: Usuário sem role EOAP
**When**: Tentar acessar x_eoap_user_access
**Then**: Acesso negado

#### Test 2: ACL - Create Protection

**Given**: Usuário com role x_eoap_manager
**When**: Tentar criar registro em x_eoap_user_access
**Then**: Criação bloqueada

#### Test 3: ACL - Delete Protection

**Given**: Usuário com role x_eoap_admin
**When**: Tentar deletar registro em x_eoap_user_access
**Then**: Deleção bloqueada

#### Test 4: Field ACL - Risk Rating

**Given**: Usuário com role x_eoap_access_owner
**When**: Tentar modificar risk_rating
**Then**: Modificação bloqueada

#### Test 5: Audit Trail - Write Protection

**Given**: Usuário com role x_eoap_admin
**When**: Tentar atualizar registro em x_eoap_audit_trail
**Then**: Atualização bloqueada

#### Test 6: Audit Trail - Delete Protection

**Given**: Usuário com role x_eoap_admin
**When**: Tentar deletar registro em x_eoap_audit_trail
**Then**: Deleção bloqueada

#### Test 7: SoD - Requester Cannot Approve Own Request

**Given**: Usuário solicita access
**When**: Usuário tenta aprovar próprio request
**Then**: Aprovação bloqueada

#### Test 8: Cross-Role - Risk Analyst Cannot Modify Access

**Given**: Usuário com role x_eoap_risk_analyst
**When**: Tentar modificar registro em x_eoap_user_access
**Then**: Modificação bloqueada

### 6.3 Configuração

**Application**: EOAP

**Test User**: eoap_auditor_user

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate
- No security vulnerability

---

## 7. Suite: EOAP_ATF_Events

### 7.1 Objetivo

Validar processamento de eventos.

### 7.2 Testes

#### Test 1: Event Processing - Happy Path

**Given**: Event eoap.employee.created recebido
**When**: EOAP_EventProcessor executado
**Then**:
- Event processado
- Status = processed
- correlation_id propagado

#### Test 2: Event Processing - Duplicate

**Given**: Event eoap.employee.created duplicado
**When**: EOAP_EventProcessor executado
**Then**:
- Event ignorado
- Status = ignored_duplicate
- Idempotency mantida

#### Test 3: Event Processing - Retry Transient

**Given**: Event com erro transitório
**When**: EOAP_EventProcessor executado
**Then**:
- Retry automático (3×)
- Status = processed se sucesso
- Status = failed_final se falha persistente

#### Test 4: Event Processing - DLQ

**Given**: Event com erro permanente
**When**: EOAP_EventProcessor executado
**Then**:
- Retry automático (3×)
- Status = failed_final
- Event em DLQ

#### Test 5: Event Processing - Correlation ID

**Given**: Event com correlation_id
**When**: EOAP_EventProcessor executado
**Then**:
- correlation_id propagado para audit trail
- correlation_id propagado para subflows

#### Test 6: Event Processing - Performance

**Given**: 100 eventos simultâneos
**When**: EOAP_EventProcessor executado
**Then**: Tempo médio < 30s

### 7.3 Configuração

**Application**: EOAP

**Test User**: eoap_admin_user

**Schedule**: Cada commit (CI/CD)

**Gates**:
- 100% pass rate
- Performance < 30s

---

## 8. ATF Configuration

### 8.1 Test Environment

**Ambiente**: PDI (Personal Developer Instance)

**Data**: Synthetic

**Mock Services**:
- IAM: Mock
- HRIS: Mock
- SIEM: Mock

### 8.2 Test Users

| Test User | Role | Propósito |
| --- | --- | --- |
| eoap_admin_user | x_eoap_admin | Admin tests |
| eoap_cmdb_manager_user | x_eoap_cmdb_manager | CMDB tests |
| eoap_access_owner_user | x_eoap_access_owner | Access governance tests |
| eoap_change_manager_user | x_eoap_change_manager | Change risk tests |
| eoap_risk_analyst_user | x_eoap_risk_analyst | Risk analysis tests |
| eoap_auditor_user | x_eoap_auditor | Security tests |
| eoap_manager_user | x_eoap_manager | User tests |

### 8.3 Test Execution

**Schedule**: Cada commit (CI/CD)

**Execution Order**:
1. EOAP_ATF_CMDB_Foundation
2. EOAP_ATF_Security_Negative
3. EOAP_ATF_Employee_Lifecycle
4. EOAP_ATF_Access_Governance
5. EOAP_ATF_Change_Risk
6. EOAP_ATF_Events

**Total Execution Time**: < 10 minutos

### 8.4 Test Gates

**Pre-Commit Gates**:
- Unit tests pass
- Integration tests pass
- Coverage ≥ threshold

**Pre-Release Gates**:
- Full ATF suite pass
- 100% pass rate
- No security vulnerability
- Performance SLOs atendidos

**Go-Live Gates**:
- Full ATF suite pass em QA
- Full ATF suite pass em UAT
- 100% pass rate
- No critical defect

---

## 9. ATF Maintenance

### 9.1 Test Maintenance

**Responsável**: x_eoap_admin

**Frequência**: Monthly

**Atividades**:
- Review test coverage
- Update test data
- Fix broken tests
- Remove obsolete tests
- Add new tests para novas funcionalidades

### 9.2 Test Data Management

**Refresh**: Weekly

**Strategy**:
- Synthetic data versionado
- Data representativo de produção
- Data anonymized

### 9.3 Test Reporting

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
- Go/No-Go recommendation

---

## 10. ATF Best Practices

### 10.1 Test Design

**Princípios**:
- Given-When-Then pattern
- Test independente
- Test determinístico
- Test rápido (< 30s)
- Test legível

### 10.2 Test Data

**Princípios**:
- Data synthetic
- Data versionado
- Data isolado
- Data representativo

### 10.3 Test Maintenance

**Princípios**:
- Test versionado com código
- Test review em code review
- Test atualizado com mudanças
- Test documentado

---

*ATF Strategy - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
