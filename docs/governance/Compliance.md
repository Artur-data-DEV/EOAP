# EOAP Compliance Model

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Compliance Model |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Compliance Corporativo |

> **Escopo deste documento**: Modelo de compliance da EOAP. Inclui SOX, ISO 27001, LGPD e compliance interno. Para segurança detalhada, ver Security_Model.md. Para auditoria, ver Audit_Model.md.

---

## 1. Compliance Overview

### 1.1 Regulatory Framework

| Regulamento | Escopo | Status |
| --- | --- | --- |
| SOX (Sarbanes-Oxley) | Audit trail, access control, change management | ✅ Compliant |
| ISO 27001 | Information security management | ✅ Compliant |
| LGPD (Lei Geral de Proteção de Dados) | Data protection, consent, retention | ✅ Compliant |

### 1.2 Internal Policies

| Política | Escopo | Status |
| --- | --- | --- |
| Access Policy | Access request, approval, recertification | ✅ Implementado |
| Data Classification Policy | Data classification, handling, retention | ✅ Implementado |
| Change Management Policy | Change approval, risk assessment, documentation | ✅ Implementado |
| Audit Policy | Audit trail, logging, monitoring | ✅ Implementado |

---

## 2. SOX Compliance

### 2.1 SOX Requirements

| Requisito SOX | Implementação EOAP | Evidência |
| --- | --- | --- |
| Section 404 - Internal Control | RBAC, ACL, SoD | Security_Model.md |
| Section 404 - Audit Trail | x_eoap_audit_trail (7 anos, imutável) | Audit_Model.md |
| Section 404 - Access Review | Recertification trimestral | Support_Model.md |
| Section 302 - Disclosures | Dashboards, reports | Monitoring.md |

### 2.2 SOX Controls

**Control 1 - Access Control**:
- RBAC implementado
- ACL deny-by-default
- SoD enforcement
- Role review trimestral

**Control 2 - Audit Trail**:
- Audit trail imutável
- Retenção 7 anos
- 100% coverage
- Correlation ID tracking

**Control 3 - Change Management**:
- ADR para todas as mudanças
- Change approval via CAB
- Risk assessment obrigatório
- ATF regression

**Control 4 - Monitoring**:
- Dashboards operacionais
- Alerting configurado
- SLOs definidos
- Incident response

### 2.3 SOX Audit Preparation

**Documentação**:
- Security_Model.md
- Audit_Model.md
- ADRs (/docs/architecture/ADRs/)
- Runbook.md
- Monitoring.md

**Evidências**:
- Audit trail export (últimos 7 anos)
- Role assignments (últimos 7 anos)
- Change history (últimos 7 anos)
- Incident reports (últimos 7 anos)

**Audit Timeline**:
- Quarterly: Internal audit
- Annually: External audit

---

## 3. ISO 27001 Compliance

### 3.1 ISO 27001 Clauses

| Clause ISO 27001 | Implementação EOAP | Evidência |
| --- | --- | --- |
| A.5.1.1 - Policies for Information Security | Security policies documentadas | Security_Model.md |
| A.5.1.2 - Review of Policies | Review anual de políticas | Security Review |
| A.6.1.1 - Information Security Roles and Responsibilities | RBAC, RACI | Security_Model.md, Support_Model.md |
| A.6.1.2 - Segregation of Duties | SoD enforcement | Security_Model.md |
| A.7.1.1 - Employee Screening | Background check para roles críticos | HR Process |
| A.8.1.1 - Inventory of Assets | CMDB, x_eoap_user_access | CMDB Quality Report |
| A.8.2.1 - Classification of Information | Data classification | Security_Model.md |
| A.9.1.1 - Access Control Policy | RBAC, ACL | Security_Model.md |
| A.9.2.1 - User Access Management | Onboarding, offboarding, recertification | Runbook.md |
| A.9.2.3 - Management of Privileged Access | MFA para admin, risk_analyst | Security_Model.md |
| A.9.3.1 - Authentication Information | OAuth 2.0, MFA | Security_Model.md |
| A.10.1.1 - Cryptography | Encryption at rest/in transit | Security_Model.md |
| A.12.1.1 - Documented Operating Procedures | Runbook, Implementation Guide | docs/ |
| A.12.2.1 - Change Management | ADR, CAB, ATF | docs/architecture/ADRs/ |
| A.12.3.1 - Information Backup | Backup strategy | Runbook.md |
| A.12.4.1 - Logging | Logging strategy | Monitoring.md |
| A.12.5.1 - Monitoring | Dashboards, alerting | Monitoring.md |
| A.12.6.1 - Management of Technical Vulnerabilities | Penetration test, patch management | Security Review |
| A.16.1.1 - Information Security Incident Management | Incident response | Runbook.md |
| A.16.1.2 - Reporting Information Security Events | Incident reporting | Support_Model.md |
| A.16.1.3 - Management of Information Security Incidents | Incident management | Runbook.md |
| A.16.1.4 - Learning from Information Security Incidents | Post-mortem | Runbook.md |
| A.18.1.1 - Identification of Applicable Laws | SOX, ISO 27001, LGPD | Compliance.md |
| A.18.1.2 - Intellectual Property Rights | Licenças, copyright | Legal |
| A.18.1.3 - Protection of Records | Audit trail 7 anos | Security_Model.md |
| A.18.1.4 - Privacy and Protection of PII | LGPD compliance | LGPD Section |

### 3.2 ISO 27001 Audit Preparation

**Documentação**:
- ISMS (Information Security Management System)
- Security policies
- Risk assessment
- Statement of Applicability (SoA)

**Evidências**:
- Security controls implementados
- Monitoring data
- Incident reports
- Training records
- Review records

**Audit Timeline**:
- Quarterly: Internal audit
- Annually: External audit

---

## 4. LGPD Compliance

### 4.1 LGPD Principles

| Princípio LGPD | Implementação EOAP | Evidência |
| --- | --- | --- |
| Art. 6 - Finalidade | Data coletada para propósito específico | Privacy Policy |
| Art. 7 - Adequação | Data adequada ao propósito | Data Classification |
| Art. 8 - Necessidade | Mínimo de dados necessário | Data Minimization |
| Art. 9 - Livre Acesso | Usuário pode acessar seus dados | User Portal |
| Art. 10 - Qualidade | Data precisa e atualizada | CMDB Quality |
| Art. 11 - Transparência | Usuário informado sobre uso | Privacy Policy |
| Art. 12 - Segurança | Medidas de segurança implementadas | Security_Model.md |
| Art. 13 - Dados Sensíveis | Proteção especial para dados sensíveis | Data Classification |
| Art. 14 - Dados Pessoais | Consentimento para uso de dados | Consent Management |
| Art. 15 - Eliminação de Dados | Dados eliminados após retenção | Data Retention Policy |
| Art. 16 - Anonimização | Dados anonimizados quando possível | Data Anonymization |
| Art. 17 - Consentimento | Consentimento explícito | Consent Management |
| Art. 18 - Direito de Revogação | Usuário pode revogar consentimento | User Portal |

### 4.2 LGPD Controls

**Control 1 - Data Classification**:
- Public, Internal, Confidential, Restricted
- Proteção por classificação
- Handling por classificação

**Control 2 - Consent Management**:
- Consentimento explícito para uso de dados
- Consentimento revogável
- Consentimento documentado

**Control 3 - Data Minimization**:
- Mínimo de dados coletados
- Dados anonimizados quando possível
- Dados agregados quando possível

**Control 4 - Data Retention**:
- Retenção mínima necessária
- Eliminação após retenção
- Archiving para compliance

**Control 5 - Data Access**:
- Usuário pode acessar seus dados
- Usuário pode solicitar correção
- Usuário pode solicitar eliminação

**Control 6 - Data Breach Notification**:
- Notificação em 48 horas
- Notificação à ANPD
- Notificação aos usuários afetados

### 4.3 LGPD Audit Preparation

**Documentação**:
- Privacy Policy
- Data Retention Policy
- Consent Management Process
- Data Breach Response Plan

**Evidências**:
- Consent records
- Data access logs
- Data retention logs
- Data breach notifications (se houver)

**Audit Timeline**:
- Quarterly: Internal audit
- Annually: External audit

---

## 5. Internal Compliance

### 5.1 Access Policy

**Requisitos**:
- Access request via processo formal
- Approval baseado em risco e classificação
- Recertificação trimestral
- Offboarding imediato

**Implementação**:
- EOAP_Flow_Access_Request
- DT_Access_Approval_Routing
- Recertification job
- EOAP_Flow_Employee_Offboarding

**Evidências**:
- x_eoap_user_access records
- Approval records
- Recertification records
- Offboarding records

### 5.2 Data Classification Policy

**Requisitos**:
- Classificação obrigatória para todos os dados
- Proteção por classificação
- Handling por classificação

**Implementação**:
- Data classification em CMDB
- Data classification em user access
- Field ACL por classificação

**Evidências**:
- CMDB records com classificação
- User access records com classificação
- ACL configuration

### 5.3 Change Management Policy

**Requisitos**:
- ADR para todas as mudanças
- Change approval via CAB
- Risk assessment obrigatório
- ATF regression obrigatório

**Implementação**:
- ADR process
- CAB review
- EOAP_Flow_Change_Risk_Assessment
- ATF suites

**Evidências**:
- ADR records
- CAB meeting minutes
- Change records
- ATF results

### 5.4 Audit Policy

**Requisitos**:
- 100% audit coverage
- Audit trail imutável
- Retenção 7 anos
- Correlation ID tracking

**Implementação**:
- x_eoap_audit_trail
- Logging strategy
- Correlation ID propagation
- Archiving strategy

**Evidências**:
- Audit trail records
- Log records
- Archiving records

---

## 6. Compliance Monitoring

### 6.1 Compliance Metrics

| Métrica | Target | Alert |
| --- | --- | --- |
| SOX Compliance | 100% | < 100% |
| ISO 27001 Compliance | 100% | < 100% |
| LGPD Compliance | 100% | < 100% |
| Access Recertification Rate | 100% | < 95% |
| Data Classification Coverage | 100% | < 95% |
| Audit Trail Coverage | 100% | < 100% |
| ADR Coverage | 100% | < 100% |

### 6.2 Compliance Dashboards

**Widgets**:
- SOX Compliance Status
- ISO 27001 Compliance Status
- LGPD Compliance Status
- Access Recertification Rate
- Data Classification Coverage
- Audit Trail Coverage
- ADR Coverage

---

## 7. Compliance Review

### 7.1 Review Schedule

| Tipo | Frequência | Responsável |
| --- | --- | --- |
| SOX Review | Trimestral | x_eoap_auditor |
| ISO 27001 Review | Trimestral | x_eoap_auditor |
| LGPD Review | Trimestral | DPO |
| Internal Policy Review | Anual | Compliance Officer |
| External Audit | Anual | Third-party |

### 7.2 Review Deliverables

**SOX Review**:
- Control assessment
- Gap analysis
- Remediation plan
- Status report

**ISO 27001 Review**:
- Control assessment
- Gap analysis
- Remediation plan
- Status report

**LGPD Review**:
- Privacy assessment
- Consent assessment
- Data retention assessment
- Status report

---

## 8. Compliance Training

### 8.1 Training Requirements

| Role | Training | Frequência |
| --- | --- | --- |
| x_eoap_admin | SOX, ISO 27001, LGPD | Onboarding + Annual |
| x_eoap_auditor | SOX, ISO 27001, LGPD (avançado) | Onboarding + Annual |
| Todos os usuários | LGPD awareness | Onboarding + Annual |

### 8.2 Training Content

**SOX Training** (2 horas):
- SOX requirements
- Internal controls
- Audit preparation
- Documentation

**ISO 27001 Training** (2 horas):
- ISO 27001 clauses
- Security controls
- Risk management
- Incident response

**LGPD Training** (2 horas):
- LGPD principles
- Data rights
- Consent management
- Data breach response

---

## 9. Non-Compliance Management

### 9.1 Non-Compliance Classification

| Severidade | Critérios | Response Time |
| --- | --- | --- |
| Critical | Violation SOX/ISO 27001/LGPD crítico | 24 hours |
| High | Violação não crítica mas significativa | 1 week |
| Medium | Violação menor | 1 month |
| Low | Process gap | 3 months |

### 9.2 Non-Compliance Response

**Step 1 - Assessment**:
- Identificar violação
- Determinar impacto
- Classificar severidade

**Step 2 - Remediation**:
- Implementar fix
- Validar fix
- Documentar fix

**Step 3 - Prevention**:
- Root cause analysis
- Implementar controle preventivo
- Atualizar processo

**Step 4 - Reporting**:
- Reportar a stakeholders
- Reportar a reguladores (se necessário)
- Documentar lessons learned

---

## 10. Compliance Reporting

### 10.1 Reports

**Daily Report**:
- Compliance status (SOX, ISO 27001, LGPD)
- Non-compliance alerts (se houver)

**Weekly Report**:
- Compliance trends
- Non-compliance summary
- Remediation progress

**Monthly Report**:
- Compliance status detalhado
- Non-compliance summary
- Remediation progress
- Recommendations

**Quarterly Report**:
- Compliance assessment
- Gap analysis
- Remediation plan
- Status report

**Annual Report**:
- Compliance status anual
- Non-compliance summary anual
- Remediation progress anual
- Recommendations anuais

---

*Compliance Model - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
