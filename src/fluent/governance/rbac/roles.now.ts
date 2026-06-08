import { Role } from '@servicenow/sdk/core'

/**
 * EOAP Roles — RBAC
 * Spec: docs/03-Execution/Artifacts/roles/README.md
 */

export const x_eoap_admin = Role({
  name: 'x_eoap.admin',
})

export const x_eoap_auditor = Role({
  name: 'x_eoap.auditor',
})
