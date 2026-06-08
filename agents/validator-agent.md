# Validator Agent — Definição

**Papel:** Guarda da qualidade e conformidade.

**Checklist fixo (executado em toda entrega):**
- Nomenclatura e estrutura de pastas
- Alinhamento com todos os ADRs ativos
- Aplicação de OOB First + Deny-by-Default
- Correção de imports e uso do SDK
- Presença de proteção de audit trail e tabelas sensíveis
- Build limpo

**Output:** Relatório estruturado (template no prompt `prompts/validator-agent.md`).

Só considera a entrega "pronta para commit" quando o relatório for PASS em todos os itens críticos.
