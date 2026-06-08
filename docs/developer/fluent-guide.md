# Fluent SDK Guide — Padrões EOAP

Este guia define como usar o **Fluent SDK** dentro do template EOAP de forma consistente.

## Princípios

- Todo metadado principal (tabelas, ACLs, roles, business rules, script includes, flows) deve ser definido em `.now.ts`.
- Lógica reutilizável complexa vai para `src/server/` (TypeScript) quando possível.
- `src/fluent/` é organizado por domínio:
  - `core/` — Fundamentos e extensões
  - `access/` — Tabelas e lógica de acesso de usuários
  - `governance/` — Audit, RBAC, serviços centrais
  - `integrations/` — Integrações com CMDB, HR, etc.
  - `automation/` — Flows, Jobs, Business Rules de orquestração

## Estrutura de um arquivo `.now.ts`

```typescript
import { Table, Role, Acl, Now } from '@servicenow/sdk/core'

/**
 * Descrição clara + referência à spec
 * Spec: docs/03-Execution/Artifacts/... ou ADR-XXX
 */
export const x_eoap_minha_tabela = Table({
  name: 'x_eoap_minha_tabela',
  label: 'Minha Tabela',
  schema: { ... }
})
```

**Regras**:
- Sempre usar o prefixo `x_eoap_` nas tabelas.
- Roles e API Names usam `x_eoap.` ou `EOAP_`.
- Usar `Now.ID['chave-descritiva']` para tipos que exigem `$id`.
- Importar **sempre** de `@servicenow/sdk/core`.

## Script Includes

- Defina o `ScriptInclude` em `.now.ts`.
- Implementação real em arquivo `.server.js` co-localizado (usando `Now.include`).
- Prefira funções puras ou classes simples (evite prototype excessivo quando possível).

## Flows

- Defina o esqueleto em `.now.ts`.
- Refinamentos complexos (data pills, notificações detalhadas, subflows) podem ser feitos no Flow Designer e devem ser documentados.

## Extensões em tabelas OOB (ex: cmdb_ci_business_app)

Use arquivos em `src/fluent/core/extensions/` com comentários claros do procedimento híbrido a ser executado manualmente na PDI.

## Validação

Sempre rode **antes de commit**:

```powershell
npm run build
```

O build deve passar limpo.

## Nomenclatura (ver também standards.md)

- Tabelas: `x_eoap_<nome_singular>`
- Script Includes: `EOAP_<NomePascal>`
- Flows: `EOAP Flow <Nome Descritivo>`
- Roles: `x_eoap.<nome>`

## Boas práticas agentic

O Code Agent gera código seguindo exatamente este guia. Qualquer exceção deve ser justificada no commit e, se recorrente, virar um novo padrão em `architecture/standards/`.
