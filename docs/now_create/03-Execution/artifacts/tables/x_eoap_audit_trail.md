# x_eoap_audit_trail — Tabela de Log Imutável

| Atributo | Valor |
|----------|-------|
| Escopo | x_eoap |
| Tipo | Standalone |
| Label | EOAP Audit Trail |

---

## Campos
| Label | Nome | Tipo | Obrigatório | Referência |
|-------|------|------|-------------|------------|
| Actor | actor | Reference | Não | sys_user |
| Entity Type | entity_type | String (100) | Sim | |
| Entity Sys ID | entity_sys_id | String (32) | Sim | |
| Action | action | String (100) | Sim | |
| Outcome | outcome | Choice | Sim | success, failure, partial |
| Payload Summary | payload_summary | String (4000) | Não | |
| Created On | created_on | Date/Time (Auto) | Sim | |
| Correlation ID | correlation_id | String (100) | Sim | |

---

## Índices
1. `entity_type`
2. `entity_sys_id`
3. `correlation_id`
