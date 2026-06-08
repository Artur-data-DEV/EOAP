/**
 * EOAP_AccessGovernanceService (server implementation)
 * Fornece operações de alto nível para Flows e Jobs.
 */
var EOAP_AccessGovernanceService = Class.create();
EOAP_AccessGovernanceService.prototype = {
  initialize: function () {},

  getActiveAccesses: function (user_sys_id) {
    var accessGr = new GlideRecord('x_eoap_user_access');
    accessGr.addQuery('user', user_sys_id);
    accessGr.addQuery('status', 'active');
    accessGr.query();

    var accessList = [];
    while (accessGr.next()) {
      accessList.push(accessGr.getUniqueValue());
    }
    return accessList;
  },

  revokeAccess: function (user_sys_id, actor_sys_id) {
    var accessList = this.getActiveAccesses(user_sys_id);
    var logger = new EOAP_AuditLogger();

    for (var i = 0; i < accessList.length; i++) {
      var accessGr = new GlideRecord('x_eoap_user_access');
      if (accessGr.get(accessList[i])) {
        accessGr.status = 'revoked';
        accessGr.revoked_on = new GlideDateTime();
        accessGr.update();

        logger.log(
          actor_sys_id,
          'x_eoap_user_access',
          accessList[i],
          'revoke',
          'success',
          'Access revoked via governance service'
        );
      }
    }
  },

  validateAccessOwner: function (application_sys_id, access_owner_sys_id) {
    var appGr = new GlideRecord('cmdb_ci_business_app');
    if (appGr.get(application_sys_id)) {
      return appGr.x_eoap_access_owner == access_owner_sys_id;
    }
    return false;
  },

  type: 'EOAP_AccessGovernanceService',
};
