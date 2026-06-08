# Standards — Padrões EOAP

Este documento define os padrões **obrigatórios** para todo o trabalho no EOAP.

## 1. Nomenclatura

| Tipo de Artefato | Padrão | Exemplo |
|------------------|--------|---------|
| Tabelas | `x_eoap_<nome>` | `x_eoap_user_access` |
| Script Includes / API | `EOAP_<NomePascal>` | `EOAP_AuditLogger` |
| Flows | `EOAP Flow <Nome>` | `EOAP Flow Employee Offboarding` |
| Roles | `x_eoap.<nome>` | `x_eoap.admin` |
| Business Rules | `EOAP - <Descrição>` | `EOAP - Audit Trail Write Protect` |
| Campos custom | `x_eoap_<nome>` | `x_eoap_access_owner` |

**Nunca** use nomes sem prefixo `x_eoap` ou `EOAP`.

## 2. OOB First

- Sempre prefira componentes nativos do ServiceNow.
- Só crie custom quando não existir equivalente OOB com qualidade suficiente.
- Justifique em ADR ou no cabeçalho do arquivo `.now.ts` quando for contra esta regra.

## 3. Deny-by-Default

- Toda nova tabela deve ter ACLs explícitas começando por deny.
- Regras de proteção (imutabilidade de audit trail, proteção contra delete) são obrigatórias para tabelas de governança.

## 4. Estrutura de Pastas (src/fluent/)

- `core/` — Fundamentos e extensões de tabelas OOB
- `access/` — Tudo relacionado a concessão e ciclo de vida de acessos
- `governance/` — Audit trail, RBAC, serviços centrais, proteção
- `integrations/` — CMDB, HR, IAM, etc.
- `automation/` — Flows, Scheduled Jobs, orquestração

## 5. Fluent SDK

- Ver `fluent-guide.md`
- Build deve passar localmente antes de qualquer PR ou deploy.

## 6. Documentação

- Todo novo componente em `src/fluent/` deve ter referência na documentação (especialmente em `implementation/` e `architecture/standards`).
- Atualize o guia de implementação quando o status de um artefato mudar.

## 7. Agentic Compliance

O Validator Agent verifica automaticamente o cumprimento destes standards em toda entrega gerada por agentes.
