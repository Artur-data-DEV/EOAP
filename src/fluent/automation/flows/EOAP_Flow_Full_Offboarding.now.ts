import { Flow } from '@servicenow/sdk/core';

/**
 * EOAP_Flow_Full_Offboarding (Master Offboarding Flow)
 *
 * Combines employee termination + manual offboarding catalog requests.
 * Uses the Decision Table for any remaining access reviews.
 */
Flow({
  name: 'x_eoap EOAP Full Offboarding Orchestrator',
  active: true,
  description: 'Master flow that handles both automatic (terminated user) and manual offboarding requests. Calls governance services and decision tables.',
  trigger: {
    type: 'record.updated',
    table: 'sys_user',
  },
  actions: [
    {
      name: 'Check if user is terminated or offboarding requested',
      action: 'script',
      inputs: {
        script: `
          if (current.terminated || current.u_offboarding_requested) {
            var svc = new x_eoap.EOAP_AccessGovernanceService();
            svc.revokeAccess(current.sys_id, gs.getUserID());
            
            // Log via AuditLogger
            var logger = new x_eoap.EOAP_AuditLogger();
            logger.log(gs.getUserID(), 'sys_user', current.sys_id, 'full_offboarding', 'success', 'Full offboarding executed');
          }
        `,
      },
    },
  ],
});
