# EOAP Operational Runbook

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Operational Runbook |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento Operacional Corporativo |

> **Escopo deste documento**: Runbook operacional da EOAP. Inclui procedimentos para incidentes, DLQ, reconciliação, offboarding e recertificação. Para monitoramento e suporte, ver documentos específicos.

---

## 1. Operational Overview

### 1.1 Critical Flows

| Flow | Tipo | SLA | Criticalidade |
| --- | --- | --- | --- |
| EOAP_Flow_Employee_Offboarding | SYNC_CRITICAL | < 60s | Critical |
| EOAP_Flow_Change_Risk_Assessment | SYNC_CRITICAL | < 5s | High |
| EOAP_Flow_Employee_Onboarding | ASYNC | < 30s | Medium |
| EOAP_Flow_Employee_Move | ASYNC | < 30s | Medium |
| EOAP_Flow_Access_Request | ASYNC | < 5s | Medium |

### 1.2 SLOs

| SLO | Target | Measurement |
| --- | --- | --- |
| Offboarding revogação | < 60s | 95th percentile |
| Change risk calculation | < 5s | 95th percentile |
| Event processing | < 30s | 95th percentile |
| Formulário load time | < 3s | 95th percentile |
| Audit trail write | < 1s | 99th percentile |

---

## 2. Incident Management

### 2.1 Incident Classification

| Severidade | Critérios | Response Time | Escalation |
| --- | --- | --- | --- |
| P1 - Critical | Offboarding falhou, DLQ > 100, CMDB quality < 80% | 15 min | Immediate to Platform Owners |
| P2 - High | Event processing failed, Risk calculation failed | 1 hour | 4 hours to Platform Owners |
| P3 - Medium | Dashboard não populado, Notificação não enviada | 4 hours | 24 hours to Platform Owners |
| P4 - Low | Performance degradation < 50% | 24 hours | 72 hours to Platform Owners |

### 2.2 Incident Response Procedure

#### Step 1 - Triage

**Ações**:
1. Verificar severity baseado em critérios
2. Verificar se incidente afeta produção
3. Verificar se há workaround disponível
4. Classificar incidente (P1-P4)

**Expected Result**:
- Incidente classificado
- Severidade atribuída
- Workaround identificado (se disponível)

#### Step 2 - Investigation

**Ações**:
1. Consultar x_eoap_event_processing para eventos failed
2. Consultar x_eoap_audit_trail para trace
3. Consultar logs de sistema com correlation_id
4. Verificar status de integrações (IAM, HRIS, SIEM)
5. Verificar CMDB quality

**Expected Result**:
- Root cause identificada
- Correlation ID rastreado
- Impacto quantificado

#### Step 3 - Resolution

**Ações**:
1. Implementar fix (se disponível)
2. Testar fix em ambiente de teste
3. Deploy fix para produção
4. Validar resolução
5. Documentar incidente

**Expected Result**:
- Incidente resolvido
- Fix documentado
- Post-mortem agendado

---

## 3. Dead Letter Queue (DLQ) Management

### 3.1 DLQ Scenarios

| Scenario | Causa | Ação | SLA |
| --- | --- | --- | --- |
| Event processing failed_final | Erro transitório persistente | Manual retry ou descarte | 24 hours |
| Event processing ignored_duplicate | Evento duplicado | Ignorar (idempotência) | N/A |
| Event processing failed | Erro transitório | Automatic retry (3×) | 30 min |
| IAM integration failed | IAM offline | Retry manual após IAM recovery | 4 hours |
| SIEM integration failed | SIEM offline | Retry manual após SIEM recovery | 4 hours |

### 3.2 DLQ Investigation Procedure

**Ações**:
1. Query x_eoap_event_processing:
   ```
   status = failed_final
   ORDER BY processed_on DESC
   ```
2. Para cada evento:
   - Verificar last_error
   - Verificar retry_count
   - Verificar correlation_id
   - Verificar event_data
3. Determinar root cause:
   - Transient error → Retry manual
   - Permanent error → Descartar com justificativa
   - Integration error → Verificar status de integração
4. Executar ação apropriada

**Expected Result**:
- DLQ investigado
- Ações executadas
- Eventos processados ou descartados

### 3.3 DLQ Retry Procedure

**Ações**:
1. Para evento em DLQ:
   - Atualizar status para retry_pending
   - Incrementar retry_count
   - Limpar last_error
2. Trigger manual de EOAP_EventProcessor
3. Monitorar processamento
4. Se falhar novamente → failed_final

**Expected Result**:
- Evento reprocessado
- Status atualizado
- Sucesso ou falha final

---

## 4. Reconciliation Management

### 4.1 Reconciliation Job

**Schedule**: Diário às 02:00 UTC

**Objetivo**: Identificar drift entre governança e technical access

**Ações**:
1. Query x_eoap_user_access (governed access)
2. Query IAM (technical access)
3. Comparar:
   - Orphan access: Technical access sem governança
   - Missing access: Governança sem technical access
   - Mismatch: Status diferente
4. Criar registros em x_eoap_staging_access_reconciliation
5. Notificar x_eoap_cmdb_manager

**Expected Result**:
- Drift identificado
- Registros criados em staging
- Notificação enviada

### 4.2 Reconciliation Review Procedure

**Ações**:
1. Review x_eoap_staging_access_reconciliation
2. Para cada drift:
   - Orphan access → Revogar ou governar
   - Missing access → Provisionar ou remover governança
   - Mismatch → Sincronizar status
3. Atualizar reconciliation_status para resolved
4. Documentar ação tomada

**Expected Result**:
- Drift resolvido
- Status atualizado
- Governança sincronizada

---

## 5. Offboarding Management

### 5.1 Offboarding Failure Scenario

**Symptoms**:
- EOAP_Flow_Employee_Offboarding falhou
- Usuário ainda tem access ativo
- SLA > 60s excedido

**Investigation**:
1. Verificar x_eoap_event_processing para failed events
2. Verificar status de integração IAM
3. Verificar x_eoap_user_access para usuário
4. Verificar correlation_id

**Resolution**:
1. Se IAM offline → Aguardar recovery e retry
2. Se flow error → Debug flow e retry
3. Se timeout → Aumentar timeout e retry
4. Manual workaround:
   - Revogar access diretamente em IAM
   - Atualizar x_eoap_user_access para revoked
   - Log audit trail manual

**Expected Result**:
- Offboarding completado
- Access revogado
- Audit trail atualizado

### 5.2 Offboarding Verification Procedure

**Ações**:
1. Query x_eoap_user_access:
   ```
   user = {user_sys_id}
   status = active
   ```
2. Se registros encontrados → Offboarding incompleto
3. Verificar IAM para confirmar revogação
4. Se drift → Executar reconciliação manual
5. Notificar manager e HR

**Expected Result**:
- Offboarding verificado
- Drift identificado (se houver)
- Ação corretiva tomada

---

## 6. Recertification Management

### 6.1 Recertification Job

**Schedule**: Mensal (primeiro dia do mês às 03:00 UTC)

**Objetivo**: Identificar access requiring recertification

**Ações**:
1. Query x_eoap_user_access:
   ```
   status = active
   valid_to < NOW() + 30 days
   ```
2. Para cada access:
   - Criar notificação EOAP_Notif_Recertification_Due
   - Enviar para user, manager, access_owner
3. Criar task de recertification
4. Aguardar aprovação/rejeição

**Expected Result**:
- Access expirando identificado
- Notificações enviadas
- Tasks criadas

### 6.2 Recertification Review Procedure

**Ações**:
1. Review tasks de recertificação
2. Para cada task:
   - Se aprovado → Atualizar valid_to
   - Se rejeitado → Revogar access
   - Se não respondido → Escalar para manager
3. Atualizar x_eoap_user_access
4. Log audit trail

**Expected Result**:
- Recertificação completada
- Access atualizado
- Audit trail atualizado

---

## 7. CMDB Quality Management

### 7.1 CMDB Quality Report

**Schedule**: Diário às 01:00 UTC

**Objetivo**: Monitorar qualidade CMDB

**Métricas**:
- Completeness: % de campos EOAP preenchidos
- Accuracy: % de relações CSDM corretas
- Freshness: % de registros atualizados nos últimos 30 dias

**Ações**:
1. Query cmdb_ci_business_app:
   - Verificar x_eoap_access_owner preenchido
   - Verificar x_eoap_data_classification preenchido
   - Verificar x_eoap_access_criticality preenchido
   - Verificar x_eoap_operational_tier preenchido
2. Query cmdb_ci_service_discovered:
   - Verificar x_eoap_access_owner preenchido
   - Verificar x_eoap_data_classification preenchido
3. Calcular completeness rate
4. Se < 95% → Notificar x_eoap_cmdb_manager

**Expected Result**:
- CMDB quality calculada
- Notificação enviada se < 95%
- Dashboard atualizado

### 7.2 CMDB Quality Failure Procedure

**Symptoms**:
- CMDB quality < 95%
- EOAP_Notif_CMDB_Quality_Failed enviada

**Investigation**:
1. Identificar campos não preenchidos
2. Identificar registros sem dados
3. Identificar owners responsáveis

**Resolution**:
1. Notificar owners para preencher campos
2. Criar tasks para cada owner
3. Agendar review semanal
4. Se persistente → Escalar para Platform Owners

**Expected Result**:
- Campos preenchidos
- Quality ≥ 95%
- Notificação resolvida

---

## 8. Event Processing Management

### 8.1 Event Processing Monitoring

**Métricas**:
- % processed: Eventos processados com sucesso
- % failed: Eventos com erro transitório
- % failed_final: Eventos com erro permanente
- % ignored_duplicate: Eventos duplicados ignorados

**Ações**:
1. Query x_eoap_event_processing:
   ```
   processed_on >= NOW() - 1 hour
   GROUP BY status
   ```
2. Calcular % para cada status
3. Se failed_final > 5% → Investigar DLQ
4. Se failed > 10% → Investigar integrações

**Expected Result**:
- Event processing monitorado
- Anomalias detectadas
- Ações corretivas tomadas

### 8.2 Event Processing Failure Procedure

**Symptoms**:
- % failed > 10%
- Eventos não sendo processados

**Investigation**:
1. Verificar status de EOAP_EventProcessor
2. Verificar status de integrações
3. Verificar logs de sistema
4. Verificar correlation_id

**Resolution**:
1. Se processor down → Restart processor
2. Se integration down → Aguardar recovery
3. Se error no código → Debug e fix
4. Se volume spike → Escalar para capacity review

**Expected Result**:
- Event processing restaurado
- Root cause resolvida
- Monitoramento normalizado

---

## 9. Performance Management

### 9.1 Performance Monitoring

**Métricas**:
- Formulário load time
- Risk engine execution time
- Event processing time
- Offboarding total time

**Ações**:
1. Consultar Performance Analytics
2. Verificar 95th percentile para cada métrica
3. Se > SLO → Investigar
4. Se > 2× SLO → Escalar para P2

**Expected Result**:
- Performance monitorada
- SLOs validados
- Anomalias detectadas

### 9.2 Performance Degradation Procedure

**Symptoms**:
- Formulário load time > 3s
- Risk engine > 5s
- Event processing > 30s
- Offboarding > 60s

**Investigation**:
1. Verificar database performance
2. Verificar índices
3. Verificar volume de dados
4. Verificar concurrent users

**Resolution**:
1. Se database bottleneck → Otimizar queries
2. Se índice ausente → Criar índice
3. Se volume spike → Escalar para capacity review
4. Se concurrent users → Escalar para capacity review

**Expected Result**:
- Performance restaurada
- SLOs atendidos
- Capacity review agendada (se necessário)

---

## 10. Backup and Recovery

### 10.1 Backup Strategy

**Backup Schedule**:
- Database backup: Diário às 00:00 UTC
- Application export: Semanal
- Configuration export: Após cada mudança

**Retention**:
- Database backup: 30 dias
- Application export: 90 dias
- Configuration export: 365 dias

### 10.2 Recovery Procedure

**Scenario**: Perda de dados ou corrompimento

**Ações**:
1. Identificar ponto de recuperação
2. Restaurar backup de database
3. Reimportar application
4. Reimportar configuration
5. Validar integridade
6. Executar ATF suites
7. Validar functional flows

**Expected Result**:
- Sistema restaurado
- Dados íntegros
- Funcionalidade validada

---

## 11. Escalation Matrix

| Issue | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| Offboarding failure | x_eoap_admin | Platform Owners | CIO |
| CMDB quality < 80% | x_eoap_cmdb_manager | Platform Owners | CTO |
| Security incident | x_eoap_admin | x_eoap_auditor | CISO |
| Performance degradation | x_eoap_admin | Platform Owners | CTO |
| Integration failure | x_eoap_admin | Platform Owners | CTO |
| DLQ > 100 | x_eoap_admin | Platform Owners | CIO |

---

*Operational Runbook - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
