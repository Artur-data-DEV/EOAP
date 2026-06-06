# EOAP Security Model

| Atributo | Valor |
| --- | --- |
| Documento | EOAP Security Model |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de Segurança Corporativo |

> **Escopo deste documento**: Modelo de segurança da EOAP. Inclui RBAC, ACL, SoD, STRIDE, compliance e procedimentos de segurança. Para compliance detalhado, ver Compliance.md. Para auditoria, ver Audit_Model.md.

---

## 1. Security Overview

### 1.1 Security Principles

**Princípios**:
- **Security by Design**: Segurança desde Sprint 0
- **Least Privilege**: Mínimo acesso necessário
- **Deny by Default**: ACLs deny-by-default
- **Defense in Depth**: Múltiplas camadas de segurança
- **Audit by Default**: Tudo auditado por default
- **Zero Trust**: Nunca confiar, sempre verificar

### 1.2 Security Layers

```
┌─────────────────────────────────────┐
│     Layer 1: Network Security       │
│  (TLS 1.2+, OAuth 2.0, MFA)        │
├─────────────────────────────────────┤
│     Layer 2: Application Security   │
│  (RBAC, ACL, SoD, Field ACL)       │
├─────────────────────────────────────┤
│     Layer 3: Data Security         │
│  (Encryption, Classification,        │
│   Retention, Archiving)            │
├─────────────────────────────────────┤
│     Layer 4: Audit Security         │
│  (Audit Trail, Logging, Monitoring)│
└─────────────────────────────────────┘
```

---

## 2. RBAC (Role-Based Access Control)

### 2.1 Roles

| Role | Propósito | Permissões | MFA |
| --- | --- | --- | --- |
| x_eoap_admin | Administração EOAP | Full access | Obrigatório PROD |
| x_eoap_cmdb_manager | Campos EOAP em CMDB | Read/write CMDB fields | Opcional |
| x_eoap_access_owner | Aprovação de acesso | Read/write access sob responsabilidade | Opcional |
| x_eoap_change_manager | Gestão de mudança | Read/change risk | Opcional |
| x_eoap_risk_analyst | Análise de risco | Read risk, write DT | Obrigatório PROD |
| x_eoap_auditor | Auditoria | Read audit trail | Opcional |
| x_eoap_manager | Solicitação de acesso | Request access | Opcional |

### 2.2 Role Hierarchy

```
sys_admin (plataforma)
  └─ x_eoap_admin (EOAP)
       └─ x_eoap_risk_analyst (opcional)
```

**Regras**:
- x_eoap_admin não contém sys_admin em PROD
- x_eoap_risk_analyst não contém x_eoap_admin em PROD
- Outros roles sem contains operacionais

### 2.3 Role Assignment

**Processo**:
1. Solicitação via Service Request
2. Aprovação por manager
3. Atribuição por x_eoap_admin
4. Review trimestral por Security Lead

**Review**:
- Trimestral: Validar necessidade
- Anual: Validar compliance
- Offboarding: Revogar imediatamente

---

## 3. ACL (Access Control List)

### 3.1 ACL Strategy

**Princípio**: Deny by default

**Pattern**:
- create: system/service only
- read: roles específicos
- write: roles específicos (campos permitidos)
- delete: none (soft delete apenas)

### 3.2 ACLs por Tabela

#### x_eoap_user_access

| Operação | Role | Permissão |
| --- | --- | --- |
| create | x_eoap_admin | admin |
| create | x_eoap_access_owner | admin |
| create | (outros) | none |
| read | x_eoap_admin | read |
| read | x_eoap_access_owner | read |
| read | x_eoap_manager | read |
| read | x_eoap_auditor | read |
| read | (outros) | none |
| write | x_eoap_admin | write |
| write | x_eoap_access_owner | write (campos permitidos) |
| write | (outros) | none |
| delete | (todos) | none |

#### x_eoap_audit_trail

| Operação | Role | Permissão |
| --- | --- | --- |
| create | x_eoap_admin | admin (via EOAP_AuditLogger) |
| create | (outros) | none |
| read | x_eoap_admin | read |
| read | x_eoap_auditor | read |
| read | (outros) | none |
| write | (todos) | none (append-only) |
| delete | (todos) | none (imutável) |

#### change_request (campos EOAP)

| Operação | Role | Permissão |
| --- | --- | --- |
| write (x_eoap_risk_*) | x_eoap_admin | write |
| write (x_eoap_risk_*) | EOAP_RiskEngine | write (via serviço) |
| write (x_eoap_risk_*) | (outros) | none |

### 3.3 Field ACLs

**Campos sensíveis**:
- risk_rating: read-only para Access Owner
- granted_by, granted_on: read-only para todos
- payload_summary (audit_trail): x_eoap_admin, x_eoap_auditor apenas

---

## 4. SoD (Segregation of Duties)

### 4.1 SoD Rules

| Regra | Conflito | Enforcement |
| --- | --- | --- |
| Requester cannot approve own request | Usuário solicita access, tenta aprovar | Flow validation |
| Risk Analyst cannot modify access | x_eoap_risk_analyst tenta modificar access | ACL |
| Auditor cannot modify data | x_eoap_auditor tenta modificar data | ACL |
| CMDB Manager cannot approve access | x_eoap_cmdb_manager tenta aprovar access | ACL |
| Access Owner cannot modify risk rating | x_eoap_access_owner tenta modificar risk_rating | Field ACL |

### 4.2 SoD Enforcement

**Mecanismos**:
1. **ACL**: Bloqueia operações não permitidas
2. **Flow Validation**: Valida SoD em flows críticos
3. **Field ACL**: Bloqueia modificação de campos sensíveis
4. **ATF**: Testes negativos validam SoD

### 4.3 SoD Review

**Frequência**: Trimestral

**Responsável**: x_eoap_auditor

**Atividades**:
- Review role assignments
- Review SoD violations
- Review access patterns
- Identificar gaps

---

## 5. STRIDE Analysis

### 5.1 STRIDE Threat Model

| Categoria | Ameaça | Controle | Status |
| --- | --- | --- | --- |
| **S**poofing | Impersonation de usuário | MFA, OAuth 2.0 | ✅ Implementado |
| **T**ampering | Modificação não autorizada de dados | ACL, Field ACL, Audit Trail | ✅ Implementado |
| **R**epudiation | Negação de ação | Audit Trail imutável | ✅ Implementado |
| **I**nformation Disclosure | Vazamento de dados sensíveis | Data Classification, Encryption | ✅ Implementado |
| **D**enial of Service | Sobrecarga de sistema | Rate limiting, Capacity planning | ✅ Implementado |
| **E**levation of Privilege | Escalation de privilégio | RBAC, SoD, ACL | ✅ Implementado |

### 5.2 Controles Específicos

#### Spoofing

**Controles**:
- MFA obrigatório para x_eoap_admin e x_eoap_risk_analyst em PROD
- OAuth 2.0 com client credentials
- TLS 1.2+ para todas as conexões
- Certificate pinning para integrações críticas

#### Tampering

**Controles**:
- ACL deny-by-default
- Field ACL para dados sensíveis
- Audit trail append-only e imutável
- Digital signatures para eventos críticos

#### Repudiation

**Controles**:
- Audit trail imutável (7 anos)
- Actor tracking em todos os eventos
- Correlation ID para traceability
- Non-repudiation via assinatura digital

#### Information Disclosure

**Controles**:
- Data classification (Public, Internal, Confidential, Restricted)
- Encryption at rest (database)
- Encryption in transit (TLS 1.2+)
- Field ACL para dados sensíveis

#### Denial of Service

**Controles**:
- Rate limiting (100 req/min)
- Capacity planning (1/3/5 anos)
- Circuit breaker para integrações
- Degradation graciosa

#### Elevation of Privilege

**Controles**:
- RBAC com least privilege
- SoD enforcement
- Role review trimestral
- No contains operacionais entre roles

---

## 6. Data Security

### 6.1 Data Classification

| Classificação | Critérios | Proteção |
| --- | --- | --- |
| Public | Dados públicos | Sem restrição |
| Internal | Dados internos da empresa | Acesso employees apenas |
| Confidential | Dados sensíveis da empresa | Acesso autorizado apenas |
| Restricted | Dados críticos (PII, financial) | Acesso restrito, encryption |

### 6.2 Encryption

**At Rest**:
- Database: AES-256
- Archive: AES-256
- Backup: AES-256

**In Transit**:
- API: TLS 1.2+
- Integrations: TLS 1.2+
- Email: TLS 1.2+

### 6.3 Data Retention

| Tipo de Dado | Retenção | Archiving |
| --- | --- | --- |
| Audit Trail | 7 anos (SOX) | Permanente |
| User Access | 7 anos após offboarding | 1 ano |
| Event Processing | 30 dias | 90 dias |
| Risk Evidence | 7 anos | 1 ano |

### 6.4 Data Archiving

**Strategy**:
- Archiving ativo para audit trail
- Archiving passivo para user access
- Archiving passivo para event processing
- Archiving passivo para risk evidence

**Schedule**:
- Audit trail: Diário
- User access: Mensal
- Event processing: Semanal
- Risk evidence: Mensal

---

## 7. API Security

### 7.1 REST API Security

**Authentication**:
- OAuth 2.0 com client credentials
- Token lifetime: 1 hora
- Refresh token: 24 horas

**Authorization**:
- ACLs por endpoint
- Rate limiting: 100 req/min
- IP whitelisting (opcional)

**Endpoints**:
- GET /api/x_eoap/v1/access/{sys_id}: x_eoap_admin, x_eoap_manager
- POST /api/x_eoap/v1/access: x_eoap_admin, x_eoap_manager
- GET /api/x_eoap/v1/risk/{change_sys_id}: x_eoap_admin, x_eoap_change_manager

### 7.2 Integration Security

**Connection Management**:
- Connection & Credential Aliases
- OAuth 2.0 ou certificado mútuo
- Credential rotation: 90 dias

**Outbound REST Messages**:
- Authentication via Connection Alias
- Retry: 3× transitório
- Timeout: 30s

---

## 8. Compliance

### 8.1 Regulatory Compliance

| Regulamento | Requisito | Status |
| --- | --- | --- |
| SOX | Audit trail 7 anos, imutável | ✅ Implementado |
| ISO 27001 | Security controls, risk management | ✅ Implementado |
| LGPD | Data protection, consent, retention | ✅ Implementado |

### 8.2 Internal Compliance

| Política | Requisito | Status |
| --- | --- | --- |
| Password Policy | Mínimo 12 caracteres, MFA | ✅ Implementado |
| Access Policy | Review trimestral, offboarding imediato | ✅ Implementado |
| Encryption Policy | TLS 1.2+, AES-256 | ✅ Implementado |
| Audit Policy | 100% audit coverage | ✅ Implementado |

---

## 9. Incident Response

### 9.1 Security Incident Classification

| Severidade | Critérios | Response Time |
| --- | --- | --- |
| P1 - Critical | Data breach, unauthorized access | 15 min |
| P2 - High | ACL violation, SoD violation | 1 hour |
| P3 - Medium | Potential security issue | 4 hours |
| P4 - Low | Security question | 24 hours |

### 9.2 Incident Response Procedure

**Step 1 - Containment**:
- Isolar sistema se necessário
- Revogar access comprometido
- Bloquear IPs maliciosas

**Step 2 - Investigation**:
- Identificar root cause
- Determinar impacto
- Coletar evidência

**Step 3 - Eradication**:
- Remover vulnerabilidade
- Aplicar patch
- Atualizar configurações

**Step 4 - Recovery**:
- Restaurar de backup se necessário
- Validar sistema
- Monitorar por anomalias

**Step 5 - Lessons Learned**:
- Post-mortem
- Atualizar controles
- Treinar equipe

---

## 10. Security Monitoring

### 10.1 Security Metrics

| Métrica | Target | Alert |
| --- | --- | --- |
| Failed Authentication | < 10/hour | > 50/hour |
| ACL Violations | 0 | > 0 |
| SoD Violations | 0 | > 0 |
| MFA Compliance | 100% (admin, risk_analyst) | < 100% |
| OAuth Token Expiry | < 1% expired | > 5% expired |

### 10.2 Security Dashboards

**Widgets**:
- Failed Authentication (última hora)
- ACL Violations (última hora)
- SoD Violations (última hora)
- MFA Compliance
- OAuth Token Health
- Security Incidents (última semana)

---

## 11. Security Training

### 11.1 Training Requirements

| Role | Training | Frequência |
| --- | --- | --- |
| x_eoap_admin | Security awareness + EOAP security | Onboarding + Annual |
| x_eoap_risk_analyst | Security awareness + EOAP security | Onboarding + Annual |
| x_eoap_auditor | Security awareness + Audit security | Onboarding + Annual |
| Todos os usuários | Security awareness | Onboarding + Annual |

### 11.2 Training Content

**Security Awareness** (4 horas):
- Phishing awareness
- Password security
- Data classification
- Incident reporting

**EOAP Security** (2 horas):
- RBAC e ACL
- SoD
- Audit trail
- Incident response

---

## 12. Security Review

### 12.1 Review Schedule

| Tipo | Frequência | Responsável |
| --- | --- | --- |
| Role Review | Trimestral | Security Lead |
| ACL Review | Trimestral | x_eoap_admin |
| SoD Review | Trimestral | x_eoap_auditor |
| Security Assessment | Anual | CISO |
| Penetration Test | Anual | Third-party |

### 12.2 Review Deliverables

**Role Review**:
- Lista de roles e assignments
- Gaps identificados
- Recomendações

**ACL Review**:
- Lista de ACLs
- Gaps identificados
- Recomendações

**SoD Review**:
- Lista de SoD violations
- Root cause analysis
- Recomendações

**Security Assessment**:
- Vulnerability scan
- Penetration test results
- Compliance status
- Recommendations

---

*Security Model - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
