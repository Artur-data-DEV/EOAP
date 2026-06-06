# EOAP Implementation Guide

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Implementation Guide |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Implementação Corporativa |

> **Escopo deste documento**: Guia completo de implementação da EOAP seguindo padrões enterprise ServiceNow. Inclui prerequisites, 10 steps detalhados de instalação e configuração, com validação e rollback para cada step.

---

## 1. Prerequisites

### 1.1 ServiceNow Version

| Requisito | Versão Mínima | Justificativa |
| --- | --- | --- |
| ServiceNow Release | Utah ou posterior | Suporte a Flow Designer avançado, Decision Tables modernas |
| Plugins | IntegrationHub, Flow Designer, Event Management | Capacidades EDA e orquestração |

### 1.2 Plugins Obrigatórios

| Plugin | ID | Justificativa |
| --- | --- | --- |
| Flow Designer | com.glideapp.flowdesigner | Orquestração primária |
| IntegrationHub | com.glideapp.integrationhub | Integrações assíncronas |
| Event Management | com.snc.events | Event-driven architecture |
| Decision Tables | com.glideapp.decision_table | Política declarativa |
| ATF (Automated Test Framework) | com.glideapp.automated_testing | Testes automatizados |

### 1.3 Roles e Grupos Pré-requisitos

| Role/Grupo | Propósito | Criação |
| --- | --- | --- |
| sys_admin | Administração plataforma | OOB |
| x_eoap_admin | Administração EOAP | Sprint 0 |
| x_eoap_cmdb_manager | Campos EOAP em CMDB | Sprint 0 |
| x_eoap_access_owner | Aprovação de acesso | Sprint 0 |
| x_eoap_change_manager | Gestão de mudança | Sprint 0 |
| x_eoap_risk_analyst | Análise de risco | Sprint 0 |
| x_eoap_auditor | Auditoria | Sprint 0 |
| x_eoap_manager | Solicitação de acesso | Sprint 0 |
| EOAP Access Owners | Grupo de aprovação | Sprint 0 |
| EOAP CAB Risk Reviewers | Grupo CAB | Sprint 0 |
| EOAP Platform Owners | Grupo governança | Sprint 0 |

### 1.4 Escopo da Aplicação

| Atributo | Valor |
| --- | --- |
| Application Name | EOAP - Enterprise Operations Automation Platform |
| Scope | x_eoap |
| Prefix | eoap |
| Description | Plataforma de governança operacional sobre ServiceNow |
| Source | Private |

---

## 2. Installation Steps

### Step 1 - Create Application Scope

**Objetivo**: Criar scoped application `x_eoap` com configuração inicial.

**Ações**:
1. Navegar para System Applications → Applications → Create New Application
2. Preencher:
   - Name: EOAP - Enterprise Operations Automation Platform
   - ID: x_eoap
   - Description: Plataforma de governança operacional sobre ServiceNow
   - Source: Private
   - Activate: Yes
3. Criar menu EOAP com submenus:
   - Configuration
   - Access Governance
   - Risk Management
   - CMDB Quality
   - Audit Trail
   - Event Processing
4. Criar ACLs cross-scope iniciais (ADR-017)

**Expected Result**:
- Scoped application `x_eoap` criada e ativa
- Menu EOAP visível com 6 submenus
- ACLs cross-scope base configuradas

**Validation**:
- Verificar em System Applications que x_eoap está ativa
- Navegar para menu EOAP e verificar submenus
- Testar cross-scope access para tabelas globais

**Rollback**:
- Deactivate application x_eoap
- Remover menu EOAP
- Remover ACLs cross-scope

---

### Step 2 - Create Core Tables

**Objetivo**: Criar tabelas customizadas EOAP com campos, índices e ACLs.

#### 2.1 x_eoap_user_access

**Ações**:
1. Criar tabela extends: `standalone`
2. Criar campos conforme SDD seção 1.1
3. Criar índices conforme SDD seção 1.1
4. Configurar ACLs:
   - create: system/service only
   - read: x_eoap_admin, x_eoap_access_owner, x_eoap_manager, x_eoap_auditor
   - write: x_eoap_admin, x_eoap_access_owner (apenas campos permitidos)
   - delete: none
5. Criar Field ACLs:
   - risk_rating: read-only para Access Owner
   - granted_by, granted_on: read-only para todos

**Expected Result**:
- Tabela x_eoap_user_access criada com 20 campos
- 6 índices criados
- ACLs configuradas deny-by-default
- Field ACLs configuradas

**Validation**:
- Criar registro via script (system context) → sucesso
- Tentar criar via UI (user context) → bloqueado
- Tentar deletar → bloqueado
- Verificar índices em Table Dictionary

**Rollback**:
- Remover tabela x_eoap_user_access
- Remover índices
- Remover ACLs

#### 2.2 x_eoap_access_exception

**Ações**:
1. Criar tabela extends: `standalone`
2. Criar campos conforme SDD seção 1.2
3. Criar índices: user_access, status, valid_to
4. Configurar ACLs similar a x_eoap_user_access

**Expected Result**:
- Tabela x_eoap_access_exception criada
- Índices criados
- ACLs configuradas

**Validation**:
- Mesmo padrão de validação que x_eoap_user_access

**Rollback**:
- Remover tabela e índices

#### 2.3 x_eoap_audit_trail

**Ações**:
1. Criar tabela extends: `standalone`
2. Criar campos conforme SDD seção 1.3
3. Criar índices conforme SDD seção 1.3
4. Configurar ACLs:
   - create: EOAP_AuditLogger only (service context)
   - read: x_eoap_admin, x_eoap_auditor
   - write: none
   - delete: none
5. Criar Field ACL em payload_summary: somente x_eoap_admin, x_eoap_auditor

**Expected Result**:
- Tabela append-only criada
- ACLs write-only configuradas

**Validation**:
- Tentar update/delete → bloqueado
- Criar via EOAP_AuditLogger → sucesso
- Criar via UI → bloqueado

**Rollback**:
- Remover tabela e índices

#### 2.4 x_eoap_event_processing

**Ações**:
1. Criar tabela extends: `standalone`
2. Criar campos conforme SDD seção 1.4
3. Criar índice unique em idempotency_key
4. Configurar ACLs:
   - create: EOAP_EventProcessor only
   - read: x_eoap_admin
   - write: EOAP_EventProcessor only
   - delete: x_eoap_admin

**Expected Result**:
- Tabela de controle de eventos criada
- Idempotency garantida por índice unique

**Validation**:
- Tentar criar evento duplicado → ignored_duplicate
- Verificar índice unique

**Rollback**:
- Remover tabela e índices

#### 2.5 x_eoap_risk_evidence

**Ações**:
1. Criar tabela extends: `standalone`
2. Criar campos conforme SDD seção 1.5
3. Criar índices conforme SDD seção 1.5
4. Configurar ACLs:
   - create: EOAP_RiskEngine only
   - read: x_eoap_admin, x_eoap_auditor, x_eoap_change_manager
   - write: EOAP_RiskEngine only
   - delete: none

**Expected Result**:
- Tabela de evidência de risco criada
- ACLs configuradas

**Validation**:
- Criar via EOAP_RiskEngine → sucesso
- Tentar criar via UI → bloqueado

**Rollback**:
- Remover tabela e índices

#### 2.6 x_eoap_staging_employee

**Ações**:
1. Criar tabela extends: `standalone`
2. Criar campos: employee_sys_id, event_type, event_data (JSON), processed, error_message
3. Criar índices: employee_sys_id, event_type, processed
4. Configurar ACLs: x_eoap_admin read/write

**Expected Result**:
- Tabela staging para HRIS criada

**Validation**:
- Ingest via Import Set → sucesso
- Verificar índices

**Rollback**:
- Remover tabela

#### 2.7 x_eoap_staging_access_reconciliation

**Ações**:
1. Criar tabela extends: `standalone`
2. Criar campos: user_sys_id, application_sys_id, technical_access (boolean), governed_access (boolean), drift_type, reconciliation_status
3. Criar índices: user_sys_id, application_sys_id, drift_type
4. Configurar ACLs: x_eoap_admin read/write

**Expected Result**:
- Tabela staging para reconciliação criada

**Validation**:
- Job de reconciliação popula tabela → sucesso
- Verificar índices

**Rollback**:
- Remover tabela

---

### Step 3 - Configure Roles

**Objetivo**: Criar e configurar roles EOAP com segregação de responsabilidades.

**Ações**:
1. Criar roles conforme seção 1.3 (nomenclatura corrigida):
   - x_eoap_admin
   - x_eoap_cmdb_manager
   - x_eoap_access_owner
   - x_eoap_change_manager
   - x_eoap_risk_analyst
   - x_eoap_auditor
   - x_eoap_manager
2. Configurar contains:
   - x_eoap_admin: contém admin (opcional, não recomendado em PROD)
   - x_eoap_risk_analyst: contém x_eoap_admin (opcional)
   - Outros roles: sem contains operacionais
3. Atribuir roles a usuários de teste:
   - eoap_admin_user
   - eoap_cmdb_manager_user
   - eoap_access_owner_user
   - eoap_change_manager_user
   - eoap_risk_analyst_user
   - eoap_auditor_user
   - eoap_manager_user

**Expected Result**:
- 7 roles criados
- Hierarquia de roles configurada
- Usuários de teste criados com roles apropriados

**Validation**:
- Verificar roles em User Administration → Roles
- Verificar contains em cada role
- Login como cada usuário de teste e verificar acesso

**Rollback**:
- Remover roles
- Remover usuários de teste

---

### Step 4 - Configure ACLs

**Objetivo**: Configurar ACLs por tabela e operação com deny-by-default.

#### 4.1 ACLs x_eoap_user_access

| Operação | Role | Permissão | Justificativa |
| --- | --- | --- | --- |
| create | x_eoap_admin | admin | Criação via sistema |
| create | x_eoap_access_owner | admin | Criação via flow |
| create | (outros) | none | Deny by default |
| read | x_eoap_admin | read | Leitura completa |
| read | x_eoap_access_owner | read | Leitura sob responsabilidade |
| read | x_eoap_manager | read | Leitura equipe |
| read | x_eoap_auditor | read | Auditoria |
| read | (outros) | none | Deny by default |
| write | x_eoap_admin | write | Administração |
| write | x_eoap_access_owner | write | Apenas campos permitidos |
| write | (outros) | none | Deny by default |
| delete | (todos) | none | Sem delete físico |

#### 4.2 ACLs x_eoap_audit_trail

| Operação | Role | Permissão | Justificativa |
| --- | --- | --- | --- |
| create | x_eoap_admin | admin | Via EOAP_AuditLogger |
| create | (outros) | none | Somente serviço |
| read | x_eoap_admin | read | Administração |
| read | x_eoap_auditor | read | Auditoria |
| read | (outros) | none | Deny by default |
| write | (todos) | none | Append-only |
| delete | (todos) | none | Imutável |

#### 4.3 ACLs change_request (campos EOAP)

| Operação | Role | Permissão | Justificativa |
| --- | --- | --- | --- |
| write (x_eoap_risk_*) | x_eoap_admin | write | Administração |
| write (x_eoap_risk_*) | EOAP_RiskEngine | write | Via serviço |
| write (x_eoap_risk_*) | (outros) | none | Somente RiskEngine |

**Expected Result**:
- ACLs configuradas deny-by-default
- Field ACLs configuradas em dados sensíveis
- Testes ATF negativos passam

**Validation**:
- Executar suite EOAP_ATF_Security_Negative → 100% pass
- Testar cada ACL manualmente com usuários de teste

**Rollback**:
- Remover ACLs
- Reverter para estado anterior

---

### Step 5 - Create Decision Tables

#### 5.1 x_eoap_dt_access_approval_routing

**Ações**:
1. Criar Decision Table em escopo x_eoap
2. Configurar inputs conforme SDD seção 3.1
3. Configurar outputs conforme SDD seção 3.1
4. Criar regras base conforme SDD seção 3.1
5. Configurar owner: x_eoap_risk_analyst
6. Configurar ACLs: read x_eoap_admin, x_eoap_access_owner; write x_eoap_admin

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

#### 5.2 x_eoap_dt_risk_weights

**Ações**:
1. Criar Decision Table em escopo x_eoap
2. Configurar inputs conforme SDD seção 3.2
3. Configurar outputs conforme SDD seção 3.2
4. Criar regras base para cada fator
5. Configurar owner: x_eoap_risk_analyst

**Expected Result**:
- Decision Table criada
- Regras para cada fator de risco

**Validation**:
- Testar com change_request variados
- Verificar pesos aplicados

**Rollback**:
- Remover Decision Table

#### 5.3 x_eoap_dt_risk_banding

**Ações**:
1. Criar Decision Table em escopo x_eoap
2. Configurar inputs conforme SDD seção 3.3
3. Configurar outputs conforme SDD seção 3.3
4. Criar regras conforme SDD seção 3.3
5. Configurar owner: x_eoap_risk_analyst

**Expected Result**:
- Decision Table criada
- Regras de banding configuradas

**Validation**:
- Testar com scores variados
- Verificar bandas corretas

**Rollback**:
- Remover Decision Table

#### 5.4 x_eoap_dt_lifecycle_actions

**Ações**:
1. Criar Decision Table em escopo x_eoap
2. Configurar inputs conforme SDD seção 3.4
3. Configurar outputs conforme SDD seção 3.4
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

### Step 6 - Create Flows and Subflows

#### 6.1 EOAP_Flow_Employee_Onboarding

**Ações**:
1. Criar Flow em escopo x_eoap
2. Configurar trigger: evento eoap.employee.created OU Catalog Item
3. Implementar steps conforme SDD seção 5.1:
   - Validate Input
   - Lookup Lifecycle Actions (DT)
   - Request Manager Approval (se necessário)
   - Grant Default Access (subflow)
   - Publish Events (subflow)
   - Log Audit Trail (subflow)
   - Notify Manager
4. Configurar error handling conforme SDD
5. Configurar subflows

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

#### 6.2 EOAP_Flow_Employee_Move

**Ações**:
1. Criar Flow em escopo x_eoap
2. Configurar trigger: evento eoap.employee.moved
3. Implementar steps conforme SDD seção 5.2
4. Configurar error handling

**Expected Result**:
- Flow criado
- Diff analysis implementado

**Validation**:
- Testar happy path
- Verificar revogações e concessões

**Rollback**:
- Remover Flow

#### 6.3 EOAP_Flow_Employee_Offboarding

**Ações**:
1. Criar Flow em escopo x_eoap
2. Configurar trigger: evento eoap.employee.terminated
3. Implementar steps conforme SDD seção 5.3
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

#### 6.4 EOAP_Flow_Access_Request

**Ações**:
1. Criar Flow em escopo x_eoap
2. Configurar trigger: Catalog Item
3. Implementar steps conforme SDD seção 5.4
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

#### 6.5 EOAP_Flow_Change_Risk_Assessment

**Ações**:
1. Criar Flow em escopo x_eoap
2. Configurar trigger: Business Rule em change_request (on submit)
3. Implementar steps conforme SDD seção 5.5
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

#### 6.6 Subflows

**Ações**:
1. Criar EOAP_Subflow_Grant_Access_Profile
2. Criar EOAP_Subflow_Publish_Event
3. Criar EOAP_Subflow_Log_Audit

**Expected Result**:
- 3 subflows criados
- Reutilizáveis por flows principais

**Validation**:
- Testar cada subflow isoladamente
- Verificar integração com flows principais

**Rollback**:
- Remover subflows

---

### Step 7 - Configure Integrations

#### 7.1 Scripted REST API

**Ações**:
1. Criar Scripted REST API em escopo x_eoap
2. Configurar path: `/api/x_eoap/v1/`
3. Criar endpoints:
   - GET /access/{sys_id} - Consultar acesso
   - POST /access - Solicitar acesso
   - GET /risk/{change_sys_id} - Consultar risco
4. Configurar autenticação: OAuth 2.0
5. Configurar ACLs: x_eoap_admin, x_eoap_manager
6. Implementar rate limiting

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

#### 7.2 Connection & Credential Aliases

**Ações**:
1. Criar alias para HRIS (mock em PDI)
2. Criar alias para IAM (mock em PDI)
3. Criar alias para SIEM (mock em PDI)
4. Configurar autenticação: OAuth 2.0 ou certificado mútuo
5. Configurar rotação de credenciais

**Expected Result**:
- 3 aliases criados
- Autenticação configurada
- Rotação documentada

**Validation**:
- Testar conexão com cada alias
- Verificar autenticação

**Rollback**:
- Remover aliases

#### 7.3 Outbound REST Messages

**Ações**:
1. Criar Outbound REST Message para IAM provision
2. Criar Outbound REST Message para IAM deprovision
3. Criar Outbound REST Message para SIEM alert
4. Configurar autenticação via Connection Alias
5. Configurar retry

**Expected Result**:
- 3 REST Messages criados
- Integração com IAM e SIEM

**Validation**:
- Testar cada REST Message
- Verificar retry

**Rollback**:
- Remover REST Messages

---

### Step 8 - Configure Notifications

**Ações**:
1. Criar notificações:
   - EOAP_Notif_Access_Approved
   - EOAP_Notif_Access_Rejected
   - EOAP_Notif_Access_Expired
   - EOAP_Notif_Offboarding_Complete
   - EOAP_Notif_Recertification_Due
   - EOAP_Notif_CMDB_Quality_Failed
   - EOAP_Notif_Event_DLQ
2. Configurar recipients por tipo
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

### Step 9 - Configure Dashboards

**Ações**:
1. Criar dashboard EOAP_Operational_Overview
2. Criar widgets:
   - User Access by Status
   - Access by Application
   - Risk Band Distribution
   - Event Processing Status
   - CMDB Completeness Rate
   - Audit Trail Volume (7 dias)
3. Configurar filtros por período
4. Configurar drill-down para detalhes

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

### Step 10 - ATF Validation

**Ações**:
1. Criar suite EOAP_ATF_CMDB_Foundation
   - Testar qualidade CMDB
   - Testar relações CSDM
   - Testar campos EOAP preenchidos
2. Criar suite EOAP_ATF_Employee_Lifecycle
   - Testar onboarding
   - Testar move
   - Testar offboarding
   - Testar idempotência
3. Criar suite EOAP_ATF_Access_Governance
   - Testar request
   - Testar approve
   - Testar reject
   - Testar exception
   - Testar recertification
4. Criar suite EOAP_ATF_Change_Risk
   - Testar scoring
   - Testar emergency
   - Testar CMDB Unknown
   - Testar volume < 5s
5. Criar suite EOAP_ATF_Security_Negative
   - Testar ACL
   - Testar Field ACL
   - Testar SoD
   - Testar cross-role
6. Criar suite EOAP_ATF_Events
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

## 3. Post-Installation Validation

### 3.1 Functional Validation

- [ ] Onboarding funcionando
- [ ] Move funcionando
- [ ] Offboarding funcionando
- [ ] Access request funcionando
- [ ] Risk calculation funcionando
- [ ] Audit trail sendo gerado
- [ ] Eventos sendo processados
- [ ] Notificações sendo enviadas

### 3.2 Security Validation

- [ ] ACLs deny-by-default configuradas
- [ ] Field ACLs configuradas
- [ ] SoD enforcement funcionando
- [ ] ATF Security_Negative 100% pass
- [ ] MFA configurado para admin e risk_analyst
- [ ] OAuth 2.0 configurado
- [ ] TLS 1.2+ ativo

### 3.3 Performance Validation

- [ ] Formulários < 3s
- [ ] Risk engine < 5s
- [ ] Event processing < 30s
- [ ] Offboarding < 60s
- [ ] Change risk < 5s

### 3.4 CMDB Quality Validation

- [ ] CMDB completeness ≥ 95%
- [ ] Campos EOAP preenchidos
- [ ] Relações CSDM configuradas
- [ ] CMDB Quality Report funcionando

---

## 4. Go-Live Checklist

### Pre-Go-Live

- [ ] Review ADRs aprovados
- [ ] Validar nomenclatura corrigida implementada
- [ ] Validar estrutura documental reorganizada
- [ ] Validar Implementation Guide completo
- [ ] Validar ATF suites 100% pass
- [ ] Validar CMDB quality ≥ 95%
- [ ] Validar MFA configurado para admin e risk_analyst
- [ ] Validar OAuth 2.0 configurado
- [ ] Validar TLS 1.2+ ativo
- [ ] Validar archiving configurado

### Go-Live Day

- [ ] Deploy para PROD
- [ ] Validar application ativa
- [ ] Validar menu EOAP visível
- [ ] Validar ACLs configuradas
- [ ] Validar roles configuradas
- [ ] Validar Decision Tables ativas
- [ ] Validar Flows ativos
- [ ] Validar Integrations funcionando
- [ ] Validar Notifications configuradas
- [ ] Validar Dashboards populados

### Post-Go-Live (Day 1)

- [ ] Validar onboarding funcionando
- [ ] Validar offboarding funcionando
- [ ] Validar access request funcionando
- [ ] Validar risk calculation funcionando
- [ ] Validar audit trail sendo gerado
- [ ] Validar eventos sendo processados
- [ ] Validar notificações sendo enviadas

### Post-Go-Live (Week 1)

- [ ] Validar CMDB quality report
- [ ] Validar reconciliation job
- [ ] Validar recertification job
- [ ] Validar expiration job
- [ ] Validar event retry job
- [ ] Validar dashboards precisos
- [ ] Validar alerting funcionando

---

*Implementation Guide - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
