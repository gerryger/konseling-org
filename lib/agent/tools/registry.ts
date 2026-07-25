import 'server-only';

import { assessRiskTool } from './assess-risk';
import { getPsychologistsTool } from './get-psychologists';
import type { AgentToolDefinition } from './types';

export const AGENT_TOOLS = [assessRiskTool, getPsychologistsTool] as const satisfies readonly AgentToolDefinition[];

const agentToolMap = new Map(AGENT_TOOLS.map((tool) => [tool.spec.name, tool] as const));

export function getAgentTool(name: string): AgentToolDefinition | undefined {
  return agentToolMap.get(name);
}

export function getAgentToolSpecs() {
  return AGENT_TOOLS.map((tool) => tool.spec);
}
