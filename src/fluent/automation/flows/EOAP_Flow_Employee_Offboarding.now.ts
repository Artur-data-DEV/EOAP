import { Flow } from '@servicenow/sdk/core'

/**
 * EOAP_Flow_Employee_Offboarding
 * Spec: docs/03-Execution/Artifacts/flows/EOAP_Flow_Employee_Offboarding.md
 *
 * Trigger: sys_user.terminated muda para true (ou quando o campo terminated é atualizado para true)
 * Ação: Revogar todos os acessos ativos do usuário via EOAP_AccessGovernanceService + logging + notificação ao manager.
 *
 * Nota: Para MVP, o Flow é definido como esqueleto. Ajustes de condições, data pills e notificações
 * mais precisos devem ser refinados no Flow Designer após o deploy inicial (abordagem híbrida controlada).
 */
Flow({
  name: 'x_eoap EOAP Flow Employee Offboarding',
  active: true,
  description: 'Quando um usuário é marcado como terminated, revoga automaticamente todos os seus acessos ativos e registra no audit trail.',
  trigger: {
    type: 'record.updated',
    table: 'sys_user',
    // A condição real "terminated changes to true" deve ser configurada no Flow Designer
    // ou via script condition mais precisa.
  },
  actions: [
    {
      name: 'Revoke All Active Accesses',
      action: 'script',
      inputs: {
        script: `
          var userSysId = current.sys_id;
          var actorSysId = gs.getUserID();
          var governance = new x_eoap.EOAP_AccessGovernanceService();
          governance.revokeAccess(userSysId, actorSysId);
        `,
      },
    },
    {
      name: 'Notify Manager',
      action: 'send_email',
      inputs: {
        // Data pills devem ser ajustados no designer para o manager correto
        to: '{{trigger.current.manager.email}}',
        subject: 'Offboarding automático executado - {{trigger.current.name}}',
        body: 'A EOAP revogou automaticamente todos os acessos do usuário.\n\n' +
              'Acesse o Audit Trail para detalhes completos (correlation id disponível nos logs).',
      },
    },
  ],
})
