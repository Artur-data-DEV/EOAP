import { Acl, Now } from '@servicenow/sdk/core'
import { x_eoap_admin, x_eoap_auditor } from './roles.now'

/**
 * ACLs — Deny-by-Default (segurança primeiro)
 * Spec: docs/03-Execution/Artifacts/acls/README.md
 *
 * Padrão:
 * - create: apenas system/service (para flows/jobs)
 * - read: admin + auditor
 * - write: apenas admin (para user_access)
 * - write/delete audit: negado (imutabilidade reforçada por BR também)
 */

// --- x_eoap_user_access ACLs ---
Acl({
  $id: Now.ID['x_eoap_user_access_create'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'create',
  table: 'x_eoap_user_access',
})

Acl({
  $id: Now.ID['x_eoap_user_access_read'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'read',
  table: 'x_eoap_user_access',
  roles: [x_eoap_admin, x_eoap_auditor],
})

Acl({
  $id: Now.ID['x_eoap_user_access_write'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'write',
  table: 'x_eoap_user_access',
  roles: [x_eoap_admin],
})

Acl({
  $id: Now.ID['x_eoap_user_access_delete'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'delete',
  table: 'x_eoap_user_access',
})

// --- x_eoap_audit_trail ACLs (imutável) ---
Acl({
  $id: Now.ID['x_eoap_audit_trail_create'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'create',
  table: 'x_eoap_audit_trail',
})

Acl({
  $id: Now.ID['x_eoap_audit_trail_read'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'read',
  table: 'x_eoap_audit_trail',
  roles: [x_eoap_admin, x_eoap_auditor],
})

Acl({
  $id: Now.ID['x_eoap_audit_trail_write'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'write',
  table: 'x_eoap_audit_trail',
})

Acl({
  $id: Now.ID['x_eoap_audit_trail_delete'],
  localOrExisting: 'Existing',
  type: 'record',
  operation: 'delete',
  table: 'x_eoap_audit_trail',
})
