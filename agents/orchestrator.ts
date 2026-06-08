/**
 * EOAP Multi-Agent Orchestrator
 * 
 * This is the core of the agentic system for the EOAP template.
 * It coordinates the Supervisor and specialized agents to plan, execute,
 * validate, document, and deploy changes to the ServiceNow scoped app
 * while keeping Git as the single source of truth.
 *
 * Usage:
 *   npx ts-node agents/orchestrator.ts "Implement full employee onboarding flow with risk decision table"
 *
 * The orchestrator loads prompts from ../prompts/ and agent definitions,
 * then simulates or coordinates (in future: real LLM calls + tool use).
 */

import * as fs from 'fs';
import * as path from 'path';

interface Agent {
  name: string;
  role: string;
  capabilities: string[];
  promptFile: string;
}

interface TaskPlan {
  task: string;
  steps: string[];
  agentsInvolved: string[];
  estimatedEffort: string;
  deliverables: string[];
}

const AGENTS: Agent[] = [
  {
    name: 'Supervisor',
    role: 'Main orchestrator. Plans, delegates, integrates, validates, ensures Git commits and doc sync.',
    capabilities: ['Planning', 'Delegation', 'Integration', 'Validation', 'Commit orchestration'],
    promptFile: '../prompts/supervisor-system.md',
  },
  {
    name: 'CodeAgent',
    role: 'Generates and reviews all Fluent SDK code (.now.ts), Script Includes, server modules.',
    capabilities: ['Fluent SDK code generation', 'Table/ACL/BR/Flow authoring', 'Refactoring'],
    promptFile: '../prompts/code-agent.md',
  },
  {
    name: 'DocAgent',
    role: 'Maintains and updates all documentation, ADRs, stories, implementation guides in sync with code.',
    capabilities: ['Documentation authoring', 'Now Create alignment', 'Story updates'],
    promptFile: '../prompts/doc-agent.md',
  },
  {
    name: 'VTBAgent',
    role: 'Manages Visual Task Board (VTB), creates/updates boards, lanes, and syncs with stories/backlog.',
    capabilities: ['VTB board creation', 'Story card management', 'Sprint alignment'],
    promptFile: '../prompts/vtb-agent.md',
  },
  {
    name: 'KBAgent',
    role: 'Creates and maintains Knowledge Base articles for end-users and admins.',
    capabilities: ['KB article authoring', 'Workflow documentation', 'Self-service content'],
    promptFile: '../prompts/kb-agent.md',
  },
  {
    name: 'ValidatorAgent',
    role: 'Enforces ADRs, naming standards, OOB First, Deny-by-Default, build success, security.',
    capabilities: ['Compliance checking', 'Build validation', 'ADR alignment'],
    promptFile: '../prompts/validator-agent.md',
  },
  {
    name: 'ReportAgent',
    role: 'Generates executive and technical reports, evidence packs, demo scripts.',
    capabilities: ['Report generation', 'Evidence collection', 'Demo preparation'],
    promptFile: '../prompts/report-agent.md',
  },
];

function loadPrompt(agentName: string): string {
  const agent = AGENTS.find(a => a.name === agentName);
  if (!agent) throw new Error(`Agent ${agentName} not found`);
  const promptPath = path.join(__dirname, agent.promptFile);
  return fs.readFileSync(promptPath, 'utf-8');
}

function createTaskPlan(userRequest: string): TaskPlan {
  // In a real implementation this would call an LLM with the Supervisor prompt.
  // For now, we produce a deterministic high-quality plan based on EOAP vision.
  console.log('\n[Supervisor] Analyzing request:', userRequest);

  const plan: TaskPlan = {
    task: userRequest,
    steps: [
      '1. Supervisor analyzes request against current ADRs, backlog, and existing code.',
      '2. Delegate to CodeAgent for any new Fluent artifacts (Flows, Decision Tables, tables, etc.).',
      '3. Delegate to ValidatorAgent for compliance check (build + standards).',
      '4. Delegate to DocAgent to update implementation guide, stories, and ADRs if needed.',
      '5. Delegate to VTBAgent to create/update VTB cards and board.',
      '6. Delegate to KBAgent for any new knowledge articles.',
      '7. Supervisor integrates all outputs, ensures Git commit with proper message.',
      '8. ReportAgent generates summary + next steps + evidence.',
    ],
    agentsInvolved: ['Supervisor', 'CodeAgent', 'ValidatorAgent', 'DocAgent', 'VTBAgent', 'KBAgent', 'ReportAgent'],
    estimatedEffort: '2-8 hours depending on scope (human review + agent execution)',
    deliverables: [
      'Updated/ new .now.ts files in src/fluent/',
      'Updated documentation in docs/',
      'VTB updates (instructions or script)',
      'KB articles (seeded or documented)',
      'Git commit + build verification',
      'Final report',
    ],
  };

  return plan;
}

async function runOrchestrator(userRequest: string) {
  console.log('====================================');
  console.log('EOAP Agentic Orchestrator v1.0');
  console.log('====================================\n');

  const plan = createTaskPlan(userRequest);

  console.log('=== EXECUTION PLAN ===');
  console.log(JSON.stringify(plan, null, 2));

  // Simulate delegation (in real version: call LLM with loaded prompts + tools)
  for (const agentName of plan.agentsInvolved) {
    if (agentName === 'Supervisor') continue;

    console.log(`\n[Supervisor] Delegating to ${agentName}...`);
    const prompt = loadPrompt(agentName);
    console.log(`   Loaded prompt: ${prompt.substring(0, 120)}...`);
    console.log(`   ${agentName} would now generate output based on the plan.`);
  }

  console.log('\n=== FINAL SUPERVISOR ACTIONS ===');
  console.log('- All agent outputs integrated.');
  console.log('- ValidatorAgent report: PASS (simulated).');
  console.log('- Git commit prepared: feat(eoap): <task summary>');
  console.log('- VTB and KB updates documented for human execution or future API integration.');
  console.log('- Report generated.');

  console.log('\n[Supervisor] Orchestration cycle complete.');
  console.log('Next: Human reviews, runs `npm run build && npm run deploy`, and confirms VTB/KB.');
}

// CLI entry
const request = process.argv.slice(2).join(' ') || 'Implement complete access lifecycle automation with agentic oversight';
runOrchestrator(request).catch(console.error);
