/**
 * Virtual Agent Topic: EOAP Offboarding Assistant
 *
 * This defines a basic Virtual Agent topic that can be imported or manually
 * configured in the PDI Virtual Agent Designer.
 *
 * In future versions of the SDK this can be expanded with full topic metadata.
 */
import { Record, Now } from '@servicenow/sdk/core';

Record({
  $id: Now.ID['x_eoap_va_offboarding_topic'],
  table: 'sys_cb_topic',
  data: {
    name: 'EOAP Offboarding',
    short_description: 'Assistente virtual para processos de offboarding e revogação de acessos',
    description: 'O usuário pode perguntar sobre status de offboarding, como revogar acessos manualmente ou consultar o audit trail.',
    active: true,
    // In a real implementation you would also seed the topic flows / utterances
  },
});
