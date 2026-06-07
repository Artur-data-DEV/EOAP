# Now Create Backlog - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Backlog Executable |
| Now Create Phase | 02-Plan |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Product Owner | Enterprise Architecture Team |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Backlog Corporativo |

---

## 1. Backlog Overview

### 1.1 Backlog Structure

- **Epics**: Grandes iniciativas alinhadas aos objetivos de negócio
- **Features**: Funcionalidades específicas dentro de um Epic
- **User Stories**: Requisitos detalhados de um usuário específico
- **Acceptance Criteria**: Critérios de aceitação em formato Given-When-Then

### 1.2 Prioritization

| Priority | Definition |
| --- | --- |
| **P0 - Critical** | Must-have para go-live |
| **P1 - High** | Should-have para go-live |
| **P2 - Medium** | Nice-to-have, pode ser postergado |
| **P3 - Low** | Futuro, out-of-scope |

### 1.3 Story Points

| Story Points | Estimativa de Esforço |
| --- | --- |
| 1 | 0.5 dia |
| 2 | 1 dia |
| 3 | 2 dias |
| 5 | 3 dias |
| 8 | 5 dias |
| 13 | 8 dias |

---

## 2. Epic 1: Employee Lifecycle Automation

**Priority**: P0

**Description**: Automatizar employee lifecycle (onboarding, move, offboarding) para reduzir overhead operacional e garantir compliance.

**Business Value**: Redução de 80% em tempo de offboarding, 100% compliance para SOX

**Dependencies**: HRIS integration, Decision Tables, Flows

---

### Feature 1.1: Onboarding Automation

**Priority**: P0

**Description**: Automatizar onboarding de novos funcionários com concessão de default access

---

#### User Story 1.1.1: Onboarding Happy Path

**Priority**: P0

**Story Points**: 8

**As a** HR Manager

**I want** que o sistema conceda automaticamente default access para novos funcionários

**So that** novos funcionários tenham acesso necessário imediatamente e o overhead seja reduzido

**Acceptance Criteria**:

**Given**:
- Novo funcionário criado em HRIS
- Event `eoap.employee.created` é recebido
- Default access profiles configurados para employee_type e department

**When**:
- Event é processado

**Then**:
- Sistema identifica employee_type e department
- Sistema consulta Decision Table para default access profiles
- Sistema solicita aprovação do manager (se necessário)
- Sistema concede access aprovado
- Sistema publica evento `eoap.access.granted`
- Sistema loga audit trail (entity_type: x_eoap_user_access, action: access_granted)
- Sistema notifica manager via email
- Sistema notifica funcionário via email
- SLA < 30s

---

#### User Story 1.1.2: Onboarding Idempotency

**Priority**: P0

**Story Points**: 5

**As a** System Administrator

**I want** que eventos duplicados de onboarding sejam ignorados

**So that** access não seja duplicado e o sistema seja idempotente

**Acceptance Criteria**:

**Given**:
- Event `eoap.employee.created` é recebido
- Funcionário já tem access ativo

**When**:
- Event é processado

**Then**:
- Sistema detecta duplicata via correlation_id
- Sistema ignora evento
- Sistema loga warning (ignored_duplicate)
- Access não é duplicado
- Audit trail não é duplicado

---

#### User Story 1.1.3: Onboarding Failure Handling

**Priority**: P1

**Story Points**: 5

**As a** System Administrator

**I want** que falhas de onboarding sejam tratadas gracefulmente

**So that** o sistema seja resiliente e recoverable

**Acceptance Criteria**:

**Given**:
- Event `eoap.employee.created` é recebido
- IAM integration falha

**When**:
- Event é processado

**Then**:
- Sistema loga error crítico
- Sistema coloca evento em DLQ (Dead Letter Queue)
- Sistema notifica administrator
- Sistema agenda retry automático (3 tentativas, exponential backoff)
- Sistema permite manual retry após IAM recovery

---

### Feature 1.2: Move Automation

**Priority**: P0

**Description**: Automatizar mudança de funcionário (department, location, role) com diff analysis de access

---

#### User Story 1.2.1: Move Happy Path

**Priority**: P0

**Story Points**: 8

**As a** HR Manager

**I want** que o sistema identifique e aplique apenas access diferente quando funcionário muda

**So that** access comum seja mantido e apenas access diferente seja alterado

**Acceptance Criteria**:

**Given**:
- Funcionário mudou em HRIS (department, location, role)
- Event `eoap.employee.moved` é recebido
- Funcionário tem access ativo

**When**:
- Event é processado

**Then**:
- Sistema identifica old access profiles (baseado em old employee_type, old department)
- Sistema identifica new access profiles (baseado em new employee_type, new department)
- Sistema calcula diff (access a revogar, access a conceder, access comum)
- Sistema revoga access não mais necessário
- Sistema concede access novo necessário
- Sistema mantém access comum
- Sistema loga audit trail (entity_type: x_eoap_user_access, action: access_changed)
- Sistema notifica manager
- SLA < 30s

---

#### User Story 1.2.2: Move Diff Analysis

**Priority**: P0

**Story Points**: 5

**As a** System Administrator

**I want** que diff analysis identifique corretamente access a revogar, conceder e manter

**So that** access comum não seja afetado

**Acceptance Criteria**:

**Given**:
- Funcionário tem access: [CRM, ERP, HR Portal]
- Novo access profiles: [CRM, Finance System]

**When**:
- Diff analysis é executado

**Then**:
- Access a revogar: [HR Portal] (não está em new)
- Access a conceder: [Finance System] (não está em old)
- Access a manter: [CRM] (está em ambos)
- ERP é mantido se aplicável (validar lógica de negócio)

---

### Feature 1.3: Offboarding Automation

**Priority**: P0

**Description**: Automatizar offboarding de funcionários com revogação de todos os acessos e deprovisionamento em IAM

---

#### User Story 1.3.1: Offboarding Happy Path

**Priority**: P0

**Story Points**: 8

**As a** HR Manager

**I want** que o sistema revogue automaticamente todos os acessos quando funcionário é terminado

**So that** o risco de acesso residual seja eliminado e compliance seja garantido

**Acceptance Criteria**:

**Given**:
- Funcionário terminado em HRIS
- Event `eoap.employee.terminated` é recebido
- Funcionário tem 10 acessos ativos

**When**:
- Event é processado

**Then**:
- Sistema identifica todos os acessos ativos
- Sistema revoga todos os acessos em x_eoap_user_access
- Sistema deprovisiona todos os acessos em IAM
- Sistema publica evento `eoap.access.revoked`
- Sistema loga audit trail (entity_type: x_eoap_user_access, action: access_revoked)
- Sistema notifica manager
- Sistema notifica IAM administrator
- SLA < 60s

---

#### User Story 1.3.2: Offboarding SLA

**Priority**: P0

**Story Points**: 5

**As a** Compliance Officer

**I want** que offboarding complete em < 60s

**So that** o risco de acesso residual seja minimizado

**Acceptance Criteria**:

**Given**:
- Funcionário tem 10 acessos ativos
- Event `eoap.employee.terminated` é recebido

**When**:
- Offboarding é executado

**Then**:
- Tempo total < 60s
- Todos os 10 acessos revogados
- Todos os 10 acessos deprovisionados em IAM
- Audit trail completo

---

#### User Story 1.3.3: Offboarding Failure Handling

**Priority**: P1

**Story Points**: 5

**As a** System Administrator

**I want** que falhas de offboarding sejam tratadas gracefulmente

**So that** o sistema seja resiliente e recoverable

**Acceptance Criteria**:

**Given**:
- Event `eoap.employee.terminated` é recebido
- IAM integration falha

**When**:
- Offboarding é executado

**Then**:
- Sistema revoga access em x_eoap_user_access (governado)
- Sistema coloca deprovision em DLQ
- Sistema loga error crítico
- Sistema notifica administrator
- Sistema agenda retry automático (3 tentativas, exponential backoff)
- Sistema permite manual retry após IAM recovery

---

## 3. Epic 2: Access Governance

**Priority**: P0

**Description**: Governar access lifecycle com request, approval, provisioning e revocation

**Business Value**: 100% rastreabilidade, compliance para SOX, redução de access drift

**Dependencies**: Service Catalog, Decision Tables, Flows

---

### Feature 2.1: Access Request

**Priority**: P0

**Description**: Permitir solicitação de acesso via Service Catalog

---

#### User Story 2.1.1: Access Request Submission

**Priority**: P0

**Story Points**: 5

**As a** Employee

**I want** solicitar access via Service Catalog

**So that** eu possa obter access necessário para meu trabalho

**Acceptance Criteria**:

**Given**:
- Employee está logado
- Service Catalog EOAP está disponível

**When**:
- Employee submete access request

**Then**:
- Sistema valida request (application, justification)
- Sistema calcula risco de acesso (data_classification, access_criticality)
- Sistema roteia para aprovação (se necessário)
- Sistema notifica solicitante
- Sistema loga audit trail (entity_type: x_eoap_user_access, action: access_requested)

---

#### User Story 2.1.2: Access Request Validation

**Priority**: P0

**Story Points**: 3

**As a** System Administrator

**I want** que access request seja validado antes de submissão

**So that** requests inválidos sejam rejeitados

**Acceptance Criteria**:

**Given**:
- Employee submete access request

**When**:
- Request é validado

**Then**:
- Sistema valida que application existe
- Sistema valida que justification é fornecida
- Sistema valida que employee não tem access já ativo
- Sistema rejeita request inválido com mensagem de erro

---

### Feature 2.2: Access Approval

**Priority**: P0

**Description**: Suportar workflow de aprovação de acesso

---

#### User Story 2.2.1: Approval Routing

**Priority**: P0

**Story Points**: 5

**As a** System Administrator

**I want** que approval seja roteado para Access Owner correto

**So that** approval seja eficiente e correto

**Acceptance Criteria**:

**Given**:
- Access request requer aprovação
- Application tem Access Owner configurado

**When**:
- Approval é roteado

**Then**:
- Sistema identifica Access Owner (x_eoap_access_owner em cmdb_ci_business_app)
- Sistema envia notificação de aprovação para Access Owner
- Sistema inclui request details (solicitante, application, justification)
- Sistema inclui deadline (24 horas)

---

#### User Story 2.2.2: Approval Processing

**Priority**: P0

**Story Points**: 5

**As a** Access Owner

**I want** aprovar ou rejeitar access request

**So que** eu possa governar access para minha aplicação

**Acceptance Criteria**:

**Given**:
- Access request está pendente de aprovação
- Access Owner recebe notificação

**When**:
- Access Owner aprova request

**Then**:
- Sistema concede access
- Sistema notifica solicitante
- Sistema loga audit trail (entity_type: x_eoap_user_access, action: access_approved)

**When**:
- Access Owner rejeita request

**Then**:
- Sistema notifica solicitante com motivo
- Sistema loga audit trail (entity_type: x_eoap_user_access, action: access_rejected)

---

### Feature 2.3: Access Exception

**Priority**: P1

**Description**: Suportar exceções de acesso formais com compensating controls

---

#### User Story 2.3.1: Exception Request

**Priority**: P1

**Story Points**: 5

**As a** Employee

**I want** solicitar exceção de acesso com justificativa e compensating control

**So that** eu possa obter access temporário quando necessário

**Acceptance Criteria**:

**Given**:
- Employee solicita exceção de acesso

**When**:
- Request é submetida

**Then**:
- Sistema valida justificativa
- Sistema solicita compensating control
- Sistema solicita aprovação (nível elevado)
- Sistema define expiração automática (máximo 90 dias)
- Sistema loga audit trail (entity_type: x_eoap_access_exception, action: exception_requested)

---

#### User Story 2.3.2: Exception Expiration

**Priority**: P1

**Story Points**: 3

**As a** System Administrator

**I want** que exceções expirem automaticamente

**So que** access temporário não se torne permanente

**Acceptance Criteria**:

**Given**:
- Exceção de acesso foi aprovada
- Expiração foi definida para 90 dias

**When**:
- 90 dias passam

**Then**:
- Sistema revoga access automaticamente
- Sistema notifica employee
- Sistema notifica Access Owner
- Sistema loga audit trail (entity_type: x_eoap_access_exception, action: exception_expired)

---

## 4. Epic 3: Change Risk Assessment

**Priority**: P0

**Description**: Calcular risco de mudança de forma objetiva com scoring e banding

**Business Value**: Risco de mudança objetivo, redução de incidentes, compliance para SOX

**Dependencies**: CMDB, Decision Tables, Script Includes

---

### Feature 3.1: Risk Calculation

**Priority**: P0

**Description**: Calcular risco de mudança baseado em CMDB e Decision Tables

---

#### User Story 3.1.1: Risk Score Calculation

**Priority**: P0

**Story Points**: 8

**As a** Change Manager

**I want** que risco de mudança seja calculado objetivamente

**So que** eu possa tomar decisões informadas sobre approval

**Acceptance Criteria**:

**Given**:
- Change request é criado
- Change tem application associada

**When**:
- Risk calculation é executado

**Then**:
- Sistema consulta CMDB (cmdb_ci_business_app)
- Sistema obtém data_classification, access_criticality, operational_tier
- Sistema aplica Decision Table de pesos (DT_EOAP_Risk_Weights)
- Sistema agrega risk score (0-100)
- Sistema armazena risk evidence (x_eoap_risk_evidence)
- Sistema exibe risk score na change
- SLA < 5s

---

#### User Story 3.1.2: Risk Banding

**Priority**: P0

**Story Points**: 5

**As a** Change Manager

**I want** que risk score seja bandido em Low, Medium, High, Critical, Unknown

**So que** eu possa priorizar mudanças

**Acceptance Criteria**:

**Given**:
- Risk score é calculado (0-100)

**When**:
- Banding é aplicado

**Then**:
- Score 0-25 → Low
- Score 26-50 → Medium
- Score 51-75 → High
- Score 76-100 → Critical
- CMDB unavailable → Unknown
- Sistema exibe risk band na change

---

### Feature 3.2: CMDB Quality Gate

**Priority**: P1

**Description**: Bloquear operações críticas se CMDB quality < 95%

---

#### User Story 3.2.1: CMDB Quality Check

**Priority**: P1

**Story Points**: 5

**As a** System Administrator

**I want** que operações críticas sejam bloqueadas se CMDB quality < 95%

**So que** dados incompletos não afetem risk calculation

**Acceptance Criteria**:

**Given**:
- Risk calculation é executado
- CMDB quality = 90%

**When**:
- Quality check é executado

**Then**:
- Sistema bloqueia risk calculation
- Sistema alerta CMDB Manager
- Sistema sugere correção
- Sistema define risk band como Unknown

---

## 5. Epic 4: Audit Trail

**Priority**: P0

**Description**: Fornecer audit trail completo, imutável e com retenção de 7 anos

**Business Value**: 100% compliance para SOX, rastreabilidade completa

**Dependencies**: Script Includes, ACLs, Scheduled Jobs

---

### Feature 4.1: Audit Logging

**Priority**: P0

**Description**: Logar todos os eventos críticos em audit trail

---

#### User Story 4.1.1: Audit Trail Creation

**Priority**: P0

**Story Points**: 5

**As a** Compliance Officer

**I want** que todos os eventos críticos sejam logados em audit trail

**So que** eu tenha rastreabilidade completa para auditoria

**Acceptance Criteria**:

**Given**:
- Event crítico ocorre (access granted, access revoked, risk calculated)

**When**:
- Event é logado

**Then**:
- Sistema loga event_type
- Sistema loga entity_type e entity_sys_id
- Sistema loga action
- Sistema loga actor
- Sistema loga timestamp
- Sistema loga correlation_id
- Sistema loga payload_summary
- Sistema loga payload_details (JSON)
- Audit trail é append-only
- Audit trail é imutável

---

#### User Story 4.1.2: Audit Trail Retention

**Priority**: P0

**Story Points**: 3

**As a** Compliance Officer

**I want** que audit trail seja retido por 7 anos

**So que** compliance SOX seja garantido

**Acceptance Criteria**:

**Given**:
- Audit trail é criado

**When**:
- 7 anos passam

**Then**:
- Registro é arquivado
- Registro permanece acessível
- Registro não é deletado

---

### Feature 4.2: Audit Reporting

**Priority**: P1

**Description**: Fornecer reports de auditoria

---

#### User Story 4.2.1: Audit Query

**Priority**: P1

**Story Points**: 5

**As a** Auditor

**I want** consultar audit trail por entity_type, action, actor, timeframe

**So que** eu possa conduzir auditoria

**Acceptance Criteria**:

**Given**:
- Auditor tem role x_eoap_auditor

**When**:
- Auditor consulta audit trail

**Then**:
- Sistema permite filtro por entity_type
- Sistema permite filtro por action
- Sistema permite filtro por actor
- Sistema permite filtro por timeframe
- Sistema retorna resultados em < 5s

---

## 6. Epic 5: Reconciliation

**Priority**: P0

**Description**: Reconciliar access governado vs technical diariamente

**Business Value**: Redução de 90% em access drift, compliance para SOX

**Dependencies**: IAM integration, Scheduled Jobs

---

### Feature 5.1: Daily Reconciliation

**Priority**: P0

**Description**: Executar reconciliação diária entre governado e IAM

---

#### User Story 5.1.1: Reconciliation Execution

**Priority**: P0

**Story Points**: 8

**As a** Access Owner

**I want** que reconciliação diária identifique drift entre governado e IAM

**So que** eu possa corrigir drift proativamente

**Acceptance Criteria**:

**Given**:
- Reconciliation job executa diariamente às 02:00 UTC

**When**:
- Job executa

**Then**:
- Sistema consulta access governado (x_eoap_user_access)
- Sistema consulta access technical (IAM)
- Sistema identifica drift (orphan, missing, mismatch)
- Sistema popula staging table (x_eoap_staging_access_reconciliation)
- Sistema notifica Access Owners
- Sistema gera report
- SLA < 15 min

---

#### User Story 5.1.2: Drift Detection

**Priority**: P0

**Story Points**: 5

**As a** System Administrator

**I want** que drift seja classificado em orphan, missing, mismatch

**So que** eu possa entender tipo de drift

**Acceptance Criteria**:

**Given**:
- Reconciliation executa

**When**:
- Drift é identificado

**Then**:
- Orphan access: access em governado mas não em IAM
- Missing access: access em IAM mas não em governado
- Mismatch: access diferente entre governado e IAM
- Sistema classifica drift corretamente

---

### Feature 5.2: Drift Resolution

**Priority**: P1

**Description**: Permitir resolução de drift

---

#### User Story 5.2.1: Drift Review

**Priority**: P1

**Story Points**: 5

**As a** Access Owner

**I want** revisar drift e aprovar correção

**So que** drift seja corrigido corretamente

**Acceptance Criteria**:

**Given**:
- Drift foi identificado
- Access Owner recebe notificação

**When**:
- Access Owner revisa drift

**Then**:
- Sistema permite aprovar correção
- Sistema permite rejeitar correção
- Sistema permite adicionar comentário
- Sistema loga audit trail

---

## 7. Epic 6: Integration

**Priority**: P0

**Description**: Integrar com IAM, HRIS e SIEM

**Business Value**: Automação end-to-end, visibilidade 100%

**Dependencies**: Integration Hub, REST API, OAuth 2.0

---

### Feature 6.1: IAM Integration

**Priority**: P0

**Description**: Integrar com IAM para provision/deprovision

---

#### User Story 6.1.1: IAM Provision

**Priority**: P0

**Story Points**: 8

**As a** System Administrator

**I want** que sistema provisione access em IAM

**So que** access seja concedido automaticamente

**Acceptance Criteria**:

**Given**:
- Access foi aprovado
- IAM integration está configurado

**When**:
- Provision é executado

**Then**:
- Sistema chama IAM REST API
- Sistema envia user_sys_id, application, access_type
- Sistema recebe confirmação
- Sistema atualiza status para active
- Sistema loga audit trail
- SLA < 5s

---

#### User Story 6.1.2: IAM Deprovision

**Priority**: P0

**Story Points**: 8

**As a** System Administrator

**I want** que sistema deprovisione access em IAM

**So que** access seja revogado automaticamente

**Acceptance Criteria**:

**Given**:
- Access foi revogado
- IAM integration está configurado

**When**:
- Deprovision é executado

**Then**:
- Sistema chama IAM REST API
- Sistema envia user_sys_id, application
- Sistema recebe confirmação
- Sistema atualiza status para revoked
- Sistema loga audit trail
- SLA < 5s

---

### Feature 6.2: HRIS Integration

**Priority**: P0

**Description**: Integrar com HRIS para receber eventos de employee

---

#### User Story 6.2.1: Employee Events

**Priority**: P0

**Story Points**: 8

**As a** System Administrator

**I want** que sistema receba eventos de employee do HRIS

**So que** employee lifecycle seja automatizado

**Acceptance Criteria**:

**Given**:
- Funcionário é criado/movido/terminado em HRIS

**When**:
- Event é publicado

**Then**:
- Sistema recebe event via Integration Hub
- Sistema valida event
- Sistema publica event interno (eoap.employee.created/moved/terminated)
- Sistema loga audit trail
- SLA < 10s

---

### Feature 6.3: SIEM Integration

**Priority**: P1

**Description**: Publicar eventos de segurança para SIEM

---

#### User Story 6.3.1: Security Events

**Priority**: P1

**Story Points**: 5

**As a** Security Analyst

**I want** que eventos de segurança sejam publicados para SIEM

**So que** eu possa monitorar security events

**Acceptance Criteria**:

**Given**:
- Event de segurança ocorre (access granted, access revoked, risk critical)

**When**:
- Event é publicado

**Then**:
- Sistema chama SIEM REST API
- Sistema envia event_type, entity_type, actor, timestamp
- Sistema recebe confirmação
- Sistema loga audit trail
- SLA < 5s

---

## 8. Backlog Summary

### 8.1 Epic Summary

| Epic | Priority | Features | User Stories | Total Story Points |
| --- | --- | --- | --- | --- |
| Employee Lifecycle Automation | P0 | 3 | 9 | 52 |
| Access Governance | P0 | 3 | 6 | 31 |
| Change Risk Assessment | P0 | 2 | 4 | 23 |
| Audit Trail | P0 | 2 | 4 | 18 |
| Reconciliation | P0 | 2 | 4 | 26 |
| Integration | P0 | 3 | 4 | 29 |
| **Total** | - | **15** | **31** | **179** |

### 8.2 Priority Summary

| Priority | Epics | Features | User Stories | Story Points |
| --- | --- | --- | --- | --- |
| P0 | 6 | 13 | 27 | 149 |
| P1 | 0 | 2 | 4 | 30 |
| **Total** | **6** | **15** | **31** | **179** |

### 8.3 Sprint Allocation

Assumindo 2 semanas por sprint e 6.5 FTE:

| Sprint | Duration | Story Points | Velocity Target |
| --- | --- | --- | --- |
| Sprint 1 | 2 semanas | 30 | 30 |
| Sprint 2 | 2 semanas | 30 | 30 |
| Sprint 3 | 2 semanas | 30 | 30 |
| Sprint 4 | 2 semanas | 30 | 30 |
| Sprint 5 | 2 semanas | 30 | 30 |
| Sprint 6 | 2 semanas | 29 | 29 |
| **Total** | **12 semanas** | **179** | **179** |

---

*Backlog Executable - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 02-Plan*
*Total Epics: 6*
*Total Features: 15*
*Total User Stories: 31*
*Total Story Points: 179*
