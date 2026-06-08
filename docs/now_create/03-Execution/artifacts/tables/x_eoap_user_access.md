# x_eoap_user_access — Tabela de Governança de Acessos

| Atributo | Valor |
|----------|-------|
| Escopo | x_eoap |
| Tipo | Standalone |
| Label | EOAP User Access |

---

## Campos
| Label | Nome | Tipo | Obrigatório | Referência |
|-------|------|------|-------------|------------|
| User | user | Reference | Sim | sys_user |
| Application | application | Reference | Sim | cmdb_ci_business_app |
| Status | status | Choice | Sim | requested, approved, active, revoked |
| Valid From | valid_from | Date/Time | Não | |
| Valid To | valid_to | Date/Time | Não | |
| Access Owner | access_owner | Reference | Não | sys_user |
| Justification | justification | String (4000) | Não | |
| Created On | created_on | Date/Time (Auto) | Sim | |
| Created By | created_by | Reference (Auto) | Sim | sys_user |
| Revoked On | revoked_on | Date/Time | Não | |

---

## Índices
1. `user`
2. `application`
3. `status`
