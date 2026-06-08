import { ScriptInclude, Now } from '@servicenow/sdk/core'

/**
 * EOAP_Job_Reconciliation
 * Spec: docs/03-Execution/Artifacts/scheduled-jobs/EOAP_Job_Reconciliation.md
 *
 * Este Script Include contém a lógica do job.
 * O agendamento real (diário às 02:00) deve ser criado na PDI em:
 *   System Scheduler > Scheduled Jobs > New > Run Script
 *   ou via sysauto_script record.
 *
 * Para futuro: podemos representar o scheduled job via Record() quando o SDK
 * oferecer suporte estável para sysauto_script / scheduled jobs.
 */
ScriptInclude({
  $id: Now.ID['x_eoap_job_reconciliation'],
  name: 'EOAP_Job_Reconciliation',
  active: true,
  apiName: 'x_eoap.EOAP_Job_Reconciliation',
  description: 'Job de reconciliação diário. Executa verificações de consistência e logging.',
  script: Now.include('./EOAP_Job_Reconciliation.server.js'),
})
