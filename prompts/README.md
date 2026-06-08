# prompts/

Prompts canônicos para o sistema multi-agente do EOAP (Supervisor + Agentes Especializados).

Todos os prompts aqui são:
- Versionados no Git (fonte única da verdade)
- Usados por agentes (humanos + LLMs) para manter consistência com ADRs, nomenclatura, OOB First e estrutura do template.
- Projetados para serem compostos pelo Supervisor.

## Convenções de nomenclatura de arquivos

- `supervisor-system.md` — instruções do orquestrador principal
- `<agent-name>.md` — system prompt + capabilities + output contract do agente especializado
- `task-*.md` — prompts de tarefa específicos reutilizáveis

## Agentes previstos (fase inicial)

- Supervisor
- Code Agent (Fluent SDK + TypeScript)
- Doc Agent (ADRs, Stories, Implementation Guide, Now Create)
- Validator Agent (ADR compliance, naming, security, OOB First)
- VTB Agent (Visual Task Board / Sprint board sync)
- KB Agent (Knowledge Base articles)
- Report Agent (executive + technical reports)

Consulte `agents/` para definições de cada agente e `docs/developer/agentic-development.md`.
