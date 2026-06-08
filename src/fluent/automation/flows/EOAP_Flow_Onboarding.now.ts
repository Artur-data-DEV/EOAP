import { Flow } from '@servicenow/sdk/core';

/**
 * EOAP_Flow_Onboarding (basic)
 *
 * Triggered when a new user is created or marked as active with a business application owner.
 * Can be extended with Decision Table for initial access provisioning.
 */
Flow({
  name: 'x_eoap EOAP Onboarding Initial Access',
  active: true,
  description: 'Handles initial access provisioning for new or reactivated users based on Access Owner decisions.',
  trigger: {
    type: 'record.created',
    table: 'sys_user',
  },
  actions: [
    {
      name: 'Placeholder - Call Decision Table for initial access recommendations',
      action: 'script',
      inputs: {
        script: `
          // Future: integrate with EOAP_DT_AccessRiskRouting
          // For now just logs the event
          var logger = new x_eoap.EOAP_AuditLogger();
          logger.log(gs.getUserID(), 'sys_user', current.sys_id, 'onboarding_started', 'success', 'User created - onboarding flow triggered');
        `,
      },
    },
  ],
});
