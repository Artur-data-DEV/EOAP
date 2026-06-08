# Agentic System

This section documents the multi-agent orchestration system that is a core part of the EOAP template.

The EOAP project is not only a ServiceNow application — it includes a first-class **agentic development and operations layer**.

## Key Components

- **Orchestrator** (`agents/orchestrator.ts`): The central coordinator (Supervisor).
- **Specialized Agents**: Code, Doc, Validator, VTB, KB, Report, etc.
- **Prompts**: Located in `prompts/` at the root (version controlled, reusable).
- **Execution**: Run with `npm run agent:orchestrate "your task"`

## Philosophy

- Git + Fluent SDK = single source of truth.
- Agents help plan, generate code, update documentation, manage VTB, create KB articles, validate compliance, and produce reports.
- The system is designed to be used both by humans and by LLMs (you are currently acting as the Supervisor).

## Quick Start

```powershell
npm run agent:orchestrate "Create full onboarding flow with risk decision table and Virtual Agent topic"
```

See individual agent prompts in `prompts/` and the orchestrator implementation in `agents/`.

## Integration with Now Create

The agentic system accelerates every phase:
- 01-Strategy → Report Agent + Supervisor
- 02-Plan → Doc Agent + VTB Agent
- 03-Execution → Code Agent + Validator
- 04-Build / 05-Deploy → Orchestrator coordination + evidence

This is one of the main differentiators of the EOAP template.
