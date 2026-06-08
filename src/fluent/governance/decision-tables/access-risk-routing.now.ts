/**
 * Decision Table: Access Risk & Approval Routing
 *
 * Spec: Baseado em ADR-002 (Decision Tables antes de scripts) e requisitos de governança de acessos.
 * 
 * Esta Decision Table determina:
 * - Nível de risco de um pedido de acesso
 * - Roteamento de aprovação (Access Owner, Manager, Security, etc.)
 * - Ações automáticas permitidas
 *
 * NOTA: O Fluent SDK atual tem suporte limitado a Decision Tables nativas via metadata.
 * Esta definição usa um Script Include + lógica declarativa que pode ser migrada para
 * uma Decision Table real no Flow Designer ou via sys_decision_table quando o SDK evoluir.
 * Por enquanto, a lógica está implementada de forma clara para fácil conversão.
 */

import { ScriptInclude, Now } from '@servicenow/sdk/core';

ScriptInclude({
  $id: Now.ID['x_eoap_dt_access_risk_routing'],
  name: 'EOAP_DT_AccessRiskRouting',
  active: true,
  apiName: 'x_eoap.EOAP_DT_AccessRiskRouting',
  description: 'Decision logic for access request risk scoring and approval routing (MVP implementation of ADR-002)',
  script: Now.include('./access-risk-routing.server.js'),
});
