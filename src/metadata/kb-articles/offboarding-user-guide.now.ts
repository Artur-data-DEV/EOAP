/**
 * Seed: Knowledge Base Article - User Offboarding Guide
 *
 * This will create a KB article in the PDI after deploy (via Record).
 * Article is intended for end users and managers.
 */
import { Record, Now } from '@servicenow/sdk/core';

Record({
  $id: Now.ID['x_eoap_kb_offboarding_user_guide'],
  table: 'kb_knowledge',
  data: {
    short_description: 'EOAP - Guia de Offboarding de Usuários',
    text: `
# Como funciona o Offboarding na EOAP

## Offboarding Automático
Quando o RH marca um usuário como **terminated** no registro do sys_user:

1. O Flow **EOAP Full Offboarding Orchestrator** é disparado automaticamente.
2. Todos os acessos ativos na tabela **EOAP User Access** são revogados.
3. Um registro imutável é criado no **Audit Trail**.
4. O manager do usuário recebe notificação automática.

## Offboarding Manual (via Catálogo)
1. Acesse o Service Catalog > EOAP > **EOAP Manual Offboarding**.
2. Selecione o usuário que está saindo.
3. Submeta a solicitação.
4. O mesmo fluxo de revogação automática é executado.

## O que você (Manager) precisa fazer
- Garanta que o Access Owner da aplicação seja notificado se necessário.
- Revise os acessos revogados no dashboard de governança.

Para dúvidas de compliance, consulte o artigo "EOAP - Audit Trail para Auditores".
    `,
    kb_category: 'x_eoap_access_governance',
    workflow: 'Published',
    // Add more fields as needed (author, etc.)
  },
});
