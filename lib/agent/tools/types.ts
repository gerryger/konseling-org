import type { CrisisLevel, Psikolog } from '../../chat/types';
import type { LLMProviderToolSpec } from '../provider/types';

export type AgentStreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'risk'; risk: { score: number; level: CrisisLevel; shouldEscalate: boolean } }
  | { type: 'psychologists'; psychologists: Psikolog[] }
  | { type: 'done'; stopReason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | 'pause_turn' | 'refusal' | 'unknown' }
  | { type: 'error'; message: string };

export interface AgentToolExecutionContext {
  latestUserMessage: string;
}

export interface AgentToolExecutionResult {
  resultContent: string;
  event?: Extract<AgentStreamEvent, { type: 'risk' | 'psychologists' }>;
}

export interface AgentToolDefinition {
  spec: LLMProviderToolSpec;
  execute(input: unknown, context: AgentToolExecutionContext): Promise<AgentToolExecutionResult>;
}
