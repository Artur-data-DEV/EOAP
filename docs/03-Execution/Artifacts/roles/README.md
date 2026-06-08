# Roles — RBAC da Solução EOAP

## x_eoap_admin
| Atributo | Valor |
|----------|-------|
| **Escopo** | x_eoap |
| **Descrição** | Administrador completo da solução EOAP |
| **Permissões** |
| | Ler/Escrever/Delete (permitido por Business Rule) `x_eoap_user_access` |
| | Ler `x_eoap_audit_trail` |
| | Editar `cmdb_ci_business_app.x_eoap_access_owner` |
| | Acessar Flow Designer e Script Includes |

---

## x_eoap_auditor
| Atributo | Valor |
|----------|-------|
| **Escopo** | x_eoap |
| **Descrição** | Auditor com acesso de leitura |
| **Permissões** |
| | Ler `x_eoap_user_access` |
| | Ler `x_eoap_audit_trail` |
| | Nenhuma permissão de escrita/exclusão |
