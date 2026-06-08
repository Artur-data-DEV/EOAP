# Now Create — Alinhamento do Template EOAP

Este diretório documenta como o EOAP Template se alinha e acelera a metodologia **Now Create** da ServiceNow.

## Princípios de integração

- **Planning** → Product Backlog + Stories em `docs/02-Product-Management/`
- **Architecture** → ADRs em `docs/01-Architecture/ADRs/` + decisões registradas pelo Supervisor Agent
- **Development** → Fluent SDK em `src/fluent/` + módulos em `src/server/` (Git como fonte)
- **Testing** → `docs/04-Quality/`
- **Deployment** → `npm run deploy` + evidências em `docs/05-Evidence/`
- **Governance & Documentation** → mantidos vivos pelo sistema agentic (Doc Agent + Validator Agent)

## Vantagens do uso deste template com Now Create

- Estrutura de pastas padronizada reduz tempo de setup de novos projetos.
- Prompts e agentes especializados garantem que todas as fases do Now Create produzam artefatos consistentes e rastreáveis.
- O Supervisor Agent pode ser usado para gerar os artefatos de cada fase a partir de prompts de alto nível.

## Recomendação

Para novos projetos:
1. Use este repositório como base.
2. Execute o fluxo agentic para popular backlog, ADRs iniciais e estrutura de código a partir do escopo do projeto.
3. Mantenha o VTB sincronizado (via VTB Agent ou manual com link para stories).

Consulte o Implementation Guide para o MVP atual e os ADRs para as decisões arquiteturais de longo prazo.
