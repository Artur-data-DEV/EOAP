import { Flow } from '@servicenow/sdk/core'

/**
 * EOAP_Flow_Access_Revocation
 * Spec: docs/03-Execution/Artifacts/flows/EOAP_Flow_Access_Revocation.md
 *
 * Trigger: x_eoap_user_access.status muda para 'revoked'
 * Objetivo: Registrar a revogação no audit trail (reforço) e permitir extensões futuras
 *           (ex: chamada para sistemas externos de IAM / deprovisioning).
 */
Flow({
  name: 'x_eoap EOAP Flow Access Revocation',
  active: true,
  description: 'Captura a revogação de acesso (status = revoked) e garante registro de auditoria. Ponto de extensão para deprovisionamento externo.',
  trigger: {
    type: 'record.updated',
    table: 'x_eoap_user_access',
  },
  actions: [
    {
      name: 'Log Revocation in Audit Trail',
      action: 'script',
      inputs: {
        script: `
          var accessGr = current;
          var logger = new x_eoap.EOAP_AuditLogger();
          logger.log(
            gs.getUserID(),
            'x_eoap_user_access',
            accessGr.sys_id,
            'access_revoked',
            'success',
            'Access record status changed to revoked. Application: ' + accessGr.application
          );
        `,
      },
    },
    // Ponto de extensão futuro (MVP deixa comentado):
    // {
    //   name: 'Call External Deprovisioning (IAM)',
    //   action: 'rest',
    //   ...
    // }
  ],
})
