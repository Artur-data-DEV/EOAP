# EOAP Configuration Guide

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Configuration Guide |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Configuração Corporativa |

> **Escopo deste documento**: Guia específico de configuração da EOAP. Inclui Decision Tables, Flows, Integrations, Notifications, Dashboards e ATF. Para instalação (Application Scope, Tabelas, Roles, ACLs), ver Installation Guide.

---

## 1. Prerequisites

### 1.1 Installation Completa

Antes de iniciar a configuração, certifique-se de que:

- [ ] Application Scope x_eoap criada e ativa
- [ ] 7 tabelas customizadas criadas
- [ ] 7 roles criados
- [ ] ACLs configuradas deny-by-default
- [ ] CMDB quality ≥ 95%

### 1.2 Documentos de Referência

- SDD (Solution Design Document) - `/docs/architecture/SDD.md`
- ADD (Architecture Design Document) - `/docs/architecture/ADD.md`
- ADRs - `/docs/architecture/ADRs/`

---

## 2. Configuration Steps

### Step 1 - Create Decision Tables

#### 1.1 x_eoap_dt_access_approval_routing

**Objetivo**: Configurar roteamento de aprovação de acesso baseado em risco e classificação.

**Ações**:
1. Navegar para System Definition → Decision Tables
2. Criar nova Decision Table:
   - Name: x_eoap_dt_access_approval_routing
   - Label: Access Approval Routing
   - Application: EOAP
3. Configurar inputs:
   - data_classification (Choice)
   - access_criticality (Choice)
   - operational_tier (Choice)
   - exception_type (Choice)
   - user_role (String)
4. Configurar outputs:
   - approval_required (Boolean)
   - approval_group (Reference: group)
   - approval_level (Choice: Level 1, Level 2, Level 3)
   - auto_approve (Boolean)
5. Criar regras base:
   - Rule 1: data_classification=Restricted OR access_criticality=Critical → approval_required=true, approval_level=Level 3
   - Rule 2: data_classification=Confidential OR access_criticality=High → approval_required=true, approval_level=Level 2
   - Rule 3: operational_tier=Tier 1 → approval_required=true, approval_level=Level 2
   - Rule 4: exception_type=Emergency → auto_approve=true, approval_required=false
   - Rule 5: Default → approval_required=true, approval_level=Level 1
6. Configurar owner: x_eoap_risk_analyst
7. Configurar ACLs: read x_eoap_admin, x_eoap_access_owner; write x_eoap_admin

**Expected Result**:
- Decision Table criada com 5 inputs, 4 outputs
- 5 regras base configuradas
- ACLs configuradas

**Validation**:
- Testar cada regra com inputs variados
- Verificar outputs esperados
- Testar ACLs

**Rollback**:
- Remover Decision Table

#### 1.2 x_eoap_dt_risk_weights

**Objetivo**: Configurar pesos para cada fator de risco em mudanças.

**Ações**:
1. Criar Decision Table:
   - Name: x_eoap_dt_risk_weights
   - Label: Risk Weights
   - Application: EOAP
2. Configurar inputs:
   - risk_factor (Choice: CMDB Quality, Service Criticality, Change Type, Risk History, Business Impact)
   - factor_value (Choice: Low, Medium, High, Critical, Unknown)
3. Configurar outputs:
   - weight (Integer)
   - description (String)
4. Criar regras base:
   - Rule 1: CMDB Quality + Critical → weight=40
   - Rule 2: CMDB Quality + High → weight=30
   - Rule 3: Service Criticality + Critical → weight=35
   - Rule 4: Service Criticality + High → weight=25
   - Rule 5: Change Type + Emergency → weight=30
   - Rule 6: Change Type + Normal → weight=10
   - Rule 7: Risk History + High → weight=20
   - Rule 8: Business Impact + Critical → weight=25
   - Rule 9: Unknown → weight=15
5. Configurar owner: x_eoap_risk_analyst

**Expected Result**:
- Decision Table criada
- Regras para cada fator de risco

**Validation**:
- Testar com change_request variados
- Verificar pesos aplicados

**Rollback**:
- Remover Decision Table

#### 1.3 x_eoap_dt_risk_banding

**Objetivo**: Configurar bandas de risco baseadas em score total.

**Ações**:
1. Criar Decision Table:
   - Name: x_eoap_dt_risk_banding
   - Label: Risk Banding
   - Application: EOAP
2. Configurar inputs:
   - total_score (Integer)
3. Configurar outputs:
   - band (Choice: Low, Medium, High, Critical, Unknown)
   - description (String)
4. Criar regras:
   - Rule 1: total_score ≥ 80 → band=Critical
   - Rule 2: total_score ≥ 60 AND total_score < 80 → band=High
   - Rule 3: total_score ≥ 40 AND total_score < 60 → band=Medium
   - Rule 4: total_score < 40 → band=Low
   - Rule 5: total_score = 0 OR null → band=Unknown
5. Configurar owner: x_eoap_risk_analyst

**Expected Result**:
- Decision Table criada
- Regras de banding configuradas

**Validation**:
- Testar com scores variados
- Verificar bandas corretas

**Rollback**:
- Remover Decision Table

#### 1.4 x_eoap_dt_lifecycle_actions

**Objetivo**: Configurar ações de lifecycle para onboarding, move e offboarding.

**Ações**:
1. Criar Decision Table:
   - Name: x_eoap_dt_lifecycle_actions
   - Label: Lifecycle Actions
   - Application: EOAP
2. Configurar inputs:
   - event_type (Choice: created, moved, terminated)
   - employee_type (Choice: Full-time, Contractor, Intern)
   - department (String)
   - location (String)
3. Configurar outputs:
   - default_access_profiles (Array of strings)
   - approval_required (Boolean)
   - notification_recipients (Array of strings)
   - sync_to_iam (Boolean)
4. Criar regras base para onboarding/move/offboarding
5. Configurar owner: x_eoap_admin

**Expected Result**:
- Decision Table criada
- Ações de lifecycle configuradas

**Validation**:
- Testar com employee events variados
- Verificar ações corretas

**Rollback**:
- Remover Decision Table

---

### Step 2 - Create Flows and Subflows

#### 2.1 EOAP_Flow_Employee_Onboarding

**Objetivo**: Orquestrar processo de onboarding de funcionários.

**Ações**:
1. Navegar para Process Automation → Flow Designer
2. Criar novo Flow:
   - Name: EOAP_Flow_Employee_Onboarding
   - Application: EOAP
3. Configurar trigger:
   - Trigger Type: Event
   - Event Name: eoap.employee.created
   - OU Catalog Item
4. Implementar steps:
   - **Step 1**: Validate Input
     - Validar employee_sys_id
     - Validar event_data
   - **Step 2**: Lookup Lifecycle Actions (DT)
     - Chamar x_eoap_dt_lifecycle_actions
     - Obter default_access_profiles
   - **Step 3**: Request Manager Approval (se necessário)
     - Se approval_required=true → solicitar aprovação
     - Aguardar aprovação
   - **Step 4**: Grant Default Access (subflow)
     - Chamar EOAP_Subflow_Grant_Access_Profile
     - Passar default_access_profiles
   - **Step 5**: Publish Events (subflow)
     - Chamar EOAP_Subflow_Publish_Event
     - Event: eoap.access.granted
   - **Step 6**: Log Audit Trail (subflow)
     - Chamar EOAP_Subflow_Log_Audit
     - Action: access_granted
   - **Step 7**: Notify Manager
     - Enviar notificação
5. Configurar error handling:
   - On error: Log em x_eoap_event_processing
   - Retry: 3× transitório
6. Ativar Flow

**Expected Result**:
- Flow criado com 7 steps
- Subflows integrados
- Error handling configurado

**Validation**:
- Testar happy path
- Testar error scenarios
- Verificar audit trail gerado

**Rollback**:
- Remover Flow
- Remover subflows

#### 2.2 EOAP_Flow_Employee_Move

**Objetivo**: Orquestrar processo de mudança de funcionário.

**Ações**:
1. Criar Flow:
   - Name: EOAP_Flow_Employee_Move
   - Application: EOAP
2. Configurar trigger:
   - Trigger Type: Event
   - Event Name: eoap.employee.moved
3. Implementar steps:
   - **Step 1**: Validate Input
   - **Step 2**: Diff Analysis
     - Comparar access atual vs. access novo
     - Identificar revogações necessárias
     - Identificar concessões necessárias
   - **Step 3**: Revoke Old Access
     - Chamar EOAP_Subflow_Revoke_Access
   - **Step 4**: Grant New Access
     - Chamar EOAP_Subflow_Grant_Access_Profile
   - **Step 5**: Publish Events
   - **Step 6**: Log Audit Trail
4. Configurar error handling

**Expected Result**:
- Flow criado
- Diff analysis implementado

**Validation**:
- Testar happy path
- Verificar revogações e concessões

**Rollback**:
- Remover Flow

#### 2.3 EOAP_Flow_Employee_Offboarding

**Objetivo**: Orquestrar processo de offboarding com revogação síncrona.

**Ações**:
1. Criar Flow:
   - Name: EOAP_Flow_Employee_Offboarding
   - Application: EOAP
2. Configurar trigger:
   - Trigger Type: Event
   - Event Name: eoap.employee.terminated
3. Implementar steps:
   - **Step 1**: Validate Input
   - **Step 2**: List All Active Access
     - Query x_eoap_user_access
     - Status=active
   - **Step 3**: Revoke All Access (SYNC_CRITICAL)
     - Para cada access:
       - Chamar EOAP_Subflow_Revoke_Access
       - Aguardar confirmação IAM
       - SLA < 60s total
   - **Step 4**: Deprovision IAM (ASYNC)
     - Chamar integração IAM
     - Event-driven
   - **Step 5**: Publish Events
   - **Step 6**: Log Audit Trail
4. Configurar SYNC_CRITICAL para revogação
5. Configurar ASYNC para deprovision IAM

**Expected Result**:
- Flow criado
- Revogação síncrona implementada
- SLA < 60s

**Validation**:
- Testar com usuário com N acessos
- Verificar revogação < 60s
- Verificar audit trail

**Rollback**:
- Remover Flow

#### 2.4 EOAP_Flow_Access_Request

**Objetivo**: Orquestrar processo de solicitação de acesso.

**Ações**:
1. Criar Flow:
   - Name: EOAP_Flow_Access_Request
   - Application: EOAP
2. Configurar trigger:
   - Trigger Type: Catalog Item
3. Implementar steps:
   - **Step 1**: Validate Request
   - **Step 2**: Lookup Approval Routing (DT)
     - Chamar x_eoap_dt_access_approval_routing
   - **Step 3**: Request Approval (se necessário)
     - Criar approval
     - Aguardar aprovação
   - **Step 4**: Grant Access (se aprovado)
     - Chamar EOAP_Subflow_Grant_Access_Profile
   - **Step 5**: Publish Events
   - **Step 6**: Log Audit Trail
   - **Step 7**: Notify Requester
4. Integrar com DT_Access_Approval_Routing
5. Configurar approvals

**Expected Result**:
- Flow criado
- Aprovações configuradas

**Validation**:
- Testar happy path
- Testar rejection
- Verificar DT routing

**Rollback**:
- Remover Flow

#### 2.5 EOAP_Flow_Change_Risk_Assessment

**Objetivo**: Calcular risco de mudança de forma síncrona.

**Ações**:
1. Criar Flow:
   - Name: EOAP_Flow_Change_Risk_Assessment
   - Application: EOAP
2. Configurar trigger:
   - Trigger Type: Business Rule
   - Table: change_request
   - When: on submit
3. Implementar steps:
   - **Step 1**: Validate Change Request
   - **Step 2**: Calculate Risk Factors
     - Chamar EOAP_RiskEngine
     - Para cada fator:
       - Lookup weight (DT)
       - Calcular valor
   - **Step 3**: Calculate Total Score
     - Somar todos os fatores
   - **Step 4**: Determine Risk Band (DT)
     - Chamar x_eoap_dt_risk_banding
   - **Step 5**: Update Change Request
     - Escrever x_eoap_risk_score
     - Escrever x_eoap_risk_band
     - Escrever x_eoap_risk_explanation
   - **Step 6**: Log Risk Evidence
     - Criar registro em x_eoap_risk_evidence
4. Integrar com EOAP_RiskEngine
5. Configurar SYNC_CRITICAL

**Expected Result**:
- Flow criado
- Risk calculation síncrono

**Validation**:
- Testar com change_request
- Verificar score calculado
- Testar CMDB fail → band Unknown

**Rollback**:
- Remover Flow
- Remover Business Rule trigger

#### 2.6 Subflows

**Ações**:
1. Criar EOAP_Subflow_Grant_Access_Profile:
   - Input: access_profile, user_sys_id
   - Steps: Validar → Grant IAM → Update x_eoap_user_access → Publish Event
2. Criar EOAP_Subflow_Publish_Event:
   - Input: event_type, event_data, correlation_id
   - Steps: Validar → Criar registro em x_eoap_event_processing → Retornar
3. Criar EOAP_Subflow_Log_Audit:
   - Input: entity_type, entity_sys_id, action, actor
   - Steps: Validar → Criar registro em x_eoap_audit_trail → Retornar

**Expected Result**:
- 3 subflows criados
- Reutilizáveis por flows principais

**Validation**:
- Testar cada subflow isoladamente
- Verificar integração com flows principais

**Rollback**:
- Remover subflows

---

### Step 3 - Configure Integrations

#### 3.1 Scripted REST API

**Objetivo**: Expor API REST para integração externa.

**Ações**:
1. Navegar para System Web Services → Scripted REST APIs
2. Criar API:
   - Name: EOAP REST API v1
   - API ID: x_eoap_v1
   - Application: EOAP
3. Configurar path: `/api/x_eoap/v1/`
4. Criar endpoints:
   - **GET /access/{sys_id}**
     - Script: Consultar x_eoap_user_access
     - ACL: x_eoap_admin, x_eoap_manager
   - **POST /access**
     - Script: Solicitar acesso
     - ACL: x_eoap_admin, x_eoap_manager
   - **GET /risk/{change_sys_id}**
     - Script: Consultar risco
     - ACL: x_eoap_admin, x_eoap_change_manager
5. Configurar autenticação: OAuth 2.0
6. Implementar rate limiting: 100 req/min

**Expected Result**:
- API REST criada
- 3 endpoints implementados
- OAuth 2.0 configurado

**Validation**:
- Testar cada endpoint com Postman
- Verificar autenticação
- Testar rate limiting

**Rollback**:
- Remover API
- Remover endpoints

#### 3.2 Connection & Credential Aliases

**Objetivo**: Configurar conexões seguras para integrações.

**Ações**:
1. Navegar para System Definition → Connection & Credential Aliases
2. Criar alias para HRIS:
   - Name: EOAP_HRIS_Connection
   - Type: REST
   - Authentication: OAuth 2.0
   - Mock em PDI
3. Criar alias para IAM:
   - Name: EOAP_IAM_Connection
   - Type: REST
   - Authentication: OAuth 2.0
   - Mock em PDI
4. Criar alias para SIEM:
   - Name: EOAP_SIEM_Connection
   - Type: REST
   - Authentication: OAuth 2.0
   - Mock em PDI
5. Configurar rotação de credenciais: 90 dias

**Expected Result**:
- 3 aliases criados
- Autenticação configurada
- Rotação documentada

**Validation**:
- Testar conexão com cada alias
- Verificar autenticação

**Rollback**:
- Remover aliases

#### 3.3 Outbound REST Messages

**Objetivo**: Configurar mensagens REST para integrações outbound.

**Ações**:
1. Navegar for System Web Services → Outbound → REST Message
2. Criar EOAP_IAM_Provision:
   - Endpoint: /api/v1/provision
   - Authentication: Connection Alias (EOAP_IAM_Connection)
   - HTTP Method: POST
   - Retry: 3×
3. Criar EOAP_IAM_Deprovision:
   - Endpoint: /api/v1/deprovision
   - Authentication: Connection Alias (EOAP_IAM_Connection)
   - HTTP Method: POST
   - Retry: 3×
4. Criar EOAP_SIEM_Alert:
   - Endpoint: /api/v1/alert
   - Authentication: Connection Alias (EOAP_SIEM_Connection)
   - HTTP Method: POST
   - Retry: 3×

**Expected Result**:
- 3 REST Messages criados
- Integração com IAM e SIEM

**Validation**:
- Testar cada REST Message
- Verificar retry

**Rollback**:
- Remover REST Messages

---

### Step 4 - Configure Notifications

**Objetivo**: Configurar notificações email e in-app.

**Ações**:
1. Navegar para System Notification → Notification
2. Criar notificações:
   - **EOAP_Notif_Access_Approved**
     - Condition: x_eoap_user_access.status=approved
     - Recipients: user, manager
   - **EOAP_Notif_Access_Rejected**
     - Condition: x_eoap_user_access.status=rejected
     - Recipients: user, manager
   - **EOAP_Notif_Access_Expired**
     - Condition: x_eoap_user_access.status=expired
     - Recipients: user, manager, access_owner
   - **EOAP_Notif_Offboarding_Complete**
     - Condition: event=eoap.employee.terminated processed
     - Recipients: manager, hr
   - **EOAP_Notif_Recertification_Due**
     - Condition: scheduled job trigger
     - Recipients: user, manager, access_owner
   - **EOAP_Notif_CMDB_Quality_Failed**
     - Condition: CMDB quality < 95%
     - Recipients: x_eoap_cmdb_manager, platform_owners
   - **EOAP_Notif_Event_DLQ**
     - Condition: x_eoap_event_processing.status=failed_final
     - Recipients: x_eoap_admin, platform_owners
3. Configurar templates de email
4. Configurar notificações in-app

**Expected Result**:
- 7 notificações criadas
- Templates configurados
- In-app notifications configuradas

**Validation**:
- Testar cada notificação
- Verificar delivery

**Rollback**:
- Remover notificações

---

### Step 5 - Configure Dashboards

**Objetivo**: Criar dashboard operacional com KPIs.

**Ações**:
1. Navegar for Performance Analytics → Dashboards
2. Criar dashboard:
   - Name: EOAP_Operational_Overview
   - Application: EOAP
3. Criar widgets:
   - **User Access by Status**
     - Type: Donut chart
     - Source: x_eoap_user_access
     - Group by: status
   - **Access by Application**
     - Type: Bar chart
     - Source: x_eoap_user_access
     - Group by: application
   - **Risk Band Distribution**
     - Type: Donut chart
     - Source: change_request
     - Group by: x_eoap_risk_band
   - **Event Processing Status**
     - Type: Scorecard
     - Source: x_eoap_event_processing
     - Metric: % processed
   - **CMDB Completeness Rate**
     - Type: Scorecard
     - Source: CMDB Quality Report
     - Metric: % complete
   - **Audit Trail Volume (7 dias)**
     - Type: Line chart
     - Source: x_eoap_audit_trail
     - Time range: 7 days
4. Configurar filtros por período
5. Configurar drill-down para detalhes

**Expected Result**:
- Dashboard criado
- 6 widgets configurados
- Filtros funcionando

**Validation**:
- Verificar dados populados
- Testar filtros
- Testar drill-down

**Rollback**:
- Remover dashboard

---

### Step 6 - ATF Validation

**Objetivo**: Criar suites ATF para validação automatizada.

**Ações**:
1. Navegar para Automated Test Framework → Test Suites
2. Criar suite EOAP_ATF_CMDB_Foundation:
   - Testar qualidade CMDB
   - Testar relações CSDM
   - Testar campos EOAP preenchidos
3. Criar suite EOAP_ATF_Employee_Lifecycle:
   - Testar onboarding
   - Testar move
   - Testar offboarding
   - Testar idempotência
4. Criar suite EOAP_ATF_Access_Governance:
   - Testar request
   - Testar approve
   - Testar reject
   - Testar exception
   - Testar recertification
5. Criar suite EOAP_ATF_Change_Risk:
   - Testar scoring
   - Testar emergency
   - Testar CMDB Unknown
   - Testar volume < 5s
6. Criar suite EOAP_ATF_Security_Negative:
   - Testar ACL
   - Testar Field ACL
   - Testar SoD
   - Testar cross-role
7. Criar suite EOAP_ATF_Events:
   - Testar processamento
   - Testar duplicata
   - Testar retry
   - Testar DLQ

**Expected Result**:
- 6 suites ATF criadas
- 30+ testes implementados
- 100% pass rate

**Validation**:
- Executar cada suite
- Verificar 100% pass
- Verificar cobertura

**Rollback**:
- Remover suites
- Remover testes

---

## 3. Post-Configuration Validation

### 3.1 Decision Tables Validation

- [ ] x_eoap_dt_access_approval_routing funcionando
- [ ] x_eoap_dt_risk_weights funcionando
- [ ] x_eoap_dt_risk_banding funcionando
- [ ] x_eoap_dt_lifecycle_actions funcionando
- [ ] ACLs configuradas

### 3.2 Flows Validation

- [ ] EOAP_Flow_Employee_Onboarding ativo
- [ ] EOAP_Flow_Employee_Move ativo
- [ ] EOAP_Flow_Employee_Offboarding ativo
- [ ] EOAP_Flow_Access_Request ativo
- [ ] EOAP_Flow_Change_Risk_Assessment ativo
- [ ] Subflows criados e integrados

### 3.3 Integrations Validation

- [ ] REST API funcionando
- [ ] OAuth 2.0 configurado
- [ ] Connection Aliases funcionando
- [ ] Outbound REST Messages funcionando

### 3.4 Notifications Validation

- [ ] 7 notificações criadas
- [ ] Templates configurados
- [ ] In-app notifications configuradas

### 3.5 Dashboards Validation

- [ ] Dashboard criado
- [ ] 6 widgets configurados
- [ ] Dados populados

### 3.6 ATF Validation

- [ ] 6 suites ATF criadas
- [ ] 30+ testes implementados
- [ ] 100% pass rate

---

## 4. Next Steps

Após completar a configuração, prossiga com:

1. **Operations Setup**: Configurar runbooks, monitoring, support model
2. **Testing Setup**: Executar ATF suites
3. **Go-Live**: Executar checklist de go-live

---

*Configuration Guide - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
