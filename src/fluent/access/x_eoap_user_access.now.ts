import {
  Table,
  StringColumn,
  DateTimeColumn,
  ReferenceColumn,
} from '@servicenow/sdk/core'

/**
 * EOAP User Access — Tabela de Governança de Acessos
 * Spec: docs/03-Execution/Artifacts/tables/x_eoap_user_access.md
 *
 * Status values (Choice semantics — configure display as choice list in UI or seed via sys_choice if needed):
 *   requested | approved | active | revoked
 */
export const x_eoap_user_access = Table({
  name: 'x_eoap_user_access',
  label: 'EOAP User Access',
  schema: {
    user: ReferenceColumn({
      label: 'User',
      referenceTable: 'sys_user',
      mandatory: true,
    }),
    application: ReferenceColumn({
      label: 'Application',
      referenceTable: 'cmdb_ci_business_app',
      mandatory: true,
    }),
    status: StringColumn({
      label: 'Status',
      mandatory: true,
      maxLength: 40,
    }),
    valid_from: DateTimeColumn({
      label: 'Valid From',
    }),
    valid_to: DateTimeColumn({
      label: 'Valid To',
    }),
    access_owner: ReferenceColumn({
      label: 'Access Owner',
      referenceTable: 'sys_user',
    }),
    justification: StringColumn({
      label: 'Justification',
      maxLength: 4000,
    }),
    created_on: DateTimeColumn({
      label: 'Created On',
    }),
    created_by: ReferenceColumn({
      label: 'Created By',
      referenceTable: 'sys_user',
    }),
    revoked_on: DateTimeColumn({
      label: 'Revoked On',
    }),
  },
})
