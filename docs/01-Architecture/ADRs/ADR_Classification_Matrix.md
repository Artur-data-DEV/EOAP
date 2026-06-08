# ADR Classification Matrix

| ADR | Decisão | Status MVP | Justificativa |
| --- | --- | --- | --- |
| ADR-001 | CMDB como espinha dorsal | **Active** | Necessário para x_eoap_access_owner em cmdb_ci_business_app |
| ADR-002 | Scoped Application `x_eoap` | **Active** | Necessário para isolamento de código e dados |
| ADR-003 | Flow Designer como orquestração primária | **Active** | Necessário para EOAP_Flow_Employee_Offboarding e EOAP_Flow_Access_Revocation |
| ADR-004 | Audit Trail write-only | **Active** | Necessário para x_eoap_audit_trail e EOAP_AuditLogger |
| ADR-005 | RBAC segregado por persona | **Active** | Necessário para governança (x_eoap_admin, x_eoap_auditor) |
| ADR-006 | Access Owner distinto de owned_by | **Active** | Necessário para x_eoap_access_owner em cmdb_ci_business_app |
| ADR-007 | User Access Registry | **Active** | Necessário para x_eoap_user_access (tabela principal) |
| ADR-008 | Cross-Scope Access Policy | **Active** | Necessário para scoped app acessar CMDB |
| ADR-009 | Indexing Strategy | **Active** | Necessário para performance de x_eoap_user_access e x_eoap_audit_trail |

---

## Resumo

| Status | Quantidade | ADRs |
| --- | --- | --- |
| **Active** | 9 | ADR-001, ADR-002, ADR-003, ADR-004, ADR-005, ADR-006, ADR-007, ADR-008, ADR-009 |

---

*ADR Classification Matrix*
*Versão 2.0 - 2026-06-07*
*Status: Atualizado (numeração sequencial)*
