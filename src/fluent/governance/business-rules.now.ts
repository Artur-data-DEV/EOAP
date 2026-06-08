import { BusinessRule, Now } from '@servicenow/sdk/core'

/**
 * Business Rules de Proteção (imutabilidade e integridade)
 * Spec: docs/03-Execution/Artifacts/business-rules/README.md
 *
 * Estas regras reforçam as ACLs deny-by-default e protegem o audit trail.
 */

BusinessRule({
  $id: Now.ID['x_eoap_br_user_access_delete_protect'],
  name: 'EOAP - User Access Delete Protect',
  active: true,
  table: 'x_eoap_user_access',
  when: 'before',
  delete: true,
  order: 100,
  script: Now.include('./protect-user-access-delete.server.js'),
})

BusinessRule({
  $id: Now.ID['x_eoap_br_audit_trail_write_protect'],
  name: 'EOAP - Audit Trail Write Protect',
  active: true,
  table: 'x_eoap_audit_trail',
  when: 'before',
  insert: true,
  update: true,
  order: 100,
  script: Now.include('./protect-audit-trail-write.server.js'),
})

BusinessRule({
  $id: Now.ID['x_eoap_br_audit_trail_delete_protect'],
  name: 'EOAP - Audit Trail Delete Protect',
  active: true,
  table: 'x_eoap_audit_trail',
  when: 'before',
  delete: true,
  order: 100,
  script: Now.include('./protect-audit-trail-delete.server.js'),
})
