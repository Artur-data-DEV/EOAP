/**
 * EOAP_DT_AccessRiskRouting - Decision Logic (MVP)
 *
 * Inputs:
 *   application (cmdb_ci_business_app)
 *   user (sys_user)
 *   requestedBy (sys_user)
 *   justification (string)
 *
 * Outputs:
 *   riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
 *   approvers: array of user sys_ids
 *   autoApprove: boolean
 *   requiresSecurityReview: boolean
 */

var EOAP_DT_AccessRiskRouting = Class.create();
EOAP_DT_AccessRiskRouting.prototype = {
  initialize: function () {},

  evaluate: function (applicationSysId, userSysId, requestedBySysId, justification) {
    var result = {
      riskLevel: 'Medium',
      approvers: [],
      autoApprove: false,
      requiresSecurityReview: false,
      routingReason: '',
    };

    // Simple rule-based decision (to be replaced by real Decision Table)
    var appGr = new GlideRecord('cmdb_ci_business_app');
    if (!appGr.get(applicationSysId)) {
      result.riskLevel = 'High';
      result.routingReason = 'Application not found in CMDB';
      return result;
    }

    var isCriticalApp = appGr.u_criticality == 'Critical' || appGr.u_criticality == 'High';
    var hasJustification = justification && justification.length > 50;

    if (isCriticalApp) {
      result.riskLevel = 'High';
      result.requiresSecurityReview = true;
      result.approvers.push(appGr.x_eoap_access_owner); // Access Owner
      result.routingReason = 'Critical application - requires Access Owner + Security review';
    } else if (!hasJustification) {
      result.riskLevel = 'Medium';
      result.approvers.push(appGr.x_eoap_access_owner);
      result.routingReason = 'Missing or weak justification';
    } else {
      result.riskLevel = 'Low';
      result.autoApprove = true;
      result.routingReason = 'Standard application with proper justification';
    }

    // Always include the requested user's manager for visibility
    var userGr = new GlideRecord('sys_user');
    if (userGr.get(userSysId) && userGr.manager) {
      result.approvers.push(userGr.manager);
    }

    return result;
  },

  type: 'EOAP_DT_AccessRiskRouting',
};
