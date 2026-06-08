import {
  Table,
  StringColumn,
  DateTimeColumn,
  ReferenceColumn,
} from '@servicenow/sdk/core'

/**
 * EOAP Audit Trail — Tabela de Log Imutável (semântico, não técnico)
 * Spec: docs/03-Execution/Artifacts/tables/x_eoap_audit_trail.md
 *
 * Imutabilidade garantida por:
 *  - ACLs deny write/delete para todos exceto contexto de serviço do logger
 *  - Business Rules before write/delete que abortam
 */
export const x_eoap_audit_trail = Table({
  name: 'x_eoap_audit_trail',
  label: 'EOAP Audit Trail',
  schema: {
    actor: ReferenceColumn({
      label: 'Actor',
      referenceTable: 'sys_user',
    }),
    entity_type: StringColumn({
      label: 'Entity Type',
      mandatory: true,
      maxLength: 100,
    }),
    entity_sys_id: StringColumn({
      label: 'Entity Sys ID',
      mandatory: true,
      maxLength: 32,
    }),
    action: StringColumn({
      label: 'Action',
      mandatory: true,
      maxLength: 100,
    }),
    outcome: StringColumn({
      label: 'Outcome',
      mandatory: true,
      maxLength: 40,
    }),
    payload_summary: StringColumn({
      label: 'Payload Summary',
      maxLength: 4000,
    }),
    created_on: DateTimeColumn({
      label: 'Created On',
    }),
    correlation_id: StringColumn({
      label: 'Correlation ID',
      mandatory: true,
      maxLength: 100,
    }),
  },
})
