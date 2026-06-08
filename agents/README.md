# agents/

Definições e implementações dos agentes especializados do sistema de orquestração multi-agente do EOAP.

Este diretório é parte do **Template Oficial** e deve ser copiado/adaptado para novos projetos ServiceNow.

## Filosofia

O desenvolvimento de aplicações ServiceNow de alta governança (SOX, LGPD, ISO) requer consistência que humanos sozinhos não conseguem manter em escala. O sistema agentic external (fora da PDI) garante:

- Planejamento estruturado
- Geração de código Fluent correto
- Sincronização contínua entre código, documentação, VTB e KB
- Validação automática contra ADRs

## Estrutura

- `supervisor.md` — definição e contrato do orquestrador principal
- `<agent-name>.md` — definição completa do agente (capabilities, inputs, outputs, ferramentas permitidas)
- `orchestrator/` — (futuro) scripts de orquestração local (Node/Python) que usam os prompts + chamam LLMs + executam ferramentas (git, now-sdk, ServiceNow REST)

## Status atual

Fase inicial: prompts canônicos + definições em Markdown. 
Execução atual é feita por humano + LLM (ex: esta sessão do Grok atuando como Supervisor).

Próximos passos:
- Implementar orquestrador executável
- Integração com GitHub Actions para agentic CI
- Conectores para VTB (Visual Task Board) e Knowledge Base via API

Consulte `prompts/` para os system prompts reais usados pelos agentes.
