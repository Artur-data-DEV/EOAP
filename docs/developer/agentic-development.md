# Agentic Development com o EOAP Template

O EOAP foi projetado desde o início para ser desenvolvido e mantido por um sistema multi-agente.

## Arquitetura do Sistema Agentic (visão atual)

- **Supervisor**: planeja, delega, integra, valida e garante commit.
- **Code Agent**: gera/altera código Fluent e server modules.
- **Doc Agent**: mantém documentação, ADRs, Stories e artefatos em sincronia.
- **Validator Agent**: verifica conformidade com ADRs, nomenclatura e princípios.
- **VTB Agent** (planejado): atualiza Visual Task Board / Sprint board via API ou instruções precisas.
- **KB Agent** (planejado): cria/atualiza artigos de Knowledge Base.
- **Report Agent** (planejado): gera relatórios executivos e técnicos.

## Como usar hoje (nesta sessão ou com qualquer LLM forte)

1. Forneça ao LLM o conteúdo de `prompts/supervisor-system.md` como system prompt.
2. Dê um prompt de usuário claro (ex: "Implemente o Flow de Access Revocation conforme STORY-010 e o artifact correspondente").
3. O Supervisor (LLM) irá:
   - Ler ADRs e specs relevantes (use ferramentas de leitura de arquivos)
   - Gerar plano
   - Invocar (via prompt) os agentes especializados necessários
   - Produzir código + atualizações de docs
   - Pedir para você executar `npm run build`, deploy e commit

## Benefícios

- Consistência extrema mesmo em equipes grandes ou rotativas.
- Redução drástica de retrabalho por violações de arquitetura.
- Documentação sempre atualizada (não é afterthought).
- O repositório se torna auto-documentado e auto-validável.

## Evolução planejada

- Orquestrador executável (TypeScript) que usa os prompts + LLM provider + Git + now-sdk + ServiceNow REST.
- Integração com GitHub Actions (agentic PR reviews, auto-update de VTB a partir de commits).
- Agentes com memória de longo prazo por projeto.

Este modelo de desenvolvimento agentic é parte do valor do template e deve ser replicado em todos os projetos derivados.
