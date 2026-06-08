# EOAP_Flow_Employee_Offboarding — Flow de Offboarding Automático

| Atributo | Valor |
|----------|-------|
| **Escopo** | x_eoap |
| **Trigger** | Record Updated (sys_user) |
| **Condição Trigger** | `terminated` changes to `true` |
| **Ativo** | Sim |

---

## Steps do Flow
| Passo | Tipo | Descrição |
|-------|------|-----------|
| 1 | **Trigger** | Inicia quando `sys_user.terminated` é marcado como `true` |
| 2 | **Look Up Records** | Busca registros em `x_eoap_user_access` onde `user` = trigger record e `status` = `active` |
| 3 | **Loop** | Para cada acesso encontrado: |
| 3.1 | **Update Record** | Atualiza `x_eoap_user_access`: set `status` = `revoked`, `revoked_on` = `now()` |
| 3.2 | **Script Step** | Chama `EOAP_AuditLogger.log()` para registrar a revogação |
| 4 | **Send Notification** | Envia email para o manager do usuário informando o offboarding |
| 5 | **End** | Fim do fluxo |

---

## Parâmetros do Audit Log
| Campo | Valor |
|-------|-------|
| `actor` | `gs.getUserID()` |
| `entity_type` | `x_eoap_user_access` |
| `entity_sys_id` | `sys_id` do acesso |
| `action` | `offboarding_revoke` |
| `outcome` | `success` |
| `payload_summary` | `Acesso revogado por offboarding automático` |
