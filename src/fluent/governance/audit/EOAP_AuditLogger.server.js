/**
 * EOAP_AuditLogger (server implementation)
 * Mantém o audit trail semântico e imutável.
 *
 * NOTA: GlideRecord é usado aqui para acesso a dados no contexto server-side do ServiceNow.
 * Em refatorações futuras podemos extrair para módulos em src/server/ com @servicenow/glide.
 */
var EOAP_AuditLogger = Class.create();
EOAP_AuditLogger.prototype = {
  initialize: function () {},

  log: function (actor, entity_type, entity_sys_id, action, outcome, payload_summary) {
    var auditGr = new GlideRecord('x_eoap_audit_trail');
    auditGr.initialize();
    if (actor) auditGr.actor = actor;
    auditGr.entity_type = entity_type;
    auditGr.entity_sys_id = entity_sys_id;
    auditGr.action = action;
    auditGr.outcome = outcome;
    if (payload_summary) auditGr.payload_summary = payload_summary;
    auditGr.correlation_id = this.generateCorrelationId();
    return auditGr.insert();
  },

  generateCorrelationId: function () {
    return 'EOAP-' + gs.generateGUID();
  },

  type: 'EOAP_AuditLogger',
};
