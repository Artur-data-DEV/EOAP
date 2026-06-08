import { ScriptInclude, Now } from '@servicenow/sdk/core'

/**
 * EOAP_AuditLogger — Script Include para logging imutável
 * Spec: docs/03-Execution/Artifacts/script-includes/EOAP_AuditLogger.md
 *
 * Uso principal:
 *   - Chamado por Flows de offboarding/revogação
 *   - Chamado por Scheduled Jobs
 *   - Chamado por outros Script Includes / Business Rules
 */
ScriptInclude({
  $id: Now.ID['x_eoap_audit_logger'],
  name: 'EOAP_AuditLogger',
  active: true,
  apiName: 'x_eoap.EOAP_AuditLogger',
  description: 'Centraliza a criação de registros imutáveis na tabela x_eoap_audit_trail',
  script: Now.include('./EOAP_AuditLogger.server.js'),
})
