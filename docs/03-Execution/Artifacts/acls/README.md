# ACLs — Deny-by-Default

## ACLs para `x_eoap_user_access`
| Nome | Operação | Role | Condição | Ação |
|------|----------|------|----------|------|
| `x_eoap_user_access.create` | create | system/service | | Allow |
| `x_eoap_user_access.read` | read | x_eoap_admin, x_eoap_auditor | | Allow |
| `x_eoap_user_access.write` | write | x_eoap_admin | | Allow |
| `x_eoap_user_access.delete` | delete | | | Deny (padrão) |

---

## ACLs para `x_eoap_audit_trail`
| Nome | Operação | Role | Condição | Ação |
|------|----------|------|----------|------|
| `x_eoap_audit_trail.create` | create | EOAP_AuditLogger (service context) | | Allow |
| `x_eoap_audit_trail.read` | read | x_eoap_admin, x_eoap_auditor | | Allow |
| `x_eoap_audit_trail.write` | write | | | Deny (padrão) |
| `x_eoap_audit_trail.delete` | delete | | | Deny (padrão) |
