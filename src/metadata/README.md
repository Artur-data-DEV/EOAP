# src/metadata/

Este diretório contém definições de metadados estáticos e dados semente para a aplicação EOAP usando Fluent SDK (`Record()`, `Choice`, etc.).

## Regras de uso neste template

- Todo dado estático (choices, seed records, propriedades) que deve existir na instância após deploy **deve** estar aqui.
- Prefira `Record()` do `@servicenow/sdk/core` para sys_choice, sys_properties, etc.
- Mantenha nomenclatura `x_eoap_*` / `EOAP_*`.
- Documente a origem da spec no cabeçalho do arquivo (normalmente um Artifact em `docs/03-Execution/Artifacts/`).

## Exemplo de estrutura recomendada

```
src/metadata/
├── choices/
│   └── user-access-status.now.ts
├── seed/
│   └── sample-data.now.ts   (apenas para PDI / dev)
└── properties/
    └── eoap-properties.now.ts
```

## Status atual (MVP)

- Choices para `x_eoap_user_access.status` ainda são gerenciados via UI após deploy (abordagem híbrida controlada).
- Quando o SDK oferecer suporte mais maduro a Dictionary/Choice de forma declarativa, migraremos para aqui.

Consulte `docs/developer/` para o processo de adição de novos metadados.
