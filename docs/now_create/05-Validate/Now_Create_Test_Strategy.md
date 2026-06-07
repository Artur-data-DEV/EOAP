# Now Create Test Strategy - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Test Strategy |
| Now Create Phase | 05-Validate |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| QA Lead | QA Lead |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Estratégia de Test Corporativo |

---

## 1. Test Strategy Overview

### 1.1 Testing Philosophy

**Shift-Left**: Testar o mais cedo possível no ciclo de desenvolvimento

**Test Automation**: Automatizar testes repetitivos para garantir consistência

**Test Coverage**: Alcançar ≥ 80% code coverage e 100% ATF pass rate

**Test-Driven**: Desenvolver testes em paralelo com desenvolvimento

**Continuous Testing**: Executar testes continuamente em CI/CD

### 1.2 Test Pyramid

```
         /\
        /E2E\      ← 5% (End-to-End)
       /------\
      /Integration\  ← 25% (Integration)
     /------------\
    /   Unit Tests  \  ← 70% (Unit)
   /----------------\
```

### 1.3 Test Types

| Test Type | Purpose | Tool | Coverage Target |
| --- | --- | --- | --- |
| Unit Test | Testar unidades de código isoladas | ATF, Jest | 80% |
| Integration Test | Testar integrações entre componentes | ATF, Postman | 90% |
| System Test | Testar sistema completo end-to-end | ATF, Selenium | 95% |
| UAT Test | Testar requisitos de usuário | Manual, ATF | 100% |
| Security Test | Testar vulnerabilidades de segurança | OWASP ZAP, Burp Suite | 100% |
| Performance Test | Testar performance e escalabilidade | JMeter, LoadRunner | 100% |

---

## 2. Unit Test Strategy

### 2.1 Objetivo

Testar unidades de código isoladas (Script Includes, Business Rules, Decision Tables).

### 2.2 Pré-condições

- Ambiente DEV disponível
- Código desenvolvido
- Test data disponível

### 2.3 Passos

1. Identificar unidades de código a testar
2. Escrever test cases para cada unidade
3. Executar testes
4. Validar resultados
5. Reportar defects

### 2.4 Resultado Esperado

- Code coverage ≥ 80%
- Todos os testes pass
- Defects documentados

### 2.5 Test Cases

#### UT-001: EOAP_AuditLogger.logEvent

**Objetivo**: Testar método logEvent de EOAP_AuditLogger

**Pré-condições**:
- Script Include EOAP_AuditLogger criado
- Tabela x_eoap_audit_trail criada

**Passos**:
1. Criar instância de EOAP_AuditLogger
2. Chamar logEvent com parâmetros válidos
3. Verificar registro criado em x_eoap_audit_trail
4. Verificar campos preenchidos corretamente

**Resultado Esperado**:
- Registro criado
- Campos preenchidos corretamente
- correlation_id gerado

---

#### UT-002: EOAP_RiskEngine.calculateRisk

**Objetivo**: Testar método calculateRisk de EOAP_RiskEngine

**Pré-condições**:
- Script Include EOAP_RiskEngine criado
- Decision Table x_eoap_dt_risk_weights criada
- Decision Table x_eoap_dt_risk_banding criada

**Passos**:
1. Criar instância de EOAP_RiskEngine
2. Chamar calculateRisk com change_request_sys_id válido
3. Verificar risk score calculado
4. Verificar risk band aplicado
5. Verificar evidence armazenada

**Resultado Esperado**:
- Risk score calculado corretamente
- Risk band aplicado corretamente
- Evidence armazenada

---

#### UT-003: EOAP_AccessGovernanceService.grantAccess

**Objetivo**: Testar método grantAccess de EOAP_AccessGovernanceService

**Pré-condições**:
- Script Include EOAP_AccessGovernanceService criado
- Tabela x_eoap_user_access criada

**Passos**:
1. Criar instância de EOAP_AccessGovernanceService
2. Chamar grantAccess com parâmetros válidos
3. Verificar x_eoap_user_access criado
4. Verificar status = active
5. Verificar correlation_id gerado

**Resultado Esperado**:
- x_eoap_user_access criado
- Status = active
- correlation_id gerado

---

#### UT-004: EOAP_EventProcessor.processEvent

**Objetivo**: Testar método processEvent de EOAP_EventProcessor

**Pré-condições**:
- Script Include EOAP_EventProcessor criado
- Tabela x_eoap_event_processing criada

**Passos**:
1. Criar instância de EOAP_EventProcessor
2. Chamar processEvent com event_type válido
3. Verificar x_eoap_event_processing criado
4. Verificar status = processed
5. Verificar correlation_id gerado

**Resultado Esperado**:
- x_eoap_event_processing criado
- Status = processed
- correlation_id gerado

---

#### UT-005: Decision Table - Access Approval Routing

**Objetivo**: Testar Decision Table x_eoap_dt_access_approval_routing

**Pré-condições**:
- Decision Table x_eoap_dt_access_approval_routing criada

**Passos**:
1. Testar Rule 1: Restricted Data → Level 3
2. Testar Rule 2: Confidential Data → Level 2
3. Testar Rule 4: Emergency Exception → Auto-approve
4. Testar Rule 5: Default → Level 1

**Resultado Esperado**:
- Todas as rules funcionam corretamente
- Outputs corretos

---

### 2.6 Test Data Strategy

**Test Data**:
- Usar dados sintéticos (não usar dados reais)
- Criar test users (test.user1, test.user2, etc.)
- Criar test applications (Test App 1, Test App 2, etc.)
- Criar test change requests

**Test Data Management**:
- Test data criado via Script: Background Scripts
- Test data limpo após cada execução
- Test data versionado

---

## 3. Integration Test Strategy

### 3.1 Objetivo

Testar integrações entre componentes (Flows, Subflows, Decision Tables, Script Includes).

### 3.2 Pré-condições

- Ambiente TEST disponível
- Componentes desenvolvidos
- Unit tests pass

### 3.3 Passos

1. Identificar integrações a testar
2. Escrever test cases para cada integração
3. Executar testes
4. Validar resultados
5. Reportar defects

### 3.4 Resultado Esperado

- Integrações funcionam corretamente
- Handoffs funcionam corretamente
- Error handling funciona corretamente
- Defects documentados

### 3.5 Test Cases

#### IT-001: Flow - Employee Onboarding Happy Path

**Objetivo**: Testar Flow EOAP_Flow_Employee_Onboarding happy path

**Pré-condições**:
- Flow EOAP_Flow_Employee_Onboarding criado
- Subflows criados
- Decision Tables criadas
- Script Includes criados

**Passos**:
1. Publicar event `eoap.employee.created`
2. Verificar Flow executado
3. Verificar default access concedido
4. Verificar audit trail gerado
5. Verificar manager notificado
6. Verificar SLA < 30s

**Resultado Esperado**:
- Flow executado
- Default access concedido
- Audit trail gerado
- Manager notificado
- SLA < 30s

---

#### IT-002: Flow - Employee Move Happy Path

**Objetivo**: Testar Flow EOAP_Flow_Employee_Move happy path

**Pré-condições**:
- Flow EOAP_Flow_Employee_Move criado
- Subflows criados
- Decision Tables criadas
- Script Includes criados

**Passos**:
1. Publicar event `eoap.employee.moved`
2. Verificar Flow executado
3. Verificar diff analysis executado
4. Verificar old access revogado
5. Verificar new access concedido
6. Verificar common access mantido
7. Verificar audit trail gerado
8. Verificar SLA < 30s

**Resultado Esperado**:
- Flow executado
- Diff analysis executado
- Old access revogado
- New access concedido
- Common access mantido
- Audit trail gerado
- SLA < 30s

---

#### IT-003: Flow - Employee Offboarding Happy Path

**Objetivo**: Testar Flow EOAP_Flow_Employee_Offboarding happy path

**Pré-condições**:
- Flow EOAP_Flow_Employee_Offboarding criado
- Subflows criados
- Script Includes criados
- IAM integration configurada

**Passos**:
1. Publicar event `eoap.employee.terminated`
2. Verificar Flow executado
3. Verificar todos os acessos identificados
4. Verificar todos os acessos revogados
5. Verificar IAM deprovision chamado
6. Verificar audit trail gerado
7. Verificar manager notificado
8. Verificar SLA < 60s

**Resultado Esperado**:
- Flow executado
- Todos os acessos revogados
- IAM deprovision chamado
- Audit trail gerado
- Manager notificado
- SLA < 60s

---

#### IT-004: Integration - IAM Provision

**Objetivo**: Testar integração IAM provision

**Pré-condições**:
- Integration Hub Spoke IAM criado
- IAM endpoint configurado

**Passos**:
1. Chamar IAM provision endpoint
2. Verificar request enviado
3. Verificar response recebida
4. Verificar access provisionado em IAM

**Resultado Esperado**:
- Request enviado
- Response recebida
- Access provisionado em IAM

---

#### IT-005: Integration - HRIS Employee Events

**Objetivo**: Testar integração HRIS employee events

**Pré-condições**:
- Integration Hub Spoke HRIS criado
- HRIS endpoint configurado

**Passos**:
1. Publicar employee event em HRIS
2. Verificar event recebido via Integration Hub
3. Verificar event interno publicado
4. Verificar correlation_id gerado

**Resultado Esperado**:
- Event recebido
- Event interno publicado
- correlation_id gerado

---

### 3.6 Test Data Strategy

**Test Data**:
- Usar dados sintéticos
- Criar test employees
- Criar test applications
- Criar test change requests

**Test Data Management**:
- Test data criado via Script: Background Scripts
- Test data limpo após cada execução
- Test data versionado

---

## 4. System Test Strategy

### 4.1 Objetivo

Testar sistema completo end-to-end.

### 4.2 Pré-condições

- Ambiente TEST disponível
- Todos os componentes desenvolvidos
- Integration tests pass

### 4.3 Passos

1. Identificar cenários end-to-end a testar
2. Escrever test cases para cada cenário
3. Executar testes
4. Validar resultados
5. Reportar defects

### 4.4 Resultado Esperado

- Sistema funciona end-to-end
- Todos os requisitos validados
- Defects documentados

### 4.5 Test Cases

#### ST-001: Employee Lifecycle End-to-End

**Objetivo**: Testar employee lifecycle completo (onboarding, move, offboarding)

**Pré-condições**:
- Sistema completo desenvolvido
- Integration tests pass

**Passos**:
1. Criar employee em HRIS
2. Verificar onboarding executado
3. Mover employee em HRIS
4. Verificar move executado
5. Terminar employee em HRIS
6. Verificar offboarding executado
7. Verificar audit trail completo

**Resultado Esperado**:
- Onboarding executado
- Move executado
- Offboarding executado
- Audit trail completo

---

#### ST-002: Access Governance End-to-End

**Objetivo**: Testar access governance completo (request, approval, provisioning)

**Pré-condições**:
- Sistema completo desenvolvido
- Integration tests pass

**Passos**:
1. Solicitar access via Service Catalog
2. Verificar request validado
3. Verificar approval roteado
4. Aprovar request
5. Verificar access concedido
6. Verificar audit trail gerado

**Resultado Esperado**:
- Request validado
- Approval roteado
- Access concedido
- Audit trail gerado

---

#### ST-003: Change Risk End-to-End

**Objetivo**: Testar change risk assessment completo

**Pré-condições**:
- Sistema completo desenvolvido
- Integration tests pass

**Passos**:
1. Criar change request
2. Verificar risk calculado
3. Verificar risk band aplicado
4. Verificar evidence armazenada
5. Verificar risk exibido na change

**Resultado Esperado**:
- Risk calculado
- Risk band aplicado
- Evidence armazenada
- Risk exibido na change

---

### 4.6 Test Data Strategy

**Test Data**:
- Usar dados sintéticos
- Criar test employees
- Criar test applications
- Criar test change requests

**Test Data Management**:
- Test data criado via Script: Background Scripts
- Test data limpo após cada execução
- Test data versionado

---

## 5. UAT Test Strategy

### 5.1 Objetivo

Validar requisitos de usuário com stakeholders reais.

### 5.2 Pré-condições

- Ambiente UAT disponível
- Sistema completo desenvolvido
- System tests pass
- Stakeholders disponíveis

### 5.3 Passos

1. Identificar requisitos de usuário a validar
2. Escrever scripts de UAT
3. Treinar stakeholders
4. Executar UAT
5. Coletar feedback
6. Reportar defects
7. Obter sign-off

### 5.4 Resultado Esperado

- Todos os requisitos validados
- Stakeholders satisfeitos
- UAT sign-off obtido
- Defects documentados

### 5.5 UAT Scripts

#### UAT-001: Onboarding de Novo Funcionário

**Objetivo**: Validar onboarding de novo funcionário

**Pré-condições**:
- Ambiente UAT disponível
- Stakeholder: HR Manager

**Passos**:
1. HR Manager cria novo funcionário em HRIS
2. HR Manager aguarda 30 segundos
3. HR Manager verifica access concedido
4. HR Manager verifica notificação recebida
5. HR Manager valida audit trail

**Resultado Esperado**:
- Access concedido
- Notificação recebida
- Audit trail visível

**Critério de Aceitação**:
- [ ] Access concedido corretamente
- [ ] Notificação recebida
- [ ] Audit trail visível
- [ ] HR Manager satisfeito

---

#### UAT-002: Solicitação de Acesso

**Objetivo**: Validar solicitação de acesso

**Pré-condições**:
- Ambiente UAT disponível
- Stakeholder: Employee

**Passos**:
1. Employee navega para Service Catalog
2. Employee solicita access para CRM
3. Employee fornece justificativa
4. Employee submete request
5. Employee aguarda aprovação
6. Access Owner aprova request
7. Employee verifica access concedido

**Resultado Esperado**:
- Request submetido
- Approval recebido
- Access concedido

**Critério de Aceitação**:
- [ ] Request submetido
- [ ] Approval recebido
- [ ] Access concedido
- [ ] Employee satisfeito

---

#### UAT-003: Offboarding de Funcionário

**Objetivo**: Validar offboarding de funcionário

**Pré-condições**:
- Ambiente UAT disponível
- Stakeholder: HR Manager

**Passos**:
1. HR Manager termina funcionário em HRIS
2. HR Manager aguarda 60 segundos
3. HR Manager verifica access revogado
4. HR Manager verifica notificação recebida
5. HR Manager valida audit trail

**Resultado Esperado**:
- Access revogado
- Notificação recebida
- Audit trail visível

**Critério de Aceitação**:
- [ ] Access revogado
- [ ] Notificação recebida
- [ ] Audit trail visível
- [ ] HR Manager satisfeito

---

### 5.6 Test Data Strategy

**Test Data**:
- Usar dados sintéticos
- Criar test employees
- Criar test applications
- Criar test change requests

**Test Data Management**:
- Test data criado via Script: Background Scripts
- Test data limpo após cada execução
- Test data versionado

---

## 6. Security Test Strategy

### 6.1 Objetivo

Testar vulnerabilidades de segurança.

### 6.2 Pré-condições

- Ambiente TEST disponível
- Sistema completo desenvolvido
- System tests pass

### 6.3 Passos

1. Identificar vulnerabilidades a testar
2. Executar security tests
3. Validar resultados
4. Reportar defects
5. Remediação

### 6.4 Resultado Esperado

- Nenhuma vulnerabilidade crítica
- Vulnerabilidades documentadas
- Remediação planejada

### 6.5 Test Cases

#### SEC-001: Authentication Test

**Objetivo**: Testar autenticação OAuth 2.0

**Pré-condições**:
- OAuth 2.0 configurado

**Passos**:
1. Tentar acessar API sem token
2. Verificar acesso negado
3. Tentar acessar API com token inválido
4. Verificar acesso negado
5. Tentar acessar API com token válido
6. Verificar acesso concedido

**Resultado Esperado**:
- Acesso negado sem token
- Acesso negado com token inválido
- Acesso concedido com token válido

---

#### SEC-002: ACL Test

**Objetivo**: Testar ACL deny-by-default

**Pré-condições**:
- ACLs configuradas

**Passos**:
1. Tentar acessar tabela sem role
2. Verificar acesso negado
3. Tentar deletar audit trail
4. Verificar acesso negado
5. Tentar ler audit trail com role x_eoap_auditor
6. Verificar acesso concedido

**Resultado Esperado**:
- Acesso negado sem role
- Acesso negado para delete
- Acesso concedido com role

---

#### SEC-003: SQL Injection Test

**Objetivo**: Testar vulnerabilidade SQL injection

**Pré-condições**:
- Sistema completo desenvolvido

**Passos**:
1. Tentar SQL injection em input fields
2. Verificar input sanitizado
3. Verificar query protegida

**Resultado Esperado**:
- Input sanitizado
- Query protegida

---

#### SEC-004: XSS Test

**Objetivo**: Testar vulnerabilidade XSS

**Pré-condições**:
- Sistema completo desenvolvido

**Passos**:
1. Tentar XSS em input fields
2. Verificar input sanitizado
3. Verificar output escapado

**Resultado Esperado**:
- Input sanitizado
- Output escapado

---

### 6.6 Test Data Strategy

**Test Data**:
- Usar dados sintéticos
- Criar test users
- Criar test applications

**Test Data Management**:
- Test data criado via Script: Background Scripts
- Test data limpo após cada execução
- Test data versionado

---

## 7. Performance Test Strategy

### 7.1 Objetivo

Testar performance e escalabilidade.

### 7.2 Pré-condições

- Ambiente TEST disponível
- Sistema completo desenvolvido
- System tests pass

### 7.3 Passos

1. Identificar performance targets
2. Criar testes de carga
3. Executar testes
4. Validar resultados
5. Reportar defects
6. Otimização

### 7.4 Resultado Esperado

- Performance targets atendidos
- Escalabilidade validada
- Defects documentados

### 7.5 Test Cases

#### PERF-001: Offboarding SLA

**Objetivo**: Testar offboarding SLA < 60s

**Pré-condições**:
- Sistema completo desenvolvido

**Passos**:
1. Criar employee com 10 acessos
2. Terminar employee em HRIS
3. Medir tempo total de offboarding
4. Verificar SLA < 60s

**Resultado Esperado**:
- Tempo total < 60s

---

#### PERF-002: Risk Calculation SLA

**Objetivo**: Testar risk calculation SLA < 5s

**Pré-condições**:
- Sistema completo desenvolvido

**Passos**:
1. Criar change request
2. Medir tempo de risk calculation
3. Verificar SLA < 5s

**Resultado Esperado**:
- Tempo < 5s

---

#### PERF-003: Event Processing SLA

**Objetivo**: Testar event processing SLA < 30s

**Pré-condições**:
- Sistema completo desenvolvido

**Passos**:
1. Publicar event `eoap.employee.created`
2. Medir tempo de event processing
3. Verificar SLA < 30s

**Resultado Esperado**:
- Tempo < 30s

---

#### PERF-004: Load Test - 10K user_access

**Objetivo**: Testar capacidade Ano 1 (10K user_access)

**Pré-condições**:
- Sistema completo desenvolvido

**Passos**:
1. Criar 10K user_access records
2. Executar load test
3. Medir response time
4. Verificar response time < 3s

**Resultado Esperado**:
- Response time < 3s

---

#### PERF-005: Stress Test - 50K user_access

**Objetivo**: Testar capacidade Ano 3 (50K user_access)

**Pré-condições**:
- Sistema completo desenvolvido

**Passos**:
1. Criar 50K user_access records
2. Executar stress test
3. Medir response time
4. Verificar response time < 5s

**Resultado Esperado**:
- Response time < 5s

---

### 7.6 Test Data Strategy

**Test Data**:
- Usar dados sintéticos
- Criar 10K user_access records
- Criar 50K user_access records

**Test Data Management**:
- Test data criado via Script: Background Scripts
- Test data limpo após cada execução
- Test data versionado

---

## 8. ATF Test Strategy

### 8.1 Objetivo

Automatizar testes via ATF (Automated Test Framework).

### 8.2 Pré-condições

- Ambiente TEST disponível
- Sistema completo desenvolvido
- ATF plugin instalado

### 8.3 ATF Suites

#### ATF Suite 1: EOAP_ATF_CMDB_Foundation

**Testes**:
- Test 1: CMDB Completeness - Business App
- Test 2: CMDB Completeness - Service
- Test 3: CSDM Relationships
- Test 4: CMDB Quality Gate
- Test 5: CMDB Quality Report

**Coverage**: CMDB Foundation

---

#### ATF Suite 2: EOAP_ATF_Employee_Lifecycle

**Testes**:
- Test 1: Onboarding - Happy Path
- Test 2: Onboarding - Idempotency
- Test 3: Move - Happy Path
- Test 4: Move - Diff Analysis
- Test 5: Offboarding - Happy Path
- Test 6: Offboarding - SLA
- Test 7: Offboarding - IAM Integration
- Test 8: Offboarding - Failure Handling

**Coverage**: Employee Lifecycle

---

#### ATF Suite 3: EOAP_ATF_Access_Governance

**Testes**:
- Test 1: Access Request - Happy Path
- Test 2: Access Request - Validation
- Test 3: Access Approval - Happy Path
- Test 4: Access Approval - Routing
- Test 5: Access Exception - Request
- Test 6: Access Exception - Expiration

**Coverage**: Access Governance

---

#### ATF Suite 4: EOAP_ATF_Change_Risk

**Testes**:
- Test 1: Risk Calculation - Happy Path
- Test 2: Risk Calculation - Banding
- Test 3: Risk Calculation - CMDB Quality Gate
- Test 4: Risk Calculation - Unknown Band

**Coverage**: Change Risk

---

#### ATF Suite 5: EOAP_ATF_Security_Negative

**Testes**:
- Test 1: ACL - Deny-by-Default
- Test 2: ACL - Append-Only Audit Trail
- Test 3: ACL - Write-Only Risk Evidence
- Test 4: Authentication - OAuth 2.0
- Test 5: SQL Injection Protection
- Test 6: XSS Protection

**Coverage**: Security

---

#### ATF Suite 6: EOAP_ATF_Events

**Testes**:
- Test 1: Event Processing - Happy Path
- Test 2: Event Processing - Idempotency
- Test 3: Event Processing - DLQ
- Test 4: Event Processing - Retry
- Test 5: Event Processing - Correlation ID

**Coverage**: Event Processing

---

### 8.4 ATF Configuration

**ATF Configuration**:
- Criar 6 ATF suites
- Criar 43 test cases
- Configurar test data
- Configurar test schedule

### 8.5 ATF Execution

**Execution Schedule**:
- Executar ATF suites após cada sprint
- Executar ATF suites antes de UAT
- Executar ATF suites antes de go-live

**Execution Automation**:
- Configurar ATF para execução automática
- Configurar notificação de falha
- Configurar retry automático

### 8.6 ATF Results

**Expected Results**:
- ATF pass rate = 100%
- Todos os testes pass
- Defects documentados

---

## 9. Test Data Strategy

### 9.1 Objetivo

Gerenciar test data de forma consistente e controlada.

### 9.2 Princípios

- Usar dados sintéticos (não usar dados reais)
- Criar test data via Script: Background Scripts
- Limpar test data após cada execução
- Versionar test data

### 9.3 Test Data Components

**Test Users**:
- test.user1@company.com
- test.user2@company.com
- test.manager@company.com
- test.admin@company.com

**Test Applications**:
- Test App 1
- Test App 2
- Test App 3

**Test Change Requests**:
- CHG001001
- CHG001002
- CHG001003

### 9.4 Test Data Creation

**Script: Background Scripts**
```javascript
// Criar test users
var user = new GlideRecord('sys_user');
user.addQuery('user_name', 'STARTSWITH', 'test.user');
user.query();
while (user.next()) {
  user.deleteRecord();
}

// Criar test.user1
var user1 = new GlideRecord('sys_user');
user1.user_name = 'test.user1@company.com';
user1.first_name = 'Test';
user1.last_name = 'User1';
user1.insert();

// Criar test.user2
var user2 = new GlideRecord('sys_user');
user2.user_name = 'test.user2@company.com';
user2.first_name = 'Test';
user2.last_name = 'User2';
user2.insert();

gs.info('Test users created');
```

### 9.5 Test Data Cleanup

**Script: Background Scripts**
```javascript
// Limpar test users
var user = new GlideRecord('sys_user');
user.addQuery('user_name', 'STARTSWITH', 'test.user');
user.query();
while (user.next()) {
  user.deleteRecord();
}

gs.info('Test users deleted');
```

---

## 10. Defect Management Plan

### 10.1 Defect Classification

| Severity | Definition | SLA |
| --- | --- | --- |
| Critical | Sistema não funcional, bloqueia go-live | 24 horas |
| High | Funcionalidade crítica não funciona | 48 horas |
| Medium | Funcionalidade não crítica não funciona | 1 semana |
| Low | Cosmético, não afeta funcionalidade | 2 semanas |

### 10.2 Defect Lifecycle

1. **Discovery**: Defect descoberto durante teste
2. **Logging**: Defect logado em sistema de tracking
3. **Triage**: Defect triado (severity, priority)
4. **Assignment**: Defect atribuído a desenvolvedor
5. **Fix**: Desenvolvedor corrige defect
6. **Verification**: QA verifica correção
7. **Closure**: Defect fechado

### 10.3 Defect Tracking

**Tool**: ServiceNow Incident Management (ou JIRA)

**Fields**:
- Defect ID
- Title
- Description
- Severity
- Priority
- Status
- Assigned To
- Found In
- Fixed In
- Verified By

### 10.4 Defect Metrics

| Métrica | Target |
| --- | --- |
| Defect Discovery Rate | < 10 defects/1000 lines of code |
| Critical Defect Rate | 0 |
| High Defect Rate | < 5% |
| Medium Defect Rate | < 15% |
| Defect Fix Time (Critical) | < 24 horas |
| Defect Fix Time (High) | < 48 horas |
| Defect Fix Time (Medium) | < 1 semana |

---

## 11. Test Schedule

### 11.1 Test Schedule por Sprint

| Sprint | Unit Tests | Integration Tests | System Tests | ATF Tests |
| --- | --- | --- | --- | --- |
| Sprint 1 | Sim | Não | Não | Não |
| Sprint 2 | Sim | Sim | Não | Não |
| Sprint 3 | Sim | Sim | Não | Não |
| Sprint 4 | Sim | Sim | Sim | Não |
| Sprint 5 | Sim | Sim | Sim | Sim |
| Sprint 6 | Sim | Sim | Sim | Sim |

### 11.2 Test Schedule por Fase

| Fase | Unit Tests | Integration Tests | System Tests | UAT Tests | Security Tests | Performance Tests | ATF Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 04-Build | Sim | Não | Não | Não | Não | Não | Não |
| 05-Validate | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| 06-Deploy | Sim | Sim | Sim | Não | Sim | Sim | Sim |

---

## 12. Test Summary

### 12.1 Test Coverage Summary

| Test Type | Test Cases | Coverage Target | Coverage Actual |
| --- | --- | --- | --- |
| Unit Test | 5 | 80% | TBD |
| Integration Test | 5 | 90% | TBD |
| System Test | 3 | 95% | TBD |
| UAT Test | 3 | 100% | TBD |
| Security Test | 4 | 100% | TBD |
| Performance Test | 5 | 100% | TBD |
| ATF Test | 43 | 100% | TBD |
| **Total** | **68** | - | **TBD** |

### 12.2 Test Resources

| Role | FTE | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Sprint 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tester | 1.0 | 25% | 25% | 25% | 25% | 100% | 100% |
| Developer | 2.0 | 100% | 100% | 100% | 100% | 100% | 100% |
| Security Team | 0.5 | 0% | 0% | 0% | 0% | 25% | 25% |

---

*Test Strategy - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 05-Validate*
*Total Test Cases: 68*
*Total ATF Suites: 6*
*Total ATF Tests: 43*
