# Git Workflow — EOAP

Fluxo de trabalho obrigatório para contribuições no EOAP e em projetos derivados deste template.

## Branching Strategy

- `main` — Sempre estável e deployável. Protegido.
- `feature/<descrição>` — Para novas funcionalidades ou correções (ex: `feature/add-access-revocation-flow`).
- `docs/<descrição>` — Apenas para mudanças grandes de documentação.
- `agentic/<task-id>` — Quando o trabalho for majoritariamente gerado por agentes (opcional, para rastreabilidade).

## Commit Messages

Use Conventional Commits com escopo:

```
feat(core): adicionar Flow de Access Revocation
fix(governance): corrigir ACL de audit trail
docs(developer): atualizar setup.md com passos de PDI
refactor(access): reorganizar tabela user_access
```

Sempre inclua referência a Story ou ADR quando aplicável:
```
feat(governance): implementar EOAP_AccessGovernanceService (STORY-008, ADR-003)
```

## Pull Requests

- Sempre crie PR para `main`.
- O PR deve incluir:
  - Descrição clara
  - Referência a Stories/ADRs
  - Evidência de `npm run build` passando
  - Atualização de documentação relevante
- Requer aprovação (pelo menos 1 reviewer humano ou validação forte do Validator Agent).

## Regras Agentic

Quando o Supervisor/Code Agent gerar código:
- O commit deve ser feito pelo humano após revisão.
- A mensagem de commit deve mencionar "generated with agentic assistance" quando aplicável.
- Toda entrega agentic deve passar pelo Validator Agent antes do commit.

## Sincronização com VTB

Após merge em `main`, atualize o Visual Task Board (manual ou via VTB Agent) marcando as stories correspondentes como Done.
