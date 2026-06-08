# EOAP_AuditLogger — Script Include de Logging

| Atributo | Valor |
|----------|-------|
| Escopo | x_eoap |
| Client callable | false |
| API Name | EOAP_AuditLogger |

---

## Código
```javascript
var EOAP_AuditLogger = Class.create();
EOAP_AuditLogger.prototype = {
    initialize: function() {},

    log: function(actor, entity_type, entity_sys_id, action, outcome, payload_summary) {
        var auditGr = new GlideRecord('x_eoap_audit_trail');
        auditGr.initialize();
        auditGr.actor = actor;
        auditGr.entity_type = entity_type;
        auditGr.entity_sys_id = entity_sys_id;
        auditGr.action = action;
        auditGr.outcome = outcome;
        auditGr.payload_summary = payload_summary;
        auditGr.correlation_id = this.generateCorrelationId();
        return auditGr.insert();
    },

    generateCorrelationId: function() {
        return 'EOAP-' + gs.generateGUID();
    },

    type: 'EOAP_AuditLogger'
};
```

---

## Métodos
| Método | Parâmetros | Retorno | Descrição |
|--------|------------|---------|-----------|
| log | actor, entity_type, entity_sys_id, action, outcome, payload_summary | String (sys_id) | Cria um log imutável no `x_eoap_audit_trail` |
| generateCorrelationId | Nenhum | String | Gera um ID único para tracing |
