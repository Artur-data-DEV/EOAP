import { ScriptInclude, Now } from '@servicenow/sdk/core'

/**
 * EOAP_AccessGovernanceService — Lógica central de governança de acessos
 * Spec: docs/03-Execution/Artifacts/script-includes/EOAP_AccessGovernanceService.md
 */
ScriptInclude({
  $id: Now.ID['x_eoap_access_governance_service'],
  name: 'EOAP_AccessGovernanceService',
  active: true,
  apiName: 'x_eoap.EOAP_AccessGovernanceService',
  description: 'Serviço de governança: consulta acessos ativos, revogação em lote, validação de ownership',
  script: Now.include('./EOAP_AccessGovernanceService.server.js'),
})
