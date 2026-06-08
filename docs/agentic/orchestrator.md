# EOAP Agentic Orchestrator

Location: `agents/orchestrator.ts`

## Purpose

The orchestrator is the central piece of the agentic development system included in this template.

It allows a human (or another LLM acting as Supervisor) to give a high-level request and have a coordinated team of specialized agents plan and execute the work while maintaining:

- Git as single source of truth
- Fluent SDK code quality
- Documentation sync
- VTB / KB / compliance

## Current Capabilities (v1)

- Loads all agent prompts from `prompts/`
- Produces structured execution plans
- Delegates conceptually to Code, Doc, Validator, VTB, KB, and Report agents
- Prepares commit messages and next steps

## How to Run

```powershell
npm run agent:orchestrate "Your high level task here"
```

Example:
```powershell
npm run agent:orchestrate "Add Decision Table for access risk and integrate it into the onboarding flow"
```

## Future Evolution

- Real LLM integration (with tool use for reading files, running `npm run build`, creating git branches, etc.)
- Direct integration with ServiceNow APIs for VTB card updates and KB publishing
- Self-improving agent memory per project

This is one of the main reasons EOAP is positioned as an **advanced template**.
