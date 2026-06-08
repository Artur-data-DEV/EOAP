# Business Rules — Proteção de Dados

## BR_EOAP_UserAccess_Delete_Protect
| Atributo | Valor |
|----------|-------|
| **Tabela** | x_eoap_user_access |
| **Quando** | Before |
| **Operação** | Delete |
| **Condição** | true |
| **Ação** | Abort Action |
| **Mensagem** | "Registro de acesso não pode ser excluído!" |

---

## BR_EOAP_AuditTrail_Protect_Write
| Atributo | Valor |
|----------|-------|
| **Tabela** | x_eoap_audit_trail |
| **Quando** | Before |
| **Operação** | Write |
| **Condição** | true |
| **Ação** | Abort Action |
| **Mensagem** | "Log de auditoria é imutável!" |

---

## BR_EOAP_AuditTrail_Protect_Delete
| Atributo | Valor |
|----------|-------|
| **Tabela** | x_eoap_audit_trail |
| **Quando** | Before |
| **Operação** | Delete |
| **Condição** | true |
| **Ação** | Abort Action |
| **Mensagem** | "Log de auditoria é imutável!" |
