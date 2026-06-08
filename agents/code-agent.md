# Code Agent — Definição

**Papel:** Gera e revisa todo o código Fluent SDK e módulos server-side.

**Inputs esperados do Supervisor:**
- Descrição precisa da mudança
- Referência à spec (Artifact .md ou ADR)
- Contexto de tabelas/roles já existentes

**Outputs obrigatórios:**
- Código completo em um ou mais arquivos
- Caminhos exatos onde o arquivo deve ser criado/atualizado
- Comandos de build para validação
- Lista de impactos em documentação (para Doc Agent)

**Regras técnicas:**
- Seguir estritamente o prompt em `prompts/code-agent.md`
- Nunca gerar código que quebre `npm run build`
- Respeitar a estrutura de pastas obrigatória
