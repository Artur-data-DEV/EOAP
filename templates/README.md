# templates/

Este diretório contém artefatos reutilizáveis para acelerar a criação de novos projetos ServiceNow Scoped Apps baseados no EOAP Template.

## Conteúdo planejado

- `new-scoped-app/` — esqueleto mínimo de um novo app seguindo a estrutura obrigatória
- `prompts/` — cópia ou referências aos prompts canônicos
- `agents/` — cópia das definições de agentes
- Scripts de inicialização (futuro)

Por enquanto, a recomendação é:

1. Use este repositório inteiro como template no GitHub.
2. Ajuste `now.config.json`, `package.json` e escopos.
3. Rode o fluxo agentic com o Supervisor para popular o novo projeto a partir do escopo de negócio.

Consulte `docs/developer/getting-started.md`.
