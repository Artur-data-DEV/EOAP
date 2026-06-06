# EOAP Installation Guide

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Installation Guide |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Instalação Corporativa |

> **Escopo deste documento**: Guia específico de instalação da EOAP. Inclui criação de application scope, tabelas customizadas, roles e ACLs. Para configuração completa (Decision Tables, Flows, Integrations), ver Configuration Guide.

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

### 1.3 Escopo da Aplicação

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

#### 2.1 x_eoap_user_access

**Ações**:
1. Navegar para System Definition → Tables
2. Criar nova tabela:
   - Label: User Access
   - Name: x_eoap_user_access
   - Extends: Standalone table
   - Create module: Yes
   - Application: EOAP
3. Criar campos:
   - user (Reference: sys_user)
   - application (Reference: cmdb_ci_business_app)
   - access_profile (String)
   - status (Choice: requested, pending_approval, approved, active, expired, revoked, rejected)
   - granted_by (Reference: sys_user)
   - granted_on (DateTime)
   - valid_from (DateTime)
   - valid_to (DateTime)
   - risk_rating (Choice: Low, Medium, High, Critical)
   - data_classification (Choice: Public, Internal, Confidential, Restricted)
   - access_criticality (Choice: Low, Medium, High, Critical)
   - operational_tier (Choice: Tier 1, Tier 2, Tier 3)
   - justification (String)
   - exception_reference (Reference: x_eoap_access_exception)
   - cmdb_ci_service (Reference: cmdb_ci_service_discovered)
   - correlation_id (String)
   - sys_created_by (String)
   - sys_updated_by (String)
4. Criar índices:
   - user, application, status
   - valid_to, status
   - user, status
   - application, status
   - correlation_id
   - cmdb_ci_service
5. Configurar ACLs:
   - create: system/service only
   - read: x_eoap_admin, x_eoap_access_owner, x_eoap_manager, x_eoap_auditor
   - write: x_eoap_admin, x_eoap_access_owner (apenas campos permitidos)
   - delete: none
6. Criar Field ACLs:
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
1. Criar tabela:
   - Label: Access Exception
   - Name: x_eoap_access_exception
   - Extends: Standalone table
   - Application: EOAP
2. Criar campos:
   - user_access (Reference: x_eoap_user_access)
   - exception_type (Choice: Business Critical, Temporary Access, Emergency)
   - justification (String)
   - approved_by (Reference: sys_user)
   - approved_on (DateTime)
   - valid_from (DateTime)
   - valid_to (DateTime)
   - status (Choice: requested, approved, active, expired, revoked)
   - review_required (Boolean)
   - review_date (DateTime)
3. Criar índices:
   - user_access, status
   - valid_to, status
   - user, status
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
1. Criar tabela:
   - Label: Audit Trail
   - Name: x_eoap_audit_trail
   - Extends: Standalone table
   - Application: EOAP
2. Criar campos:
   - event_type (String)
   - entity_type (String)
   - entity_sys_id (String)
   - action (String)
   - actor (Reference: sys_user)
   - timestamp (DateTime)
   - payload_summary (String)
   - payload_details (JSON)
   - correlation_id (String)
   - source (String)
3. Criar índices:
   - entity_type, entity_sys_id
   - event_type, timestamp
   - actor, timestamp
   - correlation_id
   - timestamp
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
1. Criar tabela:
   - Label: Event Processing
   - Name: x_eoap_event_processing
   - Extends: Standalone table
   - Application: EOAP
2. Criar campos:
   - idempotency_key (String, Unique)
   - event_type (String)
   - event_data (JSON)
   - status (Choice: received, processing, processed, failed, retry_pending, failed_final, ignored_duplicate)
   - retry_count (Integer)
   - last_error (String)
   - processed_on (DateTime)
   - correlation_id (String)
3. Criar índice unique em idempotency_key
4. Criar índices:
   - status, processed_on
   - event_type, status
   - correlation_id
5. Configurar ACLs:
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
1. Criar tabela:
   - Label: Risk Evidence
   - Name: x_eoap_risk_evidence
   - Extends: Standalone table
   - Application: EOAP
2. Criar campos:
   - change_request (Reference: change_request)
   - risk_factor (String)
   - risk_weight (Integer)
   - risk_value (Integer)
   - band (Choice: Low, Medium, High, Critical, Unknown)
   - evidence_data (JSON)
   - calculated_on (DateTime)
   - correlation_id (String)
3. Criar índices:
   - change_request
   - risk_factor
   - band
   - calculated_on
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
1. Criar tabela:
   - Label: Staging Employee
   - Name: x_eoap_staging_employee
   - Extends: Standalone table
   - Application: EOAP
2. Criar campos:
   - employee_sys_id (String)
   - event_type (Choice: created, moved, terminated)
   - event_data (JSON)
   - processed (Boolean)
   - processed_on (DateTime)
   - error_message (String)
3. Criar índices:
   - employee_sys_id
   - event_type
   - processed
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
1. Criar tabela:
   - Label: Staging Access Reconciliation
   - Name: x_eoap_staging_access_reconciliation
   - Extends: Standalone table
   - Application: EOAP
2. Criar campos:
   - user_sys_id (String)
   - application_sys_id (String)
   - technical_access (Boolean)
   - governed_access (Boolean)
   - drift_type (Choice: orphan_access, missing_access, mismatch)
   - reconciliation_status (Choice: pending, reviewed, resolved)
   - reviewed_on (DateTime)
   - reviewed_by (Reference: sys_user)
3. Criar índices:
   - user_sys_id
   - application_sys_id
   - drift_type
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
1. Navegar para User Administration → Roles
2. Criar roles:
   - **x_eoap_admin**: Administração EOAP
   - **x_eoap_cmdb_manager**: Campos EOAP em CMDB
   - **x_eoap_access_owner**: Aprovação de acesso
   - **x_eoap_change_manager**: Gestão de mudança
   - **x_eoap_risk_analyst**: Análise de risco
   - **x_eoap_auditor**: Auditoria
   - **x_eoap_manager**: Solicitação de acesso
3. Configurar contains:
   - x_eoap_admin: contém admin (opcional, não recomendado em PROD)
   - x_eoap_risk_analyst: contém x_eoap_admin (opcional)
   - Outros roles: sem contains operacionais
4. Criar grupos:
   - **EOAP Access Owners**: Grupo de aprovação
   - **EOAP CAB Risk Reviewers**: Grupo CAB
   - **EOAP Platform Owners**: Grupo governança
5. Atribuir roles a usuários de teste:
   - eoap_admin_user
   - eoap_cmdb_manager_user
   - eoap_access_owner_user
   - eoap_change_manager_user
   - eoap_risk_analyst_user
   - eoap_auditor_user
   - eoap_manager_user

**Expected Result**:
- 7 roles criados
- 3 grupos criados
- Hierarquia de roles configurada
- Usuários de teste criados com roles apropriados

**Validation**:
- Verificar roles em User Administration → Roles
- Verificar contains em cada role
- Login como cada usuário de teste e verificar acesso

**Rollback**:
- Remover roles
- Remover grupos
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

## 3. Post-Installation Validation

### 3.1 Table Validation

- [ ] x_eoap_user_access criada com 20 campos
- [ ] x_eoap_access_exception criada
- [ ] x_eoap_audit_trail criada
- [ ] x_eoap_event_processing criada
- [ ] x_eoap_risk_evidence criada
- [ ] x_eoap_staging_employee criada
- [ ] x_eoap_staging_access_reconciliation criada
- [ ] Todos os índices criados
- [ ] ACLs configuradas deny-by-default

### 3.2 Role Validation

- [ ] x_eoap_admin criado
- [ ] x_eoap_cmdb_manager criado
- [ ] x_eoap_access_owner criado
- [ ] x_eoap_change_manager criado
- [ ] x_eoap_risk_analyst criado
- [ ] x_eoap_auditor criado
- [ ] x_eoap_manager criado
- [ ] Grupos criados
- [ ] Usuários de teste criados

### 3.3 ACL Validation

- [ ] ACLs deny-by-default configuradas
- [ ] Field ACLs configuradas
- [ ] Cross-scope ACLs configuradas

---

## 4. Next Steps

Após completar a instalação, prossiga com:

1. **Configuration Guide**: Configurar Decision Tables, Flows, Integrations
2. **Operations Setup**: Configurar runbooks, dashboards, alerting
3. **Testing Setup**: Configurar ATF suites
4. **Go-Live**: Executar checklist de go-live

---

*Installation Guide - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
