# Access Governance Dashboard — Dashboard de Governança

| Atributo | Valor |
|----------|-------|
| **Escopo** | x_eoap |
| **Nome** | EOAP Access Governance Dashboard |
| **Menu** | EOAP |

---

## Widgets
| Nome do Widget | Tipo | Fonte de Dados | Condição |
|----------------|------|----------------|----------|
| 1. Total Active Accesses | **Count** | `x_eoap_user_access` | `status` = `active` |
| 2. Access Drift | **Count** | `x_eoap_user_access` | `status` = `revoked` AND `revoked_on` > 30 dias atrás |
| 3. Offboarding Time | **Average** | `x_eoap_user_access` | Campo: `revoked_on - updated_on` (ou campo dedicado, se criado) |
| 4. Access by Application | **Bar Chart** | `x_eoap_user_access` | Group by: `application` |
