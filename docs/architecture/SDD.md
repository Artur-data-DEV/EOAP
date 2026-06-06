# EOAP — Solution Design Document (SDD)

| Atributo | Valor |
| --- | --- |
| Documento | Solution Design Document (SDD) |
| Solução | EOAP v2 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow |
| Autor | Artur Campos Batista |
| Data | 2026-06-06 |
| Versão | 2.0 |
| Status | Aprovado para implementação |
| Documento de referência | EOAP_ADD_v2.md (Architecture Design Document) |
| Documento complementar | EOAP_Implementation_Guide_v2.md (Implementation Guide) |

> **Escopo deste documento**: Este SDD contém o design detalhado de todos os componentes da EOAP. Decisões arquiteturais estão no ADD. Plano de execução por sprint está no Implementation Guide. Para cada componente, este documento define: objetivo, entradas, saídas, dependências, tratamento de erro, logs, segurança e testes.

---

## Sumário

1. [Custom Tables Design](#1-custom-tables-design)
2. [Custom Fields Design](#2-custom-fields-design)
3. [Decision Tables Design](#3-decision-tables-design)
4. [Script Includes Design](#4-script-includes-design)
5. [Flows Design](#5-flows-design)
6. [Catalog Items & Record Producers](#6-catalog-items--record-producers)
7. [Business Rules Design](#7-business-rules-design)
8. [Scheduled Jobs Design](#8-scheduled-jobs-design)
9. [Notifications Design](#9-notifications-design)
10. [ATF Test Suites Design](#10-atf-test-suites-design)
11. [APIs & Integration Points](#11-apis--integration-points)
12. [Import Sets & Transform Maps](#12-import-sets--transform-maps)
13. [Dashboards & Reporting](#13-dashboards--reporting)
14. [UI Policies & Client Scripts](#14-ui-policies--client-scripts)

---

## 1. Custom Tables Design

### 1.1 x_eoap_user_access — User Access Registry

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Registro governado de acesso concedido a usuário para aplicação, serviço, perfil ou entitlement, com ciclo de vida completo incluindo owner, validade, justificativa, status e recertificação. |
| **ADR** | ADR-011 |
| **Extends** | task (para herdar workflow capabilities, approvals e assignment) ou standalone — decisão: **standalone** para evitar overhead de task e manter semântica pura de entitlement. |

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| user | Reference (sys_user) | Sim | Usuário que recebe o acesso. |
| application | Reference (cmdb_ci_business_app) | Sim | Business Application governada. |
| application_service | Reference (cmdb_ci_service_discovered) | Não | Application Service específico, se aplicável. |
| access_type | Choice | Sim | Tipo de acesso: role, group, entitlement, profile. |
| access_level | Choice | Sim | Nível: read, write, admin, privileged. |
| access_owner | Reference (sys_user) | Sim | Owner de governança responsável pelo acesso. |
| status | Choice | Sim | Status do ciclo de vida: requested (Requested), pending_approval (Aprovação pendente), approved (Aprovado), active (Provisionado/Ativo), expired (Expirado), revoked (Revogado), rejected (Rejeitado). |
| justification | String (256) | Sim | Justificativa de negócio. |
| valid_from | Date | Sim | Data de início da validade. |
| valid_to | Date | Não | Data de expiração (obrigatória se temporário). |
| granted_by | Reference (sys_user) | Não | Quem concedeu efetivamente. |
| granted_on | DateTime | Não | Data de concessão. |
| revoked_by | Reference (sys_user) | Não | Quem revogou. |
| revoked_on | DateTime | Não | Data de revogação. |
| revocation_reason | Choice | Não | Motivo: expiration, offboarding, manual, recertification_failed, policy_change. |
| recertification_date | Date | Não | Data da próxima recertificação. |
| recertification_status | Choice | Não | Status: pending, certified, revoked. |
| risk_rating | Choice | Não | Classificação de risco do acesso: low, medium, high, critical. |
| source_request | Reference (sc_req_item) | Não | RITM de origem, se aplicável. |
| correlation_id | String (128) | Sim | ID de correlação end-to-end. |

#### Transições de Estado

As transições de estado para o registro de acesso (`x_eoap_user_access`) seguem as seguintes regras de negócio:

| Estado Origem | Estado Destino | Evento / Ação Gatilho | Autor / Processo |
| --- | --- | --- | --- |
| `[Nulo]` | `requested` | Criação da solicitação via Catalog Item ou Flow. | Requester / Employee Lifecycle Flow |
| `requested` | `pending_approval` | Solicitação submetida; Roteamento avaliado por `DT_EOAP_Access_Approval_Routing`. | Flow Designer Engine |
| `pending_approval` | `approved` | Aprovadores autorizam a solicitação de acesso. | Access Owner |
| `pending_approval` | `rejected` | Aprovador recusa a solicitação de acesso. | Access Owner |
| `approved` | `active` | Automação técnica confirma a criação do acesso físico/lógico. | Outbound REST Action / Group Sync |
| `active` | `revoked` | Desligamento ou revogação manual de acessos incompatíveis. | Offboarding Flow / Access Owner |
| `active` | `expired` | A data `valid_to` é atingida. | Scheduled Job `EOAP_Job_Access_Expiration` |


#### Índices

| Campos | Tipo | Justificativa |
| --- | --- | --- |
| user, status | Composite | Consulta de acessos ativos por usuário. |
| application, status | Composite | Consulta de acessos por aplicação. |
| access_owner, status | Composite | Consulta de acessos por owner. |
| valid_to, status | Composite | Job de expiração. |
| correlation_id | Single | Rastreabilidade end-to-end. |
| recertification_date, recertification_status | Composite | Job de recertificação. |

#### Dependências

- cmdb_ci_business_app (x_eoap_access_owner preenchido)
- sys_user (ativo)
- EOAP_AccessGovernanceService (operações de lifecycle)
- EOAP_AuditLogger (registro de evidência)

#### Tratamento de Erro

- Criação sem user ou application válidos: rejeitar com mensagem específica.
- Criação sem access_owner na aplicação referenciada: escalar ao CMDB Manager.
- Transição de status inválida: rejeitar e logar tentativa.
- Expiração de acesso já revogado: ignorar (idempotente).

#### Logs

- Toda criação, alteração de status e revogação geram log `[EOAP][AccessGovernance][UserAccess][{correlation_id}][{outcome}]`.
- Toda transição gera audit trail via EOAP_AuditLogger.

#### Segurança

- Ver Record ACLs e Field ACLs no ADD, seção 12.

#### Testes ATF

- Criar acesso com dados válidos → status = requested.
- Aprovar acesso → status = active.
- Expirar acesso → status = expired.
- Revogar acesso → status = revoked.
- Tentativa de deleção → bloqueada por ACL.
- Tentativa de leitura sem role → bloqueada por ACL.
- Tentativa de edição de risk_rating por Access Owner → bloqueada por Field ACL.

---

### 1.2 x_eoap_access_exception — Access Exception Registry

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Controle de exceções temporárias de acesso com risco, aprovação, validade, compensating controls e reconciliação pós-vencimento. |
| **ADR** | ADR-014 |

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| user_access | Reference (x_eoap_user_access) | Sim | Registro de acesso relacionado. |
| exception_type | Choice | Sim | Tipo: temporary_elevation, policy_override, emergency_access. |
| justification | String (512) | Sim | Justificativa detalhada. |
| risk_assessment | Choice | Sim | Risco: low, medium, high, critical. |
| compensating_control | String (512) | Sim | Controles compensatórios. |
| status | Choice | Sim | Status: requested, approved, active, expired, revoked. |
| valid_from | Date | Sim | Início. |
| valid_to | Date | Sim | Fim obrigatório para exceções. |
| approved_by | Reference (sys_user) | Não | Aprovador. |
| approved_on | DateTime | Não | Data de aprovação. |
| correlation_id | String (128) | Sim | ID de correlação. |

#### Dependências

- x_eoap_user_access
- EOAP_AccessGovernanceService
- Approval Flow
- EOAP_AuditLogger

#### Tratamento de Erro

- Exceção sem validade → rejeitar criação.
- Exceção sem compensating control → rejeitar criação.
- Exceção expirada com acesso ainda ativo → gerar tarefa de revogação.

#### Logs e Segurança

- Padrão EOAP de logging e audit trail.
- ACLs conforme ADD seção 12.

#### Testes ATF

- Criar exceção com dados válidos → status = requested.
- Aprovar → status = active.
- Expirar → status = expired, acesso relacionado sinalizado.
- Tentativa de criação sem compensating_control → rejeitada.
- Tentativa de deleção → bloqueada.

---

### 1.3 x_eoap_audit_trail — Audit Trail

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Trilha de auditoria aplicacional write-only para decisões, score, aprovações, rejeições e exceções com semântica de negócio. |
| **ADR** | ADR-006 |

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| actor | Reference (sys_user) | Sim | Quem realizou a ação. |
| action | Choice | Sim | access_requested, access_approved, access_rejected, access_granted, access_revoked, access_expired, exception_created, exception_approved, exception_expired, risk_calculated, owner_changed, lifecycle_event, cmdb_quality_failed, event_failed, reconciliation_drift. |
| entity_type | String (64) | Sim | user_access, access_exception, change_request, business_application, event. |
| entity_sys_id | String (32) | Sim | Sys_id da entidade. |
| before_summary | String (512) | Não | Estado anterior. |
| after_summary | String (512) | Não | Estado posterior. |
| correlation_id | String (128) | Sim | ID de correlação. |
| transaction_id | String (128) | Sim | ID de transação ServiceNow. |
| outcome | Choice | Sim | success, failure, partial. |
| payload_summary | String (1024) | Não | Contexto adicional (sanitizado). |
| rule_version | String (64) | Não | Versão da regra aplicada. |
| module | String (64) | Sim | Módulo EOAP que gerou o registro. |

#### Índices

| Campos | Tipo | Justificativa |
| --- | --- | --- |
| entity_type, entity_sys_id | Composite | Consulta de trilha por entidade. |
| correlation_id | Single | Rastreabilidade end-to-end. |
| created_on | Single | Consulta por período. |
| actor | Single | Consulta por ator. |
| action | Single | Consulta por tipo de ação. |

#### Tratamento de Erro

- Falha de escrita no audit trail: logar em syslog com severidade error e correlation_id. NUNCA silenciar falha de auditoria.
- Se EOAP_AuditLogger falhar, a operação principal NÃO deve ser revertida (audit trail é assíncrono por design), mas deve gerar alerta ao Platform Owner.

#### Segurança

- create: somente EOAP_AuditLogger (service context).
- read: x_eoap.admin, x_eoap.auditor.
- write: NENHUM.
- delete: NENHUM.
- Field ACL em payload_summary: somente auditor e admin.

---

### 1.4 x_eoap_event_processing — Event Processing Control

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Controle operacional de eventos críticos com status, retry, correlation_id, idempotency_key e governança de processamento. |
| **ADR** | ADR-012 |

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| event_name | String (128) | Sim | Nome do evento (ex: eoap.employee.created). |
| correlation_id | String (128) | Sim | ID de correlação. |
| idempotency_key | String (256) | Sim | Chave de idempotência. |
| status | Choice | Sim | received, processing, processed, failed, retry_pending, failed_final, ignored_duplicate. |
| payload_hash | String (64) | Não | Hash do payload para detecção de duplicatas. |
| retry_count | Integer | Sim (default 0) | Contagem de retries. |
| max_retries | Integer | Sim (default 3) | Limite de retries. |
| error_message | String (512) | Não | Mensagem de erro. |
| error_detail | String (2000) | Não | Stack resumido. |
| next_retry_at | DateTime | Não | Próximo retry agendado. |
| processed_at | DateTime | Não | Timestamp de processamento. |
| source_module | String (64) | Sim | Módulo de origem. |

#### Índices

| Campos | Tipo | Justificativa |
| --- | --- | --- |
| idempotency_key | Single (unique) | Detecção de duplicatas. |
| correlation_id | Single | Rastreabilidade. |
| status | Single | Monitoramento operacional. |
| event_name, status | Composite | Dashboard por tipo e status. |
| next_retry_at, status | Composite | Job de retry. |

---

### 1.5 x_eoap_risk_evidence — Risk Evidence

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Evidências de cálculo de risco por Change, decompostas por fator, regra e versão para auditoria e calibragem. |
| **ADR** | ADR-010 |

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| change_request | Reference (change_request) | Sim | Change avaliada. |
| factor_name | String (128) | Sim | Nome do fator: ci_criticality, incident_history, outage_history, window_risk, etc. |
| factor_value | String (256) | Sim | Valor do fator. |
| factor_weight | Decimal | Sim | Peso aplicado. |
| factor_score | Decimal | Sim | Score parcial (value × weight). |
| rule_version | String (64) | Sim | Versão da Decision Table que gerou o peso. |
| source_ci | Reference (cmdb_ci) | Não | CI de referência, se aplicável. |
| total_score | Decimal | Não | Score total (preenchido no registro final). |
| risk_band | Choice | Não | Banda resultante: low, medium, high, critical. |
| correlation_id | String (128) | Sim | ID de correlação. |
| calculated_at | DateTime | Sim | Timestamp do cálculo. |
| calculated_by | String (64) | Sim | Identidade do service (EOAP_RiskEngine). |

#### Índices

| Campos | Tipo | Justificativa |
| --- | --- | --- |
| change_request | Single | Consulta de evidências por Change. |
| rule_version | Single | Análise de regras por versão. |
| correlation_id | Single | Rastreabilidade. |
| risk_band | Single | Dashboard de distribuição. |

---

## 2. Custom Fields Design

### 2.1 Campos em cmdb_ci_business_app

| Campo | Tipo | Values | Propósito | Governança |
| --- | --- | --- | --- | --- |
| x_eoap_access_owner | Reference (sys_user) | N/A | Owner de governança de acesso. | Preenchimento obrigatório para apps críticas. CMDB Manager/Admin escreve. |
| x_eoap_data_classification | Choice | public, internal, confidential, restricted | Classificação de dados processados. | Alimenta Decision Tables de risco e aprovação. |
| x_eoap_access_criticality | Choice | low, medium, high, critical | Criticidade do acesso/entitlement. | Alimenta Decision Tables de risco e aprovação. |

### 2.2 Campos em cmdb_ci_service_discovered

| Campo | Tipo | Values | Propósito | Governança |
| --- | --- | --- | --- | --- |
| x_eoap_operational_tier | Choice | tier_1, tier_2, tier_3 | Tier operacional para cálculo de risco. | Alinha ao modelo de risco EOAP. |

### 2.3 Campos em change_request

| Campo | Tipo | Values | Propósito | Governança |
| --- | --- | --- | --- | --- |
| x_eoap_risk_score | Integer | 0-100 | Score calculado pelo Risk Engine. | Somente RiskEngine escreve; Change Manager lê. |
| x_eoap_risk_band | Choice | low, medium, high, critical | Faixa de risco. | Derivada por Decision Table. |
| x_eoap_risk_explanation | String (2000) | N/A | Explicação da composição do risco. | Gerada por RiskEngine. |

---

## 3. Decision Tables Design

### 3.1 DT_EOAP_Access_Approval_Routing

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Roteamento declarativo de aprovações de acesso sem alteração de código. |
| **Owner** | Access Governance Admin |

#### Inputs

| Input | Tipo | Origem |
| --- | --- | --- |
| application_access_criticality | Choice | cmdb_ci_business_app.x_eoap_access_criticality |
| data_classification | Choice | cmdb_ci_business_app.x_eoap_data_classification |
| employment_type | Choice | sys_user (regular, contractor, vendor, temporary) |
| exception_flag | Boolean | x_eoap_access_exception exists |
| access_level | Choice | x_eoap_user_access.access_level |

#### Outputs

| Output | Tipo | Descrição |
| --- | --- | --- |
| approval_group | Reference (sys_user_group) | Grupo aprovador. |
| approval_required | Boolean | Se aprovação é necessária. |
| approval_levels | Integer | Número de níveis de aprovação. |
| sla_target | Integer (hours) | SLA de decisão. |

#### Regras Exemplo

| access_criticality | data_classification | employment_type | exception_flag | → approval_required | → approval_levels | → sla_target |
| --- | --- | --- | --- | --- | --- | --- |
| critical | restricted | any | false | true | 2 | 4h |
| critical | restricted | contractor | false | true | 3 | 8h |
| high | confidential | any | false | true | 1 | 8h |
| low | public | regular | false | false | 0 | N/A |
| any | any | any | true | true | +1 | +4h |

#### Dependências

- cmdb_ci_business_app com campos EOAP preenchidos.
- Grupos de aprovação configurados.

#### Tratamento de Erro

- Campos de entrada ausentes: usar defaults conservadores (approval_required = true, approval_levels = 2).
- Nenhuma regra correspondente: gerar alerta e usar defaults conservadores.

#### Logs

- Log de avaliação com correlation_id, inputs e output selecionado.

#### Segurança

- Somente x_eoap.admin e x_eoap.access_owner podem visualizar.
- Somente x_eoap.admin pode alterar regras.
- Alteração gera audit trail.

#### Testes ATF

- App critical + restricted → 2 níveis.
- App low + public + regular → sem aprovação.
- Contractor + critical → 3 níveis.
- Exception flag → +1 nível.
- Inputs ausentes → defaults conservadores.

---

### 3.2 DT_EOAP_Risk_Weights

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Separar pesos de risco do cálculo procedural, permitindo calibragem por governança. |
| **Owner** | Risk Analyst |

#### Inputs

| Input | Tipo | Origem |
| --- | --- | --- |
| change_type | Choice | change_request.type |
| app_criticality | Choice | cmdb_ci_business_app.x_eoap_access_criticality |
| data_classification | Choice | cmdb_ci_business_app.x_eoap_data_classification |
| operational_tier | Choice | cmdb_ci_service_discovered.x_eoap_operational_tier |
| incident_count_90d | Integer | Calculado por RiskEngine |
| outage_count_90d | Integer | Calculado por RiskEngine |
| change_window_risk | Choice | in_window, outside_window, emergency |

#### Outputs

| Output | Tipo | Descrição |
| --- | --- | --- |
| factor_name | String | Nome do fator avaliado. |
| factor_weight | Decimal | Peso do fator (0.0 - 1.0). |
| factor_score | Integer | Score base do fator (0-100). |

#### Tratamento de Erro

- Fator não reconhecido: weight = 0, score = 0, logar warning.
- Dados ausentes: usar valores neutros (weight mínimo).

#### Testes ATF

- Change normal + tier_1 + restricted → peso alto.
- Change standard + tier_3 + public → peso baixo.
- Emergency + qualquer → peso máximo para window_risk.
- Histórico de incidentes alto → score elevado.

---

### 3.3 DT_EOAP_Risk_Banding

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Converter score total em banda de risco e determinar necessidade de CAB. |
| **Owner** | Risk Analyst |

#### Inputs

| Input | Tipo | Origem |
| --- | --- | --- |
| total_score | Integer | EOAP_RiskEngine |
| emergency_flag | Boolean | change_request.type = emergency |
| critical_service_flag | Boolean | Pelo menos um Application Service tier_1 impactado |

#### Outputs

| Output | Tipo | Descrição |
| --- | --- | --- |
| risk_band | Choice | low, medium, high, critical |
| cab_required | Boolean | Se CAB é obrigatório. |
| additional_approval | Reference (sys_user_group) | Grupo adicional de aprovação, se aplicável. |

#### Regras Exemplo

| total_score range | emergency | critical_service | → risk_band | → cab_required |
| --- | --- | --- | --- | --- |
| 0-25 | false | false | low | false |
| 26-50 | false | false | medium | false |
| 51-75 | false | false | high | true |
| 76-100 | false | false | critical | true |
| any | true | any | critical | true |
| any | false | true | high (mínimo) | true |

---

### 3.4 DT_EOAP_Lifecycle_Actions

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Configurar ações padrão de onboarding/move/offboarding por departamento, role family e localização. |
| **Owner** | Platform Owner |

#### Inputs

| Input | Tipo | Origem |
| --- | --- | --- |
| employee_event | Choice | onboarding, move, offboarding |
| department | Reference (cmdb_ci_business_app) | Department do colaborador |
| role_family | Choice | Família de cargo |
| location | Reference (cmn_location) | Localização |

#### Outputs

| Output | Tipo | Descrição |
| --- | --- | --- |
| action_set | Choice | grant_default, review_and_grant, revoke_all, revoke_and_reassign |
| default_access_profile | String | Perfil padrão de acesso a conceder. |
| notification_template | String | Template de notificação. |
| manager_approval_required | Boolean | Se manager precisa aprovar. |

---

## 4. Script Includes Design

### 4.1 EOAP_RiskEngine

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Orquestrar cálculo de risco de Change combinando Decision Tables, histórico de incidentes, criticidade de CIs e janelas de mudança. Persistir evidência e retornar score explicável. |
| **ADR** | ADR-010 |
| **Tipo** | Server-side, Scoped, não acessível client-side. |

#### Interface Pública

```javascript
// Classe: EOAP_RiskEngine
// Prototype:

/**
 * Calcula risco para uma Change Request.
 * @param {string} changeRequestSysId - sys_id da change_request.
 * @param {string} correlationId - ID de correlação end-to-end.
 * @returns {object} { score: number, band: string, explanation: string, evidenceCount: number }
 */
calculateRisk: function(changeRequestSysId, correlationId)

/**
 * Recalcula risco (idempotente — remove evidências anteriores da mesma versão).
 * @param {string} changeRequestSysId
 * @param {string} correlationId
 * @returns {object} Mesmo formato de calculateRisk.
 */
recalculateRisk: function(changeRequestSysId, correlationId)
```

#### Entradas

- change_request (sys_id)
- CIs relacionados via cmdb_rel_ci
- Histórico de incidentes (90 dias) por CI
- Histórico de outages (90 dias) por CI
- Decision Tables: DT_EOAP_Risk_Weights e DT_EOAP_Risk_Banding
- correlation_id

#### Saídas

- x_eoap_risk_score atualizado em change_request
- x_eoap_risk_band atualizado em change_request
- x_eoap_risk_explanation atualizado em change_request
- Registros em x_eoap_risk_evidence (1 por fator)
- Audit trail via EOAP_AuditLogger
- Evento eoap.change.risk.calculated publicado

#### Lógica de Alto Nível

1. Validar change_request existe e está em estado elegível.
2. Obter CIs relacionados via cmdb_rel_ci.
3. Para cada CI: consultar Business Application, Application Service, criticidade, classificação.
4. Consultar histórico de incidentes e outages (últimos 90 dias).
5. Avaliar cada fator contra DT_EOAP_Risk_Weights.
6. Persistir evidência por fator em x_eoap_risk_evidence.
7. Somar scores parciais em score total.
8. Avaliar score total contra DT_EOAP_Risk_Banding.
9. Atualizar campos de risco em change_request.
10. Registrar audit trail.
11. Publicar evento.
12. Retornar resultado.

#### Dependências

- EOAP_AuditLogger
- DT_EOAP_Risk_Weights
- DT_EOAP_Risk_Banding
- cmdb_rel_ci
- incident, problem, cmdb_ci_outage

#### Tratamento de Erro

| Cenário | Ação |
| --- | --- |
| Change não encontrada | Retornar erro com mensagem. Não criar evidência. |
| Nenhum CI relacionado | Score = 0, band = low, explanation = "No CIs found". Log warning. |
| Decision Table sem regra correspondente | Usar defaults conservadores. Log warning. |
| Falha de consulta a CMDB | Score com confidence reduzida. Criar evidência parcial. Log error. |
| Falha de persistência de evidência | Reverter transação. Log error. Não publicar evento. |

#### Logs

- `[EOAP][RiskEngine][Change:{sys_id}][{correlation_id}][START]`
- `[EOAP][RiskEngine][Change:{sys_id}][{correlation_id}][FACTOR] {factor_name}={factor_score}`
- `[EOAP][RiskEngine][Change:{sys_id}][{correlation_id}][COMPLETE] score={score} band={band}`
- `[EOAP][RiskEngine][Change:{sys_id}][{correlation_id}][ERROR] {message}`

#### Segurança

- Executar em contexto de sistema/serviço.
- Não expor como API direta.
- Invocado por Flow Designer ou Business Rule controlada.

#### Testes ATF

- Change com 1 CI tier_1 + restricted → score alto.
- Change com 1 CI tier_3 + public → score baixo.
- Change com 20 CIs → execução < 5s.
- Change sem CIs → score = 0, band = low.
- Change emergencial → band = critical.
- Recálculo → evidências anteriores substituídas.
- Falha de CMDB → degradação graciosa.

---

### 4.2 EOAP_AuditLogger

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Registrar audit trail aplicacional write-only com correlation_id, actor, entidade, ação, payload resumido e resultado. Garantir que falha de auditoria nunca seja silenciosa. |
| **ADR** | ADR-006 |

#### Interface Pública

```javascript
// Classe: EOAP_AuditLogger
// Prototype:

/**
 * Registra entrada no audit trail.
 * @param {object} params - {
 *   actor: string (sys_id),
 *   action: string,
 *   entity_type: string,
 *   entity_sys_id: string,
 *   before_summary: string (optional),
 *   after_summary: string (optional),
 *   correlation_id: string,
 *   outcome: string,
 *   payload_summary: string (optional),
 *   rule_version: string (optional),
 *   module: string
 * }
 * @returns {string|null} sys_id do registro criado, ou null em caso de falha.
 */
log: function(params)

/**
 * Registra entrada com actor automaticamente detectado do contexto.
 * @param {object} params - Mesmo que log, sem actor.
 * @returns {string|null}
 */
logWithCurrentActor: function(params)
```

#### Tratamento de Erro

- Parâmetros obrigatórios ausentes: logar error em syslog com detalhes, retornar null.
- Falha de GlideRecord insert: logar error em syslog com correlation_id e todos os parâmetros. Gerar notificação ao Platform Owner.
- **NUNCA** silenciar falha de audit trail.

#### Segurança

- Escrita somente em contexto de sistema/serviço.
- Validar que nenhum parâmetro contém dados sensíveis sem sanitização.
- payload_summary deve ser limitado a 1024 chars e sanitizado.

---

### 4.3 EOAP_AccessGovernanceService

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Centralizar concessão, revogação, reconciliação e expiração de registros de acesso governado. Garantir idempotência e rastreabilidade. |
| **ADR** | ADR-011 |

#### Interface Pública

```javascript
// Classe: EOAP_AccessGovernanceService
// Prototype:

grantAccess: function(params) // → { success, accessSysId, message }
revokeAccess: function(accessSysId, reason, correlationId) // → { success, message }
expireAccess: function(accessSysId, correlationId) // → { success, message }
requestRecertification: function(accessSysId, correlationId) // → { success, message }
certifyAccess: function(accessSysId, correlationId) // → { success, message }
reconcile: function(applicationSysId, correlationId) // → { drifts: array, resolved: number }
```

#### Dependências

- x_eoap_user_access
- cmdb_ci_business_app
- EOAP_AuditLogger
- EOAP_EventProcessor

#### Tratamento de Erro

- Grant sem application válida: rejeitar.
- Grant sem access_owner na application: escalar ao CMDB Manager.
- Revoke de acesso já revogado: idempotente, retornar success.
- Reconcile sem aplicações configuradas: retornar lista vazia.

---

### 4.4 EOAP_EventProcessor

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Controlar consumo idempotente de eventos críticos, retry e registro de falha funcional. |
| **ADR** | ADR-012 |

#### Interface Pública

```javascript
// Classe: EOAP_EventProcessor
// Prototype:

/**
 * Registra recebimento de evento e verifica idempotência.
 * @returns {object} { shouldProcess: boolean, processingId: string, reason: string }
 */
registerEvent: function(eventName, correlationId, idempotencyKey, sourceModule)

/**
 * Marca evento como processado com sucesso.
 */
markProcessed: function(processingId)

/**
 * Marca evento como falho e agenda retry se dentro do limite.
 */
markFailed: function(processingId, errorMessage, errorDetail)

/**
 * Processa retries pendentes.
 * @returns {number} Quantidade de eventos reprocessados.
 */
processRetries: function()
```

#### Tratamento de Erro

- Duplicidade: retornar shouldProcess = false, reason = "duplicate".
- Limite de retries excedido: marcar failed_final, gerar tarefa ao Platform Owner.

---

### 4.5 EOAP_CMDBQualityService

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Validar completude mínima de Business Applications, Application Services e relacionamentos exigidos pelo EOAP. |
| **ADR** | ADR-015 |

#### Interface Pública

```javascript
// Classe: EOAP_CMDBQualityService
// Prototype:

/**
 * Valida completude de uma Business Application.
 * @returns {object} { isValid: boolean, issues: array }
 */
validateApplication: function(appSysId)

/**
 * Valida todas as Business Applications críticas.
 * @returns {object} { totalChecked: number, passed: number, failed: number, issues: array }
 */
validateAllCritical: function()

/**
 * Calcula taxa de completude para dashboard.
 * @returns {object} { rate: number, details: array }
 */
getCompletenessRate: function()
```

#### Regras de Validação

- Business Application crítica deve ter: owner, access_owner, data_classification, access_criticality, pelo menos 1 Application Service.
- Application Service deve ter: relação com Business Application, operational_tier.
- Access Owner deve referenciar usuário ativo.

---

## 5. Flows Design

### 5.1 EOAP_Flow_Employee_Onboarding

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Orquestrar onboarding de colaborador: validar dados, consultar DT_Lifecycle_Actions, solicitar aprovação se necessário, conceder acessos padrão, publicar eventos e registrar auditoria. |

#### Trigger

- Evento: eoap.employee.created
- OU Catalog Item: "EOAP Employee Onboarding"

#### Steps

1. **Validate Input**: Verificar user_sys_id, manager, department.
2. **Lookup Lifecycle Actions**: Consultar DT_EOAP_Lifecycle_Actions com employee_event = "onboarding".
3. **Request Manager Approval** (se manager_approval_required = true): Ask for Approval.
4. **Grant Default Access**: Invocar EOAP_AccessGovernanceService.grantAccess para cada acesso no perfil padrão.
5. **Publish Events**: eoap.employee.created (se ainda não publicado).
6. **Log Audit Trail**: Via EOAP_AuditLogger.
7. **Notify Manager**: Notificação de conclusão.

#### Error Handling

- Usuário inativo: cancelar flow, logar reason.
- Manager ausente: escalar ao Platform Owner.
- Falha de grant: retry interno, se falhar marcar parcial e notificar.

#### Subflows

- EOAP_Subflow_Grant_Access_Profile
- EOAP_Subflow_Publish_Event
- EOAP_Subflow_Log_Audit

---

### 5.2 EOAP_Flow_Employee_Move

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Orquestrar movimentação: identificar acessos atuais, consultar novos perfis, revogar acessos incompatíveis, conceder novos acessos, publicar eventos. |

#### Trigger

- Evento: eoap.employee.moved

#### Steps

1. **Get Current Access**: Listar acessos ativos do usuário.
2. **Lookup New Profile**: Consultar DT_EOAP_Lifecycle_Actions com employee_event = "move".
3. **Diff Analysis**: Comparar perfil atual com novo.
4. **Revoke Incompatible**: EOAP_AccessGovernanceService.revokeAccess para cada acesso não presente no novo perfil.
5. **Grant New Access**: EOAP_AccessGovernanceService.grantAccess para novos acessos.
6. **Log Audit Trail**: Todas as transições.
7. **Notify Manager**: Resumo das mudanças.

---

### 5.3 EOAP_Flow_Employee_Offboarding

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Orquestrar offboarding: revogar todos os acessos, encerrar exceções, publicar eventos, garantir completude da revogação. |

#### Trigger

- Evento: eoap.employee.terminated

#### Steps

1. **Get All Active Access**: Listar todos os acessos do usuário com status = active.
2. **Revoke All**: EOAP_AccessGovernanceService.revokeAccess para cada acesso.
3. **Expire Exceptions**: Expirar exceções ativas.
4. **Validate Completeness**: Verificar que nenhum acesso permanece ativo.
5. **Log Audit Trail**: Registrar revogação completa.
6. **Notify Manager e Platform Owner**: Confirmação de offboarding completo.

#### Error Handling

- Revogação parcial: marcar como partial, gerar tarefa de follow-up, NUNCA ignorar.
- Acesso já revogado: idempotente, prosseguir.

---

### 5.4 EOAP_Flow_Access_Request

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Processar solicitação de acesso: criar registro, avaliar roteamento por DT, solicitar aprovações, conceder ou rejeitar. |

#### Trigger

- Catalog Item: "EOAP Request Access"

#### Steps

1. **Create Access Record**: x_eoap_user_access com status = requested.
2. **Evaluate Routing**: DT_EOAP_Access_Approval_Routing.
3. **Request Approval**: Conforme routing (1-3 níveis).
4. **On Approve**: EOAP_AccessGovernanceService.grantAccess, status = active.
5. **On Reject**: EOAP_AccessGovernanceService, status = rejected.
6. **Log Audit Trail**: Cada transição.
7. **Notify Requester e Access Owner**: Decisão.
8. **Publish Event**: eoap.access.approved ou eoap.access.requested.

---

### 5.5 EOAP_Flow_Change_Risk_Assessment

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Acionar cálculo de risco quando Change Request atinge estado de avaliação. |

#### Trigger

- Business Rule (before/after): change_request transição para estado de assessment.

#### Steps

1. **Invoke RiskEngine**: EOAP_RiskEngine.calculateRisk.
2. **Evaluate CAB**: Se cab_required = true, iniciar processo de CAB review.
3. **Notify Change Manager**: Score e explicação.
4. **Log Audit Trail**: Resultado do cálculo.

---

## 6. Catalog Items & Record Producers

### 6.1 EOAP Request Access (Catalog Item)

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Permitir que colaboradores solicitem acesso a aplicações governadas de forma estruturada e rastreável. |

#### Variáveis

| Variável | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| requested_application | Reference (cmdb_ci_business_app) | Sim | Aplicação desejada. |
| access_level | Choice | Sim | Nível de acesso: read, write, admin. |
| justification | Text Area | Sim | Justificativa de negócio. |
| duration | Choice | Sim | Permanente ou temporário (30d, 60d, 90d, custom). |
| custom_end_date | Date | Condicional | Se duration = custom. |

#### Validações

- Aplicação deve ter access_owner definido.
- Aplicação deve ter data_classification definido.
- Usuário não deve ter acesso ativo duplicado.

#### Flow Trigger

- Aciona EOAP_Flow_Access_Request ao submit.

---

### 6.2 EOAP Employee Onboarding (Catalog Item)

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Iniciar processo de onboarding para novo colaborador. |

#### Variáveis

| Variável | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| employee | Reference (sys_user) | Sim | Colaborador. |
| manager | Reference (sys_user) | Sim | Gestor. |
| department | Reference (cmn_department) | Sim | Departamento. |
| start_date | Date | Sim | Data de início. |
| role_family | Choice | Sim | Família de cargo. |

---

### 6.3 EOAP Employee Offboarding (Catalog Item)

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Iniciar processo de offboarding de colaborador. |

#### Variáveis

| Variável | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| employee | Reference (sys_user) | Sim | Colaborador. |
| termination_date | Date | Sim | Data de desligamento. |
| reason | Choice | Sim | Motivo: resignation, termination, retirement, transfer. |
| immediate_revocation | Boolean | Sim | Se revogação imediata é necessária. |

---

## 7. Business Rules Design

> **Princípio**: Business Rules são usadas com moderação. A maioria dos processos usa Flow Designer. Business Rules são reservadas para: (1) validação síncrona imediata, (2) cálculos de campo que devem ocorrer no mesmo thread, (3) enforcement de integridade que não pode ser adiado.

### 7.1 BR_EOAP_AuditTrail_Protect

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Impedir atualização e deleção de registros de audit trail por qualquer persona. |
| **Tabela** | x_eoap_audit_trail |
| **When** | Before update, Before delete |
| **Ação** | `current.setAbortAction(true); gs.addErrorMessage('Audit trail records cannot be modified or deleted.');` |

### 7.2 BR_EOAP_RiskScore_Protect

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Impedir edição manual de x_eoap_risk_score e x_eoap_risk_band. |
| **Tabela** | change_request |
| **When** | Before update |
| **Condition** | current.x_eoap_risk_score.changes() || current.x_eoap_risk_band.changes() |
| **Ação** | Se caller não é EOAP_RiskEngine (verificar via context ou source), reverter valores e logar tentativa. |

### 7.3 BR_EOAP_UserAccess_Delete_Protect

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Impedir deleção de registros de user access. |
| **Tabela** | x_eoap_user_access |
| **When** | Before delete |
| **Ação** | `current.setAbortAction(true);` |

### 7.4 BR_EOAP_AccessException_Validate

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Validar que exceção possui valid_to e compensating_control antes de inserção. |
| **Tabela** | x_eoap_access_exception |
| **When** | Before insert |
| **Ação** | Se valid_to vazio ou compensating_control vazio, abortar com mensagem. |

---

## 8. Scheduled Jobs Design

### 8.1 EOAP_Job_Access_Expiration

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Identificar e expirar acessos cuja valid_to é anterior à data atual. |
| **Frequência** | Diário, 01:00 AM. |
| **Lógica** | Query x_eoap_user_access WHERE status = active AND valid_to < now(). Para cada: EOAP_AccessGovernanceService.expireAccess. |
| **Logs** | Contagem de acessos expirados, correlation_id por batch. |
| **Error Handling** | Falha em um registro não bloqueia os demais. Registrar falha por registro. |

### 8.2 EOAP_Job_Exception_Expiration

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Expirar exceções de acesso vencidas e sinalizar acessos relacionados. |
| **Frequência** | Diário, 01:30 AM. |
| **Lógica** | Query x_eoap_access_exception WHERE status = active AND valid_to < now(). Expirar e verificar acesso relacionado. |

### 8.3 EOAP_Job_Recertification_Check

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Identificar acessos com recertification_date próxima e gerar tarefa de revisão para Access Owner. |
| **Frequência** | Semanal, segunda-feira 08:00 AM. |
| **Lógica** | Query x_eoap_user_access WHERE recertification_date <= now() + 14d AND recertification_status = pending. Criar tarefa. |

### 8.4 EOAP_Job_Reconciliation

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Reconciliar acessos governados com grupos/papéis técnicos efetivos. Identificar divergências (drifts). |
| **Frequência** | Diário, 03:00 AM. |
| **Lógica** | Para cada Business Application: comparar x_eoap_user_access ativos com memberships reais. Registrar drifts. |
| **Output** | Relatório de divergências e audit trail. |

### 8.5 EOAP_Job_Event_Retry

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Reprocessar eventos com status retry_pending. |
| **Frequência** | A cada 15 minutos. |
| **Lógica** | EOAP_EventProcessor.processRetries(). |

### 8.6 EOAP_Job_CMDB_Quality_Report

| Aspecto | Detalhamento |
| --- | --- |
| **Objetivo** | Gerar relatório de completude CMDB e atualizar dashboard. |
| **Frequência** | Diário, 06:00 AM. |
| **Lógica** | EOAP_CMDBQualityService.validateAllCritical(). Registrar resultado. |

---

## 9. Notifications Design

| Notification | Trigger | Recipients | Template |
| --- | --- | --- | --- |
| Access Request Submitted | Access request created | Requester, Access Owner | Detalhes da solicitação. |
| Access Approved | Access approved | Requester, Manager | Detalhes do acesso concedido. |
| Access Rejected | Access rejected | Requester, Manager | Motivo da rejeição. |
| Access Expiring Soon | 7 dias antes de expiração | User, Access Owner | Lembrete de renovação. |
| Access Expired | Acesso expirado por job | User, Access Owner, Manager | Confirmação de expiração. |
| Exception Expiring | 3 dias antes de expiração de exceção | User, Access Owner | Lembrete de renovação de exceção. |
| Risk Score High/Critical | Score ≥ high | Change Manager, Application Owner | Score, banda e explicação. |
| Recertification Due | Recertificação pendente | Access Owner | Lista de acessos para revisão. |
| Event Processing Failed | Evento com status failed | Platform Owner | Detalhes do erro e correlation_id. |
| CMDB Quality Alert | Completude abaixo de threshold | CMDB Manager | Relatório de gaps. |
| Reconciliation Drift | Divergência detectada | Access Owner, Platform Owner | Lista de drifts. |

---

## 10. ATF Test Suites Design

### 10.1 Suite: EOAP_ATF_CMDB_Foundation

| Test Case | Tipo | Cenário | Critério de Aceite |
| --- | --- | --- | --- |
| Create Business Application | Positive | Criar app com todos os campos EOAP. | Registro criado com campos preenchidos. |
| Business App Missing Owner | Negative | Criar app sem owner. | Validação de qualidade falha. |
| Relate App Service | Positive | Criar Application Service e relacionar. | Relação cmdb_rel_ci criada. |
| Quality Check Pass | Positive | Validar app completa. | isValid = true. |
| Quality Check Fail | Negative | Validar app incompleta. | isValid = false, issues listados. |

### 10.2 Suite: EOAP_ATF_Employee_Lifecycle

| Test Case | Tipo | Cenário | Critério de Aceite |
| --- | --- | --- | --- |
| Onboarding Happy Path | Positive | Onboarding completo com acessos padrão. | Acessos criados, eventos publicados, audit trail. |
| Onboarding No Manager | Negative | Onboarding sem manager. | Flow escala, não gera acessos sem aprovação. |
| Move with Access Change | Positive | Move com mudança de perfil. | Acessos incompatíveis revogados, novos concedidos. |
| Offboarding Complete | Positive | Offboarding com revogação total. | Todos os acessos revogados. |
| Offboarding Partial Failure | Negative | Offboarding com falha em uma revogação. | Status = partial, tarefa de follow-up criada. |
| Duplicate Event | Negative | Evento duplicado de onboarding. | Segundo evento ignorado (idempotente). |

### 10.3 Suite: EOAP_ATF_Access_Governance

| Test Case | Tipo | Cenário | Critério de Aceite |
| --- | --- | --- | --- |
| Request Access | Positive | Solicitação válida. | Registro criado, approval routing correto. |
| Approve Access | Positive | Aprovação por Access Owner. | Status = active, audit trail. |
| Reject Access | Positive | Rejeição com justificativa. | Status = rejected, audit trail. |
| Expire Access | Positive | Job de expiração. | Status = expired, notificação enviada. |
| Exception Create | Positive | Exceção com compensating control. | Exceção criada, aprovação iniciada. |
| Exception Without Control | Negative | Exceção sem compensating control. | Criação bloqueada. |
| Recertification Flow | Positive | Recertificação com aprovação. | Status = certified. |
| Duplicate Access | Negative | Solicitação de acesso já ativo. | Rejeitada com mensagem. |

### 10.4 Suite: EOAP_ATF_Change_Risk

| Test Case | Tipo | Cenário | Critério de Aceite |
| --- | --- | --- | --- |
| Normal Change Low Risk | Positive | Change com CIs tier_3 public. | Score baixo, band = low. |
| Normal Change High Risk | Positive | Change com CI tier_1 restricted. | Score alto, band = high/critical. |
| Emergency Change | Positive | Change tipo emergency. | Band = critical, cab_required = true. |
| Change No CIs | Edge | Change sem CIs relacionados. | Score = 0, band = low, warning logged. |
| CMDB Incomplete | Edge | Change com CI sem classificação. | Degradação graciosa, confidence reduzida. |
| Recalculation | Positive | Recalcular risco da mesma Change. | Evidências atualizadas, score recalculado. |
| Volume Test | Performance | Change com 20 CIs. | Execução < 5s. |

### 10.5 Suite: EOAP_ATF_Security_Negative

| Test Case | Tipo | Cenário | Critério de Aceite |
| --- | --- | --- | --- |
| No Role Read User Access | Negative | Impersonate usuário sem role, tentar ler x_eoap_user_access. | Acesso negado. |
| No Role Write Audit Trail | Negative | Tentar editar x_eoap_audit_trail. | Acesso negado. |
| No Role Delete Audit Trail | Negative | Tentar deletar audit trail. | Acesso negado. |
| Access Owner Edit Risk Rating | Negative | Access Owner tenta editar risk_rating. | Field ACL bloqueia. |
| User Edit Risk Score | Negative | Usuário tenta editar x_eoap_risk_score. | Bloqueado. |
| Self Approval | Negative | Usuário tenta aprovar próprio pedido. | Bloqueado por flow. |
| Auditor Edit Record | Negative | Auditor tenta editar registro operacional. | Acesso negado. |
| Cross-Role Boundary | Negative | Risk Analyst tenta editar Decision Table de acesso. | Bloqueado. |

### 10.6 Suite: EOAP_ATF_Events

| Test Case | Tipo | Cenário | Critério de Aceite |
| --- | --- | --- | --- |
| Event Processing Success | Positive | Evento processado com sucesso. | Status = processed. |
| Event Duplicate | Negative | Evento duplicado (mesma idempotency_key). | Status = ignored_duplicate. |
| Event Retry Success | Positive | Evento falha e retried com sucesso. | retry_count = 1, status = processed. |
| Event Max Retries | Negative | Evento excede max_retries. | Status = failed_final, tarefa criada. |
| Event Invalid Payload | Negative | Evento com payload inválido. | Status = failed, error_message preenchido. |

---

## 11. APIs & Integration Points

### 11.1 Scripted REST API: EOAP Risk Assessment (futuro)

| Aspecto | Detalhamento |
| --- | --- |
| **Endpoint** | `/api/x_eoap/v1/risk/assess` |
| **Method** | POST |
| **Purpose** | Permitir cálculo de risco por integração externa (futuro). |
| **Authentication** | OAuth 2.0 via Connection Alias. |
| **Request Body** | `{ "change_sys_id": "", "correlation_id": "" }` |
| **Response** | `{ "score": 0, "band": "", "explanation": "", "evidence_count": 0 }` |
| **Error Response** | `{ "error": { "code": "", "message": "", "correlation_id": "" } }` |

### 11.2 Scripted REST API: EOAP Access Status (futuro)

| Aspecto | Detalhamento |
| --- | --- |
| **Endpoint** | `/api/x_eoap/v1/access/status` |
| **Method** | GET |
| **Query Params** | `user_sys_id`, `application_sys_id` |
| **Response** | `{ "accesses": [ { "status": "", "valid_to": "", "access_level": "" } ] }` |

---

## 12. Import Sets & Transform Maps

### 12.1 EOAP Import: Business Applications (futuro)

| Aspecto | Detalhamento |
| --- | --- |
| **Staging Table** | x_eoap_import_business_app |
| **Source** | CSV, REST, ou CMDB Export de fonte autorizada. |
| **Transform Target** | cmdb_ci_business_app |
| **Coalesce Key** | name + company (ou sys_id externo) |
| **Fields Mapped** | name, owned_by, x_eoap_access_owner, x_eoap_data_classification, x_eoap_access_criticality, operational_status |
| **onBefore** | Validar campos obrigatórios; rejeitar registros incompletos. |
| **onAfter** | Logar resultado com correlation_id; registrar audit trail. |
| **Error Handling** | Registros rejeitados permanecem em staging com status = error e motivo. |

### 12.2 EOAP Import: User Access Reconciliation (futuro)

| Aspecto | Detalhamento |
| --- | --- |
| **Staging Table** | x_eoap_import_access_reconciliation |
| **Source** | IAM export (Azure AD, Okta) |
| **Transform Target** | Comparação com x_eoap_user_access |
| **Coalesce Key** | user + application + access_type |
| **Ação** | Identificar drifts entre fonte IAM e registros EOAP. |

---

## 13. Dashboards & Reporting

### 13.1 EOAP Executive Dashboard

| Widget | Dados | Uso |
| --- | --- | --- |
| CMDB Completeness | % de apps críticas com dados completos. | Governança CMDB. |
| Active Access Count | Total de acessos ativos por status. | Visão geral de Access Governance. |
| Expired Access Count | Acessos expirados não revogados. | Risco de acesso órfão. |
| Risk Distribution | Distribuição de Changes por risk_band. | Visão de risco de mudança. |
| Event Health | Eventos processados vs. failed. | Saúde operacional. |

### 13.2 EOAP Operational Dashboard

| Widget | Dados | Uso |
| --- | --- | --- |
| Approval Cycle Time | Tempo médio de decisão de acesso. | Gargalos de Access Owner. |
| Pending Recertifications | Acessos com recertificação pendente. | Compliance. |
| Reconciliation Drifts | Divergências detectadas. | Integridade de dados. |
| Risk Engine Performance | Tempo médio de cálculo. | Performance monitoring. |
| CMDB Quality by App | Qualidade por Business Application. | Priorização de correção. |

### 13.3 EOAP Audit Dashboard

| Widget | Dados | Uso |
| --- | --- | --- |
| Audit Trail Volume | Registros por período e módulo. | Volume e tendência. |
| Decisions by Type | Aprovações, rejeições, revogações. | Análise de padrões. |
| Exceptions Active | Exceções ativas por classificação. | Risco de exceções. |
| Risk Evidence by Change | Evidências por Change e fator. | Auditoria de risco. |

---

## 14. UI Policies & Client Scripts

> **Princípio**: UI Policies e Client Scripts melhoram UX mas NÃO são controles de segurança. Todo controle de segurança deve ter ACL correspondente.

### 14.1 UI Policy: User Access Form

| Regra | Condição | Ação |
| --- | --- | --- |
| Hide revocation fields | status ≠ revoked | Ocultar revoked_by, revoked_on, revocation_reason. |
| Make valid_to required | duration = temporary | Tornar valid_to obrigatório. |
| Read-only on active | status = active | Campos de solicitação read-only. |
| Show recertification | recertification_date is not empty | Mostrar seção de recertificação. |

### 14.2 UI Policy: Access Exception Form

| Regra | Condição | Ação |
| --- | --- | --- |
| Require compensating control | always | compensating_control obrigatório. |
| Require valid_to | always | valid_to obrigatório. |
| Read-only on approved | status = active | Campos de solicitação read-only. |

### 14.3 Client Script: Access Request Validation

| Tipo | onChange/onSubmit |
| --- | --- |
| **Objetivo** | Validar que aplicação selecionada possui access_owner definido antes de submit. |
| **Ação** | GlideAjax para verificar access_owner. Se ausente, alertar usuário e impedir submit com mensagem orientativa. |

---

## Appendix: Component Dependency Matrix

| Componente | Depende de | É dependência de |
| --- | --- | --- |
| EOAP_AuditLogger | x_eoap_audit_trail | Todos os Script Includes e Flows |
| EOAP_EventProcessor | x_eoap_event_processing | Todos os Flows que publicam eventos |
| EOAP_RiskEngine | DT_Risk_Weights, DT_Risk_Banding, CMDB, EOAP_AuditLogger | EOAP_Flow_Change_Risk |
| EOAP_AccessGovernanceService | x_eoap_user_access, CMDB, EOAP_AuditLogger, EOAP_EventProcessor | Todos os Flows de Access e Lifecycle |
| EOAP_CMDBQualityService | cmdb_ci_business_app, cmdb_ci_service_discovered | EOAP_Job_CMDB_Quality, RiskEngine (pre-check) |
| DT_Access_Approval_Routing | cmdb_ci_business_app fields | EOAP_Flow_Access_Request |
| DT_Risk_Weights | CMDB fields | EOAP_RiskEngine |
| DT_Risk_Banding | RiskEngine output | EOAP_RiskEngine |
| DT_Lifecycle_Actions | sys_user fields | Lifecycle Flows |
