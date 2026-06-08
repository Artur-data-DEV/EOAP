# EOAP — Enterprise Operations Automation Platform

**Official ServiceNow Scoped Application Template** with built-in multi-agent orchestration.

Git is the **single source of truth**. All artifacts (tables, ACLs, roles, Script Includes, Flows, Business Rules, documentation, prompts, and agent definitions) live in this repository as code and structured documents.

## Key Characteristics

- **Scoped App**: `x_eoap`
- **Development Model**: Fluent SDK first (`.now.ts`), hybrid controlled when necessary
- **Agentic Orchestration**: Supervisor + specialized agents (Code, Doc, Validator, VTB, KB, Report)
- **Governance**: Strong alignment with ADRs, Now Create, OOB First, Deny-by-Default, and compliance requirements (SOX, LGPD, ISO)
- **Purpose**: Production-grade access lifecycle automation (Onboarding / Move / Offboarding) + reusable template for the organization

## Repository Structure (Mandatory for all derivatives)

```
.github/workflows/          # CI for Fluent build + template validation
agents/                     # Agent definitions (Supervisor, Code, Doc, Validator...)
prompts/                    # Canonical system prompts for the multi-agent system
src/
  fluent/
    core/
    access/
    governance/             # audit, rbac, services, business rules
    integrations/
    automation/
  server/
  metadata/
docs/
  01-Architecture/ADRs/
  02-Product-Management/
  03-Execution/
  developer/
  now_create/
  ...
templates/
```

## Quick Start (for this app or as template)

See `docs/developer/getting-started.md` for exact commands, scopeId handling, auth, build, and deploy.

Core commands:
```powershell
npm install
# 1. Create scoped app x_eoap (or your scope) in PDI
# 2. Fill scopeId in now.config.json
npm run build
npx now-sdk auth --add https://<pdi>.service-now.com --alias pdi --type oauth
npm run deploy
```

## Agentic Development

The recommended way to work on EOAP or any project derived from this template is through the multi-agent system.

Load `prompts/supervisor-system.md` as the primary system prompt. The Supervisor will plan, delegate to Code/Doc/Validator agents, ensure Git commits, documentation sync, and produce exact commands.

## Principles (Non-negotiable)

- Git = single source of truth
- Fluent SDK first
- Rigorous naming (`x_eoap_*`, `EOAP_*`)
- OOB First + Deny-by-Default
- Every change ends in a commit + updated documentation + validation

## License

UNLICENSED (organization internal template)

