# Now Create Deployment Plan - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Deployment Plan |
| Now Create Phase | 06-Deploy |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Release Manager | Release Manager |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Draft** |
| Classificação | Confidencial — Documento de Deploy Corporativo |

---

## 1. Deployment Strategy

### 1.1 Deployment Approach

**Strategy**: Blue-Green Deployment

**Rationale**: Minimizar downtime, permite rollback rápido, reduz risco

**Environments**:
- **DEV**: Desenvolvimento (always available)
- **TEST**: Teste (always available)
- **PROD**: Produção (blue-green switch)

### 1.2 Deployment Phases

| Phase | Environment | Duration | Purpose |
| --- | --- | --- | --- |
| Phase 1 | DEV | 1 dia | Deploy to DEV, validate |
| Phase 2 | TEST | 1 dia | Deploy to TEST, validate, UAT |
| Phase 3 | PROD | 1 dia | Deploy to PROD, cutover, go-live |

**Total Deployment Duration**: 3 dias

### 1.3 Deployment Windows

**Deployment Window**: Sexta-feira, 22:00 - 02:00 UTC (4 horas)

**Rationale**: Menor impacto operacional, suporte disponível

**Change Freeze**: Quartais (Q1, Q2, Q3, Q4)

---

## 2. Deployment Checklist

### 2.1 Pre-Deployment Checklist

**Environment Validation**:
- [ ] DEV environment disponível
- [ ] TEST environment disponível
- [ ] PROD environment disponível
- [ ] ServiceNow Utah ou posterior instalado
- [ ] Plugins instalados (Flow Designer, IntegrationHub, Event Management, Decision Tables, ATF)
- [ ] CMDB quality ≥ 80%

**Code Validation**:
- [ ] Code review aprovado
- [ ] ATF pass rate = 100%
- [ ] Unit test pass rate ≥ 80%
- [ ] Integration test pass rate ≥ 90%
- [ ] System test pass rate ≥ 95%
- [ ] Security test pass rate = 100%
- [ ] Performance test pass rate = 100%

**Documentation Validation**:
- [ ] ADD aprovado por ARB
- [ ] SDD aprovado por Technical Lead
- [ ] ADR Catalog aprovado
- [ ] Build Guide completo
- [ ] Test Strategy completo
- [ ] Runbook completo
- [ ] Support Model completo
- [ ] Monitoring Strategy completo

**Stakeholder Validation**:
- [ ] Stakeholders notificados
- [ ] Change request aprovado
- [ ] Communication plan executado
- [ ] Training completo

**Security Validation**:
- [ ] Security review aprovado
- [ ] STRIDE analysis completo
- [ ] Penetration test completo
- [ ] Compliance review aprovado
- [ ] MFA ativo para x_eoap_admin, x_eoap_risk_analyst (PROD)

**Integration Validation**:
- [ ] IAM integration testada
- [ ] HRIS integration testada
- [ ] SIEM integration testada
- [ ] OAuth 2.0 configurado
- [ ] Integration Hub Spokes testados

**Backup Validation**:
- [ ] Backup configurado
- [ ] Backup testado
- [ ] Recovery testado

---

### 2.2 Deployment Checklist

**Application Scope Deployment**:
- [ ] Application Scope `x_eoap` criado
- [ ] Application ativa

**Tables Deployment**:
- [ ] x_eoap_user_access criada
- [ ] x_eoap_access_exception criada
- [ ] x_eoap_audit_trail criada
- [ ] x_eoap_event_processing criada
- [ ] x_eoap_risk_evidence criada
- [ ] x_eoap_staging_employee criada
- [ ] x_eoap_staging_access_reconciliation criada
- [ ] Índices criados

**Roles Deployment**:
- [ ] x_eoap_admin criado
- [ ] x_eoap_cmdb_manager criado
- [ ] x_eoap_access_owner criado
- [ ] x_eoap_change_manager criado
- [ ] x_eoap_risk_analyst criado
- [ ] x_eoap_auditor criado
- [ ] x_eoap_manager criado

**Groups Deployment**:
- [ ] EOAP Admins criado
- [ ] EOAP CMDB Managers criado
- [ ] EOAP Access Owners criado
- [ ] EOAP Change Managers criado
- [ ] EOAP Risk Analysts criado
- [ ] EOAP Auditors criado
- [ ] EOAP Managers criado

**ACLs Deployment**:
- [ ] ACLs configuradas para x_eoap_user_access
- [ ] ACLs configuradas para x_eoap_access_exception
- [ ] ACLs configuradas para x_eoap_audit_trail (append-only)
- [ ] ACLs configuradas para x_eoap_event_processing
- [ ] ACLs configuradas para x_eoap_risk_evidence (write-only)
- [ ] ACLs configuradas para x_eoap_staging_employee
- [ ] ACLs configuradas para x_eoap_staging_access_reconciliation

**Decision Tables Deployment**:
- [ ] x_eoap_dt_access_approval_routing criada
- [ ] x_eoap_dt_risk_weights criada
- [ ] x_eoap_dt_risk_banding criada
- [ ] x_eoap_dt_lifecycle_actions criada
- [ ] x_eoap_dt_exception_approval_routing criada

**Script Includes Deployment**:
- [ ] EOAP_AuditLogger criado
- [ ] EOAP_RiskEngine criado
- [ ] EOAP_AccessGovernanceService criado
- [ ] EOAP_EventProcessor criado
- [ ] EOAP_CMDBQualityService criado

**Flows Deployment**:
- [ ] EOAP_Flow_Employee_Onboarding criado
- [ ] EOAP_Flow_Employee_Move criado
- [ ] EOAP_Flow_Employee_Offboarding criado

**Subflows Deployment**:
- [ ] EOAP_Subflow_Grant_Access_Profile criado
- [ ] EOAP_Subflow_Revoke_Access_Profile criado
- [ ] EOAP_Subflow_Publish_Event criado
- [ ] EOAP_Subflow_Log_Audit criado

**Notifications Deployment**:
- [ ] EOAP_Notif_Access_Granted criada
- [ ] EOAP_Notif_Access_Revoked criada
- [ ] EOAP_Notif_Access_Requested criada
- [ ] EOAP_Notif_Access_Rejected criada

**REST APIs Deployment**:
- [ ] GET /api/x_eoap/v1/access/{sys_id} criado
- [ ] POST /api/x_eoap/v1/access criado
- [ ] GET /api/x_eoap/v1/risk/{change_sys_id} criado
- [ ] GET /api/x_eoap/v1/audit/{entity_sys_id} criado

**OAuth 2.0 Deployment**:
- [ ] OAuth 2.0 Client criado
- [ ] Token lifetime configurado
- [ ] Refresh token configurado
- [ ] Scopes configurados

**Integration Hub Spokes Deployment**:
- [ ] IAM Spoke criado
- [ ] HRIS Spoke criado
- [ ] SIEM Spoke criado

**Scheduled Jobs Deployment**:
- [ ] EOAP_Job_Reconciliation criado
- [ ] EOAP_Job_Archiving criado
- [ ] EOAP_Job_CMDB_Quality criado

**Dashboards Deployment**:
- [ ] EOAP_Operational_Overview criado
- [ ] EOAP_Performance criado
- [ ] EOAP_Security criado

---

### 2.3 Post-Deployment Checklist

**Validation**:
- [ ] Application Scope ativa
- [ ] Todas as tabelas criadas
- [ ] Todos os índices criados
- [ ] Todas as ACLs configuradas
- [ ] Todos os roles criados
- [ ] Todos os groups criados
- [ ] Todas as Decision Tables criadas
- [ ] Todos os Script Includes criados
- [ ] Todos os Flows criados
- [ ] Todos os Subflows criados
- [ ] Todas as Notifications criadas
- [ ] Todas as APIs criadas
- [ ] OAuth 2.0 configurado
- [ ] Todos os Spokes criados
- [ ] Todos os Scheduled Jobs criados
- [ ] Todos os Dashboards criados

**Testing**:
- [ ] ATF suites executadas
- [ ] ATF pass rate = 100%
- [ ] Smoke test executado
- [ ] Integration test executado
- [ ] Performance test executado

**Monitoring**:
- [ ] Dashboards configurados
- [ ] Alertas configurados
- [ ] Logs configurados
- [ ] KPIs monitorados

**Communication**:
- [ ] Stakeholders notificados
- [ ] Release notes publicadas
- [ ] Support team notificado

---

## 3. Cutover Plan

### 3.1 Cutover Strategy

**Strategy**: Blue-Green Cutover

**Duration**: 4 horas (22:00 - 02:00 UTC)

**Date**: Sexta-feira, 2026-12-08

### 3.2 Pre-Cutover Activities

**T-7 dias**:
- [ ] Cutover plan aprovado
- [ ] Stakeholders notificados
- [ ] Communication plan executado
- [ ] Backup completo realizado

**T-3 dias**:
- [ ] Pre-cutover validation executado
- [ ] Rollback plan testado
- [ ] Support team preparado

**T-1 dia**:
- [ ] Final check de todos os componentes
- [ ] Final check de integrações
- [ ] Final check de segurança
- [ ] Final check de performance

**T-4 horas**:
- [ ] Stakeholders notificados (cutover iniciando)
- [ ] Support team em standby
- [ ] Rollback team em standby

### 3.3 Cutover Execution

**22:00 - 22:30 UTC**: Pre-Cutover Validation
- Validar ambiente PROD
- Validar backups
- Validar rollback procedures

**22:30 - 23:00 UTC**: Deploy to PROD
- Deploy application scope
- Deploy tables
- Deploy roles
- Deploy ACLs
- Deploy Decision Tables
- Deploy Script Includes
- Deploy Flows
- Deploy Subflows
- Deploy Notifications
- Deploy APIs
- Deploy OAuth
- Deploy Spokes
- Deploy Scheduled Jobs
- Deploy Dashboards

**23:00 - 23:30 UTC**: Validation
- Validar todos os componentes
- Executar ATF suites
- Executar smoke test
- Validar integrações

**23:30 - 00:00 UTC**: Cutover
- Cutover para EOAP (blue → green)
- Validar cutover
- Notificar stakeholders

**00:00 - 00:30 UTC**: Post-Cutover Validation
- Validar sistema funcional
- Validar performance
- Validar segurança
- Validar monitoramento

**00:30 - 01:00 UTC**: Go-Live
- Sistema em go-live
- Suporte ativo
- Monitoramento ativo

**01:00 - 02:00 UTC**: Stabilization
- Monitorar sistema
- Resolver issues
- Documentar lessons learned

### 3.4 Post-Cutover Activities

**T+1 dia**:
- [ ] Go-live validation executado
- [ ] Stakeholders notificados (go-live)
- [ ] Release notes publicadas

**T+1 semana**:
- [ ] Hypercare iniciado
- [ ] Monitoramento intensivo
- [ ] Issues resolvidos

**T+4 semanas**:
- [ ] Hypercare finalizado
- [ ] Post-go-live validation executado
- [ ] Lessons learned documentadas

---

## 4. Rollback Plan

### 4.1 Rollback Strategy

**Strategy**: Automated Rollback via Blue-Green Switch

**Trigger**: Qualquer um dos seguintes:
- Critical incident não resolvido em 30 minutos
- Performance targets não atendidos
- Security incident
- Stakeholder request

### 4.2 Rollback Procedures

**Automated Rollback**:
1. Identificar trigger
2. Executar rollback (green → blue)
3. Validar rollback
4. Notificar stakeholders
5. Investigar root cause

**Manual Rollback**:
1. Identificar trigger
2. Desativar Flows
3. Desativar Scheduled Jobs
4. Desativar APIs
5. Desativar Spokes
6. Validar rollback
7. Notificar stakeholders
8. Investigar root cause

### 4.3 Rollback Validation

**Validation Checklist**:
- [ ] Sistema rollback para blue
- [ ] Sistema funcional
- [ ] Performance normal
- [ ] Security normal
- [ ] Stakeholders notificados

### 4.4 Rollback Timeline

| Trigger | Rollback Time | Total Downtime |
| --- | --- | --- |
| Automated | 5 minutos | 5 minutos |
| Manual | 30 minutos | 30 minutos |

---

## 5. Go-Live Checklist

### 5.1 Pre-Go-Live Checklist

**Technical Validation**:
- [ ] Todos os componentes deployados
- [ ] ATF pass rate = 100%
- [ ] Smoke test pass
- [ ] Integration test pass
- [ ] Performance test pass
- [ ] Security test pass

**Business Validation**:
- [ ] Todos os requisitos validados
- [ ] UAT sign-off obtido
- [ ] Stakeholders satisfeitos

**Operational Validation**:
- [ ] Support team preparado
- [ ] Runbook disponível
- [ ] Monitoring configurado
- [ ] Alertas configurados
- [ ] Backup configurado
- [ ] Recovery testado

**Compliance Validation**:
- [ ] SOX compliance validado
- [ ] ISO 27001 compliance validado
- [ ] LGPD compliance validado
- [ ] Audit trail funcional

### 5.2 Go-Live Execution

**Go-Live Time**: 00:30 UTC, 2026-12-09

**Activities**:
1. Cutover para EOAP (blue → green)
2. Validar sistema funcional
3. Validar performance
4. Validar segurança
5. Validar monitoramento
6. Notificar stakeholders
7. Iniciar hypercare

### 5.3 Go-Live Validation

**Validation Checklist**:
- [ ] Sistema funcional
- [ ] Performance targets atendidos
- [ ] Security normal
- [ ] Monitoramento ativo
- [ ] Suporte ativo
- [ ] Stakeholders notificados

---

## 6. Go-Live Validation

### 6.1 Validation Activities

**Functional Validation**:
- [ ] Onboarding funcional
- [ ] Move funcional
- [ ] Offboarding funcional
- [ ] Access governance funcional
- [ ] Change risk funcional
- [ ] Audit trail funcional
- [ ] Reconciliation funcional

**Performance Validation**:
- [ ] Offboarding SLA < 60s
- [ ] Risk calculation SLA < 5s
- [ ] Event processing SLA < 30s
- [ ] Form load time < 3s
- [ ] API response time < 1s

**Security Validation**:
- [ ] Failed authentication < 10/hour
- [ ] ACL violations = 0
- [ ] MFA ativo para x_eoap_admin, x_eoap_risk_analyst
- [ ] TLS 1.2+ configurado
- [ ] Encryption at-rest configurado

**Compliance Validation**:
- [ ] SOX compliance validado
- [ ] ISO 27001 compliance validado
- [ ] LGPD compliance validado
- [ ] Audit trail 7-year retention

**Integration Validation**:
- [ ] IAM integration funcional
- [ ] HRIS integration funcional
- [ ] SIEM integration funcional

### 6.2 Validation Timeline

| Validation | Duration | Start Time | End Time |
| --- | --- | --- | --- |
| Functional Validation | 2 horas | 00:30 UTC | 02:30 UTC |
| Performance Validation | 1 hora | 02:30 UTC | 03:30 UTC |
| Security Validation | 1 hora | 03:30 UTC | 04:30 UTC |
| Compliance Validation | 1 hora | 04:30 UTC | 05:30 UTC |
| Integration Validation | 1 hora | 05:30 UTC | 06:30 UTC |

**Total Validation Duration**: 6 horas

---

## 7. Hypercare Plan

### 7.1 Hypercare Strategy

**Duration**: 4 semanas (2026-12-09 a 2027-01-08)

**Objective**: Fornecer suporte intensivo pós-go-live para estabilizar sistema.

### 7.2 Hypercare Activities

**Week 1 (2026-12-09 - 2026-12-15)**:
- Daily standups (09:00 UTC)
- Incident monitoring 24/7
- Issue resolution prioritizado
- Stakeholder communication diária
- Performance tuning se necessário

**Week 2 (2026-12-16 - 2026-12-22)**:
- Daily standups (09:00 UTC)
- Incident monitoring 24/7
- Issue resolution priorizado
- Stakeholder communication diária
- Performance tuning se necessário

**Week 3 (2026-12-23 - 2026-12-29)**:
- Daily standups (09:00 UTC)
- Incident monitoring 24/7
- Issue resolution priorizado
- Stakeholder communication diária
- Performance tuning se necessário

**Week 4 (2026-12-30 - 2027-01-08)**:
- Daily standups (09:00 UTC)
- Incident monitoring 24/7
- Issue resolution priorizado
- Stakeholder communication diária
- Performance tuning se necessário

### 7.3 Hypercare Support Model

**Support Tiers**:
- **L1 Support**: 24/7 (Hypercare)
- **L2 Support**: 24/7 (Hypercare)
- **L3 Support**: 24/7 (Hypercare)

**Escalation**:
- P1 (Critical): Escalar para L3 imediatamente
- P2 (High): Escalar para L3 em 1 hora
- P3 (Medium): Escalar para L3 em 4 horas
- P4 (Low): Escalar para L3 em 24 horas

### 7.4 Hypercare Communication

**Daily Standup**:
- Time: 09:00 UTC
- Participants: Product Owner, Process Owner, ServiceNow Architect, Technical Lead, Developer, Admin, Tester, L1, L2, L3
- Agenda: Issues, incidents, performance, stakeholders

**Stakeholder Communication**:
- Daily email summary (18:00 UTC)
- Weekly stakeholder meeting (Friday 15:00 UTC)

### 7.5 Hypercare Exit Criteria

**Exit Criteria**:
- [ ] No critical incidents por 7 dias
- [ ] No high incidents por 3 dias
- [ ] Performance targets atendidos consistentemente
- [ ] Stakeholders satisfeitos
- [ ] Runbook completo
- [ ] Support model operacional

---

## 8. Post-Go-Live Validation

### 8.1 Validation Activities

**Functional Validation**:
- [ ] Onboarding funcional (100 casos)
- [ ] Move funcional (50 casos)
- [ ] Offboarding funcional (50 casos)
- [ ] Access governance funcional (100 casos)
- [ ] Change risk funcional (100 casos)
- [ ] Audit trail funcional (validação manual)
- [ ] Reconciliation funcional (validação manual)

**Performance Validation**:
- [ ] Offboarding SLA < 60s (95th percentile)
- [ ] Risk calculation SLA < 5s (95th percentile)
- [ ] Event processing SLA < 30s (95th percentile)
- [ ] Form load time < 3s (95th percentile)
- [ ] API response time < 1s (95th percentile)

**Security Validation**:
- [ ] Failed authentication < 10/hour
- [ ] ACL violations = 0
- [ ] MFA ativo para x_eoap_admin, x_eoap_risk_analyst
- [ ] TLS 1.2+ configurado
- [ ] Encryption at-rest configurado

**Compliance Validation**:
- [ ] SOX compliance validado (auditor review)
- [ ] ISO 27001 compliance validado (auditor review)
- [ ] LGPD compliance validado (auditor review)
- [ ] Audit trail 7-year retention validado

**Integration Validation**:
- [ ] IAM integration funcional (100 transações)
- [ ] HRIS integration funcional (100 eventos)
- [ ] SIEM integration funcional (100 eventos)

### 8.2 Validation Timeline

| Validation | Duration | Start Date | End Date |
| --- | --- | --- | --- |
| Functional Validation | 1 semana | 2027-01-09 | 2027-01-15 |
| Performance Validation | 1 semana | 2027-01-09 | 2027-01-15 |
| Security Validation | 1 semana | 2027-01-09 | 2027-01-15 |
| Compliance Validation | 1 semana | 2027-01-09 | 2027-01-15 |
| Integration Validation | 1 semana | 2027-01-09 | 2027-01-15 |

**Total Validation Duration**: 1 semana

---

## 9. Data Migration Plan

### 9.1 Data Migration Strategy

**Strategy**: N/A (não há data migration para EOAP)

**Rationale**: EOAP é uma aplicação nova, não há dados legados a migrar.

### 9.2 Data Migration Activities

N/A

---

## 10. Environment Strategy

### 10.1 Environment Architecture

**Environments**:
- **DEV**: Desenvolvimento (always available)
- **TEST**: Teste (always available)
- **PROD**: Produção (blue-green switch)

### 10.2 Environment Configuration

**DEV Environment**:
- ServiceNow instance: dev.service-now.com
- Plugins: Flow Designer, IntegrationHub, Event Management, Decision Tables, ATF
- CMDB quality: ≥ 80%
- Access: Desenvolvedores, Testers

**TEST Environment**:
- ServiceNow instance: test.service-now.com
- Plugins: Flow Designer, IntegrationHub, Event Management, Decision Tables, ATF
- CMDB quality: ≥ 90%
- Access: Testers, Stakeholders

**PROD Environment**:
- ServiceNow instance: prod.service-now.com
- Plugins: Flow Designer, IntegrationHub, Event Management, Decision Tables, ATF
- CMDB quality: ≥ 95%
- Access: Usuários finais, Support

### 10.3 Environment Promotion

**Promotion Gates**:
- **DEV → TEST**: ATF 100%, ADRs Accepted, code review
- **TEST → PROD**: UAT assinado, load test 50% Ano 1, MFA ativo, CSDM ≥ 95%

---

## 11. Release Notes

### 11.1 Release Information

**Release**: EOAP v1.0

**Release Date**: 2026-12-09

**Version**: 1.0.0

**Type**: Major Release

### 11.2 Release Summary

**New Features**:
- Employee lifecycle automation (onboarding, move, offboarding)
- Access governance (request, approval, provisioning, revocation)
- Change risk assessment (objective scoring, banding)
- Audit trail (complete, immutable, 7-year retention)
- Event-driven architecture (IAM, HRIS, SIEM integration)
- CMDB quality management (completeness, accuracy, freshness)
- Access reconciliation (daily automated)
- Exception management (formal, compensating controls)

**Technical Components**:
- Scoped application `x_eoap`
- 7 custom tables
- 20 ADRs
- 6 Decision Tables
- 3 Flows
- 4 Subflows
- 5 Script Includes
- 4 REST APIs
- 3 Integration Hub Spokes
- 2 Scheduled Jobs
- 3 Dashboards

**Bug Fixes**:
- N/A (primeira release)

**Known Issues**:
- N/A

### 11.3 Upgrade Instructions

**Upgrade from N/A**: N/A (primeira release)

**Upgrade from v1.0 to v1.1**: TBD

### 11.4 Deprecations

N/A

---

## 12. Deployment Summary

### 12.1 Deployment Timeline

| Phase | Environment | Date | Duration |
| --- | --- | --- | --- |
| Phase 1 | DEV | 2026-12-05 | 1 dia |
| Phase 2 | TEST | 2026-12-06 | 1 dia |
| Phase 3 | PROD | 2026-12-08 | 1 dia |
| **Total** | - | - | **3 dias** |

### 12.2 Resource Allocation

| Role | Phase 1 | Phase 2 | Phase 3 |
| --- | --- | --- | --- |
| Release Manager | 100% | 100% | 100% |
| ServiceNow Architect | 100% | 100% | 100% |
| Technical Lead | 100% | 100% | 100% |
| Developer | 100% | 100% | 100% |
| Admin | 100% | 100% | 100% |
| Tester | 100% | 100% | 100% |
| Security Team | 50% | 50% | 50% |
| L1 Support | 0% | 0% | 100% |
| L2 Support | 0% | 0% | 100% |
| L3 Support | 0% | 0% | 100% |

### 12.3 Risk Mitigation

| Risco | Probabilidade | Impact | Mitigação |
| --- | --- | --- | --- |
| Deployment falha | Low | Critical | Rollback plan testado, backup completo |
| Cutover falha | Low | Critical | Rollback plan, communication plan |
| Performance não atendida | Medium | High | Performance tuning, rollback |
| Security incident | Low | Critical | Security review, rollback |
| Stakeholder resistance | Low | High | Change management, training |

---

*Deployment Plan - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Draft*
*Now Create Phase: 06-Deploy*
*Deployment Duration: 3 dias*
*Cutover Duration: 4 horas*
*Hypercare Duration: 4 semanas*
*Go-Live Date: 2026-12-09*
